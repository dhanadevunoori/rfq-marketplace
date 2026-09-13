import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import CreateRfq from "./pages/buyer/CreateRfq";
import MyRfqs from "./pages/buyer/MyRfqs";
import RfqDetails from "./pages/buyer/RfqDetails";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import BrowseRfqs from "./pages/supplier/BrowseRfqs";
import SupplierRfqDetails from "./pages/supplier/RfqDetails";
import MyQuotations from "./pages/supplier/MyQuotations";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="/buyer"
            element={
              <ProtectedRoute role="BUYER">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/supplier"
            element={
              <ProtectedRoute role="SUPPLIER">
                <div className="p-8">
                  Supplier Dashboard
                </div>
              </ProtectedRoute>
            }
          />

          <Route
  path="/buyer/rfqs/create"
  element={
    <ProtectedRoute role="BUYER">
      <CreateRfq />
    </ProtectedRoute>
  }
/>

<Route
  path="/buyer/rfqs"
  element={
    <ProtectedRoute role="BUYER">
      <MyRfqs />
    </ProtectedRoute>
  }
/>

<Route
  path="/buyer/rfqs/:id"
  element={
    <ProtectedRoute role="BUYER">
      <RfqDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/supplier"
  element={
    <ProtectedRoute role="SUPPLIER">
      <SupplierDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/supplier/rfqs"
  element={
    <ProtectedRoute role="SUPPLIER">
      <BrowseRfqs />
    </ProtectedRoute>
  }
/>

<Route
  path="/supplier/rfqs/:id"
  element={
    <ProtectedRoute role="SUPPLIER">
      <SupplierRfqDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/supplier/quotations"
  element={
    <ProtectedRoute role="SUPPLIER">
      <MyQuotations />
    </ProtectedRoute>
  }
/>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;