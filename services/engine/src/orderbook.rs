// src/orderbook.rs
use crate::models::{Order, OrderType, Side, Trade};
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

    // MỚI: Xử lý lệnh với matching logic - Hỗ trợ cả Limit và Market Order
    pub fn process_order(&mut self, mut order: Order) -> Vec<Trade> {
        let mut trades = Vec::new();
        let mut trade_counter = 1u64;

        // Lấy danh sách lệnh đối nghịch (opposite side)
        let opposite_side = match order.side {
            Side::Bid => &mut self.asks,  // Lệnh mua -> tìm lệnh bán
            Side::Ask => &mut self.bids,  // Lệnh bán -> tìm lệnh mua
        };

        // Duyệt qua các mức giá tốt nhất (BTreeMap tự sắp xếp)
        // QUAN TRỌNG: 
        // - Nếu Buy (Bid): lấy Ask thấp nhất trước (sellers giá rẻ nhất) -> keys() thường
        // - Nếu Sell (Ask): lấy Bid cao nhất trước (buyers giá cao nhất) -> keys().rev()
        let prices_to_check: Vec<Decimal> = match order.side {
            Side::Bid => opposite_side.keys().copied().collect(),      // Ask: thấp -> cao
            Side::Ask => opposite_side.keys().rev().copied().collect(), // Bid: cao -> thấp
        };
        
        for price in prices_to_check {
            // Kiểm tra điều kiện khớp lệnh
            // QUAN TRỌNG: Market Order bỏ qua check giá, Limit Order phải check giá
            let can_match = match order.order_type {
                OrderType::Market => true, // Market Order: Khớp bất chấp giá
                OrderType::Limit => {
                    match order.side {
                        Side::Bid => order.price >= price,  // Mua: giá đặt >= giá bán
                        Side::Ask => order.price <= price,  // Bán: giá đặt <= giá mua
                    }
                }
            };

            if !can_match {
                break; // Không còn lệnh nào khớp được nữa
            }

            if let Some(queue) = opposite_side.get_mut(&price) {
                // Xử lý các lệnh trong queue ở mức giá này
                while let Some(mut opposite_order) = queue.pop_front() {
                    // Tính số lượng khớp
                    let match_amount = order.amount.min(opposite_order.amount);
                    
                    // Tạo Trade
                    let (buyer_id, seller_id) = match order.side {
                        Side::Bid => (order.id, opposite_order.id),
                        Side::Ask => (opposite_order.id, order.id),
                    };

                    let trade = Trade {
                        trade_id: trade_counter,
                        buyer_order_id: buyer_id,
                        seller_order_id: seller_id,
                        price,
                        amount: match_amount,
                        timestamp: 0,
                    };
                    
                    println!("   ⚡ Trade: {:?} khớp {} @ {}", 
                        if order.order_type == OrderType::Market { "MARKET" } else { "LIMIT" },
                        match_amount, price
                    );
                    
                    trades.push(trade);
                    trade_counter += 1;

                    // Cập nhật số lượng còn lại
                    order.amount -= match_amount;
                    opposite_order.amount -= match_amount;

                    // Nếu lệnh đối nghịch còn thừa, đưa lại vào queue
                    if opposite_order.amount > Decimal::ZERO {
                        queue.push_front(opposite_order);
                        break; // Lệnh hiện tại đã khớp hết
                    } else {
                        // Lệnh đối nghịch đã khớp hết -> xóa khỏi index
                        self.order_locations.remove(&opposite_order.id);
                    }

                    // Nếu lệnh hiện tại đã khớp hết
                    if order.amount == Decimal::ZERO {
                        break;
                    }
                }

                // Xóa mức giá nếu queue rỗng
                if queue.is_empty() {
                    opposite_side.remove(&price);
                }
            }

            // Nếu lệnh đã khớp hết, dừng
            if order.amount == Decimal::ZERO {
                break;
            }
        }

        // QUAN TRỌNG: Chỉ thêm vào OrderBook nếu:
        // 1. Còn số lượng chưa khớp
        // 2. Là Limit Order (Market Order không được vào Book)
        if order.amount > Decimal::ZERO {
            match order.order_type {
                OrderType::Limit => {
                    println!(" -> Lệnh Limit còn dư, thêm vào OrderBook");
                    self.add_limit_order(order);
                },
                OrderType::Market => {
                    println!(" -> Lệnh Market còn dư {} nhưng không thêm vào Book (Kill)", order.amount);
                    // Market Order không được thêm vào Book, phần dư bị "Kill"
                }
            }
        }

        trades
    }

    /// Lấy độ sâu thị trường (Market Depth) - Top N mức giá tốt nhất
    /// 
    /// # Arguments
    /// * `limit` - Số lượng mức giá muốn lấy (ví dụ: top 10)
    /// * `is_bid` - true để lấy bên Mua (Bids), false để lấy bên Bán (Asks)
    /// 
    /// # Returns
    /// Vec<(Price, Total Amount)> - Danh sách giá và tổng khối lượng ở mức giá đó
    pub fn get_depth(&self, limit: usize, is_bid: bool) -> Vec<(String, String)> {
        let mut result = Vec::new();
        
        if is_bid {
            // Bids: Giá cao nhất trước (Best Bid = giá cao nhất)
            // BTreeMap tăng dần -> cần rev() để lấy giá cao nhất
            for (price, orders) in self.bids.iter().rev().take(limit) {
                let total_amount: Decimal = orders.iter().map(|o| o.amount).sum();
                result.push((price.to_string(), total_amount.to_string()));
            }
        } else {
            // Asks: Giá thấp nhất trước (Best Ask = giá thấp nhất)
            // BTreeMap tăng dần -> iter() thường để lấy giá thấp nhất
            for (price, orders) in self.asks.iter().take(limit) {
                let total_amount: Decimal = orders.iter().map(|o| o.amount).sum();
                result.push((price.to_string(), total_amount.to_string()));
            }
        }

        result
    }
}
