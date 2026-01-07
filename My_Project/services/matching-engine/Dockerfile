# Build stage
FROM rust:1.75-alpine AS builder

WORKDIR /build

# Install build dependencies
RUN apk add --no-cache musl-dev openssl-dev pkgconfig

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Create dummy main to cache dependencies
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy source code
COPY . .

# Build the application
RUN cargo build --release --bin matching-engine

# Runtime stage
FROM alpine:3.19

WORKDIR /app

# Install runtime dependencies
RUN apk --no-cache add ca-certificates libgcc

# Copy binary from builder
COPY --from=builder /build/target/release/matching-engine /app/matching-engine

# Create non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 9090

CMD ["/app/matching-engine"]
