import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    salary: "",
    joiningDate: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      const res = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        department: res.data.department || "",
        phone: res.data.phone || "",
        salary: res.data.salary || "",
        joiningDate: res.data.joiningDate
          ? res.data.joiningDate.split("T")[0]
          : "",
      });

      setLoading(false);
    };

    fetchEmployee();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateEmployee = async (e) => {
    e.preventDefault();

    await api.put(`/users/${id}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    navigate("/admin/users");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>

        <form onSubmit={updateEmployee} className="space-y-4">
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

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
