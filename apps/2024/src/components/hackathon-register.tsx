import { Button } from "@knighthacks/design-system/components";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../packages/design-system/src/components/ui/dialog";
import { Input } from "../../../../packages/design-system/src/components/ui/input";
import { Label } from "../../../../packages/design-system/src/components/ui/label";

export function HackathonRegister() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Register for the Hackathon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Registration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Why do you want to attend Knight Hacks?
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              What do you want to learn at Knight Hacks?
            </Label>
            <Input id="username" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
