import client from "./client";

export const register = (payload) =>
  client.post("/register/", payload).then((r) => r.data);

export const login = (payload) =>
  client.post("/login/", payload).then((r) => r.data);
