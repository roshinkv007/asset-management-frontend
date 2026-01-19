import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminAssets = () => {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    serialNumber: "",
    cost: "",
    purchasedOn: "",
    warrantyDate: "",
  });

  // ===== CATEGORY DROPDOWN STATE =====
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  // ===== CATEGORIES FROM API =====
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAssets = async () => {
    const res = await api.get("/assets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssets(res.data);
  };

  // ===== FETCH CATEGORIES =====
  const fetchCategories = async () => {
    const res = await api.get("/asset-categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data.map((c) => c.name));
  };

  useEffect(() => {
    fetchAssets();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createAsset = async (e) => {
    e.preventDefault();

    await api.post("/assets", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setForm({
      name: "",
      category: "",
      serialNumber: "",
      cost: "",
      purchasedOn: "",
      warrantyDate: "",
    });

    setCategoryQuery("");
    setCategoryOpen(false);

    fetchAssets();
  };

  const deleteAsset = async (id) => {
    await api.delete(`/assets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAssets();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Assets</h2>

          {/* ===== ADDED: MANAGE CATEGORIES BUTTON ===== */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/admin/assets/categories")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Manage Categories
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Back to Dashboard
            </button>
          </div>
          {/* ===== END ADDED ===== */}
        </div>

        {/* CREATE ASSET */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-xl">
          <h3 className="text-lg font-semibold mb-4">Create New Asset</h3>

          <form onSubmit={createAsset} className="space-y-3">
            <input
              name="name"
              placeholder="Asset Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            {/* CATEGORY DROPDOWN */}
            <div className="relative">
              {categoryOpen && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setCategoryOpen(false)}
                />
              )}

              <input
                type="text"
                placeholder="Select Asset Category"
                value={categoryQuery}
                onChange={(e) => {
                  setCategoryQuery(e.target.value);
                  setCategoryOpen(true);
                }}
                onFocus={() => setCategoryOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    const filtered = categories.filter((cat) =>
                      cat.toLowerCase().includes(categoryQuery.toLowerCase())
                    );

                    if (filtered.length > 0) {
                      setForm({ ...form, category: filtered[0] });
                      setCategoryQuery(filtered[0]);
                      setCategoryOpen(false);
                    }
                  }
                }}
                className="w-full border p-2 rounded relative z-10"
                required
              />

              {categoryOpen && (
                <div className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                  {categories
                    .filter((cat) =>
                      cat.toLowerCase().includes(categoryQuery.toLowerCase())
                    )
                    .map((cat) => (
                      <div
                        key={cat}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setForm({ ...form, category: cat });
                          setCategoryQuery(cat);
                          setCategoryOpen(false);
                        }}
                      >
                        {cat}
                      </div>
                    ))}

                  {categories.filter((cat) =>
                    cat.toLowerCase().includes(categoryQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="p-2 text-gray-400">No results</div>
                  )}
                </div>
              )}
            </div>

            <input
              name="serialNumber"
              placeholder="Serial Number"
              value={form.serialNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="cost"
              type="number"
              placeholder="Cost"
              value={form.cost}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <p>Purchase Date</p>
            <input
              name="purchasedOn"
              type="date"
              value={form.purchasedOn}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <p>Warranty Date</p>
            <input
              name="warrantyDate"
              type="date"
              value={form.warrantyDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Create Asset
            </button>
          </form>
        </div>

        {/* ASSETS TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Assets</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{asset.name}</td>
                    <td className="p-2">{asset.category}</td>
                    <td className="p-2">{asset.status}</td>

                    <td className="p-2">
                      <button
                        onClick={() => deleteAsset(asset._id)}
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
    </div>
  );
};

export default AdminAssets;