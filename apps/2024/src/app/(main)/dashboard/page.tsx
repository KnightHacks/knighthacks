import { Tabs, TabsContent, TabsList, TabsTrigger } from "@knighthacks/ui/tabs";

export const runtime = "edge";

export default function Dashboard() {
  return (
    <div className="px-8 pt-20">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">Profile content</TabsContent>
        <TabsContent value="application">Application content</TabsContent>
      </Tabs>
    </div>
  );
}
