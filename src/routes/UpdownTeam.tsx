import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/Loader";
import { ArrowBigDown } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";

const UpdownTeam = () => {
  const memberID = sessionStorage.getItem("memberID");
  const { data, isLoading } = useQuery({
    queryKey: ["updown"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/team/updown`, {
        params: {
          member: memberID,
        },
      });
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-4">
      <PageHeader 
      title="Updown Team"
      subtitle="View your updown team members"
      />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Sponsor ID</TableHead>
              <TableHead>Placement ID</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((member: any) => (
              <TableRow key={member.MemberID}>
                <TableCell className="font-medium">{member.MemberID}</TableCell>
                <TableCell>{member.Member}</TableCell>
                <TableCell>{member.SponserID}</TableCell>
                <TableCell>{member.PlacementID}</TableCell>
                <TableCell>{member.Leaf}</TableCell>
                <TableCell>{member.DOJ?.split("T")[0] || "-"}</TableCell>
                <TableCell>
                  <ArrowBigDown size={18} className="text-primary" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UpdownTeam;
