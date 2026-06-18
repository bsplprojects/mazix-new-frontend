import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { binaryTree, type TreeNode } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function NodeCard({ node, root }: { node?: TreeNode; root?: boolean }) {
  if (!node) return <div className="h-[110px] w-[180px]" />;
  const empty = node.bv === 0;
  return (
    <div
      className={cn(
        "relative rounded-xl px-4 py-3 w-[180px] text-center transition-smooth",
        root &&
          "bg-gradient-emerald text-primary-foreground shadow-glow border border-primary/40",
        !root &&
          !empty &&
          "bg-gradient-card border border-border/60 shadow-card hover:border-primary/50",
        empty &&
          "border border-dashed border-border bg-card/30 text-muted-foreground",
      )}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <div
          className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold",
            root
              ? "bg-primary-foreground/20 text-primary-foreground"
              : empty
                ? "bg-muted text-muted-foreground"
                : "bg-gradient-emerald text-primary-foreground",
          )}
        >
          {empty
            ? "+"
            : node.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
        </div>
        {!empty && (
          <span
            className={cn(
              "text-[9px] uppercase tracking-wider",
              root ? "text-primary-foreground/80" : "text-brass",
            )}
          >
            {node.rank}
          </span>
        )}
      </div>
      <div className="text-xs font-medium truncate">{node.name}</div>
      <div
        className={cn(
          "text-[10px] font-mono mt-0.5",
          root ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {node.id}
      </div>
      {!empty && (
        <div
          className={cn(
            "text-[11px] mt-1 font-mono",
            root ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {node.bv.toLocaleString("en-IN")} BV
        </div>
      )}
      {!root && !empty && (
        <span
          className={cn(
            "absolute top-2 right-2 h-1.5 w-1.5 rounded-full",
            node.active ? "bg-primary" : "bg-muted-foreground/40",
          )}
        />
      )}
    </div>
  );
}

function TreeBranch({
  node,
  level = 0,
  root = false,
}: {
  node: TreeNode;
  level?: number;
  root?: boolean;
}) {
  const hasChildren = !!(node.left || node.right);
  return (
    <div className="flex flex-col items-center">
      <NodeCard node={node} root={root} />
      {hasChildren && level < 3 && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-stretch">
            <div className="flex-1 flex justify-end pr-4 relative">
              <div className="absolute top-0 right-0 left-1/2 h-px bg-border" />
              <div className="absolute top-0 right-0 w-px h-6 bg-border" />
              {node.left && (
                <div className="pt-6">
                  <TreeBranch node={node.left} level={level + 1} />
                </div>
              )}
            </div>
            <div className="flex-1 flex justify-start pl-4 relative">
              <div className="absolute top-0 left-0 right-1/2 h-px bg-border" />
              <div className="absolute top-0 left-0 w-px h-6 bg-border" />
              {node.right && (
                <div className="pt-6">
                  <TreeBranch node={node.right} level={level + 1} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function BinaryTreePage() {
  const [zoom, setZoom] = useState(0.85);
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Binary Genealogy"
        subtitle="Live view of your left and right legs · click any node to drill down"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(0.85)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Total Downline", value: "1,284", sub: "All levels" },
          { label: "Active Members", value: "1,142", sub: "89% activity rate" },
          { label: "BV Difference", value: "84,800", sub: "Left leg leading" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-gradient-card border border-border/60 p-5"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
            <div className="font-display text-2xl mt-1">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <TreeViewport zoom={zoom} />
    </div>
  );
}

function TreeViewport({ zoom }: { zoom: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const TREE_WIDTH = 1100;
  const [autoScale, setAutoScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth - 24;
      setAutoScale(Math.min(1, w / TREE_WIDTH));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setInnerHeight(el.offsetHeight));
    ro.observe(el);
    setInnerHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const finalScale = autoScale * zoom;

  return (
    <div
      ref={containerRef}
      className="rounded-2xl bg-gradient-card border border-border/60 shadow-card p-3 md:p-6 overflow-x-auto"
    >
      <div
        style={{
          width: TREE_WIDTH * finalScale,
          minWidth: "100%",
          height: innerHeight * finalScale,
          position: "relative",
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: TREE_WIDTH,
            transform: `scale(${finalScale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <TreeBranch node={binaryTree} root />
        </div>
      </div>
    </div>
  );
}
