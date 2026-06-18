import Loader from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserPlus, Network } from "lucide-react";

const cards = [
  {
    title: "Position 1",
    value: "0",
    icon: Users,
  },
  {
    title: "Position 2",
    value: "0",
    icon: UserCheck,
  },
  {
    title: "Position 1 (Repurchase BV)",
    value: "0",
    icon: UserPlus,
  },
  {
    title: "Position 2 (Repurchase BV)",
    value: "0",
    icon: Network,
  },
];

const TeamDashboard = () => {
  const memberID = sessionStorage.getItem("memberID");

  const { data, isLoading } = useQuery({
    queryKey: ["team-dashboard"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/downline/${memberID}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="grid grid-cols-4 gap-2">
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Position 1</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">{data?.Pos1}</div>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Position 2</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">{data?.Pos2}</div>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Position 1 (Repurchase BV)
          </CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">{0}</div>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Position 2 (Repurchase BV)
          </CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">{0}</div>
        </CardContent>
      </Card>
    </main>
  );
};

export default TeamDashboard;
