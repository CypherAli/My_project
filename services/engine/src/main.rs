mod models;
mod orderbook;

#[cfg(test)]
mod tests;

use models::{Order, Side};
use orderbook::OrderBook;
use rust_decimal_macros::dec; // Macro để viết số thập phân nhanh

fn main() {
    println!("🔥 Trading Engine is starting...");

    let mut book = OrderBook::new();

    // Giả lập 1 lệnh Mua BTC giá 50,000
    let buy_order = Order::new(
        1, 
        101, 
        dec!(50000.0), 
        dec!(0.1), 
        Side::Bid
    );

    // Giả lập 1 lệnh Bán BTC giá 51,000
    let sell_order = Order::new(
        2, 
        102, 
        dec!(51000.0), 
        dec!(0.5), 
        Side::Ask
    );

    println!("Nhận lệnh Mua: {:?}", buy_order);
    book.add_limit_order(buy_order);

    println!("Nhận lệnh Bán: {:?}", sell_order);
    book.add_limit_order(sell_order);

    println!("Current Book: {:?}", book);
}
