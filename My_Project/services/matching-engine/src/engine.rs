use anyhow::Result;
use async_nats::Client as NatsClient;
use redis::aio::ConnectionManager;
use tracing::info;
use tokio::sync::mpsc;

pub struct MatchingEngine {
    nats_client: NatsClient,
    redis_conn: ConnectionManager,
    workers: usize,
}

impl MatchingEngine {
    pub fn new(
        nats_client: NatsClient,
        redis_conn: ConnectionManager,
        workers: usize,
    ) -> Self {
        Self {
            nats_client,
            redis_conn,
            workers,
        }
    }

    pub async fn run(self) -> Result<()> {
        info!("Matching engine is running with {} workers", self.workers);

        // Subscribe to order events
        let mut subscriber = self.nats_client.subscribe("orders.>".to_string()).await?;

        info!("Subscribed to orders.* subjects");

        // Process messages
        while let Some(message) = subscriber.next().await {
            info!(
                "Received message on subject: {} | payload: {:?}",
                message.subject,
                String::from_utf8_lossy(&message.payload)
            );

            // TODO: Parse order and match
            // TODO: Publish trade events
        }

        Ok(())
    }
}
