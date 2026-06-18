import logo from "@/assets/mazix-logo.png";

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="Mazix logo"
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
      />
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">Mazix</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-brass">
          Wealth Network
        </span>
      </div>
    </div>
  );
}
