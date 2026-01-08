// src/models.rs
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Side {
    Bid, // Mua
    Ask, // Bán
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    pub id: u64,           // ID duy nhất của lệnh
    pub user_id: u64,      // Ai đặt lệnh?
    pub symbol: String,    // Cặp tiền nào? (VD: BTC/USDT)
    pub price: Decimal,    // Giá đặt (Dùng Decimal cho chính xác)
    pub amount: Decimal,   // Số lượng đặt
    pub side: Side,        // Mua hay Bán?
    pub timestamp: u64,    // Thời gian đặt (để ưu tiên lệnh đến trước)
}

impl Order {
    // Helper để tạo lệnh nhanh khi test
    pub fn new(id: u64, user_id: u64, price: Decimal, amount: Decimal, side: Side) -> Self {
        Order {
            id,
            user_id,
            symbol: "BTC/USDT".to_string(),
            price,
            amount,
            side,
            timestamp: 0, // Tạm thời để 0
        }
    }
}
