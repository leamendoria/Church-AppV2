"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, BookOpen, Users, Bell, HandCoins, Group, GraduationCap } from "lucide-react"
import { DailyDevotion } from "./daily-devotion"
import { CorporatePrayer } from "./corporate-prayer"
import { Announcements } from "./announcements"
import { SowingSeed } from "./sowing-seed"
import { PastorScheduling } from "./pastor-scheduling"
import { CellGroups } from "./cell-groups"
import { Trainings } from "./trainings"

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-card shadow-sm py-4 px-4 md:px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">GLAWGO Church Connect</h1>
        {/* Add user profile/settings icon here if needed */}
      </header>
      <Tabs defaultValue="devotion" className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto pb-20">
          <TabsContent value="devotion" className="p-4">
            <DailyDevotion />
          </TabsContent>
          <TabsContent value="prayer" className="p-4">
            <CorporatePrayer />
          </TabsContent>
          <TabsContent value="pastor" className="p-4">
            <PastorScheduling />
          </TabsContent>
          <TabsContent value="cell-groups" className="p-4">
            <CellGroups />
          </TabsContent>
          <TabsContent value="trainings" className="p-4">
            <Trainings />
          </TabsContent>
          <TabsContent value="announcements" className="p-4">
            <Announcements />
          </TabsContent>
          <TabsContent value="giving" className="p-4">
            <SowingSeed />
          </TabsContent>
        </main>
        <footer className="fixed bottom-0 left-0 right-0 bg-card shadow-lg border-t border-border z-50">
          <TabsList className="grid w-full grid-cols-7 h-auto py-2">
            <TabsTrigger
              value="devotion"
              className="flex flex-col items-center gap-1 text-xs data-[state=active]:text-primary"
            >
              <BookOpen className="h-5 w-5" />
              Word
            </TabsTrigger>
            <TabsTrigger
              value="prayer"
              className="flex flex-col items-center gap-1 text-xs data-[state=active]:text-primary"
            >
              <Users className="h-5 w-5" />
              Prayer
            </TabsTrigger>
            <TabsTrigger
              value="pastor"
              className="flex flex-col items-center gap-1 text-xs data-[state=active]:text-primary"
            >
              <CalendarDays className="h-5 w-5" />
              Pastor
            </TabsTrigger>
            <TabsTrigger
              value="cell-groups"
              className="flex flex-col items-center gap-1 text-xs data-[state=active]:text-primary"
            >
              <Group className="h-5 w-5" />
              Cell Grp
            </TabsTrigger>
            <TabsTrigger
              value="trainings"
              className="flex flex-col items-center gap-1 text-xs data-[state=active]:text-primary"
            >
              <GraduationCap className="h-5 w-5" />
              Trainings
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="flex flex-col items-center gap-1 text-xs data-[state=active]:text-primary"
            >
              <Bell className="h-5 w-5" />
              Announce
            </TabsTrigger>
            <TabsTrigger
              value="giving"
              className="flex flex-col items-center gap-1 text-xs data-[state=active]:text-primary"
            >
              <HandCoins className="h-5 w-5" />
              Giving
            </TabsTrigger>
          </TabsList>
        </footer>
      </Tabs>
    </div>
  )
}
