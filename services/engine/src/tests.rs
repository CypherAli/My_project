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

#[test]
fn test_cancel_order() {
    let mut book = OrderBook::new();

    // 1. Thêm lệnh mua (chờ khớp)
    let order_id = 100;
    let buy_order = Order::new(order_id, 1, dec!(50000), dec!(1.0), Side::Bid);
    book.add_limit_order(buy_order);

    // 2. Hủy lệnh đó
    let is_cancelled = book.cancel_order(order_id);
    assert!(is_cancelled, "Lệnh phải được hủy thành công");

    // 3. Hủy lại lần nữa (phải thất bại)
    let is_cancelled_again = book.cancel_order(order_id);
    assert!(!is_cancelled_again, "Hủy lệnh không tồn tại phải trả về false");
}

#[test]
fn test_cancel_order_multiple_at_same_price() {
    let mut book = OrderBook::new();

    // Thêm nhiều lệnh cùng mức giá
    let order1 = Order::new(101, 1, dec!(50000), dec!(1.0), Side::Bid);
    let order2 = Order::new(102, 2, dec!(50000), dec!(2.0), Side::Bid);
    let order3 = Order::new(103, 3, dec!(50000), dec!(3.0), Side::Bid);
    
    book.add_limit_order(order1);
    book.add_limit_order(order2);
    book.add_limit_order(order3);

    // Hủy lệnh ở giữa
    let is_cancelled = book.cancel_order(102);
    assert!(is_cancelled, "Lệnh 102 phải được hủy thành công");

    // Hủy lệnh đầu tiên
    let is_cancelled = book.cancel_order(101);
    assert!(is_cancelled, "Lệnh 101 phải được hủy thành công");

    // Hủy lệnh cuối cùng
    let is_cancelled = book.cancel_order(103);
    assert!(is_cancelled, "Lệnh 103 phải được hủy thành công");
}

#[test]
fn test_cancel_nonexistent_order() {
    let mut book = OrderBook::new();

    // Thử hủy lệnh không tồn tại
    let is_cancelled = book.cancel_order(999);
    assert!(!is_cancelled, "Hủy lệnh không tồn tại phải trả về false");
}

#[test]
fn test_cancel_bid_and_ask_orders() {
    let mut book = OrderBook::new();

    // Thêm lệnh Bid
    let bid_order = Order::new(200, 1, dec!(50000), dec!(1.0), Side::Bid);
    book.add_limit_order(bid_order);

    // Thêm lệnh Ask
    let ask_order = Order::new(201, 2, dec!(51000), dec!(1.0), Side::Ask);
    book.add_limit_order(ask_order);

    // Hủy lệnh Bid
    let is_cancelled = book.cancel_order(200);
    assert!(is_cancelled, "Lệnh Bid phải được hủy thành công");

    // Hủy lệnh Ask
    let is_cancelled = book.cancel_order(201);
    assert!(is_cancelled, "Lệnh Ask phải được hủy thành công");
}
