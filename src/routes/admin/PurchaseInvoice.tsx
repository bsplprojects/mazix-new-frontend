import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const PurchaseInvoice = () => {
  const { id } = useParams();
  const { data: receipt, isLoading } = useQuery({
    queryKey: ["receipt"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/purchase-receipt/${id}`);
      return res.data;
    },
  });

  console.log(receipt);
  return (
    <main
      style={{
        width: "100%",
        background: "white",
        height: "100vh",
      }}
    >
      
    </main>
  );
};

export default PurchaseInvoice;
