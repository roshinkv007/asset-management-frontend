import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminAssets from "./pages/AdminAssets";
import { useAuth } from "./auth/AuthContext";
import { Navigate } from "react-router-dom";
import ManageUsers from "./pages/admin/ManageUsers";
import EditEmployee from "./pages/EditEmployee";

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
       

        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assets"
          element={
            <ProtectedRoute role="admin">
              <AdminAssets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            user?.role === "admin" ? <ManageUsers /> : <Navigate to="/" />
          }
        />
         <Route path="/admin/users/:id/edit" element={<EditEmployee />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
