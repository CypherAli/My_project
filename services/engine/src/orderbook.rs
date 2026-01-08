// src/orderbook.rs
use crate::models::{Order, Side};
use rust_decimal::Decimal;
use std::collections::HashMap;

#[derive(Debug)]
pub struct OrderBook {
    // Danh sách lệnh Bán (Asks): Giá thấp nhất xếp trước
    // Key: Price, Value: List các lệnh ở mức giá đó (Queue)
    asks: HashMap<Decimal, Vec<Order>>, 
    
    // Danh sách lệnh Mua (Bids): Giá cao nhất xếp trước
    bids: HashMap<Decimal, Vec<Order>>,
}

impl OrderBook {
    pub fn new() -> Self {
        OrderBook {
            asks: HashMap::new(),
            bids: HashMap::new(),
        }
    }

    // Hàm thêm lệnh vào sổ (chưa khớp vội, chỉ thêm thôi)
    pub fn add_limit_order(&mut self, order: Order) {
        let list = match order.side {
            Side::Bid => self.bids.entry(order.price).or_insert(Vec::new()),
            Side::Ask => self.asks.entry(order.price).or_insert(Vec::new()),
        };
        
        // Thêm lệnh vào cuối hàng chờ ở mức giá này (Time Priority)
        list.push(order);
        println!(" -> Đã thêm lệnh vào OrderBook");
    }
}
