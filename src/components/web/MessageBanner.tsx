import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";

interface MessageBannerProps {
  type: "info" | "warning" | "error" | "success" | "non-document-error";
  text: string;
}

const MessageBanner = ({ type, text }: MessageBannerProps) => {
  if (type === "non-document-error") {
    return (
      <div className="error">
        <XCircle />
        <h1 className="font-bold text-lg">404</h1>
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div className={type}>
      {type === "error" ? (
        <XCircle />
      ) : type === "warning" ? (
        <TriangleAlert />
      ) : type === "success" ? (
        <CheckCircle2 />
      ) : type === "info" ? (
        <Info />
      ) : null}

      <h1 className="font-bold text-[1rem]">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </h1>
      <p>{text}</p>
    </div>
  );
};

export default MessageBanner;
