# 🔥 Rust Matching Engine

## Giới thiệu
Đây là trái tim của hệ thống giao dịch - một matching engine được viết bằng Rust để đảm bảo:
- ⚡ **Hiệu năng cao**: Xử lý hàng nghìn lệnh/giây
- 💰 **Độ chính xác tuyệt đối**: Dùng `rust_decimal` thay vì float
- 🔒 **Memory safe**: Rust đảm bảo không có race condition

## Cấu trúc Project

```
engine/
├── Cargo.toml           # Dependencies configuration
└── src/
    ├── main.rs          # Entry point
    ├── models.rs        # Order & Side definitions
    └── orderbook.rs     # Matching logic
```

## Yêu cầu hệ thống

### Windows
1. **Rust toolchain**: 
   ```bash
   winget install Rustlang.Rustup
   ```

2. **Visual Studio Build Tools** (cho linker):
   ```bash
   winget install Microsoft.VisualStudio.2022.BuildTools --override "--quiet --wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
   ```

### Sau khi cài đặt
- Đóng và mở lại terminal để cập nhật PATH
- Hoặc chạy: 
  ```powershell
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
  ```

## Chạy Engine

```bash
cd services/engine
cargo run
```

Lần đầu tiên sẽ mất thời gian để download dependencies (~70+ crates).

## Output mong đợi

```
🔥 Trading Engine is starting...
Nhận lệnh Mua: Order { id: 1, user_id: 101, price: 50000, amount: 0.1, side: Bid }
 -> Đã thêm lệnh vào OrderBook
Nhận lệnh Bán: Order { id: 2, user_id: 102, price: 51000, amount: 0.5, side: Ask }
 -> Đã thêm lệnh vào OrderBook
Current Book: OrderBook { asks: {...}, bids: {...} }
```

## Kiến trúc

### 1. Order Model (`models.rs`)
- **Side**: Bid (Mua) / Ask (Bán)
- **Order**: Chứa thông tin lệnh (id, user, price, amount, timestamp)

### 2. OrderBook (`orderbook.rs`)
- **Bids**: HashMap<Price, Vec<Order>> - Lệnh mua (giá cao trước)
- **Asks**: HashMap<Price, Vec<Order>> - Lệnh bán (giá thấp trước)
- **add_limit_order()**: Thêm lệnh vào sổ

### 3. Matching Logic (Sắp tới)
Trong giai đoạn tiếp theo sẽ implement:
- Price-Time Priority
- Order matching algorithm
- Trade execution
- WebSocket notifications

## Dependencies quan trọng

```toml
rust_decimal = "1.33"        # Tính toán financial chính xác
serde = "1.0"                # Serialize/Deserialize
tokio = "1"                  # Async runtime
anyhow = "1.0"               # Error handling
```

## Lưu ý quan trọng

⚠️ **KHÔNG BAO GIỜ dùng `f64` cho tính toán tiền**
```rust
// ❌ SAI
let price: f64 = 0.1 + 0.2; // = 0.30000000000000004

// ✅ ĐÚNG
use rust_decimal_macros::dec;
let price = dec!(0.1) + dec!(0.2); // = 0.3
```

## Roadmap

- [x] Khởi tạo project structure
- [x] Định nghĩa Order models
- [x] Tạo OrderBook cơ bản
- [ ] Implement matching algorithm
- [ ] Thêm WebSocket để nhận lệnh từ Gateway
- [ ] Publish trades lên message queue
- [ ] Optimize với BTreeMap
- [ ] Add benchmarking tests

## Troubleshooting

### Lỗi `link.exe not found`
Cài Visual Studio Build Tools như hướng dẫn ở trên.

### Lỗi `cargo not found`
Cài Rust và làm mới terminal/PATH.

### Slow compilation
Lần đầu tiên compile sẽ chậm. Các lần sau sẽ nhanh hơn nhờ incremental compilation.
