import { teamApi } from "@/services/teamApi";
import { useQuery } from "@tanstack/react-query";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2, User, UserRound, UserStar } from "lucide-react";
import { useMemo } from "react";
import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

dagreGraph.setGraph({
  rankdir: "TB",
  nodesep: 120,
  ranksep: 180,
});

const nodeStyle = {
  background: "transparent",
  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",

  color: "#F4D06F",

  border: "1px solid rgba(244,208,111,0.22)",
  borderTop: "2px solid rgba(244,208,111,0.75)",

  borderRadius: "20px",

  minWidth: "250px",
  padding: "14px 18px",

  fontSize: "18px",
  fontWeight: "600",
  letterSpacing: "0.3px",

  textAlign: "center",

  boxShadow: `
    0 12px 30px rgba(0,0,0,0.45),
    0 4px 12px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.05),
    inset 0 0 20px rgba(244,208,111,0.04)
  `,

  backdropFilter: "blur(10px)",

  transition: "all 0.25s ease",

  cursor: "pointer",
};

const Tree = () => {
  const userId = sessionStorage.getItem("memberID") || "";

  const { data: left = [], isLoading } = useQuery({
    queryKey: ["team-left", userId],
    queryFn: () => teamApi.left(userId),
    enabled: !!userId,
  });

  const { data: right = [] } = useQuery({
    queryKey: ["team-right", userId],
    queryFn: () => teamApi.right(userId),
    enabled: !!userId,
  });

  const members = useMemo(() => {
    const merged = [...left, ...right];

    return Array.from(new Map(merged.map((m) => [m.id, m])).values());
  }, [left, right]);

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

    const rootChildren = {
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

    const rawNodes: any[] = [
      {
        id: userId,
        data: {
          label: (
            <div className="flex items-center flex-col gap-3 p-2">
              <p className="p-3 rounded-full bg-white/50 border border-white/10 inset-shadow-[0px_0px_12px_rgba(0,0,0,0.4)] shadow-sm shadow-black">
                <UserStar className="h-14 w-14 text-black" />
              </p>
              {`${userId}`}
            </div>
          ),
        },
        style: {
          ...nodeStyle,
          background:
            "linear-gradient(180deg, #FFE08A 0%, #FFBF00 55%, #D99A00 100%)",
          color: "#000",
          border: "2px solid #FFF3C2",
          borderRadius: "22px",
          boxShadow: `
          0 20px 50px rgba(255,191,0,0.45),
          0 8px 20px rgba(0,0,0,0.3),
          inset 0 2px 0 rgba(255,255,255,0.8)
        `,
          fontWeight: "800",
          letterSpacing: "0.5px",
          fontSize: "22px",
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
            <div className="flex items-center flex-col gap-3 p-2">
              <p className="p-3 rounded-full bg-white/10 border border-white/10 inset-shadow-[0px_0px_12px_rgba(0,0,0,0.9)] shadow-md shadow-black">
                <UserRound className="h-14 w-14 text-white" />
              </p>
              {`${member.name}\n${member.id}`}
            </div>
          ),
        },
        style: nodeStyle,
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
  }, [members, userId]);

  return (
    <main
      style={{
        height: "100%",
        width: "100%",
        background: "transparent",
      }}
    >
      {isLoading ? (
        <div className="flex items-start mt-36 justify-center h-full">
          <div className="text-white flex items-center flex-col gap-2">
            <Loader2 className="animate-spin w-14 h-14 " />
            Please wait while we're generating your tree. This may take a
            moment.
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
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
    </main>
  );
};

export default Tree;
