use std::collections::BTreeMap;
use uuid::Uuid;
use crate::types::{Order, OrderSide, Trade};

/// High-performance order book implementation
pub struct OrderBook {
    symbol: String,
    bids: BTreeMap<u64, Vec<Order>>,  // Price -> Orders (sorted descending)
    asks: BTreeMap<u64, Vec<Order>>,  // Price -> Orders (sorted ascending)
}

impl OrderBook {
    pub fn new(symbol: String) -> Self {
        Self {
            symbol,
            bids: BTreeMap::new(),
            asks: BTreeMap::new(),
        }
    }

    pub fn add_order(&mut self, order: Order) {
        match order.side {
            OrderSide::Buy => {
                self.bids
                    .entry(order.price)
                    .or_insert_with(Vec::new)
                    .push(order);
            }
            OrderSide::Sell => {
                self.asks
                    .entry(order.price)
                    .or_insert_with(Vec::new)
                    .push(order);
            }
        }
    }

    pub fn match_order(&mut self, order: Order) -> Vec<Trade> {
        let mut trades = Vec::new();
        // TODO: Implement matching logic
        trades
    }

    pub fn cancel_order(&mut self, order_id: Uuid) -> bool {
        // TODO: Implement cancellation logic
        false
    }

    pub fn get_best_bid(&self) -> Option<u64> {
        self.bids.keys().next_back().copied()
    }

    pub fn get_best_ask(&self) -> Option<u64> {
        self.asks.keys().next().copied()
    }
}
