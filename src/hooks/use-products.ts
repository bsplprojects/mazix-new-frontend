import { useQuery } from "@tanstack/react-query";
import { http } from "../config/http";

export const useProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await http.get("/GetAllProducts");
      return res.data;
    },
  });

  return {
    data,
    isLoading,
  };
};
