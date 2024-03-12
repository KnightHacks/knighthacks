import { z } from "zod";

import { gradYears, majors, schools, shirtSizes } from "@knighthacks/consts";

export const AddUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

export const UpdateUserSchema = AddUserSchema.extend({
  userId: z.string(),
}).omit({ email: true });

export const AddUserProfileSchema = z.object({
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

export const AddUserProfileFormSchema = AddUserProfileSchema.extend({
  resume: z.instanceof(File).optional(),
});

export const UpdateUserProfileSchema = AddUserProfileSchema.extend({
  userId: z.string(),
});

export const UpdateUserProfileFormSchema = UpdateUserProfileSchema.extend({
  resume: z.instanceof(File).optional(),
});

export * from "zod";
