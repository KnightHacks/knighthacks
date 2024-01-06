import {useState} from 'react';
import { Button } from '~/components/ui/button';
import {Sheet, SheetContent} from '~/components/ui/sheet';
import { AddSponsorForm } from './add-sponsor-form';

export function Sponsors() {
    const [addSponsorFormSheetOpen, setAddSponsorFormSheetOpen] = useState(false)
  
    return (
        <div className="px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4">
            <Button onClick={() => setAddSponsorFormSheetOpen(true)}>
              Add Sponsor
            </Button>
          </div>
          <Sheet open={addSponsorFormSheetOpen} onOpenChange={setAddSponsorFormSheetOpen}>
            <SheetContent >
                <AddSponsorForm />
            </SheetContent>
          </Sheet>
        </div>

      </div>
    );
  }