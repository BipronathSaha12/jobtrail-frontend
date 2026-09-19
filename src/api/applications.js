import client from "./client";

export const listApplications = (params) =>
  client.get("/applications/", { params }).then((r) => r.data);

export const getApplication = (id) =>
  client.get(`/applications/${id}/`).then((r) => r.data);

export const createApplication = (payload) =>
  client.post("/applications/", payload).then((r) => r.data);

export const updateApplication = (id, payload) =>
  client.patch(`/applications/${id}/`, payload).then((r) => r.data);

export const deleteApplication = (id) =>
  client.delete(`/applications/${id}/`);

export const getStats = () =>
  client.get("/stats/").then((r) => r.data);
