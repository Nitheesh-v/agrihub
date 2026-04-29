import { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orderService";
import { useSelector } from "react-redux";

const statusConfig = {
  delivered: { cls: "bg-emerald-100 text-emerald-800 border-emerald-200", bar: "#166534" },
  processing: { cls: "bg-blue-100 text-blue-800 border-blue-200", bar: "#2563eb" },
  cancelled: { cls: "bg-red-100 text-red-800 border-red-200", bar: "#dc2626" },
  pending: { cls: "bg-amber-100 text-amber-800 border-amber-200", bar: "#d97706" },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { token } = useSelector((s) => s.auth);

  useEffect(() => { fetchOrders(); }, []);
  const fetchOrders = async () => { 
    try
     {
       const res = await getMyOrders(token);
       
        setOrders(res.data);

       } catch (e) 
       { 
        console.error(e);
       } };

  if (orders.length === 0) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg,#f0fdf4,#fefce8)" }}>
      <div className="text-center ani-fadein">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <p className="text-xl font-bold text-green-900 mb-2">No orders yet</p>
        <p className="text-green-500 text-sm">Your orders will show up here after purchase</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg,#f0fdf4,#fefce8)" }}>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-8 ani-fadeup">
          <div className="w-12 h-12 rounded-2xl shadow-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#166534,#3B6D11)" }}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-900">My Orders</h1>
            <p className="text-sm text-green-600">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order, i) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            return (
              <div key={order._id} className={`bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden ani-fadeup stagger-${Math.min(i + 1, 5)} hover:shadow-md transition-shadow`}>
                <div className="h-1.5" style={{ background: `linear-gradient(90deg,${cfg.bar},#86efac)` }} />
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Order ID</p>
                      <p className="font-mono font-bold text-gray-900 text-sm">{order._id.slice(-10).toUpperCase()}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.cls}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 border border-green-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#3B6D11"><path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z" /></svg>
                          </div>
                          <div>
                           <p className="text-sm font-semibold text-gray-800">
  {item.crop?.name || "Unknown Crop"}
</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} · ₹{item.price} each</p>
                          </div>
                        </div>
                        <p className="font-bold text-green-900">₹{item.quantity * item.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "linear-gradient(135deg,#166534,#3B6D11)" }}>
                    <span className="text-sm font-bold text-white">Total</span>
                    <span className="text-lg font-black text-white">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}