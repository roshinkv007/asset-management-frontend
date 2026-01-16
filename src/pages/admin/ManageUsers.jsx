
import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserRole,
  toggleUserStatus,
} from "../../services/userService.js";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(res => setUsers(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Manage Users</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-t text-center">
              <td>{u.name}</td>
              <td>{u.email}</td>

              <td>
                <select
                  value={u.role}
                  onChange={e =>
                    updateUserRole(u._id, e.target.value)
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>
                <button
                  onClick={() => toggleUserStatus(u._id)}
                  className="px-2 py-1 bg-black text-white"
                >
                  {u.isActive ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
