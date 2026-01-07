use anyhow::Result;
use tracing::{info, Level};

mod config;
mod engine;
mod messaging;
mod orderbook;
mod types;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .with_target(false)
        .json()
        .init();

    info!("Starting Matching Engine...");

    // Load configuration
    dotenv::dotenv().ok();
    let config = config::Config::from_env()?;

    info!("Configuration loaded successfully");
    info!("Engine Port: {}", config.engine_port);
    info!("Workers: {}", config.engine_workers);
    info!("NATS URL: {}", config.nats_url);

    // Initialize NATS connection
    let nats_client = async_nats::connect(&config.nats_url).await?;
    info!("Connected to NATS");

    // Initialize Redis connection
    let redis_client = redis::Client::open(config.redis_url.clone())?;
    let redis_conn = redis_client.get_connection_manager().await?;
    info!("Connected to Redis");

    // Initialize matching engine
    let engine = engine::MatchingEngine::new(nats_client, redis_conn, config.engine_workers);

    info!("Matching engine initialized");

    // Start the engine
    engine.run().await?;

    Ok(())
}
