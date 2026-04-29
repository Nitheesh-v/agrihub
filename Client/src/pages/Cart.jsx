import { useSelector, useDispatch } from "react-redux";
import { clearCart, increaseQty, decreaseQty, removeFromCart } from "@/redux/slices/cartSlice";
import { createOrder } from "@/services/orderService";
import { createPayment, verifyPayment } from "@/services/paymentService";
import { Link } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items || []);
  const { token } = useSelector((state) => state.auth);

  const total = items.reduce((acc, item) => acc + item.crop.price * item.quantity, 0);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) { alert("Razorpay SDK failed to load"); return; }

      const { data } = await createPayment(total, token);

      const options = {
        key: "rzp_test_Sav11ACOaXPU5P",
        amount: data.amount,
        currency: "INR",
        name: "AgriHub",
        description: "Crop Purchase",
        order_id: data.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, token);

            if (verifyRes && verifyRes.status === 200) {
              const orderData = {
                items: items.map((item) => ({ crop: item.crop._id, quantity: item.quantity, price: item.crop.price })),
                totalAmount: total,
              };
              await createOrder(orderData, token);
              dispatch(clearCart());
              alert("Payment verified & order placed!");
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            console.error("Handler Error:", error);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  };

  const handleOrder = async () => {
    const orderData = {
      items: items.map((item) => ({ crop: item.crop._id, quantity: item.quantity, price: item.crop.price })),
      totalAmount: total,
    };
    await createOrder(orderData, token);
    dispatch(clearCart());
    alert("Order placed!");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "#EAF3DE" }}
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3B6D11" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Add some crops from the marketplace to get started.</p>
          <Link to="/buyer/orders">
            <button
              className="w-full h-10 rounded-lg text-sm font-medium transition-all"
              style={{ background: "#27500A", color: "#EAF3DE" }}
              onMouseEnter={(e) => (e.target.style.background = "#1a3d06")}
              onMouseLeave={(e) => (e.target.style.background = "#27500A")}
            >
              View my orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Your cart</h1>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <Link to="/buyer/orders">
            <button className="text-sm font-medium px-4 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition">
              View orders
            </button>
          </Link>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{item.crop.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>₹{item.crop.price} / unit</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                    <span>{item.crop.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.crop._id))}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                {/* Qty controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => dispatch(decreaseQty(item.crop._id))}
                    className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(increaseQty(item.crop._id))}
                    className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-medium text-gray-900">
                  ₹{item.crop.price * item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Order summary</h2>

          <div className="space-y-2 mb-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-600">
                <span>{item.crop.name} × {item.quantity}</span>
                <span>₹{item.crop.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-medium text-gray-900">Total</span>
            <span className="font-medium text-gray-900">₹{total}</span>
          </div>

          <div className="mt-5 space-y-2">
            <button
              onClick={handlePayment}
              className="w-full h-11 rounded-lg text-sm font-medium transition-all active:scale-[0.98]"
              style={{ background: "#27500A", color: "#EAF3DE" }}
              onMouseEnter={(e) => (e.target.style.background = "#1a3d06")}
              onMouseLeave={(e) => (e.target.style.background = "#27500A")}
            >
              Pay & place order — ₹{total}
            </button>
            <button
              onClick={handleOrder}
              className="w-full h-10 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition active:scale-[0.98]"
            >
              Place order without payment
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}