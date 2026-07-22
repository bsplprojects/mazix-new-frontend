import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserPlus, Network, Hourglass } from "lucide-react";

const cards = [
  {
    title: "ORG 1",
    value: "0",
    icon: Users,
  },
  {
    title: "ORG 2",
    value: "0",
    icon: UserCheck,
  },
  {
    title: "ORG 1 (Repurchase BV)",
    value: "0",
    icon: UserPlus,
  },
  {
    title: "ORG 2 (Repurchase BV)",
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
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground animate-pulse flex justify-center items-center mt-2 gap-2">
          <Hourglass className="w-4 h-4 animate-spin" /> This might take some
          time. Please have some patience.
        </div>
      </div>
    );
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ORG 1</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">{data?.Pos1 ?? 0}</div>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ORG 2</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">{data?.Pos2 ?? 0}</div>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            ORG 1 (Repurchase BV)
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
            ORG 2 (Repurchase BV)
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
