import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

type HookProps = {
  fDate?: Date | string;
  tDate?: Date | string;
  limit: number;
};

export const useRepurchase = ({ fDate, tDate, limit = 5 }: HookProps) => {
  const memberId = sessionStorage.getItem("memberID");
  const { data, isLoading } = useQuery({
    queryKey: ["repurchase-history", fDate, tDate, limit],
    queryFn: async () => {
      const res = await axiosInstance.get(`/repurchase/history/${memberId}`, {
        params: { fDate, tDate, limit },
      });
      return res.data;
    },
  });

  return {
    repurchaseHistory: data,
    isLoading,
  };
};
