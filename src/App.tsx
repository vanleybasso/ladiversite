import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AfterPayment from "./pages/AfterPayment";
import Orders from "./pages/Orders";
import AccountDetails from "./pages/AccountDetails";
import About from "./pages/About";
import NotFound from "./pages/404";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PageTitle from "./components/PageTitle";
import { ThemeProvider } from "./components/ThemeContext";
import EditProduct from "./pages/EditProduct"; 
import PaymentMethod from "./pages/PaymentMethod";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <PageTitle />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/afterpayment" element={<AfterPayment />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/account-details" element={<AccountDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            // No seu App.tsx, adicione a nova rota:
<Route path="/payment" element={<PaymentMethod />} />
           
            <Route path="/edit-product/:id" element={<EditProduct />} /> 
            <Route path="/edit-product" element={<EditProduct />} /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;