// Simple test client to publish orders to NATS
use async_nats;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🧪 Connecting to NATS...");
    let client = async_nats::connect("nats://localhost:4222").await?;
    println!("✅ Connected!");

    // Test 1: Send BID order
    println!("\n📤 Sending BID order...");
    let bid_order = json!({
        "type": "Place",
        "data": {
            "id": 1001,
            "user_id": 100,
            "symbol": "BTC/USDT",
            "price": "50000.00",
            "amount": "1.5",
            "side": "Bid",
            "timestamp": 0
        }
    });
    
    client.publish("orders", bid_order.to_string().into()).await?;
    println!("✅ BID order sent!");
    
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

    // Test 2: Send ASK order
    println!("\n📤 Sending ASK order...");
    let ask_order = json!({
        "type": "Place",
        "data": {
            "id": 1002,
            "user_id": 101,
            "symbol": "BTC/USDT",
            "price": "50001.00",
            "amount": "2.0",
            "side": "Ask",
            "timestamp": 0
        }
    });
    
    client.publish("orders", ask_order.to_string().into()).await?;
    println!("✅ ASK order sent!");
    
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

    // Test 3: Check Redis
    println!("\n🔍 Checking Redis for snapshot...");
    let redis_client = redis::Client::open("redis://127.0.0.1:6379")?;
    let mut conn = redis_client.get_connection()?;
    
    let snapshot: Option<String> = redis::Commands::get(&mut conn, "orderbook:BTC/USDT")?;
    
    if let Some(data) = snapshot {
        println!("✅ SUCCESS! Snapshot found in Redis:");
        println!("{}", data);
        
        // Parse and display nicely
        if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(&data) {
            println!("\n📊 Parsed Orderbook:");
            println!("Symbol: {}", parsed["symbol"]);
            println!("Bids: {}", serde_json::to_string_pretty(&parsed["bids"])?);
            println!("Asks: {}", serde_json::to_string_pretty(&parsed["asks"])?);
        }
    } else {
        println!("❌ ERROR: No snapshot found in Redis!");
    }

    println!("\n✅ Test completed!");
    Ok(())
}
