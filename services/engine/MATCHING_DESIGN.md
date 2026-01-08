# Matching Algorithm Design

## Nguyên tắc hoạt động

### 1. Price-Time Priority (Ưu tiên Giá - Thời gian)
- **Price Priority**: Lệnh MUA cao nhất match với lệnh BÁN thấp nhất
- **Time Priority**: Cùng giá thì lệnh đến trước được xử lý trước (FIFO)

### 2. Order Book Structure

```
Asks (Bán) - Sắp xếp giá TĂNG DẦN
┌─────────────────────────────┐
│ 51,500 USDT → [Order1, ...]│  ← Giá cao nhất
│ 51,000 USDT → [Order2, ...]│
│ 50,800 USDT → [Order3, ...]│  ← Giá thấp nhất (Best Ask)
└─────────────────────────────┘
              ↕️  SPREAD (Gap giữa giá)
┌─────────────────────────────┐
│ 50,500 USDT → [Order4, ...]│  ← Giá cao nhất (Best Bid)
│ 50,200 USDT → [Order5, ...]│
│ 49,900 USDT → [Order6, ...]│  ← Giá thấp nhất
└─────────────────────────────┘
Bids (Mua) - Sắp xếp giá GIẢM DẦN
```

### 3. Matching Logic

```rust
fn match_order(incoming_order) {
    if incoming_order.side == Bid {
        // Lệnh MUA
        while incoming_order.amount > 0 {
            best_ask = get_best_ask();  // Lệnh bán rẻ nhất
            
            if incoming_order.price >= best_ask.price {
                execute_trade(incoming_order, best_ask);
            } else {
                break;  // Không match được nữa
            }
        }
    } else {
        // Lệnh BÁN
        while incoming_order.amount > 0 {
            best_bid = get_best_bid();  // Lệnh mua cao nhất
            
            if incoming_order.price <= best_bid.price {
                execute_trade(incoming_order, best_bid);
            } else {
                break;  // Không match được nữa
            }
        }
    }
    
    // Nếu còn dư, thêm vào OrderBook
    if incoming_order.amount > 0 {
        add_to_orderbook(incoming_order);
    }
}
```

### 4. Ví dụ cụ thể

**Trạng thái ban đầu:**
- Asks: 51,000 (0.5 BTC), 52,000 (1 BTC)
- Bids: 50,000 (0.3 BTC), 49,000 (0.8 BTC)

**Lệnh mới đến:** MUA 0.7 BTC @ 51,500 USDT

**Quá trình match:**
1. Best Ask = 51,000 (0.5 BTC) ≤ 51,500 → MATCH!
   - Trade 1: 0.5 BTC @ 51,000 USDT
   - Còn lại: 0.2 BTC cần mua

2. Best Ask = 52,000 (1 BTC) ≤ 51,500 → KHÔNG MATCH (giá quá cao)
   
3. Thêm 0.2 BTC vào Bids @ 51,500

**Trạng thái sau:**
- Asks: 52,000 (1 BTC)
- Bids: 51,500 (0.2 BTC), 50,000 (0.3 BTC), 49,000 (0.8 BTC)

### 5. Trade Execution

```rust
struct Trade {
    id: u64,
    price: Decimal,
    amount: Decimal,
    buyer_id: u64,
    seller_id: u64,
    timestamp: u64,
}

fn execute_trade(buyer: &Order, seller: &Order) -> Trade {
    let price = seller.price;  // Lệnh Maker quyết định giá
    let amount = min(buyer.amount, seller.amount);
    
    Trade {
        id: generate_trade_id(),
        price,
        amount,
        buyer_id: buyer.user_id,
        seller_id: seller.user_id,
        timestamp: now(),
    }
}
```

### 6. Optimization với BTreeMap

Thay vì `HashMap`, dùng `BTreeMap` để tự động sắp xếp:

```rust
use std::collections::BTreeMap;

struct OrderBook {
    // Tự động sắp xếp theo key (price)
    asks: BTreeMap<Decimal, Vec<Order>>,  // Tăng dần
    bids: BTreeMap<Decimal, Vec<Order>>,  // Giảm dần (dùng Reverse)
}

// Lấy best price O(log n) thay vì O(n)
fn get_best_ask(&self) -> Option<&Vec<Order>> {
    self.asks.first_key_value().map(|(_, orders)| orders)
}

fn get_best_bid(&self) -> Option<&Vec<Order>> {
    self.bids.last_key_value().map(|(_, orders)| orders)
}
```

## Roadmap Implementation

### Phase 1 (Đã xong) ✅
- [x] Order models
- [x] Basic OrderBook structure
- [x] Add order function

### Phase 2 (Sắp tới)
- [ ] Implement matching algorithm
- [ ] Execute trades
- [ ] Partial fill logic
- [ ] Cancel order function

### Phase 3
- [ ] Optimize với BTreeMap
- [ ] Add WebSocket server
- [ ] Integrate with message queue (RabbitMQ/Redis)
- [ ] Real-time trade notifications

### Phase 4
- [ ] Performance testing
- [ ] Add metrics/monitoring
- [ ] Implement circuit breaker
- [ ] Add order validation rules

## Performance Targets

- **Throughput**: 10,000+ orders/second
- **Latency**: < 1ms per match
- **Memory**: < 100MB for 100,000 orders
- **Availability**: 99.99% uptime
