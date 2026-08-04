import { useState } from "react";
import { Upload, Link2, CalendarDays, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/config/axios";
import OffersList from "./OffersList";

const Offer = () => {
  const client = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    startDate: "",
    endDate: "",
    status: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const body = new FormData();

      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append("link", formData.link);
      body.append("startDate", formData.startDate);
      body.append("endDate", formData.endDate);
      body.append("status", String(formData.status));

      if (image) {
        body.append("image", image);
      }

      const { data } = await axiosInstance.post("/admin/offer", body);

      return data;
    },

    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["offers"] });
      toast.success(data.message || "Offer added successfully.");
      setFormData({
        title: "",
        description: "",
        link: "",
        startDate: "",
        endDate: "",
        status: true,
      });
      setPreview(null);
      setImage(null);
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Offer Management</CardTitle>
        </CardHeader>

        <CardContent className="grid lg:grid-cols-2 gap-8">
          {/* Form */}

          <div className="space-y-5">
            <div className="space-y-1">
              <Label>Offer Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Big Festival Sale"
              />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-1">
              <Label>Link</Label>

              <p className="text-xs text-muted-foreground mb-2">
                Enter the URL where users should be redirected after clicking
                the offer button (e.g. product page, registration page, or
                payment page).
              </p>

              <div className="relative">
                <Link2 className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

                <Input
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Start Date</Label>

                <div className="relative">
                  <CalendarDays className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>End Date</Label>

                <div className="relative">
                  <CalendarDays className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Offer Status</Label>
                <p className="text-xs text-muted-foreground">
                  Enable or disable this offer.
                </p>
              </div>

              <Switch
                checked={formData.status}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: checked,
                  }))
                }
              />
            </div>

            <Button
              className="w-full"
              disabled={isPending}
              onClick={() => mutate()}
            >
              {isPending ? "Saving..." : "Save Offer"}
            </Button>
          </div>

          {/* Preview */}

          <div className="space-y-4">
            <div className="w-full flex items-center justify-between">
              <Label>Offer Banner</Label>
              {preview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                  }}
                >
                  Remove
                </Button>
              )}
            </div>

            <label
              htmlFor="banner"
              className="border-2 border-dashed rounded-xl h-100 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition"
            >
              {preview ? (
                <img
                  src={preview}
                  alt=""
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <ImageIcon className="w-14 h-14 text-muted-foreground mb-3" />
                  <p className="font-medium">Upload Offer Banner</p>

                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or WEBP
                  </p>

                  <Button type="button" variant="secondary" className="mt-5">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                  </Button>
                </>
              )}
            </label>

            <input
              id="banner"
              hidden
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </div>
        </CardContent>
      </Card>
      <OffersList />
    </div>
  );
};

export default Offer;
