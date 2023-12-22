import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Redirect } from "wouter";

import type { RouterOutput } from "@knighthacks/api";
import { insertHackerRequestSchema } from "@knighthacks/db";

import { trpc } from "~/trpc";

export function HackathonRegistration() {
  const { data: currentUser, isLoading } = trpc.users.getCurrentUser.useQuery();

  if (isLoading) {
    return <>Fetching current user...</>;
  }

  if (!currentUser) return <Redirect to="/hackathon/account-registration" />;

  return <HackerRegistration currentUser={currentUser} />;
}

type HackerRegistrationSchema = z.infer<typeof insertHackerRequestSchema>;

function HackerRegistration({
  currentUser,
}: {
  currentUser: NonNullable<RouterOutput["users"]["getCurrentUser"]>;
}) {
  const utils = trpc.useUtils();
  const { mutate, isLoading, isSuccess } = trpc.hackers.register.useMutation({
    onSuccess: () => {
      void utils.users.getCurrentUser.invalidate();
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<HackerRegistrationSchema>({
    resolver: zodResolver(insertHackerRequestSchema),
  });

  const onSubmit: SubmitHandler<HackerRegistrationSchema> = (data) => {
    mutate({
      ...data,
    });
  };

  if (currentUser.hasAppliedToCurrentHackathon || isSuccess) {
    return <>Thank you for registering!</>;
  }

  if (isLoading) {
    return <>Registering...</>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        Why do you want to participate in KnightHacks?
        <textarea className="block" {...register("whyAttend")} />
        <ErrorMessage errors={errors} name="whyAttend" />
      </label>
      <label className="block">
        What do you want to learn at KnightHacks?
        <textarea className="block" {...register("whatLearn")} />
        <ErrorMessage errors={errors} name="whatLearn" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
