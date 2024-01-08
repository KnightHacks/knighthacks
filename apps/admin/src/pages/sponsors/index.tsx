import {useState} from 'react';
import { Button } from '~/components/ui/button';
import {Sheet, SheetContent} from '~/components/ui/sheet';
import { AddSponsorForm } from './add-sponsor-form';
import { trpc } from '~/trpc';
import { DataTable } from '~/components/ui/data-table';
import { columns } from './sponsor-columns';

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
          <SponsorTable />
          <Sheet open={addSponsorFormSheetOpen} onOpenChange={setAddSponsorFormSheetOpen}>
            <SheetContent >
                <AddSponsorForm />
            </SheetContent>
          </Sheet>
        </div>

      </div>
    );
  }

  export function SponsorTable() {
    const { data: sponsors, isLoading, error } = trpc.sponsors.getAll.useQuery();
  
    if (isLoading) return <div>Loading...</div>;
  
    if (error) return <div>Error: {error.message}</div>;
  
    return <DataTable columns={columns} data={sponsors} />;
  }