// src/orderbook.rs
use crate::models::{Order, Side};
use rust_decimal::Decimal;
use std::collections::{BTreeMap, HashMap, VecDeque};

// Struct lưu vị trí của lệnh để tìm cho nhanh
#[derive(Debug)]
struct OrderLocation {
    price: Decimal,
    side: Side,
    // index trong VecDeque thì khó track vì nó thay đổi khi pop, 
    // nhưng ta có thể tìm nhanh trong VecDeque nhỏ nếu biết Price.
}

#[derive(Debug)]
pub struct OrderBook {
    // Danh sách lệnh Mua (Bids): Giá cao nhất xếp trước (BTreeMap)
    bids: BTreeMap<Decimal, VecDeque<Order>>,
    
    // Danh sách lệnh Bán (Asks): Giá thấp nhất xếp trước (BTreeMap)
    asks: BTreeMap<Decimal, VecDeque<Order>>,
    
    // MỚI: Index tìm kiếm nhanh Order theo ID
    // Key: OrderID, Value: Thông tin vị trí (Giá, Phe)
    order_locations: HashMap<u64, OrderLocation>, 
}

impl OrderBook {
    pub fn new() -> Self {
        OrderBook {
            bids: BTreeMap::new(),
            asks: BTreeMap::new(),
            order_locations: HashMap::new(), // MỚI
        }
    }

    // MỚI: Sửa hàm add_limit_order để cập nhật index location
    pub fn add_limit_order(&mut self, order: Order) {
        // 1. Lưu location vào index
        self.order_locations.insert(order.id, OrderLocation {
            price: order.price,
            side: order.side,
        });

        // 2. Thêm vào hàng chờ như cũ (dùng VecDeque thay vì Vec cho tốc độ pop_front)
        let list = match order.side {
            Side::Bid => self.bids.entry(order.price).or_insert(VecDeque::new()),
            Side::Ask => self.asks.entry(order.price).or_insert(VecDeque::new()),
        };
        
        // Thêm lệnh vào cuối hàng chờ ở mức giá này (Time Priority)
        list.push_back(order);
        println!(" -> Đã thêm lệnh vào OrderBook");
    }

    // MỚI: Hàm Hủy Lệnh (Trả về true nếu hủy thành công)
    pub fn cancel_order(&mut self, order_id: u64) -> bool {
        // 1. Tra cứu xem lệnh nằm ở đâu (O(1))
        if let Some(location) = self.order_locations.remove(&order_id) {
            // 2. Tìm đúng hàng chờ (Queue) ở mức giá đó
            let orders = match location.side {
                Side::Bid => self.bids.get_mut(&location.price),
                Side::Ask => self.asks.get_mut(&location.price),
            };

            if let Some(queue) = orders {
                // 3. Tìm và xóa lệnh khỏi Queue
                // Vì Queue thường ngắn (vài chục lệnh cùng mức giá) nên duyệt qua nhanh
                // retain giữ lại những phần tử KHÔNG phải là order_id cần xóa
                queue.retain(|o| o.id != order_id);
                
                // Nếu Queue rỗng thì xóa luôn key trong BTreeMap cho nhẹ
                if queue.is_empty() {
                    match location.side {
                        Side::Bid => { self.bids.remove(&location.price); },
                        Side::Ask => { self.asks.remove(&location.price); },
                    }
                }
                
                println!(" -> Đã hủy lệnh ID: {}", order_id);
                return true;
            }
        }
        
        println!(" -> Không tìm thấy lệnh ID: {} để hủy", order_id);
        false
    }
}
