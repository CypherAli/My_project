mod models;
mod orderbook;
mod engine;

#[cfg(test)]
mod tests;

use engine::MatchingEngine;
use models::Command;
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

    // 4. Vòng lặp xử lý Message
    while let Some(message) = subscriber.next().await {
        // Parse message từ bytes sang JSON String
        let json_str = from_utf8(&message.payload)?;
        println!("\n📩 Received: {}", json_str);

        // Parse từ JSON sang Command struct
        match serde_json::from_str::<Command>(json_str) {
            Ok(cmd) => {
                // Xử lý lệnh
                let events = engine.process_command(cmd);
                
                // Publish kết quả (Event) ngược lại NATS
                for event in events {
                    let event_json = serde_json::to_string(&event)?;
                    println!("   📤 Publishing Event: {}", event_json);
                    
                    // Bắn event ra topic "events"
                    client.publish("events", event_json.into()).await?;
                }
            },
            Err(e) => {
                eprintln!("❌ Error parsing command: {}", e);
            }
        }
    }

    Ok(())
}
