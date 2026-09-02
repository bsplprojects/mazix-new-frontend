import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/config/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";

type Offer = {
  OfferID: number;
  Title: string;
  Description?: string;
  Link?: string;
  Image?: string;
  StartDate: Date | string;
  EndDate: Date | string;
  Status: boolean;
};

const OffersList = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/offer");
      return res.data.data;
    },
  });

  const { mutate: toggleOffer, isPending } = useMutation({
    mutationFn: async ({
      offerId,
      status,
    }: {
      offerId: number;
      status: boolean;
    }) => {
      const { data } = await axiosInstance.patch("/admin/offer/status", {
        offerId,
        status,
      });

      return data;
    },

    onSuccess: () => {
      toast.success("Offer status updated.");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },

    onError: (err: any) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.msg);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleToggleOffer = (offer: Offer) => {
    toggleOffer({
      offerId: offer.OfferID,
      status: !offer.Status,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          Loading offers...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Offers</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5">
          {data?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No offers available.
            </div>
          )}

          {data?.map((offer: Offer) => (
            <div
              key={offer.OfferID}
              className="border rounded-xl overflow-hidden flex flex-col md:flex-row"
            >
              <img
                src={`https://app.mymazix.com/${offer?.Image?.replace("../../", "")}`}
                className="w-full md:w-72 h-48 object-cover"
              />

              <div className="flex-1 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{offer.Title}</h3>

                    <p className="text-sm text-muted-foreground">
                      {offer.Description}
                    </p>
                  </div>

                  <div className="space-x-1">
                    <Badge variant={offer.Status ? "default" : "secondary"}>
                      {offer.Status ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      size="sm"
                      variant={offer.Status ? "destructive" : "default"}
                      onClick={() => handleToggleOffer(offer)}
                    >
                      {isPending ? (
                        "Updating..."
                      ) : (
                        <>{offer.Status ? "Disable" : "Enable"}</>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <strong>Link:</strong> {offer.Link}
                </div>

                <div className="text-sm text-muted-foreground">
                  {offer.StartDate?.toString()?.slice(0, 10)} →{" "}
                  {offer.EndDate?.toString()?.slice(0, 10)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OffersList;
