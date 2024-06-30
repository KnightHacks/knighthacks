import {
  APPLICATION_STATUSES,
  COUNTRIES,
  LEVELS_OF_STUDY,
  MAJORS,
  SCHOOLS,
  SHIRT_SIZES,
  SPONSOR_TIERS,
} from "@knighthacks/consts";
import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().min(1, { message: "Required" }).email("Invalid email"),
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Rquired" }),
  clerkID: z.string().min(1, { message: "Required" }),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  userID: z.number(),
});

export const CreateUserProfileSchema = z
  .object({
    userID: z.number(),
    phone: z
      .string()
      .min(1, { message: "Required" })
      .regex(/^\d{10}$/, "Invalid phone"),
    address1: z.string().min(1, { message: "Required" }),
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
    city: z.string().min(1, { message: "Required" }),
    state: z.string().min(1, { message: "Required" }),
    zip: z
      .string()
      .min(1, { message: "Required" })
      .regex(/^\d{5}$/, { message: "Invalid zip code" }),
    age: z.coerce
      .number()
      .min(18, {
        message: "You must be at least 18 years",
      })
      .max(100, { message: "Erm, what the sigma?" }),
    major: z.enum(MAJORS),
    school: z.enum(SCHOOLS),
    gradYear: z.string().min(4, { message: "Required" }),
    levelOfStudy: z.enum(LEVELS_OF_STUDY),
    shirtSize: z.enum(SHIRT_SIZES),
    resume: z.string().optional(),
    gender: z.string().min(1, { message: "Required" }),
    ethnicity: z.string().min(1, { message: "Required" }),
    discord: z.string().min(1, { message: "Required" }),
  })
  .merge(CreateUserSchema);

export const CreateUserProfileFormSchema = CreateUserProfileSchema.extend({
  resume: z.instanceof(File).optional(),
});

export const UpdateUserProfileSchema = CreateUserProfileSchema.partial().extend(
  {
    userID: z.number(),
  },
);

export const ProfileApplicationSchema = CreateUserProfileSchema.omit({
  userID: true,
  clerkID: true,
});

export const ProfileApplicationFormSchema = ProfileApplicationSchema.extend({
  age: z
    .string()
    .min(1, { message: "Required" })
    // Try to parse the string into an integer
    .refine((value) => !isNaN(parseInt(value, 10)), {
      message: "Must be a number",
    })
    .transform((value) => parseInt(value, 10))
    .refine((age) => age >= 18, {
      message: "You must be at least 18 years old",
    })
    .refine((age) => age <= 100, {
      message: "Erm, what the sigma?",
    }),
  resume: z.instanceof(File).optional(),
});

export const UpdateProfileApplicationFormSchema =
  ProfileApplicationFormSchema.partial().extend({
    userID: z.number(),
  });

export const UpdateUserProfileFormSchema =
  CreateUserProfileFormSchema.partial().extend({
    userID: z.number(),
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
  hackathonID: z.number(),
});

export const UpdateHackathonFormSchema =
  CreateHackathonFormSchema.partial().extend({
    hackathonID: z.number(),
  });

export const CreateHackerSchema = z.object({
  hackathonID: z.number(),
  userID: z.number(),
  survey1: z.string().min(1, { message: "This question is required" }),
  survey2: z.string().min(1, { message: "This question is required" }),
  isFirstTime: z.boolean(),
  isPlinktern: z.boolean(),
  status: z.enum(APPLICATION_STATUSES).optional(),
  agreesToReceiveEmailsFromMLH: z.boolean(),
});

export const UpdateHackerSchema = CreateHackerSchema.partial().extend({
  hackerID: z.number(),
});

export const HackerApplicationSchema = CreateHackerSchema.omit({
  status: true,
  hackathonID: true,
  userID: true,
}).extend({
  hasReadAndAgreesToMLHCodeOfConduct: z
    .boolean()
    .refine((value) => value === true, {
      message: "Must be checked",
    }),
  consentsToSharingApplicationWithMLHAndAgreesToTheMLHPrivacyPolicyAndContestTerms:
    z.boolean().refine((value) => value === true, {
      message: "Must be checked",
    }),
});

export const UpdateHackerApplicationSchema = HackerApplicationSchema.partial()
  .extend({
    hackerID: z.number(),
  })
  .omit({
    hasReadAndAgreesToMLHCodeOfConduct: true,
    consentsToSharingApplicationWithMLHAndAgreesToTheMLHPrivacyPolicyAndContestTerms:
      true,
  });

export const CreateSponsorSchema = z.object({
  name: z.string().min(1, { message: "Sponsor name is required" }),
  logo: z.string().url({ message: "Invalid logo URL" }),
  website: z.string().url({ message: "Invalid website URL" }),
  tier: z.enum(SPONSOR_TIERS),
  hackathonID: z.number(),
});

export const UpdateSponsorSchema = CreateSponsorSchema.partial().extend({
  sponsorId: z.number(),
});

export * from "zod";
