import {
  CheckCircle2,
  CircleX,
  Info,
  Siren,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ModalType = {
  type: string;
  message: string;
};

interface Props {
  modal: ModalType;
  setModal: (modal: ModalType) => void;
}

function getBackgroundColor(type: string) {
  let color = "bg-red-500/10 text-red-500";
  switch (type) {
    case "success":
      color = "bg-emerald-500/10 text-emerald-500";
      break;
    case "info":
      color = "bg-cyan-500/10 text-cyan-500";
      break;
    case "warn":
      color = "bg-amber-500/10 text-amber-500";
      break;
    case "validation":
      color = "bg-orange-500/10 text-orange-500";
      break;
  }
  return color;
}

function getIcon(type: string) {
  const iconSize = "h-12 w-12";
  let icon = <CircleX className={iconSize} />;
  switch (type) {
    case "success":
      icon = <CheckCircle2 className={iconSize} />;
      break;
    case "info":
      icon = <Info className={iconSize} />;
      break;
    case "warn":
      icon = <TriangleAlert className={iconSize} />;
      break;
    case "validation":
      icon = <Siren className={iconSize} />;
      break;
  }
  return icon;
}

function getModalTitle(type: string) {
  let message = "Something went wrong";
  switch (type) {
    case "success":
      message = "Success!";
      break;
    case "info":
      message = "Info!";
      break;
    case "warn":
      message = "Warning!";
      break;
    case "validation":
      message = "Fill the required fields!";
      break;
  }
  return message;
}

export default function StatusModal({ modal, setModal }: Props) {
  const isOpen = !!modal.type;

  if (!isOpen) return null;

  const close = () =>
    setModal({
      type: "",
      message: "",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
        <button
          onClick={close}
          className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${getBackgroundColor(
              modal.type,
            )}`}
          >
            {getIcon(modal.type)}
          </div>

          <h2 className="text-2xl font-bold">{getModalTitle(modal.type)}</h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {modal.message}
          </p>

          <Button onClick={close} className="mt-8 w-full">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
