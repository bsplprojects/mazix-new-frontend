import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { http } from "@/config/http";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight, LucideIndianRupee, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const MyOrdersPage = () => {
  const [phone, setPhone] = useState("");

  // 7781090654
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await http.get(`/GetOrderDetail/?phone=${phone}`);
      return res.data;
    },
  });

  return (
    <main className="w-full flex flex-col">
      <Header />

      <div className="mt-16 p-4 sm:p-6 min-h-screen">
        {/* BREADCRUMBS */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">My Orders</span>
        </nav>

        {/* TITLE & FILTER BUTTONS */}
        <div className="w-full flex flex-col items-center text-center">
          <h1
            className="text-2xl sm:text-3xl font-semibold mt-4 
"
          >
            My Orders
          </h1>
          <div className="w-full flex flex-col items-center justify-center my-1">
            <span>Enter your phone number to get your orders</span>
            <div className="mt-5 flex items-center">
              <Input
                className="w-fit"
                placeholder="Enter Phone No."
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button
                onClick={() => mutation.mutate()}
                disabled={phone.length === 0 || mutation.isPending}
                className="ml-2"
              >
                {mutation.isPending ? "Loading..." : "Get Orders"}
              </Button>
            </div>
          </div>
          {/* {mutation.data?.data?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 py-6">
              <button className="py-1 px-4 border rounded-full border-primary text-primary">
                All
              </button>
              <button className="py-1 px-4 border rounded-full">
                In Progress
              </button>
              <button className="py-1 px-4 border rounded-full">
                Delivered
              </button>
              <button className="py-1 px-4 border rounded-full">
                Cancelled
              </button>
            </div>
          )} */}
        </div>

        {/* ORDERS */}
        <div className="flex flex-col items-center gap-4 mt-8">
          {mutation.data?.data?.length > 0 && (
            <div className=" sm:w-4/5 lg:w-1/2 px-1">
              Showing{" "}
              <span className="font-bold">{mutation.data?.data?.length}</span>{" "}
              results
            </div>
          )}

          {mutation.data?.data?.length > 0 &&
            mutation.data?.data
              ?.sort((a, b) => new Date(b?.OrderDate) - new Date(a?.OrderDate))
              ?.map((order: any, index: number) => (
                <div
                  key={index}
                  className="rounded-3xl p-4 w-full sm:w-4/5 lg:w-1/2 ring-1 ring-zinc-200 shadow-md hover:ring-zinc-300 transition-all hover:shadow-lg"
                >
                  {/* STATUS & DATE */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <p className="text-muted-foreground py-1 font-medium bg-muted px-2 rounded-full flex items-center">
                      <span className="h-2 w-2 mr-1 rounded-full bg-muted-foreground shadow  shadow-muted-foreground" />
                      {order?.DeliveryStatus}
                    </p>
                    <span className="hidden sm:block">|</span>
                    <p className="text-muted-foreground ">
                      {order?.OrderDate?.split("T")[0]}
                      {" | "}
                      {order?.OrderDate?.split("T")[1]?.split(".")[0]}
                    </p>
                  </div>

                  {/* IMAGE & DETAILS */}
                  <div className="pt-5 flex flex-col sm:flex-row items-start gap-4">
                    <div className="rounded-xl overflow-hidden w-24 sm:w-25">
                      <img
                        src={`https://new.mazix.co.in/Uploads/${
                          order?.ExtraII?.split("/Uploads")[1]
                        }`}
                        alt={order?.ExtraI}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <h2 className="text-foreground font-semibold text-base sm:text-lg">
                          {order?.ExtraI}
                        </h2>
                        <div className="flex items-center gap-4">
                          <p className="text-muted-foreground font-semibold text-lg sm:text-xl flex items-center ">
                            <LucideIndianRupee size={16} />
                            {order?.SaleRate}
                          </p>
                          <span className="text-sm text-zinc-600">
                            QTY : {order?.Qty}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm mt-3">
                        <span className="font-bold">Order ID</span>:{" "}
                        {order?.OrderID}
                      </p>
                    </div>
                    <div className="lg:ml-10 ">
                      {order?.TrackingID && (
                        <p className="text-sm ">
                          <span className="font-bold">Tracker ID</span>:{" "}
                          {order?.TrackingID}
                        </p>
                      )}
                      {order?.DeliveryPartner && (
                        <p className="text-sm mt-3">
                          <span className="font-bold">Delivery partner</span>:{" "}
                          {order?.DeliveryPartner}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          {mutation.data?.status === "NotFound" && (
            <div className="flex flex-col items-center gap-2 py-8">
              <ShoppingBag size={40} className="text-muted" />
              <h2 className="text-foreground font-semibold text-base sm:text-lg">
                No orders found.
              </h2>
              <Link to={"/products"}>
                <Button>Browse Products</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default MyOrdersPage;
