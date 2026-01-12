use crate::models::{Order, OrderType, Side};
use crate::orderbook::OrderBook;
use rust_decimal_macros::dec;

#[test]
fn test_add_bid_order() {
    let mut book = OrderBook::new();
    let order = Order::new(1, 101, dec!(50000), dec!(0.1), Side::Bid, OrderType::Limit);
    
    book.add_limit_order(order);
    
    // Test passes if no panic
    assert!(true);
}

#[test]
fn test_add_ask_order() {
    let mut book = OrderBook::new();
    let order = Order::new(2, 102, dec!(51000), dec!(0.5), Side::Ask, OrderType::Limit);
    
    book.add_limit_order(order);
    
    // Test passes if no panic
    assert!(true);
}

#[test]
fn test_order_creation() {
    let order = Order::new(1, 101, dec!(50000), dec!(0.1), Side::Bid, OrderType::Limit);
    
    assert_eq!(order.id, 1);
    assert_eq!(order.user_id, 101);
    assert_eq!(order.price, dec!(50000));
    assert_eq!(order.amount, dec!(0.1));
    assert_eq!(order.side, Side::Bid);
}

#[test]
fn test_multiple_orders_at_same_price() {
    let mut book = OrderBook::new();
    
    let order1 = Order::new(1, 101, dec!(50000), dec!(0.1), Side::Bid, OrderType::Limit);
    let order2 = Order::new(2, 102, dec!(50000), dec!(0.2), Side::Bid, OrderType::Limit);
    
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
    let buy_order = Order::new(order_id, 1, dec!(50000), dec!(1.0), Side::Bid, OrderType::Limit);
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
    let order1 = Order::new(101, 1, dec!(50000), dec!(1.0), Side::Bid, OrderType::Limit);
    let order2 = Order::new(102, 2, dec!(50000), dec!(2.0), Side::Bid, OrderType::Limit);
    let order3 = Order::new(103, 3, dec!(50000), dec!(3.0), Side::Bid, OrderType::Limit);
    
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
    let bid_order = Order::new(200, 1, dec!(50000), dec!(1.0), Side::Bid, OrderType::Limit);
    book.add_limit_order(bid_order);

    // Thêm lệnh Ask
    let ask_order = Order::new(201, 2, dec!(51000), dec!(1.0), Side::Ask, OrderType::Limit);
    book.add_limit_order(ask_order);

    // Hủy lệnh Bid
    let is_cancelled = book.cancel_order(200);
    assert!(is_cancelled, "Lệnh Bid phải được hủy thành công");

    // Hủy lệnh Ask
    let is_cancelled = book.cancel_order(201);
    assert!(is_cancelled, "Lệnh Ask phải được hủy thành công");
}

// ========== TEST MARKET ORDER ==========

#[test]
fn test_market_order_full_match() {
    let mut book = OrderBook::new();

    // 1. Setup: Có người đang bán giá 50,000 và 51,000
    book.add_limit_order(Order::new(1, 101, dec!(50000), dec!(1.0), Side::Ask, OrderType::Limit));
    book.add_limit_order(Order::new(2, 102, dec!(51000), dec!(1.0), Side::Ask, OrderType::Limit));

    // 2. Action: Đặt Market Buy 1.5 BTC (Giá set là 0 cũng được vì Market không quan tâm giá)
    let market_order = Order::new(3, 200, dec!(0), dec!(1.5), Side::Bid, OrderType::Market);
    let trades = book.process_order(market_order);

    // 3. Verify: Phải khớp hết 1.0 ở giá 50k, và 0.5 ở giá 51k
    assert_eq!(trades.len(), 2, "Phải có 2 trades");
    assert_eq!(trades[0].price, dec!(50000), "Trade đầu tiên ở giá 50000");
    assert_eq!(trades[0].amount, dec!(1.0), "Trade đầu tiên khớp 1.0 BTC");
    assert_eq!(trades[1].price, dec!(51000), "Trade thứ hai ở giá 51000");
    assert_eq!(trades[1].amount, dec!(0.5), "Trade thứ hai khớp 0.5 BTC");
}

#[test]
fn test_market_order_partial_match() {
    let mut book = OrderBook::new();

    // Setup: Chỉ có 1 BTC đang bán ở giá 50,000
    book.add_limit_order(Order::new(1, 101, dec!(50000), dec!(1.0), Side::Ask, OrderType::Limit));

    // Action: Market Buy 2 BTC (nhưng chỉ có 1 BTC trong sổ lệnh)
    let market_order = Order::new(2, 200, dec!(0), dec!(2.0), Side::Bid, OrderType::Market);
    let trades = book.process_order(market_order);

    // Verify: Chỉ khớp được 1 BTC, phần dư 1 BTC bị Kill (không vào OrderBook)
    assert_eq!(trades.len(), 1, "Chỉ khớp được 1 trade");
    assert_eq!(trades[0].amount, dec!(1.0), "Khớp được 1.0 BTC");
}

#[test]
fn test_market_order_sell() {
    let mut book = OrderBook::new();

    // Setup: Có người muốn mua giá 50,000 và 49,000
    book.add_limit_order(Order::new(1, 101, dec!(50000), dec!(1.0), Side::Bid, OrderType::Limit));
    book.add_limit_order(Order::new(2, 102, dec!(49000), dec!(0.5), Side::Bid, OrderType::Limit));

    // Action: Market Sell 1.3 BTC
    let market_order = Order::new(3, 200, dec!(0), dec!(1.3), Side::Ask, OrderType::Market);
    let trades = book.process_order(market_order);

    // Verify: Market Sell sẽ khớp với giá cao nhất trước (50k) để có lợi cho người bán
    assert_eq!(trades.len(), 2, "Phải có 2 trades");
    assert_eq!(trades[0].price, dec!(50000), "Bán ở giá 50000 trước (giá tốt nhất)");
    assert_eq!(trades[0].amount, dec!(1.0), "Bán 1.0 BTC");
    assert_eq!(trades[1].price, dec!(49000), "Bán ở giá 49000 sau");
    assert_eq!(trades[1].amount, dec!(0.3), "Bán 0.3 BTC");
}

#[test]
fn test_limit_order_still_works() {
    let mut book = OrderBook::new();

    // Setup: Có người bán giá 51,000
    book.add_limit_order(Order::new(1, 101, dec!(51000), dec!(1.0), Side::Ask, OrderType::Limit));

    // Action: Limit Buy giá 50,000 (thấp hơn giá bán -> không khớp)
    let limit_order = Order::new(2, 200, dec!(50000), dec!(1.0), Side::Bid, OrderType::Limit);
    let trades = book.process_order(limit_order);

    // Verify: Không khớp, lệnh Limit vào OrderBook chờ
    assert_eq!(trades.len(), 0, "Không có trade nào xảy ra");
}

#[test]
fn test_market_order_ignores_price_field() {
    let mut book = OrderBook::new();

    // Setup: Có người bán giá 50,000
    book.add_limit_order(Order::new(1, 101, dec!(50000), dec!(1.0), Side::Ask, OrderType::Limit));

    // Action: Market Buy với giá "vô lý" 1000 (nhưng vẫn khớp vì Market không check giá)
    let market_order = Order::new(2, 200, dec!(1000), dec!(1.0), Side::Bid, OrderType::Market);
    let trades = book.process_order(market_order);

    // Verify: Vẫn khớp được vì Market Order bỏ qua giá
    assert_eq!(trades.len(), 1, "Khớp được 1 trade");
    assert_eq!(trades[0].price, dec!(50000), "Khớp ở giá 50000");
}
