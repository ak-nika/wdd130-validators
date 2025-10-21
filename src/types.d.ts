interface HTMLValidatorMessage {
  type: "error" | "info" | "non-document-error";
  subType?: string;
  message: string;
}

interface HTMLValidatorResponse {
  url: string;
  messages: HTMLValidatorMessage[];
}

interface CSSValidatorError {
  message: string;
  source: string;
}

interface CSSValidatorResponse {
  url: string;
  result: {
    errorcount: number;
    warningcount: number;
  };
  errors: CSSValidatorError[];
  warnings: CSSValidatorError[];
}
