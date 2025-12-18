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
        relative flex min-w-[280px] cursor-pointer items-start gap-3 rounded-xl
        border p-[15px] backdrop-blur-[12px] transition-all duration-300
        hover:scale-[1.02] hover:brightness-110
        ${
          type === "success"
            ? "border-[rgba(0,255,133,0.4)] bg-[rgba(0,255,133,0.08)]"
            : type === "error"
              ? "border-[rgba(255,75,75,0.4)] bg-[rgba(255,75,75,0.08)]"
              : "border-[rgba(75,168,255,0.4)] bg-[rgba(75,168,255,0.08)]"
        }
      `}
      style={{
        backgroundImage:
          type === "success"
            ? "linear-gradient(135deg, rgba(42,42,60,0.3), rgba(0,255,133,0.15))"
            : type === "error"
              ? "linear-gradient(135deg, rgba(42,42,60,0.3), rgba(255,75,75,0.15))"
              : "linear-gradient(135deg, rgba(42,42,60,0.3), rgba(75,168,255,0.15))",
        boxShadow:
          type === "success"
            ? "0 0 12px rgba(0,255,133,0.3)"
            : type === "error"
              ? "0 0 12px rgba(255,75,75,0.3)"
              : "0 0 12px rgba(75,168,255,0.3)",
      }}
    >
      {/* ICON */}
      <div className="mt-0.5 flex-shrink-0">
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-[#00FF85]" />
        ) : type === "error" ? (
          <XCircle className="h-5 w-5 text-[#FF4B4B]" />
        ) : (
          <Info className="h-5 w-5 text-[#4BA8FF]" />
        )}
      </div>

      {/* TEXT CONTENT */}
      <div className="flex flex-col">
        <p className="text-[15px] font-medium text-white leading-tight">
          {message}
        </p>
        {desc && (
          <p className="text-[13px] text-[rgba(255,255,255,0.7)] mt-1">
            {desc}
          </p>
        )}
      </div>

      {/* soft animated overlay glow */}
      <div
        className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 hover:opacity-20 ${
          type === "success"
            ? "bg-[#00FF85] blur-md"
            : type === "error"
              ? "bg-[#FF4B4B] blur-md"
              : "bg-[#4BA8FF] blur-md"
        }`}
      ></div>
    </div>
  ));
};
