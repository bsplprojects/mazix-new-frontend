import { axiosInstance } from "@/config/axios";
import axios from "axios";

export const usersApi = axios.create({
  baseURL: "http://localhost:5000/api/users",
  withCredentials: true,
});

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async (
  MemberID = "",
  Fromdate = "",
  Todate = "",
  page = 1,
  limit = 10,
) => {
  const { data } = await axiosInstance.get("/admin/members", {
    params: {
      MemberID,
      Fromdate,
      Todate,
      page,
      limit,
    },
  });

  return data;
};
