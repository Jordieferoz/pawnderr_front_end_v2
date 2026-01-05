import { CheckCircle2, Info, XCircle } from "lucide-react";
import { toast } from "sonner";

export interface IToastMessage {
  type: "success" | "error" | "info";
  message: string;
  desc?: string;
}

export const showToast = ({ type, message, desc }: IToastMessage) => {
  toast.custom((id) => (
    <div
      onClick={() => toast.dismiss(id)}
      className={`
        relative flex min-w-[280px] cursor-pointer items-start gap-3 rounded-xl p-[15px] backdrop-blur-[12px] transition-all duration-300 hover:scale-[1.02] border-none hover:brightness-110 ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
              ? "bg-red-500"
              : "border-[rgba(75,168,255,0.4)] bg-[rgba(75,168,255,0.08)]"
        }
      `}
    >
      {/* ICON */}
      <div className="mt-0.5 flex-shrink-0">
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-white" />
        ) : type === "error" ? (
          <XCircle className="h-5 w-5 text-white" />
        ) : (
          <Info className="h-5 w-5 text-white" />
        )}
      </div>

      {/* TEXT CONTENT */}
      <div className="flex flex-col">
        <p className="text-[15px] font-medium text-white leading-tight">
          {message}
        </p>
        {desc && <p className="text-[13px] text-black mt-1">{desc}</p>}
      </div>
    </div>
  ));
};
