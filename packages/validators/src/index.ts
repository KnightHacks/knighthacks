import { z } from "zod";

import {
  APPLICATION_STATUSES,
  GRADUATION_YEARS,
  MAJORS,
  SCHOOLS,
  SHIRT_SIZES,
  SPONSOR_TIERS,
} from "@knighthacks/consts";

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

export const UpdateUserSchema = CreateUserSchema.extend({
  userId: z.string(),
}).omit({ email: true });

export const CreateUserProfileSchema = z.object({
  userId: z.string(),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address1: z.string().min(1, { message: "Address is required" }),
  address2: z.string().optional().or(z.literal("")),
  country: z.string().min(1, { message: "Country is required" }),
  github: z
    .string()
    .url({ message: "Invalid GitHub link" })
    .optional()
    .or(z.literal("")),
  personalWebsite: z
    .string()
    .url({ message: "Invalid personal website link" })
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url({ message: "Invalid LinkedIn link" })
    .optional()
    .or(z.literal("")),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zip: z.string().min(1, { message: "Zip code is required" }),
  age: z.coerce
    .number()
    .min(18, { message: "You must be at least 18 years old" }),
  major: z.enum(MAJORS),
  school: z.enum(SCHOOLS),
  gradYear: z.enum(GRADUATION_YEARS),
  shirtSize: z.enum(SHIRT_SIZES),
  resume: z.string().optional(),
});

export const AddUserProfileFormSchema = CreateUserProfileSchema.extend({
  resume: z.instanceof(File).optional(),
});

export const UpdateUserProfileSchema = CreateUserProfileSchema.extend({
  userId: z.string(),
});

export const UpdateUserProfileFormSchema = AddUserProfileFormSchema.extend({
  userId: z.string(),
});

export const CreateHackathonSchema = z.object({
  name: z.string().min(1, { message: "Hackathon name is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  theme: z.string().optional(),
});

export const CreateHackathonFormSchema = CreateHackathonSchema.omit({
  startDate: true,
  endDate: true,
}).extend({
  date: z
    .object(
      {
        from: z.date().optional(),
        to: z.date().optional(),
      },
      {
        required_error: "Start and end date is required",
      },
    )
    .refine((date) => !!date.to, "Start and end date is required"),
});

export const UpdateHackathonSchema = CreateHackathonSchema.extend({
  hackathonId: z.number(),
});

export const UpdateHackathonFormSchema = CreateHackathonFormSchema.extend({
  hackathonId: z.number(),
});

export const CreateHackerSchema = z.object({
  hackathonId: z.number(),
  userId: z.string(),
  whyAttend: z
    .string()
    .min(1, { message: "Why do you want to attend is required" }),
  whatLearn: z
    .string()
    .min(1, { message: "What do you want to learn is required" }),
  status: z.enum(APPLICATION_STATUSES),
});

export const UpdateHackerSchema = CreateHackerSchema.extend({
  hackerId: z.number(),
});

export const CreateSponsorSchema = z.object({
  name: z.string().min(1, { message: "Sponsor name is required" }),
  logo: z.string().url({ message: "Invalid logo URL" }),
  website: z.string().url({ message: "Invalid website URL" }),
  tier: z.enum(SPONSOR_TIERS),
  hackathonId: z.number(),
});

export const UpdateSponsorSchema = CreateSponsorSchema.extend({
  sponsorId: z.number(),
});

export * from "zod";
