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
      <div className="mx-auto max-w-5xl">
        <div className="left-2 mb-4">
          <Button onClick={() => setAddHackathonFormSheetOpen(true)}>
            Add Hackathon
          </Button>
        </div>
      </div>
      {displayHackathons()}
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
