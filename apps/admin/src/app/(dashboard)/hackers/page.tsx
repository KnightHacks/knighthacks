"use client";

import type { RouterOutput } from "@knighthacks/api";
import { useEffect, useState } from "react";
import { Button } from "@knighthacks/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@knighthacks/ui/card";
import { Checkbox } from "@knighthacks/ui/checkbox";
import { Input } from "@knighthacks/ui/input";
import { Label } from "@knighthacks/ui/label";
import { ScrollArea } from "@knighthacks/ui/scroll-area";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@knighthacks/ui/tabs";
import { toast } from "@knighthacks/ui/toast";

// import { sendAcceptanceEmail } from "~/app/emails/send-acceptance-email";
import { api } from "~/trpc";
import { DataTable } from "../_components/data-table";
import { CreateHackerForm } from "./create-hacker-form";
import { hackerColumns } from "./hacker-columns";

type HackerType = RouterOutput["hacker"]["adminAll"][number];

interface Counts {
  accepted: number;
  waitlisted: number;
  denied: number;
  pending: number;
  checkedin: number;
  confirmed: number;
  withdrawn: number;
  plinktern: number;
  total: number;
}

export const runtime = "edge";

export default function Hackers() {
  const [createHackathonFormSheetOpen, setCreateHackathonFormSheetOpen] =
    useState(false);

  const [counts, setCounts] = useState<Counts>({
    accepted: 0,
    waitlisted: 0,
    denied: 0,
    confirmed: 0,
    pending: 0,
    checkedin: 0,
    withdrawn: 0,
    plinktern: 0,
    total: 0,
  });

  const { data: hackers, isPending, error } = api.hacker.adminAll.useQuery();

  useEffect(() => {
    if (hackers) {
      setCounts({
        accepted: hackers.filter((hacker) => hacker.status === "accepted")
          .length,
        waitlisted: hackers.filter((hacker) => hacker.status === "waitlisted")
          .length,
        denied: hackers.filter((hacker) => hacker.status === "denied").length,
        pending: hackers.filter((hacker) => hacker.status === "pending").length,
        checkedin: hackers.filter((hacker) => hacker.status === "checkedin")
          .length,
        withdrawn: hackers.filter((hacker) => hacker.status === "withdrawn")
          .length,
        confirmed: hackers.filter((hacker) => hacker.status === "confirmed")
          .length,
        plinktern: hackers.filter((hacker) => hacker.isPlinktern === true)
          .length,
        total: hackers.length,
      });
    }
  }, [hackers]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 space-x-2 space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <div className="text-md flex flex-row space-x-1 text-gray-500">
                <div>Accepted: {counts.accepted}</div>
                <div>Waitlisted: {counts.waitlisted}</div>
                <div>Denied: {counts.denied}</div>
                <div>Applied: {counts.pending}</div>
                <div>Checked In: {counts.checkedin}</div>
                <div>Withdrawn: {counts.withdrawn}</div>
                <div>Confirmed: {counts.confirmed}</div>
                <div>Plinktern: {counts.plinktern}</div>
                <div>Total: {counts.total}</div>
              </div>
            </CardHeader>
          </Card>
          <Tabs defaultValue="view">
            <TabsList>
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>
            <TabsContent value="view">
              <Button onClick={() => setCreateHackathonFormSheetOpen(true)}>
                Create Hacker
              </Button>
              <HackathonsTable />
            </TabsContent>
            <TabsContent value="manage">
              <ManageTable updateCounts={setCounts} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Sheet
        open={createHackathonFormSheetOpen}
        onOpenChange={setCreateHackathonFormSheetOpen}
      >
        <SheetContent>
          <CreateHackerForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface ManageTableProps {
  updateCounts: React.Dispatch<React.SetStateAction<Counts>>;
}

export function ManageTable({ updateCounts }: ManageTableProps) {
  const { data: hackers, isPending, error } = api.hacker.adminAll.useQuery();

  const updateHacker = api.hacker.adminUpdate.useMutation({
    onSuccess: () => {
      toast("Success!", {
        description: "Hacker Status Updated.",
      });
      // Refetch hackers data after updating
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  const [allHackers, setAllHackers] = useState<typeof hackers>([]);
  const [selectedHacker, setSelectedHacker] = useState(
    hackers ? hackers[0] : null,
  );

  useEffect(() => {
    const filteredHackers = hackers?.filter(
      (hacker) => hacker.status === "pending",
    );
    setAllHackers(filteredHackers);
    if (filteredHackers) {
      if (filteredHackers.length > 0) {
        setSelectedHacker(filteredHackers[0]);
      } else {
        setSelectedHacker(null);
      }
    }
  }, [hackers]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const appliedCount = allHackers?.length;

  const moveToNextApplicant = () => {
    const currentIndex = allHackers?.findIndex(
      (h) => h.id === selectedHacker?.id,
    );
    if (
      allHackers &&
      currentIndex &&
      currentIndex > -1 &&
      currentIndex < allHackers.length - 1
    ) {
      setSelectedHacker(allHackers[currentIndex + 1]);
    } else {
      setSelectedHacker(null); // No more applicants
    }
  };

  type Status =
    | "withdrawn"
    | "pending"
    | "accepted"
    | "waitlisted"
    | "checkedin"
    | "confirmed"
    | "denied";

  const handleStatusChange = (status: Status, hacker: HackerType) => {
    updateHacker.mutate(
      {
        hackerID: hacker.id,
        status,
      },
      {
        onSuccess: () => {
          setAllHackers((prev) => prev?.filter((h) => h.id !== hacker.id));
          moveToNextApplicant();
        },
      },
    );
    updateCounts((prevCounts) => ({
      ...prevCounts,
      [hacker.status]: prevCounts[hacker.status] - 1,
      [status]: prevCounts[status] + 1,
    }));

    if (status === "accepted") {
      console.log("hacker: ", hacker);
      try {
        void fetch("/api/send-acceptance-email", {
          method: "POST",
          body: JSON.stringify(hacker.user),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }
  };

  if (!hackers.length) return <div>No Hackers available</div>;

  return (
    <div className="flex h-full">
      <Card className="mr-4 w-1/4">
        <CardHeader>
          <CardTitle>Hackers</CardTitle>
          <div className="text-sm text-gray-500">
            Applied Count: {appliedCount}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {allHackers?.map((hacker) => (
              <Button
                key={hacker.id}
                variant="ghost"
                className={`w-full justify-between font-normal ${
                  selectedHacker?.id === hacker.id ? "bg-secondary" : ""
                }`}
                onClick={() => setSelectedHacker(hacker)}
              >
                <h1>{`${hacker.user.firstName} ${hacker.user.lastName}`}</h1>
                <h1>{hacker.status}</h1>
              </Button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Hacker Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-full">
            {selectedHacker ? (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={`${selectedHacker.user.firstName} ${selectedHacker.user.lastName}`}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={selectedHacker.user.email}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Application Status</Label>
                  <Input id="status" value={selectedHacker.status} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hackathon">Hackathon</Label>
                  <Input
                    id="hackathon"
                    value={selectedHacker.hackathon.name}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="survey1">Survey Question 1</Label>
                  <Input id="survey1" value={selectedHacker.survey1} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="survey2">Survey Question 2</Label>
                  <Input id="survey2" value={selectedHacker.survey2} readOnly />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFirstTime"
                    checked={selectedHacker.isFirstTime ? true : false}
                    disabled
                  />
                  <Label htmlFor="isFirstTime">First-time Hacker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPlinktern"
                    checked={selectedHacker.isPlinktern ? true : false}
                    disabled
                  />
                  <Label htmlFor="isPlinktern">Plinktern</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreesToReceiveEmails"
                    checked={
                      selectedHacker.agreesToReceiveEmailsFromMLH ? true : false
                    }
                    disabled
                  />
                  <Label htmlFor="agreesToReceiveEmails">
                    Agrees to Receive Emails from MLH
                  </Label>
                </div>
                <div className="flex w-full items-center justify-center space-x-2">
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      handleStatusChange("accepted", selectedHacker);
                    }}
                    className="h-16 w-32 bg-green-500 text-lg font-bold text-white hover:bg-green-600"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      handleStatusChange("waitlisted", selectedHacker);
                    }}
                    className="h-16 w-32 bg-yellow-500 text-lg font-bold text-white hover:bg-green-600"
                  >
                    Waitlist
                  </Button>
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      handleStatusChange("denied", selectedHacker);
                    }}
                    className="h-16 w-32 bg-red-500 text-lg font-bold text-white hover:bg-red-600"
                  >
                    Deny
                  </Button>
                </div>
              </form>
            ) : (
              <p>No Hackers left to Review</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export function HackathonsTable() {
  const { data: hackers, isPending, error } = api.hacker.adminAll.useQuery();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={hackerColumns} data={hackers} />;
}
