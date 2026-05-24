import { z } from "zod";

const MAX_REQUEST_SIZE = 50 * 1024; // 50KB max payload

export const leadSubmissionSchema = z.object({
  name: z.string().min(2).max(120),
  mobile: z.string().min(10).max(20),
  email: z.string().email().max(200).optional().or(z.literal("")),
  address: z.string().min(3).max(500),
  preferredSchedule: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  existingAcUnit: z.string().max(200).optional(),
  floorLevel: z.string().max(50).optional(),
  windowOrientation: z.string().max(50).optional(),

  roomLengthM: z.number().positive().max(100),
  roomWidthM: z.number().positive().max(100),
  ceilingHeightM: z.number().min(2).max(12),
  roomType: z.string().max(50),
  insulation: z.string().max(20),
  sunExposure: z.string().max(20),
  windowCount: z.number().int().min(0).max(100),

  calculationInputs: z.record(z.unknown()),
  calculationResult: z.object({
    totalBtu: z.number().positive().max(1000000),
    totalHp: z.number().positive().max(100),
    totalTR: z.number().positive().max(100).optional(),
    warnings: z.array(z.string()).optional(),
  }),

  sourcePage: z.string().max(200).default("/calculator"),
  turnstileToken: z.string().optional(),
  deviceType: z.string().max(20).optional(),
  userAgent: z.string().max(500).optional(),

  _hp: z.string().max(100).optional(),
  _ft: z.string().max(100).optional(),
  _ik: z.string().max(100).optional(),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

export function validateRequestSize(contentLength: string | null): boolean {
  if (!contentLength) return true;
  const size = parseInt(contentLength, 10);
  return !isNaN(size) && size <= MAX_REQUEST_SIZE;
}

export function parseAndValidate(
  json: unknown
): { success: true; data: LeadSubmission } | { success: false; error: string } {
  const result = leadSubmissionSchema.safeParse(json);

  if (!result.success) {
    const firstError = result.error.errors[0];
    const field = firstError?.path?.join(".") || "unknown";
    return {
      success: false,
      error: `Invalid ${field}`,
    };
  }

  return { success: true, data: result.data };
}
