// src/models.rs
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Side {
    Bid, // Mua
    Ask, // Bán
}

// Thêm enum OrderType để phân biệt Limit và Market Order
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum OrderType {
    Limit,
    Market,
}

// Implement Default để dễ xử lý khi parse từ JSON cũ (không có trường này)
impl Default for OrderType {
    fn default() -> Self {
        OrderType::Limit
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    pub id: u64,           // ID duy nhất của lệnh
    pub user_id: u64,      // Ai đặt lệnh?
    pub symbol: String,    // Cặp tiền nào? (VD: BTC/USDT)
    pub price: Decimal,    // Giá đặt (Dùng Decimal cho chính xác)
    pub amount: Decimal,   // Số lượng đặt
    pub side: Side,        // Mua hay Bán?
    #[serde(default)]      // Nếu JSON không có trường này -> dùng default (Limit)
    #[serde(rename = "type")] // Map với trường JSON "type" từ Go (vì "type" là keyword trong Rust)
    pub order_type: OrderType, // Limit hoặc Market
    pub timestamp: u64,    // Thời gian đặt (để ưu tiên lệnh đến trước)
}

impl Order {
    // Helper để tạo lệnh nhanh khi test
    pub fn new(id: u64, user_id: u64, price: Decimal, amount: Decimal, side: Side, order_type: OrderType) -> Self {
        Order {
            id,
            user_id,
            symbol: "BTC/USDT".to_string(),
            price,
            amount,
            side,
            order_type,
            timestamp: 0, // Tạm thời để 0
        }
    }
}

// Trade: Kết quả của một giao dịch được khớp
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Trade {
    pub trade_id: u64,         // ID duy nhất của trade
    pub buyer_order_id: u64,   // ID lệnh mua
    pub seller_order_id: u64,  // ID lệnh bán
    pub price: Decimal,        // Giá khớp
    pub amount: Decimal,       // Số lượng khớp
    pub timestamp: u64,        // Thời điểm khớp
}

// Input: Các lệnh mà Engine có thể hiểu
#[derive(Debug, Deserialize, Serialize)]
#[serde(tag = "type", content = "data")] // Giúp JSON đẹp hơn: {"type": "place", "data": {...}}
pub enum Command {
    Place(Order),
    Cancel(u64), // Chỉ cần ID để hủy
}

// Output: Kết quả Engine trả ra
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum EngineEvent {
    OrderPlaced { 
        order_id: u64,
        user_id: u64,
        symbol: String,
        price: Decimal,
        amount: Decimal,
        side: Side,
    },
    OrderCancelled { order_id: u64, success: bool },
    TradeExecuted { trade: Trade },
}
