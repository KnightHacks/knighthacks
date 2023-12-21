import type { SubmitHandler } from "react-hook-form";
import { useAuth } from "@clerk/clerk-react";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Redirect } from "wouter";
import { z } from "zod";

import {
  gradYears,
  insertUserRequestSchema,
  majors,
  schools,
  shirtSizes,
} from "@knighthacks/db";

import { trpc } from "~/lib/trpc";

export function HackathonAccountRegistration() {
  const {
    data: currentUser,
    isLoading,
    error,
  } = trpc.users.getCurrentUser.useQuery();

  if (isLoading) return <p>Fetching current user...</p>;

  if (error) {
    alert(error.message);
    return <Redirect to="/hackathon/signin" />;
  }

  if (currentUser) return <Redirect to="/hackathon/registration" />;

  return <UserForm />;
}

const userRegistrationSchema = insertUserRequestSchema.extend({
  // On the client, we want to accept a FileList object
  // On the server, we want to accept a string, which will be the key of the uploaded file
  resume: z.instanceof(FileList).transform((fileList) => fileList[0]),
});

type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;

function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegistrationSchema>({
    resolver: zodResolver(userRegistrationSchema),
  });

  const { getToken } = useAuth();
  const { mutate, error, isLoading } = trpc.users.register.useMutation();

  if (isLoading) return <p>Loading...</p>;

  const onSubmit: SubmitHandler<UserRegistrationSchema> = async (data) => {
    let resume: string | null = null;
    if (data.resume) {
      // Upload resume
      const formData = new FormData();
      formData.append("resume", data.resume);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/resume/upload/${data.resume.name}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );

      if (!res.ok) {
        alert("Error uploading resume");
        return;
      }

      const { key } = (await res.json()) as { key: string };
      resume = key;
    }

    mutate({
      ...data,
      resume,
    });
  };

  if (error) alert(error.message);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        Is Member
        <input className="block" type="checkbox" {...register("isMember")} />
        <ErrorMessage errors={errors} name="isMember" />
      </label>
      <label className="block">
        First Name
        <input className="block" type="text" {...register("firstName")} />
        <ErrorMessage errors={errors} name="firstName" />
      </label>
      <label className="block">
        Last Name
        <input className="block" type="text" {...register("lastName")} />
        <ErrorMessage errors={errors} name="lastName" />
      </label>
      <label>
        Phone
        <input className="block" {...register("phone")} />
        <ErrorMessage errors={errors} name="phone" />
      </label>
      <label className="block">
        Age
        <input
          className="block"
          type="number"
          min={0}
          max={100}
          defaultValue={0}
          {...register("age", { valueAsNumber: true })}
        />
        <ErrorMessage errors={errors} name="age" />
      </label>
      <label className="block">
        Shirt Size
        <select className="block" {...register("shirtSize")}>
          {shirtSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          <option value="XL">XL</option>
        </select>
        <ErrorMessage errors={errors} name="shirtSize" />
      </label>
      <label className="block">
        Major
        <select className="block" {...register("major")}>
          {majors.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>
        <ErrorMessage errors={errors} name="major" />
      </label>
      <label className="block">
        School
        <select className="block" {...register("school")}>
          {schools.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>
        <ErrorMessage errors={errors} name="school" />
      </label>
      <label className="block">
        Graduation Year
        <select className="block" {...register("gradYear")}>
          {gradYears.map((gradYear) => (
            <option key={gradYear} value={gradYear}>
              {gradYear}
            </option>
          ))}
        </select>
        <ErrorMessage errors={errors} name="gradYear" />
      </label>
      <label className="block">
        Address 1
        <input className="block" type="text" {...register("address1")} />
        <ErrorMessage errors={errors} name="address1" />
      </label>
      <label className="block">
        Address 2
        <input className="block" type="text" {...register("address2")} />
        <ErrorMessage errors={errors} name="address2" />
      </label>
      <label className="block">
        City
        <input className="block" type="text" {...register("city")} />
        <ErrorMessage errors={errors} name="city" />
      </label>
      <label className="block">
        State
        <input className="block" type="text" {...register("state")} />
        <ErrorMessage errors={errors} name="state" />
      </label>
      <label className="block">
        Zip
        <input className="block" type="text" {...register("zip")} />
        <ErrorMessage errors={errors} name="zip" />
      </label>
      <label className="block">
        Country
        <input className="block" type="text" {...register("country")} />
        <ErrorMessage errors={errors} name="country" />
      </label>
      <label className="block">
        Github
        <input className="block" type="text" {...register("github")} />
        <ErrorMessage errors={errors} name="github" />
      </label>
      <label className="block">
        Personal Website
        <input className="block" type="text" {...register("personalWebsite")} />
        <ErrorMessage errors={errors} name="personalWebsite" />
      </label>
      <label className="block">
        LinkedIn
        <input className="block" type="text" {...register("linkedin")} />
        <ErrorMessage errors={errors} name="personalWebsite" />
      </label>
      <label className="block">
        Resume
        <input
          className="block"
          type="file"
          accept="application/pdf"
          {...register("resume")}
        />
        <ErrorMessage errors={errors} name="resume" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
