import { axiosInstance } from "@/config/axios";

// helper (clean response handling)
const get = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const teamApi = {
  left: (id: string) => get(`/team/left/${id}`),
  right: (id: string) => get(`/team/right/${id}`),
  direct: (id: string) => get(`/team/direct/${id}`),
  statement: (id: string) => get(`/team/payout-statement/${id}`),

  oldincome: (params: {
    id: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const query = new URLSearchParams();

    if (params.fromDate) query.append("fromDate", params.fromDate);
    if (params.toDate) query.append("toDate", params.toDate);
    if (params.page) query.append("page", String(params.page));
    if (params.pageSize) query.append("pageSize", String(params.pageSize));

    return get(
      `/team/old-income/${params.id}${
        query.toString() ? `?${query.toString()}` : ""
      }`,
    );
  },
  myincome: (params: {
    id: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const query = new URLSearchParams();

    if (params.fromDate) query.append("fromDate", params.fromDate);
    if (params.toDate) query.append("toDate", params.toDate);
    if (params.page) query.append("page", String(params.page));
    if (params.pageSize) query.append("pageSize", String(params.pageSize));

    return get(
      `/team/my-income/${params.id}${
        query.toString() ? `?${query.toString()}` : ""
      }`,
    );
  },
};
