import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, CalendarCheck } from "lucide-react"

export function PastorScheduling() {
  const currentMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" })
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1) // Example for a 31-day month
  const availableDays = [5, 12, 19, 26] // Example available days

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">Pastor Scheduling Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg text-muted-foreground">
            Easily book a one-on-one session with our pastors for PID (Personal Intensive Discipleship) or Cell Group
            face-to-face meetings.
          </p>
          <Button asChild className="w-full max-w-xs mx-auto bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="https://calendly.com/your-church-link" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Book a Session via Calendly
            </a>
          </Button>
          <CardDescription className="text-sm mt-4">
            (This button links to your Calendly booking page. Full integration with the Calendly API for in-app booking,
            availability, and email reminders would require backend development and API key management.)
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">Pastor Availability</CardTitle>
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
            {Array.from({ length: 4 }, (_, i) => (
              <div key={`empty-${i}`} className="h-8 w-8"></div>
            ))}
            {daysInMonth.map((day) => (
              <div
                key={day}
                className={`h-8 w-8 flex items-center justify-center rounded-full ${
                  availableDays.includes(day)
                    ? "bg-secondary text-secondary-foreground font-bold cursor-pointer"
                    : "text-foreground opacity-50"
                }`}
                title={availableDays.includes(day) ? "Available" : "Not Available"}
              >
                {day}
              </div>
            ))}
          </div>
          <CardDescription className="text-sm text-center mt-4">
            <CalendarCheck className="inline-block h-4 w-4 mr-1 text-secondary" />
            Days marked in pastel red indicate pastor availability.
          </CardDescription>
          <CardDescription className="text-sm text-center mt-2">
            (This is a static representation. Actual availability would be fetched from Calendly or a database.)
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-secondary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-secondary">
            Email Reminders & Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Once your session is booked, you will receive an email confirmation with all the details and timely
            reminders.
          </p>
          <p className="text-sm mt-2">
            (This functionality is handled by Calendly or would require a custom email service integration.)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
