use crate::models::{Order, Side};
use crate::orderbook::OrderBook;
use rust_decimal_macros::dec;

#[test]
fn test_add_bid_order() {
    let mut book = OrderBook::new();
    let order = Order::new(1, 101, dec!(50000), dec!(0.1), Side::Bid);
    
    book.add_limit_order(order);
    
    // Test passes if no panic
    assert!(true);
}

#[test]
fn test_add_ask_order() {
    let mut book = OrderBook::new();
    let order = Order::new(2, 102, dec!(51000), dec!(0.5), Side::Ask);
    
    book.add_limit_order(order);
    
    // Test passes if no panic
    assert!(true);
}

#[test]
fn test_order_creation() {
    let order = Order::new(1, 101, dec!(50000), dec!(0.1), Side::Bid);
    
    assert_eq!(order.id, 1);
    assert_eq!(order.user_id, 101);
    assert_eq!(order.price, dec!(50000));
    assert_eq!(order.amount, dec!(0.1));
    assert_eq!(order.side, Side::Bid);
}

#[test]
fn test_multiple_orders_at_same_price() {
    let mut book = OrderBook::new();
    
    let order1 = Order::new(1, 101, dec!(50000), dec!(0.1), Side::Bid);
    let order2 = Order::new(2, 102, dec!(50000), dec!(0.2), Side::Bid);
    
    book.add_limit_order(order1);
    book.add_limit_order(order2);
    
    // Test passes if no panic (both orders at same price)
    assert!(true);
}
