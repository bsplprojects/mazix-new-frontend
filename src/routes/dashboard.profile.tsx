import { useState } from "react";
import {
  Mail,
  Calendar,
  GitBranch,
  Award,
  User,
  Users,
  Landmark,
  ShieldCheck,
  Upload,
  CheckCircle2,
  FileText,
  Camera,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import Loader from "@/components/Loader";

const tabs = [
  { value: "personal", label: "Personal Info", icon: User },
  { value: "nominee", label: "Nominee Info", icon: Users },
  { value: "bank", label: "Bank Info", icon: Landmark },
  { value: "kyc", label: "KYC", icon: ShieldCheck },
];

export default function Profile() {
  const mid = sessionStorage.getItem("MID");
  const { memberDetail } = useDashboard(mid as string);

  const m = memberDetail?.data;

 
  return (
    <div className="space-y-8 max-w-300 mx-auto">
      <PageHeader
        title="Profile"
        subtitle="Your member identity, nominee, bank and KYC details"
      />

      {/* Identity hero */}
      <div className="rounded-2xl bg-gradient-hero border border-border/60 p-8 shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-emerald opacity-50" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-24 w-24 rounded-2xl bg-gradient-emerald shadow-glow text-primary-foreground flex items-center justify-center font-display text-3xl">
            {m?.MemberName?.charAt(0) ?? "M"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="font-display text-3xl">
                {m?.MemberName ?? "Member"}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brass/10 border border-brass/40 text-brass text-xs">
                <Award className="h-3 w-3" />
              </span>
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              {m?.MemberID ?? ""}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> {m?.EmailID ?? "not available"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> Joined on: {"not available"}
              </span>
              <span className="flex items-center gap-1.5">
                <GitBranch className="h-3 w-3" /> Sponsor: {"not available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="bg-card/40 border border-border/60 p-1 h-auto flex flex-wrap gap-1 w-full justify-start">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-glow gap-2 px-4 py-2"
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfo m={m} />
        </TabsContent>
        <TabsContent value="nominee" className="mt-6">
          <NomineeInfo />
        </TabsContent>
        <TabsContent value="bank" className="mt-6">
          <BankInfo />
        </TabsContent>
        <TabsContent value="kyc" className="mt-6">
          <KycInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 md:p-8 shadow-card">
      <div className="mb-6">
        <h3 className="font-display text-2xl">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function PersonalInfo({ m }: { m: any }) {
  return (
    <SectionCard
      title="Personal Info"
      description="Identity details on file with the company"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Full Name">
          <Input
            defaultValue={m?.MemberName ?? ""}
            className="bg-input border-border"
          />
        </Field>
        <Field label="Member ID">
          <Input
            defaultValue={m?.MemberID ?? ""}
            disabled
            className="bg-input border-border font-mono"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            defaultValue={m?.EmailID ?? ""}
            className="bg-input border-border"
          />
        </Field>
        <Field label="Phone">
          <Input
            defaultValue={m?.ContactNo ?? ""}
            className="bg-input border-border"
          />
        </Field>

        <Field label="Gender">
          <Select defaultValue={m?.Gender}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Address Line 1">
          <Input
            defaultValue={m?.Address ?? ""}
            className="bg-input border-border"
          />
        </Field>

        <Field label="City">
          <Input
            defaultValue={m?.District ?? ""}
            className="bg-input border-border"
          />
        </Field>
        <Field label="State">
          <Input
            defaultValue={m?.StateID ?? ""}
            className="bg-input border-border"
          />
        </Field>
        <Field label="Pincode">
          <Input
            defaultValue={m?.Pincode ?? ""}
            className="bg-input border-border"
          />
        </Field>
        <Field label="Country">
          <Input
            defaultValue={m?.Country ?? ""}
            className="bg-input border-border"
          />
        </Field>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90">
          Save Personal Info
        </Button>
      </div>
    </SectionCard>
  );
}

function NomineeInfo() {
  const mid = sessionStorage.getItem("MID");
  const { data, isLoading } = useQuery({
    queryKey: ["nominee"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/nominee/${mid}`);
      return res.data;
    },
  });

  const n = data?.data[0];

  return (
    <SectionCard
      title="Nominee Info"
      description="Person nominated to receive your benefits"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4 ">
            <Field label="Nominee Full Name">
              <Input
                defaultValue={n?.Nominee}
                className="bg-input border-border"
              />
            </Field>
            <Field label="Nominee Relation">
              <Input
                defaultValue={n?.Relation}
                className="bg-input border-border"
              />
            </Field>
            <Field label="Sex">
              <Select defaultValue={n?.Sex}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="flex justify-end mt-6">
            <Button className="bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90">
              Save Nominee Info
            </Button>
          </div>
        </>
      )}
    </SectionCard>
  );
}

function BankInfo() {
  const mid = sessionStorage.getItem("MID");
  const { data, isLoading } = useQuery({
    queryKey: ["bank"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/bank/${mid}`);
      return res.data;
    },
  });

  const b = data?.data[0];

  return (
    <SectionCard
      title="Bank Info"
      description="Account used for payouts and withdrawals"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Account Holder">
              <Input
                defaultValue={b?.AcName ?? ""}
                className="bg-input border-border"
              />
            </Field>
            <Field label="Bank Name">
              <Input
                defaultValue={b?.Bank ?? ""}
                className="bg-input border-border"
              />
            </Field>
            <Field label="Account Number">
              <Input
                defaultValue={b?.AcNo ?? ""}
                className="bg-input border-border font-mono"
              />
            </Field>

            <Field label="IFSC Code">
              <Input
                defaultValue={b?.IFSC ?? ""}
                className="bg-input border-border font-mono"
              />
            </Field>
            <Field label="Branch">
              <Input
                defaultValue={b?.Branch ?? ""}
                className="bg-input border-border"
              />
            </Field>
            <Field label="Account Type">
              <Select defaultValue={b?.AcType ?? ""}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saving">Saving</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex justify-end mt-6">
            <Button className="bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90">
              Save Bank Info
            </Button>
          </div>
        </>
      )}
    </SectionCard>
  );
}

function KycInfo() {
  const mid = sessionStorage.getItem("MID");
  const { data, isLoading } = useQuery({
    queryKey: ["kyc"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/kyc/${mid}`);
      return res.data?.data;
    },
  });

  const BASE_URL = "https://new.mazix.co.in/";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data && data.length > 0 ? (
        data.map((doc, index: number) => (
          <div
            key={index}
            className="border rounded-xl p-4 bg-white/5 text-white"
          >
            {/* Document Name */}
            <h3 className="font-semibold mb-2">{doc.DocName}</h3>

            {/* Image Preview */}
            {doc.DocPath ? (
              <img
                src={`${BASE_URL}${doc.DocPath.replace("../", "")}`}
                alt={doc.DocName}
                className="w-full h-40 object-cover rounded-lg border"
              />
            ) : (
              <div className="h-40 flex items-center justify-center border rounded-lg">
                No Document
              </div>
            )}

            {/* Status */}
            <p className="mt-2 text-sm">
              Status:{" "}
              <span
                className={
                  doc.Status === "Verify" ? "text-green-400" : "text-yellow-400"
                }
              >
                {doc.Status}
              </span>
            </p>
          </div>
        ))
      ) : (
        // fallback upload UI
        <SectionCard
          title="KYC Verification"
          description="Upload your Aadhaar, PAN and a recent photograph"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <UploadTile
              icon={<FileText className="h-6 w-6" />}
              title="Aadhaar Card"
              hint="PDF, JPG or PNG · max 5 MB"
              status="verified"
            />
            <UploadTile
              icon={<FileText className="h-6 w-6" />}
              title="PAN Card"
              hint="PDF, JPG or PNG · max 5 MB"
              status="verified"
            />
            <UploadTile
              icon={<Camera className="h-6 w-6" />}
              title="Passport Photo"
              hint="JPG or PNG · max 2 MB"
              status="pending"
              accept="image/*"
            />
          </div>

          <div className="mt-6 p-4 rounded-xl bg-card/40 border border-border/60 text-xs text-muted-foreground space-y-1">
            <div className="text-foreground font-medium mb-1">Guidelines</div>
            <p>
              • Documents must be clear, color scans — all four corners visible.
            </p>
            <p>• Name on PAN and Aadhaar must match the personal info above.</p>
            <p>• Photograph: plain background, face centered, no filters.</p>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <Button variant="outline" className="border-border">
              Save Draft
            </Button>
            <Button className="bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90">
              Submit for Verification
            </Button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function UploadTile({
  icon,
  title,
  hint,
  status,
  accept = ".pdf,image/*",
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  status: "verified" | "pending" | "none";
  accept?: string;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputId = `upload-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <label
      htmlFor={inputId}
      className="group relative block rounded-2xl border border-dashed border-border/80 bg-input/30 p-5 cursor-pointer transition-smooth hover:border-primary/60 hover:bg-input/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border",
            status === "verified" &&
              "text-primary border-primary/40 bg-primary/10",
            status === "pending" && "text-brass border-brass/40 bg-brass/10",
            status === "none" && "text-muted-foreground border-border bg-card",
          )}
        >
          {status === "verified"
            ? "Verified"
            : status === "pending"
              ? "Pending"
              : "Not uploaded"}
        </span>
      </div>
      <div className="font-display text-lg">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <Upload className="h-3.5 w-3.5 text-primary" />
        <span className="text-primary">
          {fileName ?? "Click to upload or drag & drop"}
        </span>
      </div>

      <input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  );
}
