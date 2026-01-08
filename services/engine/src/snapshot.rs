// src/snapshot.rs
use crate::orderbook::OrderBook;
use redis::{Commands, RedisError};
use serde::Serialize;

/// Cấu trúc dữ liệu để gửi xuống Frontend (đã đơn giản hóa)
#[derive(Debug, Serialize)]
pub struct OrderBookSnapshot {
    pub symbol: String,
    pub bids: Vec<(String, String)>, // (Price, Amount) - Dùng String để giữ chính xác Decimal
    pub asks: Vec<(String, String)>,
    pub timestamp: u64,
}

/// SnapshotManager quản lý việc đẩy dữ liệu Orderbook lên Redis
pub struct SnapshotManager {
    client: redis::Client,
}

impl SnapshotManager {
    /// Khởi tạo SnapshotManager với URL Redis
    /// 
    /// # Arguments
    /// * `redis_url` - URL kết nối Redis (ví dụ: "redis://127.0.0.1:6379")
    pub fn new(redis_url: &str) -> Result<Self, RedisError> {
        let client = redis::Client::open(redis_url)?;
        Ok(SnapshotManager { client })
    }

    /// Cập nhật snapshot của Orderbook lên Redis
    /// 
    /// # Arguments
    /// * `symbol` - Cặp giao dịch (ví dụ: "BTC/USDT")
    /// * `book` - Reference đến OrderBook hiện tại
    /// 
    /// # Returns
    /// Result với () nếu thành công, hoặc anyhow::Error nếu có lỗi
    pub fn update(&self, symbol: &str, book: &OrderBook) -> anyhow::Result<()> {
        let mut conn = self.client.get_connection()?;

        // 1. Convert OrderBook nội bộ thành Snapshot (chỉ lấy top 10 lệnh mỗi bên)
        let snapshot = OrderBookSnapshot {
            symbol: symbol.to_string(),
            bids: book.get_depth(10, true),  // Top 10 Bids (giá cao nhất)
            asks: book.get_depth(10, false), // Top 10 Asks (giá thấp nhất)
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        };

        // 2. Serialize thành chuỗi JSON
        let json_data = serde_json::to_string(&snapshot)?;

        // 3. Lưu vào Redis (Key ví dụ: "orderbook:BTC/USDT")
        let key = format!("orderbook:{}", symbol);
        let _: () = conn.set(&key, &json_data)?;

        // 4. (Tùy chọn) Publish vào kênh Redis PubSub để WebSocket bên Go nhận được ngay
        let channel = format!("ob_update:{}", symbol);
        let _: () = conn.publish(channel, json_data)?;

        println!("📸 Updated snapshot for {} | Bids: {}, Asks: {}", 
                 symbol, snapshot.bids.len(), snapshot.asks.len());
        
        Ok(())
    }

    /// Lấy snapshot từ Redis (để test hoặc để API Gateway query)
    pub fn get_snapshot(&self, symbol: &str) -> anyhow::Result<Option<String>> {
        let mut conn = self.client.get_connection()?;
        let key = format!("orderbook:{}", symbol);
        let result: Option<String> = conn.get(key)?;
        Ok(result)
    }

    /// Xóa snapshot khỏi Redis
    pub fn clear_snapshot(&self, symbol: &str) -> anyhow::Result<()> {
        let mut conn = self.client.get_connection()?;
        let key = format!("orderbook:{}", symbol);
        let _: () = conn.del(key)?;
        println!("🗑️  Cleared snapshot for {}", symbol);
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::{Order, Side};
    use rust_decimal_macros::dec;

    #[test]
    fn test_snapshot_manager() {
        // Test cơ bản (cần Redis đang chạy)
        let manager = SnapshotManager::new("redis://127.0.0.1:6379");
        assert!(manager.is_ok());
    }

    #[test]
    fn test_snapshot_serialization() {
        let snapshot = OrderBookSnapshot {
            symbol: "BTC/USDT".to_string(),
            bids: vec![
                ("50000.00".to_string(), "1.5".to_string()),
                ("49999.00".to_string(), "2.0".to_string()),
            ],
            asks: vec![
                ("50001.00".to_string(), "1.2".to_string()),
                ("50002.00".to_string(), "3.0".to_string()),
            ],
            timestamp: 1234567890,
        };

        let json = serde_json::to_string(&snapshot).unwrap();
        assert!(json.contains("BTC/USDT"));
        assert!(json.contains("50000.00"));
    }
}
