// benches/orderbook_bench.rs
// Uncomment when ready to add criterion for benchmarking
/*
use criterion::{black_box, criterion_group, criterion_main, Criterion};
use matching_engine::models::{Order, Side};
use matching_engine::orderbook::OrderBook;
use rust_decimal_macros::dec;

fn bench_add_orders(c: &mut Criterion) {
    c.bench_function("add 1000 orders", |b| {
        b.iter(|| {
            let mut book = OrderBook::new();
            for i in 0..1000 {
                let order = Order::new(
                    i,
                    i % 100,
                    dec!(50000) + rust_decimal::Decimal::from(i % 100),
                    dec!(0.1),
                    if i % 2 == 0 { Side::Bid } else { Side::Ask }
                );
                book.add_limit_order(black_box(order));
            }
        });
    });
}

criterion_group!(benches, bench_add_orders);
criterion_main!(benches);
*/

// Placeholder for now
fn main() {
    println!("Benchmarks will be added in future iterations");
}
