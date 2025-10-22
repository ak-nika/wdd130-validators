import express from "express";
import fetch from "node-fetch";

const router = express.Router();

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

router.get("/validate", (req, res) => {
  res.json({ message: "General validate endpoint working ✅" });
});

router.get("/validate-html", async (req, res) => {
  const url = req.query.url as string;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });

  try {
    const response = await fetch(
      `https://validator.w3.org/nu/?doc=${encodeURIComponent(url)}&out=json`,
      {
        headers: {
          "User-Agent": "LocalValidator/1.0",
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );

    if (!response.ok)
      throw new Error(`Validator API returned ${response.status}`);

    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to validate URL" });
  }
});

router.get("/validate-css", async (req, res) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    const response = await fetch(
      `https://jigsaw.w3.org/css-validator/validator?uri=${encodeURIComponent(
        url
      )}&profile=css3&warning=1&output=json`
    );

    // --- Handle unreachable or broken URLs ---
    if (!response.ok) {
      const result: CSSValidatorResponse = {
        url,
        result: { errorcount: 1, warningcount: 0 },
        errors: [
          {
            message: `Page not found or inaccessible (status ${response.status})`,
            source: url,
          },
        ],
        warnings: [],
      };
      return res.status(404).json(result);
    }

    // --- Try parsing JSON safely ---
    let data: any;
    try {
      data = await response.json();
    } catch {
      const result: CSSValidatorResponse = {
        url,
        result: { errorcount: 1, warningcount: 0 },
        errors: [
          {
            message: "Invalid JSON returned by W3C CSS Validator",
            source: url,
          },
        ],
        warnings: [],
      };
      return res.status(500).json(result);
    }

    // --- Validate structure of response ---
    if (!data?.cssvalidation) {
      const result: CSSValidatorResponse = {
        url,
        result: { errorcount: 1, warningcount: 0 },
        errors: [
          {
            message: "Unexpected response structure from W3C API",
            source: url,
          },
        ],
        warnings: [],
      };
      return res.status(500).json(result);
    }

    const { errorcount, warningcount } = data.cssvalidation.result;
    const errors = data.cssvalidation.errors || [];
    const warnings = data.cssvalidation.warnings || [];

    const result: CSSValidatorResponse = {
      url,
      result: { errorcount, warningcount },
      errors,
      warnings,
    };

    res.json(result);
  } catch (err: unknown) {
    const result: CSSValidatorResponse = {
      url,
      result: { errorcount: 1, warningcount: 0 },
      errors: [
        {
          message:
            err instanceof Error
              ? err.message
              : "Unknown error occurred during validation",
          source: url,
        },
      ],
      warnings: [],
    };
    res.status(500).json(result);
  }
});

export default router;
