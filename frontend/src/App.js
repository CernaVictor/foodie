import { useJsApiLoader } from "@react-google-maps/api";
import { useContext, useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Footer from "./components/Footer";
import { Login } from "./components/Login";
import Navbar from "./components/Navbar";
import { Register } from "./components/Register";
import GoogleMapsContext from "./context/GoogleMapsContext";
import { LocationProvider } from "./context/LocationContext";
import { LoginProvider, useAuth } from "./context/LoginContext";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import OrderStatusPage from "./pages/OrderStatusPage";
import { OrdersPage } from "./pages/OrdersPage";
import RestaurantPage from "./pages/RestaurantPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import AddRestaurantPage from "./pages/AddRestaurantPage";
import AddProductPage from "./pages/AddProductPage";
import ProtectedRoute from "./components/ProtectedRoute";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

function App() {
  return (
    <LoginProvider>
      <AppContent />
    </LoginProvider>
  );
}

function AppContent() {
  const { setIsGoogleMapsApiLoaded } = useContext(GoogleMapsContext);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  const auth = useAuth();

  useEffect(() => {
    setIsGoogleMapsApiLoaded(isLoaded);
  }, [isLoaded, setIsGoogleMapsApiLoaded]);

  return (
    <LocationProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              auth?.user === null ? <Navigate to="/login" /> : <HomePage />
            }
          />
          <Route
            path="/orders"
            element={
              auth?.user === null ? <Navigate to="/login" /> : <OrdersPage />
            }
          />
          <Route
            path="/restaurants"
            element={
              <ProtectedRoute user={auth.user} requiredRole="">
                <RestaurantsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/restaurant/:restaurantId"
            element={
              <ProtectedRoute user={auth.user} requiredRole="">
                <RestaurantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:cartId"
            element={
              <ProtectedRoute user={auth.user} requiredRole="user">
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-status/:orderId"
            element={
              <ProtectedRoute user={auth.user} requiredRole="">
                <OrderStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-restaurant"
            element={
              <ProtectedRoute user={auth.user} requiredRole="admin">
                <AddRestaurantPage />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/add-product"
            element={
              <ProtectedRoute user={auth.user} requiredRole="admin">
                <AddProductPage />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
        <Footer />
      </Router>
    </LocationProvider>
  );
}

export default App;
