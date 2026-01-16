export const getAssetHistory = (id) =>
  api.get(`/assets/${id}/history`);