import { trpc } from "@/trpc";
import { User } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";

export function UsersTable() {
  const { data, error, isLoading } = trpc.users.getAll.useQuery();

  if (error) return <div>Error: {error.message}</div>;

  if (isLoading) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}

export function Users() {
  return (
    <>
      <UsersTable />
      <UserForm />
    </>
  );
}

function UserForm() {
  const { register, handleSubmit } = useForm<User>();
  const { mutate, error } = trpc.users.register.useMutation();

  const onSubmit: SubmitHandler<User> = (data) => {
    mutate(data);
  };

  if (error) alert(error.message);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Is Admin
        <input className="block" type="checkbox" {...register("isAdmin")} />
      </label>
      <label>
        Is Member
        <input className="block" type="checkbox" {...register("isMember")} />
      </label>
      <label>
        First Name
        <input className="block" type="text" {...register("firstName")} />
      </label>
      <label>
        Last Name
        <input className="block" type="text" {...register("lastName")} />
      </label>
      <label>
        Address 1
        <input className="block" type="text" {...register("address1")} />
      </label>
      <label>
        Address 2
        <input className="block" type="text" {...register("address2")} />
      </label>
      <label>
        State
        <input className="block" type="text" {...register("state")} />
      </label>
      <label>
        City
        <input className="block" type="text" {...register("city")} />
      </label>
      <label>
        Zip
        <input className="block" type="text" {...register("zip")} />
      </label>
      <label>
        Major
        <input className="block" type="text" {...register("major")} />
      </label>
      <label>
        Graduation Year
        <input className="block" type="text" {...register("gradYear")} />
      </label>
      <label>
        Phone
        <input className="block" type="text" {...register("phone")} />
      </label>
      <label>
        Email
        <input className="block" type="text" {...register("email")} />
      </label>
      <label>
        Personal Website
        <input className="block" type="text" {...register("personalWebsite")} />
      </label>
      <label>
        Github
        <input className="block" type="text" {...register("github")} />
      </label>
      <label>
        LinkedIn
        <input className="block" type="text" {...register("linkedin")} />
      </label>

      <label>
        <input className="block" type="text" {...register("shirtSize")} />
      </label>
      <input type="submit" />
    </form>
  );
}
