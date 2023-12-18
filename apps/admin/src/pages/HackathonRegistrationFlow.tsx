import { useSessionStore } from "@/lib/stores/session-store";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@knighthacks/db";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export function HackathonRegistrationFlow() {
  const { data: currentUser } = trpc.users.getCurrentUser.useQuery();
  const { session } = useSessionStore();

  if (!session) {
    return <SignInWithGithub />;
  }

  if (session && !currentUser) {
    return <UserForm accessToken={session.access_token} />;
  }

  return (
    <>
      <p>Thank you for making a KnightHacks account!</p>
    </>
  );
}

function SignInWithGithub() {
  return (
    <button
      onClick={() =>
        supabase.auth.signInWithOAuth({
          provider: "github",
        })
      }
    >
      Sign In With Github
    </button>
  );
}

const userRegistrationSchema = insertUserSchema
  .extend({
    // On the client, we want to accept a FileList object
    // On the server, we want to accept a string, which will be the key of the uploaded file
    resume: z.instanceof(FileList).transform((fileList) => fileList[0]),
  })
  // These fields will be filled in by the current session
  .omit({ email: true, oauthProvider: true, oauthUserId: true });

type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;

function UserForm({ accessToken }: { accessToken: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegistrationSchema>({
    resolver: zodResolver(userRegistrationSchema),
  });

  const { mutate, error } = trpc.users.register.useMutation();

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
            Authorization: `Bearer ${accessToken}}`,
          },
        }
      );

      if (!res.ok) {
        alert("Error uploading resume");
        return;
      }

      const { key } = await res.json();
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
        <input className="block" type="tel" {...register("phone")} />
      </label>
      <label className="block">
        Age
        <input
          className="block"
          type="number"
          {...register("age", {
            valueAsNumber: true,
          })}
        />
        <ErrorMessage errors={errors} name="age" />
      </label>
      <label className="block">
        Shirt Size
        <input className="block" type="text" {...register("shirtSize")} />
        <ErrorMessage errors={errors} name="shirtSize" />
      </label>
      <label className="block">
        Major
        <input className="block" type="text" {...register("major")} />
        <ErrorMessage errors={errors} name="major" />
      </label>
      <label className="block">
        School
        <input className="block" type="text" {...register("school")} />
        <ErrorMessage errors={errors} name="school" />
      </label>
      <label className="block">
        Graduation Year
        <input className="block" type="text" {...register("gradYear")} />
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
