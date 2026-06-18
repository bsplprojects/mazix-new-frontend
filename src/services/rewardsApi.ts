import { axiosInstance } from "@/config/axios";

const get = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const rewardApi = {
  rewards: (id: string) => get(`/reward/member-reward?MemberID=${id}`),
};
