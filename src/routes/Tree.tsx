import { teamApi } from "@/services/teamApi";
import { useQuery } from "@tanstack/react-query";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const nodeStyle = {
  background: `
    linear-gradient(
      180deg,
      rgba(28,28,28,0.98) 0%,
      rgba(16,16,16,0.98) 100%
    )
  `,

  color: "#F4D06F",

  border: "1px solid rgba(244,208,111,0.22)",
  borderTop: "2px solid rgba(244,208,111,0.75)",

  borderRadius: "18px",

  minWidth: "200px",
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

    const nodes = [
      {
        id: userId,
        position: { x: 0, y: 0 },
        data: {
          label: `${userId}`,
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
          transform: "scale(1.1)",
        },
      },
    ];

    const layout = (nodeId: string, x: number, y: number, gap: number) => {
      const member = nodeMap.get(nodeId);

      if (!member) return;

      nodes.push({
        id: member.id,
        position: { x, y },
        data: {
          label: `${member.name} ${member.id}`,
        },
        style: nodeStyle,
      });

      const children = childrenMap.get(nodeId);

      if (!children) return;
      const MIN_GAP = 250;
      if (children.left) {
        layout(children.left, x - gap, y + 250, Math.max(gap / 2, MIN_GAP));
      }

      if (children.right) {
        layout(children.right, x + gap, y + 250, Math.max(gap / 2, MIN_GAP));
      }
    };

    if (rootChildren.left) {
      layout(rootChildren.left, -800, 180, 1000);
    }

    if (rootChildren.right) {
      layout(rootChildren.right, 800, 180, 1000);
    }

    const edges = [];

    if (rootChildren.left) {
      edges.push({
        id: `e-root-left`,
        source: userId,
        target: rootChildren.left,
        type: "smoothstep",
        animated: true,
      });
    }

    if (rootChildren.right) {
      edges.push({
        id: `e-root-right`,
        source: userId,
        target: rootChildren.right,
        type: "smoothstep",
        animated: true,
      });
    }

    members.forEach((member) => {
      if (member.placementId && nodeMap.has(member.placementId)) {
        edges.push({
          id: `e-${member.placementId}-${member.id}`,
          source: member.placementId,
          target: member.id,
          type: "smoothstep",
          animated: true,
        });
      }
    });

    return { nodes, edges };
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
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls className="text-black" />
        </ReactFlow>
      )}
    </main>
  );
};

export default Tree;
