import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type ValidatorMessage = {
  type: "error" | "info" | "non-document-error";
  subType?: string;
  message: string;
};

type ValidatorResponse = {
  url: string;
  messages: ValidatorMessage[];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countValidationResults(data: ValidatorResponse) {
  const counts = data.messages.reduce(
    (acc, msg) => {
      if (msg.type === "error" || msg.type === "non-document-error")
        acc.errors++;
      if (msg.type === "info") acc.infos++;
      return acc;
    },
    { errors: 0, infos: 0 }
  );

  return counts;
}
