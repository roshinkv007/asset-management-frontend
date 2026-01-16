import api from "../api/axios";

export const getUsers = () => api.get("/users");
export const updateUserRole = (id, role) =>
  api.put(`/users/${id}/role`, { role });
export const toggleUserStatus = (id) =>
  api.put(`/users/${id}/status`);
