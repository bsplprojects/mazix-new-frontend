import { useQuery } from "@tanstack/react-query";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import dagre from "dagre";
import { axiosInstance } from "@/config/axios";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

dagreGraph.setGraph({
  rankdir: "TB",
  nodesep: 120,
  ranksep: 180,
});

const nodeStyle: React.CSSProperties = {
  background: "var(--color-card)",
  color: "var(--color-foreground)",

  border: "1px solid var(--color-border)",
  borderRadius: "14px",

  minWidth: "250px",
  padding: "14px 18px",

  fontSize: "17px",
  fontWeight: 600,

  boxShadow: "var(--shadow-card)",

  transition: ".2s ease",
  cursor: "pointer",
};

interface Members {
  active: boolean;
  bv: number;
  id: string;
  joinDate: string;
  leg: string;
  name: string;
  placementId: string;
  repurchaseBV: number;
}

const Tree = () => {
  const userId = sessionStorage.getItem("memberID") || "";

  const [memberId, setMemberId] = useState(userId);
  const [allMembers, setAllMembers] = useState<Members[]>([]);
  const [leftCursor, setLeftCursor] = useState<string | null>(null);
  const [rightCursor, setRightCursor] = useState<string | null>(null);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const fetchMembers = async (
    leg: "left" | "right",
    cursor: string | null = null,
  ) => {
    const res = await axiosInstance.post(`/team/${leg}/${memberId}`, {
      search: "",
      queue: cursor,
      limit: 10,
    });
    return res.data;
  };

  const { isLoading } = useQuery({
    queryKey: ["left-team", userId, memberId],
    queryFn: async () => {
      const res = await axiosInstance.post(`/team/left/${memberId}`, {
        search: "",
        queue: null,
        limit: 10,
      });
      const members = res.data?.members;
      setLeftCursor(res.data?.nextCursor);
      setAllMembers((prev) => [...prev, ...members]);
      return res.data?.members;
    },
  });

  const { isLoading: isRightLoading } = useQuery({
    queryKey: ["right-team", userId, memberId],
    queryFn: async () => {
      const res = await axiosInstance.post(`/team/right/${memberId}`, {
        search: "",
        queue: null,
        limit: 10,
      });
      const members = res.data?.members;
      setRightCursor(res.data?.nextCursor);
      setAllMembers((prev) => [...prev, ...members]);
      return res.data?.members;
    },
  });

  const loadNext = async () => {
    try {
      setIsGeneratingNext(true);
      const [leftRes, rightRes] = await Promise.all([
        leftCursor ? fetchMembers("left", leftCursor) : Promise.resolve(null),
        rightCursor
          ? fetchMembers("right", rightCursor)
          : Promise.resolve(null),
      ]);

      if (leftRes) {
        setLeftCursor(leftRes.nextCursor);
      }
      if (rightRes) {
        setRightCursor(rightRes.nextCursor);
      }
      setAllMembers((prev) => [
        ...prev,
        ...(leftRes?.members ?? []),
        ...(rightRes?.members ?? []),
      ]);
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const loadAll = async () => {
    try {
      setIsGeneratingAll(true);
      let currentLeft = leftCursor;
      let currentRight = rightCursor;

      while (currentLeft || currentRight) {
        const [leftRes, rightRes] = await Promise.all([
          currentLeft
            ? fetchMembers("left", currentLeft)
            : Promise.resolve(null),
          currentRight
            ? fetchMembers("right", currentRight)
            : Promise.resolve(null),
        ]);

        if (leftRes) {
          setAllMembers((prev) => [...prev, ...leftRes.members]);
          currentLeft = leftRes.nextCursor;
        }

        if (rightRes) {
          setAllMembers((prev) => [...prev, ...rightRes.members]);
          currentRight = rightRes.nextCursor;
        }
      }

      setLeftCursor(currentLeft);
      setRightCursor(currentRight);
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const members = useMemo(() => {
    const merged = allMembers;

    return Array.from(new Map(merged.map((m) => [m.id, m])).values());
  }, [allMembers]);

  const handleMemberClick = (id: string) => {
    if (id === userId) {
      setAllMembers([]);
    }
    setMemberId(id);
  };

  const { nodes, edges } = useMemo(() => {
    if (!members.length) {
      return {
        nodes: [],
        edges: [],
      };
    }

    const nodeMap = new Map();
    const childrenMap = new Map();

    members.forEach((member) => {
      nodeMap.set(member.id, member);
    });

    members.forEach((member) => {
      if (!member.placementId) return;

      if (!childrenMap.has(member.placementId)) {
        childrenMap.set(member.placementId, {
          left: null,
          right: null,
        });
      }

      const parent = childrenMap.get(member.placementId);

      if (member.leg?.toLowerCase() === "left") {
        parent.left = member.id;
      } else {
        parent.right = member.id;
      }
    });

    const rootChildren: { left: string | null; right: string | null } = {
      left: null,
      right: null,
    };

    members.forEach((member) => {
      if (member.placementId === userId) {
        if (member.leg?.toLowerCase() === "left") {
          rootChildren.left = member.id;
        } else {
          rootChildren.right = member.id;
        }
      }
    });

    // ROOT NODE
    const rawNodes: any[] = [
      {
        id: userId,
        data: {
          label: (
            <div
              onClick={() => handleMemberClick(userId)}
              className="flex items-center flex-col gap-3 p-2"
            >
              {`${userId} (You)`}
            </div>
          ),
        },
        style: {
          ...nodeStyle,

          background:
            "linear-gradient(135deg, #f8d56b 0%, #d4a017 50%, #9c6b00 100%)",

          color: "#1a1a1a",

          border: "1px solid rgba(255,255,255,0.35)",

          borderRadius: "18px",

          boxShadow: `
    0 10px 30px rgba(212,160,23,.35),
    inset 0 1px 0 rgba(255,255,255,.45)
  `,

          fontWeight: 800,
          letterSpacing: "0.4px",
          fontSize: "24px",
        },
        position: { x: 0, y: 0 },
      },
    ];

    const rawEdges: any[] = [];

    members.forEach((member) => {
      rawNodes.push({
        id: member.id,
        data: {
          label: (
            <>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <div
                    onClick={() => handleMemberClick(member.id)}
                    className="flex items-center flex-col gap-3 p-2"
                  >
                    <span className="font-bold text-xl">{member.name}</span>
                    <span
                      className={` ${memberId === member.id ? "text-white" : "text-primary"} font-medium`}
                    >
                      {member.id}
                    </span>
                  </div>
                </HoverCardTrigger>

                <HoverCardContent className="w-32 text-xs flex flex-col gap-1">
                  <p>Joining BV = {member.bv}</p>
                  <p>Repurchase BV = {member.repurchaseBV}</p>
                </HoverCardContent>
              </HoverCard>
            </>
          ),
        },
        // I want the node which is selected to get highlighted
        style: {
          ...nodeStyle,

          background:
            memberId === member.id
              ? "var(--color-primary)"
              : "var(--color-card)",

          color:
            memberId === member.id
              ? "var(--color-primary-foreground)"
              : "var(--color-foreground)",

          border:
            memberId === member.id
              ? "2px solid var(--color-primary)"
              : "1px solid var(--color-border)",

          boxShadow:
            memberId === member.id
              ? "var(--shadow-glow)"
              : "var(--shadow-card)",
        },
        position: { x: 0, y: 0 },
      });
    });

    if (rootChildren.left) {
      rawEdges.push({
        id: `e-root-left`,
        source: userId,
        target: rootChildren.left,
        type: "smoothstep",
        animated: true,
      });
    }

    if (rootChildren.right) {
      rawEdges.push({
        id: `e-root-right`,
        source: userId,
        target: rootChildren.right,
        type: "smoothstep",
        animated: true,
      });
    }

    members.forEach((member) => {
      if (member.placementId && nodeMap.has(member.placementId)) {
        rawEdges.push({
          id: `e-${member.placementId}-${member.id}`,
          source: member.placementId,
          target: member.id,
          type: "smoothstep",
          animated: true,
        });
      }
    });

    const dagreGraph = new dagre.graphlib.Graph();

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
      rankdir: "TB", // Top -> Bottom
      ranksep: 180, // Vertical gap
      nodesep: 120, // Horizontal gap
    });

    rawNodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: node.id === userId ? 260 : 220,
        height: node.id === userId ? 110 : 90,
      });
    });

    rawEdges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = rawNodes.map((node) => {
      const position = dagreGraph.node(node.id);

      const width = node.id === userId ? 260 : 220;
      const height = node.id === userId ? 110 : 90;

      return {
        ...node,
        position: {
          x: position.x - width / 2,
          y: position.y - height / 2,
        },
        sourcePosition: "bottom",
        targetPosition: "top",
      };
    });

    return {
      nodes: layoutedNodes,
      edges: rawEdges,
    };
  }, [members, userId, memberId]);

  return (
    <main
      style={{
        height: "100%",
        width: "100%",
        background: "transparent",
        display: "relative",
      }}
    >
      {isLoading || isRightLoading ? (
        <div className="flex items-start mt-36 justify-center h-full">
          <div className="text-accent-foreground flex items-center flex-col gap-2">
            <Loader2 className="animate-spin w-14 h-14 " />
            Please wait while we're generating your tree. This may take a
            moment.
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          proOptions={{ hideAttribution: true }}
          fitView
          fitViewOptions={{
            padding: 0.3,
          }}
          minZoom={0.2}
          maxZoom={2}
        >
          <Background />
          <Controls className="text-black" />
        </ReactFlow>
      )}
      <div className="absolute bottom-16 md:left-1/2 left-1/4 md:translate-x-1/8 flex gap-2">
        <Button
          onClick={loadNext}
          variant={"outline"}
          disabled={isGeneratingNext}
        >
          {isGeneratingNext ? (
            <>
              <Loader2 className="animate-spin" /> Generating...
            </>
          ) : (
            "Generate Next 10"
          )}
        </Button>

        <Button onClick={loadAll} disabled={isGeneratingAll}>
          {isGeneratingAll ? (
            <>
              <Loader2 className="animate-spin" /> Generating...
            </>
          ) : (
            "Generate All"
          )}
        </Button>
      </div>
    </main>
  );
};

export default Tree;
