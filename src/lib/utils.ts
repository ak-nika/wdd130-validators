import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countHtmlValidationResults(data: HTMLValidatorResponse) {
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
