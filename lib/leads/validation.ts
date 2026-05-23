import { z } from "zod";

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
    totalBtu: z.number(),
    totalHp: z.number(),
    totalTR: z.number().optional(),
  }),
  sourcePage: z.string().max(200).default("/calculator"),
  turnstileToken: z.string().optional(),
  deviceType: z.string().max(20).optional(),
  userAgent: z.string().max(500).optional(),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;
