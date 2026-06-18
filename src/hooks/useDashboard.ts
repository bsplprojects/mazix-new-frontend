import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = (mid: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/${mid}`);
      return res.data;
    },
  });

  return {
    memberDetail: data,
    isLoading,
  };
};
