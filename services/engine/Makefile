.PHONY: build run test clean fmt check release docker-build

# Build debug version
build:
	cargo build

# Run the engine
run:
	cargo run

# Run tests
test:
	cargo test

# Clean build artifacts
clean:
	cargo clean

# Format code
fmt:
	cargo fmt

# Check code without building
check:
	cargo check

# Build release version (optimized)
release:
	cargo build --release

# Run release version
run-release:
	cargo run --release

# Build Docker image
docker-build:
	docker build -t matching-engine:latest .

# Run benchmarks (when added)
bench:
	cargo bench

# Watch and auto-recompile
watch:
	cargo watch -x run

# Install cargo-watch if needed
install-watch:
	cargo install cargo-watch
