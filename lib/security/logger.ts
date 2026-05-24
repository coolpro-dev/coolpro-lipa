type LogLevel = "debug" | "info" | "warn" | "error";

type RequestLogData = {
  ip: string;
  endpoint: string;
  method: string;
  userAgent?: string;
  fingerprint?: string;
  statusCode?: number;
  duration?: number;
  error?: string;
  reason?: string;
  botScore?: number;
};

type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
};

const isProduction = process.env.NODE_ENV === "production";

function formatLog(entry: LogEntry): string {
  if (isProduction) {
    return JSON.stringify(entry);
  }
  const { timestamp, level, message, data } = entry;
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${dataStr}`;
}

function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  if (level === "debug" && isProduction) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  };

  const formatted = formatLog(entry);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) => log("debug", message, data),
  info: (message: string, data?: Record<string, unknown>) => log("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) => log("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) => log("error", message, data),

  request: (data: RequestLogData) => {
    const level: LogLevel = data.statusCode && data.statusCode >= 400 ? "warn" : "info";
    log(level, "api_request", data as Record<string, unknown>);
  },

  security: (event: string, data: Record<string, unknown>) => {
    log("warn", `security:${event}`, data);
  },
};
