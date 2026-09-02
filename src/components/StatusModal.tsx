import { CheckCircle2, CircleX, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ModalType = {
  type: string;
  message: string;
};

interface Props {
  modal: ModalType;
  setModal: (modal: ModalType) => void;
}

export default function StatusModal({ modal, setModal }: Props) {
  const isOpen = !!modal.type;

  if (!isOpen) return null;

  const isSuccess = modal.type === "success";
  const isInfo = modal.type === "info";

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
            className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
              isSuccess
                ? "bg-emerald-500/10 text-emerald-500"
                : isInfo
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-red-500/10 text-red-500"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-12 w-12" />
            ) : isInfo ? (
              <TriangleAlert className="h-12 w-12" />
            ) : (
              <CircleX className="h-12 w-12" />
            )}
          </div>

          <h2 className="text-2xl font-bold">
            {isSuccess ? "Success!" : isInfo ? "Warning!" : "Oops!"}
          </h2>

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
