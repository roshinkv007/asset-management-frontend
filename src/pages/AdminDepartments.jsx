/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ===== FETCH DEPARTMENTS =====
  const fetchDepartments = async () => {
    const res = await api.get("/departments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ===== CREATE DEPARTMENT =====
  const createDepartment = async (e) => {
    e.preventDefault();

    await api.post(
      "/departments",
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setName("");
    fetchDepartments();
  };

  // ===== DISABLE DEPARTMENT =====
  const disableDepartment = async (id) => {
    await api.put(
      `/departments/${id}/disable`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchDepartments();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Departments</h2>

          <button
            onClick={() => navigate("/admin/users")}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>

        {/* CREATE DEPARTMENT */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-md">
          <h3 className="font-semibold mb-3">Add New Department</h3>

          <form onSubmit={createDepartment} className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Department name"
              className="flex-1 border p-2 rounded"
              required
            />

            <button className="bg-indigo-600 text-white px-4 py-2 rounded">
              Add
            </button>
          </form>
        </div>

        {/* DEPARTMENT LIST */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Departments</h3>

          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((dept) => (
                <tr key={dept._id} className="border-t">
                  <td className="p-2">{dept.name}</td>
                  <td className="p-2">
                    {dept.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Disabled</span>
                    )}
                  </td>
                  <td className="p-2">
                    {dept.isActive && (
                      <button
                        onClick={() => disableDepartment(dept._id)}
                        className="bg-red-500 text-white text-xs px-3 py-1 rounded"
                      >
                        Disable
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {departments.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-gray-500 text-center">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDepartments;