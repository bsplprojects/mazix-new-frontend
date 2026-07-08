import { PageHeader, StatCard } from "@/components/dashboard-ui";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { axiosInstance } from "@/config/axios";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Coins } from "lucide-react";
import { useState } from "react";

const TeamBV = () => {
  const [option, setOption] = useState("");
  const { memberId } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["team-bv", option],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/team/bv?org=${option === "org1" ? "Left" : "Right"}&memberId=${memberId}`,
      );
      return res.data;
    },
    enabled: !!option,
  });

  console.log(data);

  return (
    <main className="max-w-350 mx-auto space-y-8">
      <PageHeader
        title="Team Business Volume"
        subtitle="Overview of your ORG 1 and ORG 2 Business Volume"
      />

      <RadioGroup className="max-w-sm" value={option} onValueChange={setOption}>
        <FieldLabel htmlFor="org1">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>ORG 1</FieldTitle>
              <FieldDescription>For Organization One</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="org1" id="org1" />
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="org2">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>ORG 2</FieldTitle>
              <FieldDescription>For Organization Two</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="org2" id="org2" />
          </Field>
        </FieldLabel>
      </RadioGroup>

      {false && (
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            label="Joining BV"
            value={"0"}
            tone="emerald"
            icon={<Coins className="h-4 w-4" />}
          />
          <StatCard
            label="Repurchase BV"
            value={0}
            tone="brass"
            icon={<Coins className="h-4 w-4" />}
          />
        </div>
      )}
    </main>
  );
};

export default TeamBV;
