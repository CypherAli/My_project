# Matching Engine

High-performance order matching engine built with Rust and Tokio.

## Features

- In-memory order book with sub-millisecond matching
- NATS JetStream integration for event streaming
- Redis for order book snapshots
- Prometheus metrics
- Lock-free data structures for concurrency

## Project Structure

```
matching-engine/
├── src/
│   ├── main.rs          # Application entry point
│   ├── config.rs        # Configuration management
│   ├── engine.rs        # Core matching engine
│   ├── orderbook.rs     # Order book implementation
│   ├── types.rs         # Data types
│   └── messaging.rs     # NATS messaging
├── crates/              # Internal crates
├── benches/             # Benchmarks
├── Cargo.toml
└── Dockerfile
```

## Development

```bash
# Run locally
cargo run

# Run tests
cargo test

# Run benchmarks
cargo bench

# Build release
cargo build --release
```

## Performance

- Order matching: < 1μs per match
- Throughput: > 1M orders/sec
- Memory: O(n) where n is active orders
