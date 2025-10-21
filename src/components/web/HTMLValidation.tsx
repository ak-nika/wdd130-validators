import { useEffect, useState } from "react";
import Loader from "./Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { countHtmlValidationResults } from "@/lib/utils";
import { CheckCircle2, InfoIcon, XCircleIcon } from "lucide-react";

const HTMLValidation = ({ urls }: { urls: string[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HTMLValidatorResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!urls || !urls.length || urls.length === 0) return;

    const validateUrls = async () => {
      try {
        setIsLoading(true);

        setResults([]);
        setError(null);

        const validationResults = [];

        for (const url of urls) {
          const res = await fetch(
            `/api/validate-html?url=${encodeURIComponent(url)}`
          );
          const data = await res.json();

          validationResults.push(data);
        }

        setResults(validationResults);
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    validateUrls();
  }, [urls]);

  return (
    <section className="container mx-auto mt-16 p-4">
      {isLoading && <Loader text="HTML Validation" />}
      {error && !isLoading && (
        <div className="p-4 font-semibold bg-red-200 text-red-600 w-full border border-red-600 rounded-md">
          {error}
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="p-4">
          <h2 className="text-2xl mb-8">HTML Validations</h2>

          <Accordion type="multiple" className="w-full">
            {results.map((result, index) => {
              const { errors, infos } = countHtmlValidationResults(result);

              return (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="truncate flex-1 text-left font-semibold">
                        {result.url}
                      </span>

                      <div className="flex items-center gap-3 shrink-0">
                        {errors > 0 && (
                          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                            <XCircleIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {errors}
                            </span>
                          </div>
                        )}

                        {infos > 0 && (
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                            <InfoIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{infos}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="text-balance space-y-2">
                    {result.messages.length > 0 ? (
                      result.messages.map((message, index) => (
                        <div
                          className={`p-4 border rounded-md flex items-center gap-2 ${
                            message.type === "error" ||
                            message.type === "non-document-error"
                              ? "error"
                              : message.type === "info"
                              ? "info"
                              : "border-border bg-muted text-muted-foreground"
                          }`}
                          key={index}
                        >
                          <h3 className="font-semibold flex-center">
                            {message.type === "error" ||
                            message.type === "non-document-error" ? (
                              <XCircleIcon />
                            ) : (
                              <InfoIcon />
                            )}{" "}
                            {message.type}
                          </h3>
                          <p>{message.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="success">
                        <CheckCircle2 /> No errors found
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </section>
  );
};

export default HTMLValidation;
