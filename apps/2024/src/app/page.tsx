import { Button } from "@knighthacks/design-system/components";
import { HackathonRegister } from "~/components/hackathon-register";

export default function Home() {
  return (
    <div>
      <div>This is the home page!</div>
      <Button>Register for Hackathon</Button>
      <HackathonRegister/>
    </div>
  );
}
