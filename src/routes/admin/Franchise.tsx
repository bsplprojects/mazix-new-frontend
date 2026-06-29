import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as joiningApi from "@/services/joiningApi";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/config/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface Form {
  memberName: string;
  guardianName: string;
  gender: "male" | "female" | "others" | "";
  age: number;
  address: string;
  pincode: number;
  stateId: number | string;
  districtId: number | string;
  contactNo: string;
  altContactNo: string;
  aadharNumber: string;
  panNumber: string;
  email: string;
  password: string;
}

const Franchise = () => {
  const [formdata, setFormdata] = useState<Form>({
    memberName: "",
    guardianName: "",
    gender: "",
    age: 0,
    address: "",
    pincode: 0,
    stateId: 0,
    districtId: 0,
    contactNo: "",
    altContactNo: "",
    aadharNumber: "",
    panNumber: "",
    email: "",
    password: "",
  });

  const { data: states } = useQuery({
    queryKey: ["states"],
    queryFn: joiningApi.getStates,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: districts } = useQuery({
    queryKey: ["districts", formdata.stateId],
    queryFn: () => joiningApi.getCities(formdata.stateId as number),
    enabled: +formdata.stateId > 0,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const numericFields = ["age", "pincode"];

    setFormdata({
      ...formdata,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/admin/franchise/new", formdata);
      return res.data;
    },
    onSuccess: () => {
      setFormdata({
        memberName: "",
        guardianName: "",
        gender: "",
        age: 0,
        address: "",
        pincode: 0,
        stateId: 0,
        districtId: 0,
        contactNo: "",
        altContactNo: "",
        aadharNumber: "",
        panNumber: "",
        email: "",
        password: "",
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error(err.message);
      }
    },
  });

  const handleSubmit = () => {
    if (!formdata.memberName || !formdata.gender || !formdata.password) {
      toast.error("Please fill all required fields");
      return;
    }
    mutation.mutate();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        Add Franchise
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">Enter member details</p>

      <div className="grid grid-cols-3 gap-3 mt-10">
        <div className="space-y-1">
          <Label>
            Member Name <span className="text-red-500">*</span>
          </Label>
          <Input
            name="memberName"
            value={formdata.memberName}
            onChange={handleChange}
            placeholder="Enter member name"
          />
        </div>
        <div className="space-y-1">
          <Label>Guardian Name</Label>
          <Input
            placeholder="Enter guardian name"
            name="guardianName"
            value={formdata.guardianName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1">
          <Label>
            Gender <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formdata.gender}
            onValueChange={(val: "male" | "female" | "others" | "") =>
              setFormdata({ ...formdata, gender: val })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Age</Label>
          <Input
            name="age"
            value={formdata.age === 0 ? "" : formdata.age}
            onChange={handleChange}
            placeholder="age"
            type="number"
            max={100}
            min={0}
          />
        </div>
        <div className="space-y-1">
          <Label>Address</Label>
          <Input
            name="address"
            value={formdata.address}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>
        <div className="space-y-1">
          <Label>Pincode</Label>
          <Input
            name="pincode"
            value={formdata.pincode === 0 ? "" : formdata.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            type="number"
            maxLength={6}
          />
        </div>
        <div className="space-y-1">
          <Label>State</Label>
          <Select
            value={
              formdata.stateId?.toString() === "0"
                ? ""
                : formdata.stateId?.toString()
            }
            onValueChange={(val) =>
              setFormdata({ ...formdata, stateId: Number(val) })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states?.map((s: { id: number; name: string }) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>District</Label>
          <Select
            value={
              formdata.districtId?.toString() === "0"
                ? ""
                : formdata.districtId?.toString()
            }
            onValueChange={(val) =>
              setFormdata({ ...formdata, districtId: Number(val) })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts?.map((s: { id: number; name: string }) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Contact No.</Label>
          <Input
            name="contactNo"
            value={formdata.contactNo}
            onChange={handleChange}
            placeholder="Contact number"
            type="tel"
            maxLength={13}
          />
        </div>
        <div className="space-y-1">
          <Label>Alt Contact No.</Label>
          <Input
            name="altContactNo"
            value={formdata.altContactNo}
            onChange={handleChange}
            placeholder="Alternate contact number"
            type="tel"
          />
        </div>
        <div className="space-y-1">
          <Label>Aadhar Number</Label>
          <Input
            name="aadharNumber"
            value={formdata.aadharNumber}
            onChange={handleChange}
            placeholder="Aadhar number"
            maxLength={12}
          />
        </div>
        <div className="space-y-1">
          <Label>PAN</Label>
          <Input
            name="panNumber"
            value={formdata.panNumber}
            onChange={handleChange}
            placeholder="PAN"
            maxLength={10}
          />
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            name="email"
            value={formdata.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
          />
        </div>
        <div className="space-y-1">
          <Label>
            Password <span className="text-red-500">*</span>{" "}
          </Label>
          <Input
            name="password"
            value={formdata.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
          />
        </div>
      </div>
      <Button
        disabled={
          mutation.isPending || !formdata.memberName || !formdata.gender
        }
        onClick={handleSubmit}
        className="mt-8"
      >
        {mutation.isPending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

export default Franchise;
