import { z } from "zod";

import { gradYears, majors, schools, shirtSizes } from "@knighthacks/consts";

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
  major: z.enum(majors),
  school: z.enum(schools),
  gradYear: z.enum(gradYears),
  shirtSize: z.enum(shirtSizes),
  resume: z.string().optional(),
});

export const AddUserProfileFormSchema = CreateUserProfileSchema.extend({
  resume: z.instanceof(File).optional(),
});

export const UpdateUserProfileSchema = CreateUserProfileSchema.extend({
  userId: z.string(),
});

export const UpdateUserProfileFormSchema = UpdateUserProfileSchema.extend({
  resume: z.instanceof(File).optional(),
});

export const CreateHackathonSchema = z.object({
  name: z.string().min(1, { message: "Hackathon name is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  theme: z.string().min(1, { message: "Theme is required" }),
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

export * from "zod";
