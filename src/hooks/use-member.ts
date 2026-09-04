import { useQuery } from "@tanstack/react-query";
import { http } from "../config/http";

export const useMember = (memberId:string) => {
  const { data } = useQuery({
    queryKey: ["member", memberId],
    queryFn: async () => {
      const res = await http.post("/MemberInfoData", {
        UserId: memberId,
      });
      return res.data;
    },
    enabled: !!memberId,
  });
  return { data };
};
