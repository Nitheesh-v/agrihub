import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Home } from "./pages/Home";

// Farmer
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerContracts from "./pages/FarmerContracts";
import FarmerMyContracts from "./pages/FarmerMyContracts";

// Company
import CompanyDashboard from "./pages/CompanyDashboard";
import CreateContract from "./pages/CreateContract";
import CompanyContracts from "./pages/CompanyContracts";

// Buyer
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";

// Admin
import AdminPanel from "./pages/AdminPanel";

// Layouts
import FarmerLayout from "./pages/layouts/FarmerLayout";
import CompanyLayout from "./pages/layouts/CompanyLayout";
import BuyerLayout from "./pages/layouts/BuyerLayout";
import AdminLayout from "./pages/layouts/AdminLayout";

// Verification
import VerifyUser from "./pages/VerifyUser";

// Common
import ProtectedRoute from "./routes/ProtectedRoute";
import AddCrop from "./pages/AddCrop";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ VERIFY (VERY IMPORTANT) */}
       <Route element={<ProtectedRoute />}>
  <Route path="/verify" element={<VerifyUser />} />
</Route>

        {/* 👨‍🌾 FARMER */}
        <Route element={<ProtectedRoute role="farmer" />}>
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<FarmerDashboard />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="contracts" element={<FarmerContracts />} />
            <Route path="my-contracts" element={<FarmerMyContracts />} />
             <Route path="add-crop" element={<AddCrop />} />
          </Route>
        </Route>

        {/* 🏢 COMPANY */}
        <Route element={<ProtectedRoute role="company" />}>
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<CompanyDashboard />} />   {/* ✅ FIX */}
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="create-contract" element={<CreateContract />} />
            <Route path="contracts" element={<CompanyContracts />} />
          </Route>
        </Route>

        {/* 🛒 BUYER */}
        <Route element={<ProtectedRoute role="buyer" />}>
          <Route path="/buyer" element={<BuyerLayout />}>
            <Route index element={<Marketplace />} />  {/* ✅ FIX */}
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>
        </Route>

        {/* 👨‍💼 ADMIN */}
       <Route element={<ProtectedRoute role="admin" />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminPanel />} />
  </Route>
</Route>

        {/* 🌾 COMMON */}
        {/* <Route element={<ProtectedRoute role="farmer" />}>
          <Route path="/add-crop" element={<AddCrop />} />
        </Route> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;