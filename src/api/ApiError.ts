import { STATUS_INDICATORS } from "@/constants";

export class ApiError extends Error {
  level: string;

  fieldErrors: Record<string, string[]>;
  globalErrors: string[];

  constructor({
    level = STATUS_INDICATORS.ERROR,
    message = "Ein unbekannter Fehler ist aufgetreten, bitte den Administrator informieren.",
    fieldErrors = {},
    globalErrors = [],
  }: {
    level?: string;
    message?: string;
    fieldErrors?: Record<string, string[]>;
    globalErrors?: string[];
  }) {
    super(message);

    this.stack = new Error().stack;

    this.level = level;
    this.message = message;
    this.fieldErrors = fieldErrors;
    this.globalErrors = globalErrors;
  }
}
