import { useEffect, useState } from "react";
import Loader from "./Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { TriangleAlert, XCircleIcon } from "lucide-react";
import MessageBanner from "./MessageBanner";

const CSSValidation = ({ urls }: { urls: string[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CSSValidatorResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!urls || !urls.length || urls.length === 0) return;

    const validateCss = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const validationResults = [];

        for (const url of urls) {
          const res = await fetch(
            `/api/validate-css?url=${encodeURIComponent(url)}`
          );
          const data = await res.json();
          validationResults.push({ url, ...data });
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

    validateCss();
  }, [urls]);

  return (
    <section className="p-4 mt-8 container mx-auto">
      {isLoading && <Loader text="CSS validation" />}
      {error && !isLoading && <div className="error">{error}</div>}

      {!isLoading && !error && results.length > 0 && (
        <div className="p-4">
          <h2 className="text-2xl mb-8">CSS Validations</h2>

          <Accordion type="multiple" className="w-full">
            {results.map((result, index) => {
              const { errorcount, warningcount } = result.result;

              return (
                <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="truncate flex-1 text-left font-semibold">
                        {result.url}
                      </span>

                      <div className="flex items-center gap-3 shrink-0">
                        {errorcount > 0 && (
                          <div className="flex-center text-red-600 dark:text-red-400">
                            <XCircleIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {errorcount}
                            </span>
                          </div>
                        )}

                        {warningcount > 0 && (
                          <div className="flex-center text-yellow-600 dark:text-yellow-400">
                            <TriangleAlert className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {warningcount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="text-balance space-y-2">
                    {result.errors.map((error, index) => (
                      <MessageBanner
                        type="error"
                        text={`${error.message} ${error.source}`}
                        key={`error-${index}`}
                      />
                    ))}

                    {result.warnings.map((warning, index) => (
                      <MessageBanner
                        type="warning"
                        text={`${warning.message} ${warning.source}`}
                        key={`warning-${index}`}
                      />
                    ))}

                    {result.errors.length === 0 &&
                      result.warnings.length === 0 && (
                        <MessageBanner type="success" text="No errors found" />
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

export default CSSValidation;
