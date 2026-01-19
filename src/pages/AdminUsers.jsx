import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import EmployeeAssetHistoryModal from "../components/EmployeeAssetHistoryModal";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    phone: "",
    salary: "",
    joiningDate: "",
  });

  // ===== CHANGED: department dropdown state =====
  const [deptQuery, setDeptQuery] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);

  // ===== CHANGED: departments from API =====
  const [departments, setDepartments] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const token = localStorage.getItem("token");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  // ===== ADDED: fetch departments =====
  const fetchDepartments = async () => {
    const res = await api.get("/departments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDepartments(res.data.map((d) => d.name));
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments(); // ← ADDED
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();

    await api.post(
      "/users",
      { ...form, role: "employee" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setForm({
      name: "",
      email: "",
      password: "",
      department: "",
      phone: "",
      salary: "",
      joiningDate: "",
    });

    setDeptQuery("");
    setDeptOpen(false);

    fetchUsers();
  };

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const restoreUser = async (id) => {
    await api.put(
      `/users/${id}/restore`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };

  const editUser = (id) => {
    navigate(`/admin/users/${id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Users Management</h2>

          {/* ===== ADDED: MANAGE DEPARTMENTS BUTTON ===== */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/admin/users/departments")}
              className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
            >
              Manage Departments
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-600 text-white px-3 py-2 rounded"
            >
              Dashboard
            </button>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              Logout
            </button>
          </div>
          {/* ===== END ADDED ===== */}
        </div>

        {/* CREATE USER */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-xl">
          <h3 className="text-lg font-semibold mb-4">Create New Employee</h3>

          <form onSubmit={createUser} className="space-y-3">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Temporary Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="salary"
              type="number"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="joiningDate"
              type="date"
              value={form.joiningDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            {/* ===== CHANGED: DEPARTMENT FROM API + SEARCH ===== */}
            <div className="relative">
              <input
                type="text"
                placeholder="Select Department"
                value={deptQuery}
                onChange={(e) => {
                  setDeptQuery(e.target.value);
                  setDeptOpen(true);
                }}
                onFocus={() => setDeptOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const filtered = departments.filter((d) =>
                      d.toLowerCase().includes(deptQuery.toLowerCase())
                    );
                    if (filtered.length > 0) {
                      setForm({ ...form, department: filtered[0] });
                      setDeptQuery(filtered[0]);
                      setDeptOpen(false);
                    }
                  }
                }}
                className="w-full border p-2 rounded"
                required
              />

              {deptOpen && (
                <div className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                  {departments
                    .filter((d) =>
                      d.toLowerCase().includes(deptQuery.toLowerCase())
                    )
                    .map((dept) => (
                      <div
                        key={dept}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setForm({ ...form, department: dept });
                          setDeptQuery(dept);
                          setDeptOpen(false);
                        }}
                      >
                        {dept}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Employee
            </button>
          </form>
        </div>

{/* EMPLOYEES TABLE */}
<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="text-lg font-semibold mb-4">Employees</h3>

  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Email</th>
          <th className="p-2 text-left">Department</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="border-t hover:bg-gray-50">
            <td className="p-2">{user.name}</td>
            <td className="p-2">{user.email}</td>
            <td className="p-2">{user.department}</td>

            <td className="p-2 flex gap-2">
              <button
                onClick={() => setSelectedEmployeeId(user._id)}
                className="bg-indigo-600 text-white text-xs px-2 py-1 rounded"
              >
                History
              </button>

              <button
                onClick={() => editUser(user._id)}
                className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      </div>

      {selectedEmployeeId && (
        <EmployeeAssetHistoryModal
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
