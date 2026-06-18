import { axiosInstance } from "@/config/axios";

export const loginMember = (MemberID: string, Password: string) =>
  axiosInstance
    .post("/auth/login", {
      MemberID,
      Password,
    })
    .then((r) => r.data);

export const loginAdmin = (MemberID: string, Password: string) =>
  axiosInstance
    .post("/admin/login", {
      MemberID,
      Password,
    })
    .then((r) => r.data);

export const getProfile = (MemberID: string) =>
  axiosInstance
    .get("/auth/profile", {
      params: { MemberID },
    })
    .then((r) => r.data);
