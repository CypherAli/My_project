mod models;
mod orderbook;
mod engine;
mod snapshot; // MỚI: Import module snapshot

#[cfg(test)]
mod tests;

use engine::MatchingEngine;
use models::Command;
use snapshot::SnapshotManager; // MỚI: Import SnapshotManager
use futures::StreamExt; // Để dùng hàm .next() cho stream
use std::str::from_utf8;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    println!("🚀 Trading Engine v1.0 starting...");

    // 1. Kết nối đến NATS Server
    let nats_url = std::env::var("NATS_URL").unwrap_or_else(|_| "nats://localhost:4222".to_string());
    println!("🔌 Connecting to NATS at {}...", nats_url);
    
    let client = async_nats::connect(nats_url).await?;
    println!("✅ Connected to NATS!");

    // 2. Subscribe (Lắng nghe) topic "orders"
    let mut subscriber = client.subscribe("orders").await?;
    println!("🎧 Listening on subject 'orders'...");

    // 3. Khởi tạo Engine
    let mut engine = MatchingEngine::new();

    // 3.1 MỚI: Khởi tạo SnapshotManager để đẩy dữ liệu lên Redis
    let redis_url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());
    println!("📸 Connecting to Redis at {}...", redis_url);
    
    let snapshot_manager = match SnapshotManager::new(&redis_url) {
        Ok(manager) => {
            println!("✅ Redis connection established!");
            Some(manager)
        },
        Err(e) => {
            eprintln!("⚠️  Warning: Could not connect to Redis: {}", e);
            eprintln!("   Continuing without snapshot support...");
            None
        }
    };

    // 4. Vòng lặp xử lý Message
    while let Some(message) = subscriber.next().await {
        // Parse message từ bytes sang JSON String
        let json_str = from_utf8(&message.payload)?;
        println!("\n📩 Received: {}", json_str);

        // Parse từ JSON sang Command struct
        match serde_json::from_str::<Command>(json_str) {
            Ok(cmd) => {
                // Lưu symbol để update snapshot sau
                let symbol = match &cmd {
                    Command::Place(order) => Some(order.symbol.clone()),
                    Command::Cancel(_) => None, // Cancel không biết symbol trước
                };

                // Xử lý lệnh
                let events = engine.process_command(cmd);
                
                // Publish kết quả (Event) ngược lại NATS
                for event in events {
                    let event_json = serde_json::to_string(&event)?;
                    println!("   📤 Publishing Event: {}", event_json);
                    
                    // Bắn event ra topic "events"
                    client.publish("events", event_json.into()).await?;
                }

                // MỚI: Cập nhật snapshot lên Redis sau khi xử lý xong
                if let (Some(ref manager), Some(ref sym)) = (&snapshot_manager, &symbol) {
                    if let Some(book) = engine.get_orderbook(sym) {
                        if let Err(e) = manager.update(sym, book) {
                            eprintln!("⚠️  Failed to update snapshot: {}", e);
                        }
                    }
                }
            },
            Err(e) => {
                eprintln!("❌ Error parsing command: {}", e);
            }
        }
    }

    Ok(())
}
