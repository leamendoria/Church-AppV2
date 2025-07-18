import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Announcements() {
  const announcements = [
    {
      id: 1,
      title: "Youth Revival Night",
      date: "July 20, 2025",
      time: "7:00 PM",
      location: "Church Auditorium",
      description: "Join us for a powerful night of worship and an inspiring message for our youth.",
      tags: ["Youth", "Event", "Revival"],
      rsvp: true,
    },
    {
      id: 2,
      title: "New Members Class",
      date: "August 3, 2025",
      time: "10:00 AM",
      location: "Fellowship Hall",
      description: "If you're new to GLAWGO, come learn about our vision, values, and how to get involved.",
      tags: ["New Members", "Training"],
      rsvp: false,
    },
    {
      id: 3,
      title: "Community Outreach Day",
      date: "August 10, 2025",
      time: "9:00 AM",
      location: "City Park",
      description: "We're serving our community! Sign up to volunteer for various outreach activities.",
      tags: ["Outreach", "Volunteer"],
      rsvp: true,
    },
  ]

  const currentMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" })
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1) // Example for a 31-day month
  const eventDays = [20, 3, 10] // Days with events for July/August

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">Announcements & Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border-l-4 border-primary">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">{announcement.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  {announcement.date} at {announcement.time} - {announcement.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">{announcement.description}</p>
                <div className="flex flex-wrap gap-2">
                  {announcement.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {announcement.rsvp && (
                  <div className="mt-2">
                    <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      RSVP Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">Event Calendar</CardTitle>
          <CardDescription className="text-center text-muted-foreground">{currentMonth}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold text-primary">
                {day}
              </div>
            ))}
            {/* Placeholder for empty days at the start of the month */}
            {Array.from({ length: 3 }, (_, i) => (
              <div key={`empty-${i}`} className="h-8 w-8"></div>
            ))}
            {daysInMonth.map((day) => {
              const eventIndex = eventDays.indexOf(day);
              const event = eventIndex !== -1 ? announcements[eventIndex] : null;
              return (
                <div
                  key={day}
                  className={`h-16 w-16 flex flex-col items-center justify-center rounded-md border border-border p-1 overflow-hidden ${
                    event ? "bg-primary/10 text-primary-foreground font-bold" : "text-foreground"
                  }`}
                  style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}
                >
                  <span className="font-bold">{day}</span>
                  {event && (
                    <>
                      <span
                        className="calendar-cell-content text-xs mt-0.5 font-semibold"
                        title={`${event.title} at ${event.time}`}
                      >
                        {event.title}
                      </span>
                      <span
                        className="calendar-cell-content text-xs text-muted-foreground"
                        title={event.time}
                      >
                        {event.time}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <CardDescription className="text-sm text-center mt-4">
            (This is a static calendar. A full event calendar would require dynamic date generation and event fetching.)
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
