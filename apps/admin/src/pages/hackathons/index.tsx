import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { displayHackathons } from "./displayHackathons";
import { AddHackathonForm } from "./hackathons";

export function Hackathons() {
  const [addHackathonFormSheetOpen, setAddHackathonFormSheetOpen] =
    useState(false);

  return (
    <div className="px-4">
      {displayHackathons()}
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Button onClick={() => setAddHackathonFormSheetOpen(true)}>
            Add Hackathon
          </Button>
        </div>
      </div>
      <Sheet
        open={addHackathonFormSheetOpen}
        onOpenChange={setAddHackathonFormSheetOpen}
      >
        <SheetContent>
          <AddHackathonForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}
