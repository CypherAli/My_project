import OrderBook from "@/components/OrderBook";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0e11] text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-blue-500 mb-8">🚀 Trading Platform UI</h1>
      
      <div className="flex gap-8 items-start">
        {/* Sau này sẽ đặt Chart ở bên trái */}
        <div className="w-[600px] h-[400px] bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800 text-gray-600">
          [Chart Coming Soon]
        </div>

        {/* OrderBook bên phải */}
        <OrderBook />
      </div>
    </main>
  );
}
