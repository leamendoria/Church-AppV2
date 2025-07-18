import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, User, CalendarIcon, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function CellGroups() {
  const cellGroups = [
    {
      id: 1,
      name: "Victory Zone - North",
      leader: "Pastor John Doe",
      day: "Wednesday",
      time: "7:00 PM",
      location: "Online (Zoom)",
    },
    {
      id: 2,
      name: "Faith Builders - South",
      leader: "Sister Jane Smith",
      day: "Tuesday",
      time: "6:30 PM",
      location: "Community Center",
    },
    {
      id: 3,
      name: "Grace Connect - East",
      leader: "Brother David Lee",
      day: "Thursday",
      time: "7:30 PM",
      location: "Church Annex",
    },
    {
      id: 4,
      name: "Hope Springs - West",
      leader: "Deacon Mark Johnson",
      day: "Monday",
      time: "7:00 PM",
      location: "Member's Home",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">Cell Group Meetings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            Connect with a Cell Group near you for fellowship, Bible study, and prayer.
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by zone or leader..." className="pl-9" />
          </div>
          {cellGroups.map((group) => (
            <Card key={group.id} className="border-l-4 border-primary">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">{group.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  Leader: {group.leader}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <CalendarIcon className="inline-block h-4 w-4 mr-1 text-primary" />
                  {group.day}s at {group.time}
                </p>
                <p className="text-sm text-muted-foreground">
                  <MapPin className="inline-block h-4 w-4 mr-1 text-primary" />
                  {group.location}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 bg-transparent text-primary border-primary hover:bg-primary/20"
                >
                  View Details / Join
                </Button>
              </CardContent>
            </Card>
          ))}
          <CardDescription className="text-sm text-center mt-4">
            (In a full implementation, you would fetch cell group data dynamically and allow filtering by zone or
            leader.)
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-secondary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-secondary">PID Mentoring Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg text-muted-foreground">
            Personal Intensive Discipleship (PID) offers one-on-one mentoring for spiritual growth.
          </p>
          <Button
            asChild
            className="w-full max-w-xs mx-auto bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <a href="#pastor-scheduling">
              <Users className="h-4 w-4 mr-2" />
              Schedule a PID Session
            </a>
          </Button>
          <CardDescription className="text-sm mt-4">
            (This would link to the Pastor Scheduling calendar. A referral flow from Cell Groups to Pastor booking would
            involve backend logic to pre-fill information or suggest specific pastors.)
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
