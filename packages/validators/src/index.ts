import { z } from "zod";

import {
  APPLICATION_STATUSES,
  COUNTRIES,
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

export const UpdateUserSchema = CreateUserSchema.partial()
  .extend({
    userId: z.string(),
  })
  .omit({ email: true });

export const CreateUserProfileSchema = z.object({
  userId: z.string(),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\d{10}$/, "Invalid phone"),
  address1: z.string().min(1, { message: "Address is required" }),
  address2: z.string().optional().or(z.literal("")),
  country: z.enum(COUNTRIES),
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
  zip: z
    .string()
    .min(1, { message: "Zip code is required" })
    .regex(/^\d{5}$/, { message: "Invalid zip code" }),
  age: z.coerce
    .number()
    .min(18, {
      message: "You must be at least 18 years old to participate",
    })
    .max(100, { message: "Erm, what the sigma?" }),
  major: z.enum(MAJORS),
  school: z.enum(SCHOOLS),
  gradYear: z.string().min(4, { message: "Graduation year is required" }),
  shirtSize: z.enum(SHIRT_SIZES),
  resume: z.string().optional(),
  gender: z.string().min(1, { message: "Gender is required" }),
  ethnicity: z.string().min(1, { message: "Ethnicity is required" }),
  discord: z.string().min(1, { message: "Discord username is required" }),
});

export const CreateUserProfileFormSchema = CreateUserProfileSchema.extend({
  resume: z.instanceof(File).optional(),
});

export const UpdateUserProfileSchema = CreateUserProfileSchema.partial().extend(
  {
    userId: z.string(),
  },
);

export const ProfileApplicationFormSchema = CreateUserProfileFormSchema.omit({
  userId: true,
}).extend({
  age: z
    .string()
    .min(1, { message: "Age is required" })
    // Try to parse the string into an integer
    .refine((value) => !isNaN(parseInt(value, 10)), {
      message: "Age must be a number",
    })
    .transform((value) => parseInt(value, 10))
    .refine((age) => age >= 18, {
      message: "You must be at least 18 years old to participate",
    })
    .refine((age) => age <= 100, {
      message: "Erm, what the sigma?",
    }),
});

export const ProfileApplicationSchema = CreateUserProfileSchema.omit({
  userId: true,
});

export const UpdateUserProfileFormSchema =
  CreateUserProfileFormSchema.partial().extend({
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

export const UpdateHackathonSchema = CreateHackathonSchema.partial().extend({
  hackathonId: z.number(),
});

export const UpdateHackathonFormSchema =
  CreateHackathonFormSchema.partial().extend({
    hackathonId: z.number(),
  });

export const CreateHackerSchema = z.object({
  hackathonId: z.number(),
  userId: z.string(),
  survey1: z.string().min(1, { message: "This question is required" }),
  survey2: z.string().min(1, { message: "This question is required" }),
  isFirstTime: z.boolean(),
  isPlinktern: z.boolean(),
  status: z.enum(APPLICATION_STATUSES).optional(),
});

export const UpdateHackerSchema = CreateHackerSchema.partial().extend({
  hackerId: z.number(),
});

export const HackerApplicationSchema = CreateHackerSchema.omit({
  status: true,
  hackathonId: true,
  userId: true,
});

export const CreateSponsorSchema = z.object({
  name: z.string().min(1, { message: "Sponsor name is required" }),
  logo: z.string().url({ message: "Invalid logo URL" }),
  website: z.string().url({ message: "Invalid website URL" }),
  tier: z.enum(SPONSOR_TIERS),
  hackathonId: z.number(),
});

export const UpdateSponsorSchema = CreateSponsorSchema.partial().extend({
  sponsorId: z.number(),
});

export * from "zod";
