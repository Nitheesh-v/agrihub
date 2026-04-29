import { useEffect, useState } from "react";
import { getCrops } from "@/services/cropService";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { Link } from "react-router-dom";

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [added, setAdded] = useState({});
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => { fetchCrops(); }, []);

  const fetchCrops = async () => { const { data } = await getCrops(); setCrops(data); };

  const handleAdd = (crop) => {
    dispatch(addToCart({ crop: { _id: crop._id, name: crop.name, price: Number(crop.price), quantity: crop.quantity, location: crop.location }, quantity: 1 }));
    setAdded((p) => ({ ...p, [crop._id]: true }));
    setTimeout(() => setAdded((p) => ({ ...p, [crop._id]: false })), 1800);
  };

  const filtered = crops.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.location?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg,#f0fdf4,#fefce8)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ani-fadeup">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl shadow-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#166534,#3B6D11)" }}>
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900">Marketplace</h1>
              <p className="text-sm text-green-600">{filtered.length} crops available</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search crops..." className="pl-9 pr-4 h-10 rounded-xl border border-green-200 text-sm bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition w-52" />
            </div>
            <Link to="/buyer/cart">
              <button className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-bold text-green-800 bg-green-100 hover:bg-green-200 border border-green-200 transition-all hover:scale-105">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
                Cart
              </button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((crop, i) => (
            <div key={crop._id} className={`bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden ani-fadeup stagger-${Math.min(i+1,5)} hover:shadow-lg hover:-translate-y-1 transition-all`}>
              <div className="h-1.5" style={{ background: "linear-gradient(90deg,#166534,#86efac,#fbbf24)" }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl border border-green-100 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#dcfce7,#f0fdf4)" }}>
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#166534"><path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z"/></svg>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">In stock</span>
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{crop.name}</h3>
                <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {crop.location}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs text-green-600 mb-1">Price</p>
                    <p className="font-black text-green-900">₹{crop.price}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-amber-600 mb-1">Available</p>
                    <p className="font-black text-amber-900">{crop.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(crop)}
                  className="w-full h-11 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                  style={{ background: added[crop._id] ? "linear-gradient(135deg,#dcfce7,#bbf7d0)" : "linear-gradient(135deg,#166534,#3B6D11)", color: added[crop._id] ? "#166534" : "white" }}>
                  {added[crop._id] ? "✓ Added to cart!" : "Add to cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}