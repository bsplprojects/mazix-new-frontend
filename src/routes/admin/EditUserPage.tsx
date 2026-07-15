import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/config/axios";

interface User {
  MemberName: string;
  GuardianName: string;
  Gender: string;
  Age: string;
  Address: string;
  Pincode: string;
  District: string;
  State: string;
  Country: string;
  MobileNo: string;
  AltMobileNo: string;
  AadharNo: string;
  PAN: string;
  EmailID: string;

  NomineeName: string;
  NomineeAge: string;
  NomineeGender: string;
  Relation: string;

  AccountName: string;
  AccountNo: string;
  AccountType: string;
  BankName: string;
  IFSC: string;
  Branch: string;

  OTP: string;
}

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User>({
    MemberName: "",
    GuardianName: "",
    Gender: "Male",
    Age: "",
    Address: "",
    Pincode: "",
    District: "",
    State: "",
    Country: "",
    MobileNo: "",
    AltMobileNo: "",
    AadharNo: "",
    PAN: "",
    EmailID: "",

    NomineeName: "",
    NomineeAge: "",
    NomineeGender: "Male",
    Relation: "",

    AccountName: "",
    AccountNo: "",
    AccountType: "Saving",
    BankName: "",
    IFSC: "",
    Branch: "",

    OTP: "",
  });

  const loadUser = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/member/${id}`);

      if (data.success) setUser(data?.data);
    } catch {
      toast.error("User load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const updateUser = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.patch(`/member/${id}`, user);
      if (res.data?.success) {
        toast.success("Member Updated Successfully");
        navigate(-1);
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string | number) => {
    setUser((prev: User) => ({ ...prev, [key]: value }));
  };

  const sendOTP = () => {
    axiosInstance
      .get(`/admin/member/otp`)
      .then(() => {
        toast.success("OTP sent");
      })
      .catch(() => {
        toast.error("OTP send failed");
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-28 space-y-8 text-white">
      {/* HEADER */}
      <Header navigate={navigate} />

      {/* MEMBER */}
      <Section title="Member Information">
        <Grid>
          <Field label="Member Name">
            <AdminInput
              value={user?.MemberName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("MemberName", e.target.value)
              }
            />
          </Field>

          <Field label="Guardian Name">
            <AdminInput
              value={user?.GuardianName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("GuardianName", e.target.value)
              }
            />
          </Field>

          <Field label="Gender">
            <AdminSelect
              value={user?.Gender}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("Gender", e.target.value)
              }
              options={["Male", "Female", "Transgender"]}
            />
          </Field>

          <Field label="Age">
            <AdminInput
              value={user?.Age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("Age", e.target.value)
              }
            />
          </Field>

          <Field label="Mobile">
            <AdminInput
              value={user?.MobileNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("MobileNo", e.target.value)
              }
            />
          </Field>

          <Field label="Email">
            <AdminInput
              value={user?.EmailID}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("EmailID", e.target.value)
              }
            />
          </Field>
        </Grid>
      </Section>

      {/* NOMINEE */}
      <Section title="Nominee Details">
        <Grid>
          <Field label="Nominee Name">
            <AdminInput
              value={user?.NomineeName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("NomineeName", e.target.value)
              }
            />
          </Field>

          <Field label="Relation">
            <AdminSelect
              value={user?.Relation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("Relation", e.target.value)
              }
              options={[
                "",
                "WIFE",
                "SON",
                "DAUGHTER",
                "MOTHER",
                "FATHER",
                "OTHER",
              ]}
            />
          </Field>
        </Grid>
      </Section>

      {/* BANK */}
      <Section title="Bank Information">
        <Grid>
          <Field label="Account Name">
            <AdminInput
              value={user?.AccountName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("AccountName", e.target.value)
              }
            />
          </Field>

          <Field label="Account Number">
            <AdminInput
              value={user?.AccountNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("AccountNo", e.target.value)
              }
            />
          </Field>

          <Field label="Account Type">
            <AdminSelect
              value={user?.AccountType}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("AccountType", e.target.value)
              }
              options={["Saving", "Current", "OD"]}
            />
          </Field>

          <Field label="IFSC">
            <AdminInput
              value={user?.IFSC}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("IFSC", e.target.value)
              }
            />
          </Field>
        </Grid>
      </Section>

      {/* OTP */}
      <Section title="Email Verification">
        <div className="flex flex-wrap gap-3">
          <AdminInput value={user?.EmailID} readOnly />

          <Button onClick={sendOTP}>Send OTP</Button>

          <AdminInput
            placeholder="Enter OTP"
            value={user?.OTP}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("OTP", e.target.value)
            }
          />
        </div>
      </Section>

      {/* SAVE */}
      <StickySave loading={loading} updateUser={updateUser} />
    </div>
  );
}

const Header = ({ navigate }: { navigate: NavigateFunction }) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold">Edit Member</h1>
      <p className="text-zinc-400 text-sm">Update member information</p>
    </div>

    <Button variant="outline" onClick={() => navigate(-1)}>
      Back
    </Button>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className=" border border-white/10 rounded-2xl p-6 space-y-5">
    <h2 className="text-xl font-bold ">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid md:grid-cols-4 gap-5">{children}</div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label className="text-sm text-zinc-400">{label}</label>
    {children}
  </div>
);

const AdminInput = ({ ...props }: any) => <Input {...props} className="" />;

const AdminSelect = ({ options, ...props }: any) => (
  <select
    {...props}
    className=" h-8 w-full rounded-lg border border-white/10 
    "
  >
    {options.map((o: string) => (
      <option key={o} className="text-black">
        {o}
      </option>
    ))}
  </select>
);

const StickySave = ({
  loading,
  updateUser,
}: {
  loading: boolean;
  updateUser: () => void;
}) => (
  <div className="fixed bottom-0 left-0 w-full bg-[#0b0f19]/90 backdrop-blur border-t border-white/10 p-4 flex justify-center">
    <Button
      size="lg"
      onClick={updateUser}
      disabled={loading}
      className="px-14 text-lg"
    >
      {loading ? <Loader2 className="animate-spin mr-2" /> : "Update Member"}
    </Button>
  </div>
);
