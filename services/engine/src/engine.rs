// src/engine.rs
use std::collections::HashMap;
use crate::models::{Command, EngineEvent, Order};
use crate::orderbook::OrderBook;

pub struct MatchingEngine {
    // Quản lý nhiều cặp tiền: Key = "BTC/USDT", Value = OrderBook
    orderbooks: HashMap<String, OrderBook>,
}

impl MatchingEngine {
    pub fn new() -> Self {
        MatchingEngine {
            orderbooks: HashMap::new(),
        }
    }

    // Hàm xử lý chính: Nhận Command -> Trả về danh sách Event
    pub fn process_command(&mut self, cmd: Command) -> Vec<EngineEvent> {
        match cmd {
            Command::Place(order) => self.process_place(order),
            Command::Cancel(order_id) => self.process_cancel(order_id),
        }
    }

    fn process_place(&mut self, order: Order) -> Vec<EngineEvent> {
        let symbol = order.symbol.clone();
        
        // 1. Tìm OrderBook của cặp tiền này (nếu chưa có thì tạo mới)
        let book = self.orderbooks
            .entry(symbol.clone())
            .or_insert_with(OrderBook::new);

        // 2. Gửi lệnh vào OrderBook xử lý
        let trades = book.process_order(order.clone());

        // 3. Tạo danh sách sự kiện trả về
        let mut events = Vec::new();

        // Sự kiện xác nhận đã đặt lệnh - GỬI ĐẦY ĐỦ THÔNG TIN
        events.push(EngineEvent::OrderPlaced { 
            order_id: order.id,
            user_id: order.user_id,
            symbol,
            price: order.price,
            amount: order.amount,
            side: order.side,
        });

        // Sự kiện cho từng trade được khớp
        for trade in trades {
            events.push(EngineEvent::TradeExecuted { trade });
        }

        events
    }

    fn process_cancel(&mut self, order_id: u64) -> Vec<EngineEvent> {
        // Vấn đề: Ta chỉ có ID, không biết lệnh nằm ở OrderBook nào (Symbol nào).
        // Giải pháp đơn giản (Tạm thời): Quét tất cả OrderBook.
        // Giải pháp tối ưu (Sau này): Cần thêm một Map<OrderID, Symbol> ở tầng Engine này.
        
        let mut success = false;
        for book in self.orderbooks.values_mut() {
            if book.cancel_order(order_id) {
                success = true;
                break; // Tìm thấy và hủy xong thì dừng
            }
        }

        vec![EngineEvent::OrderCancelled { order_id, success }]
    }

    // MỚI: Hàm lấy reference đến OrderBook của một symbol (để snapshot)
    pub fn get_orderbook(&self, symbol: &str) -> Option<&OrderBook> {
        self.orderbooks.get(symbol)
    }
}
