import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminAssets from "./pages/AdminAssets";
import { useAuth } from "./auth/AuthContext";
import { Navigate } from "react-router-dom";

import EditEmployee from "./pages/EditEmployee";
import AdminCategories from "./pages/AdminCategories";
import AdminDepartments from "./pages/AdminDepartments";

const App = () => {
  useAuth();

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
        <Route path="/admin/assets/categories" element={<AdminCategories />} />
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
          path="/admin/users/departments"
          element={
            <ProtectedRoute role="admin">
              <AdminDepartments />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/users/:id/edit" element={<EditEmployee />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
