import { axiosInstance } from "@/config/axios";

export const getMemberDashboard = (MID: string, MemberID: string) =>
  axiosInstance
    .get("/joining/member-dashboard", {
      params: { MID, MemberID },
    })
    .then((r) => r.data);

export const getProducts = () =>
  axiosInstance.get("/joining/products").then((r) => r.data);

export const getStates = () =>
  axiosInstance.get("/joining/states").then((r) => r.data);

export const getCities = (id: number) =>
  axiosInstance.get(`/joining/cities/${id}`).then((r) => r.data);

export const checkSponsor = (id: string) =>
  axiosInstance.get(`/joining/check-sponsor/${id}`).then((r) => r.data);

export const registerJoining = async (data: any) => {
  try {
    const res = await axiosInstance.post("/joining/register", data);
    return res.data;
  } catch (error: any) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error;
  }
};
