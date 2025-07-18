"use client"

import type React from "react"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect, useMemo } from "react"
import { toast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight, Loader2, MessageSquare } from "lucide-react" // Added MessageSquare icon

// Define interface for prayer team assignments, including session_type
interface PrayerTeamAssignment {
  id: string
  assignment_date: string // YYYY-MM-DD format
  team_name: string
  leader_name: string
  session_type: "morning" | "evening" // Added session_type
}

// Define interface for prayer requests
interface PrayerRequest {
  id: string
  request_text: string
  is_anonymous: boolean
  created_at: string
}

export function CorporatePrayer() {
  const [prayerRequest, setPrayerRequest] = useState("")
  const [privacy, setPrivacy] = useState("public")
  const [currentMonth, setCurrentMonth] = useState(new Date()) // State for current month in calendar
  const [assignments, setAssignments] = useState<PrayerTeamAssignment[]>([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [errorAssignments, setErrorAssignments] = useState<string | null>(null)
  const [publicPrayerRequests, setPublicPrayerRequests] = useState<PrayerRequest[]>([]) // New state for public requests
  const [loadingPublicRequests, setLoadingPublicRequests] = useState(true) // New state for loading public requests
  const [errorPublicRequests, setErrorPublicRequests] = useState<string | null>(null) // New state for public request errors

  const supabase = createBrowserClient()

  // Function to fetch prayer team assignments for the current month
  useEffect(() => {
    const fetchPrayerTeamAssignments = async () => {
      setLoadingAssignments(true)
      setErrorAssignments(null)
      try {
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

        const { data, error } = await supabase
          .from("prayer_team_assignments")
          .select("id, assignment_date, team_name, leader_name, session_type")
          .gte("assignment_date", startOfMonth.toISOString().split("T")[0])
          .lte("assignment_date", endOfMonth.toISOString().split("T")[0])
          .order("assignment_date", { ascending: true })
          .order("session_type", { ascending: true })

        if (error) {
          throw error
        }
        setAssignments(data as PrayerTeamAssignment[] || [])
      } catch (err: any) {
        console.error("Error fetching prayer team assignments:", err)
        setErrorAssignments("Failed to load prayer team assignments.")
      } finally {
        setLoadingAssignments(false)
      }
    }

    fetchPrayerTeamAssignments()
  }, [currentMonth, supabase])

  // New useEffect to fetch public prayer requests
  useEffect(() => {
    const fetchPublicPrayerRequests = async () => {
      setLoadingPublicRequests(true)
      setErrorPublicRequests(null)
      try {
        const { data, error } = await supabase
          .from("prayer_requests")
          .select("id, request_text, is_anonymous, created_at")
          .eq("is_anonymous", false) // Only fetch public requests
          .order("created_at", { ascending: false }) // Most recent first
          .limit(10) // Limit to 10 most recent public requests

        if (error) {
          throw error
        }
        setPublicPrayerRequests(data as PrayerRequest[] || [])
      } catch (err: any) {
        console.error("Error fetching public prayer requests:", err)
        setErrorPublicRequests("Failed to load public prayer requests.")
      } finally {
        setLoadingPublicRequests(false)
      }
    }

    fetchPublicPrayerRequests()
  }, [supabase]) // Re-fetch when supabase client changes

  // Memoize today's assignments for efficient rendering
  const todayAssignments = useMemo(() => {
    const today = new Date()
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    return assignments.filter((a) => a.assignment_date === todayFormatted)
  }, [assignments])

  const handleSubmitPrayerRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prayerRequest.trim()) {
      toast({
        title: "Error",
        description: "Please enter your prayer request.",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from("prayer_requests")
        .insert([
          {
            request_text: prayerRequest,
            is_anonymous: privacy === "anonymous",
          },
        ])
        .select()

      if (error) {
        console.error("Error submitting prayer request:", error)
        toast({
          title: "Submission Failed",
          description: `There was an error submitting your request: ${error.message}`,
          variant: "destructive",
        })
      } else {
        console.log("Prayer Request Submitted Successfully:", data)
        toast({
          title: "Prayer Request Submitted!",
          description: "Your prayer request has been received.",
        })
        setPrayerRequest("")
        setPrivacy("public")
        // After successful submission, re-fetch public requests to update the list
        const { data: newPublicRequests, error: newError } = await supabase
          .from("prayer_requests")
          .select("id, request_text, is_anonymous, created_at")
          .eq("is_anonymous", false)
          .order("created_at", { ascending: false })
          .limit(10)
        if (!newError) {
          setPublicPrayerRequests(newPublicRequests as PrayerRequest[] || [])
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  // Calendar logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay() // 0 for Sunday, 1 for Monday

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const numDays = daysInMonth(year, month)
    const firstDay = firstDayOfMonth(year, month)

    const days = []
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 w-full"></div>)
    }

    for (let day = 1; day <= numDays; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      // Filter all assignments for this specific date
      const dailyAssignments = assignments.filter((a) => a.assignment_date === dateString)
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

      days.push(
        <div
          key={day}
          className={`relative h-24 w-full flex flex-col items-center justify-start p-1 text-xs border rounded-md overflow-hidden ${
            isToday ? "bg-primary/20 border-primary" : "bg-card border-border"
          }`}
        >
          <span className={`font-bold ${isToday ? "text-primary" : "text-foreground"}`}>{day}</span>
          <div className="mt-1 text-center flex flex-col gap-0.5">
            {dailyAssignments.map((assignment) => {
              const assignmentLabel = `${assignment.session_type === "morning" ? "M:" : "E:"} ${assignment.team_name}`;
              const tooltip = `${assignmentLabel} (Leader: ${assignment.leader_name})`;
              return (
                <div key={assignment.id} className="leading-none">
                  <p
                    className="font-semibold text-secondary-foreground calendar-cell-content"
                    title={tooltip}
                  >
                    {assignmentLabel}
                  </p>
                  <p
                    className="text-muted-foreground calendar-cell-content"
                    title={assignment.leader_name}
                  >
                    {assignment.leader_name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>,
      )
    }
    return days
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">Corporate Prayer Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg font-semibold text-foreground">Join us for powerful corporate prayer sessions daily:</p>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">
              Morning Session: <span className="font-bold">6:00 AM</span>
            </p>
            <p className="text-muted-foreground">
              Evening Session: <span className="font-bold">8:30 PM</span>
            </p>
          </div>
          <Button asChild className="w-full max-w-xs mx-auto bg-primary text-primary-foreground hover:bg-primary/90">
            <a
              href="https://us02web.zoom.us/j/88386616439?pwd=bDlqNjJnVXAxajBlWUlpZzNLRU5nQT09"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Zoom Prayer
            </a>
          </Button>
          <CardDescription className="text-sm mt-4">
            Meeting ID: 883 8661 6439, Passcode: bDlqNjJnVXAxajBlWUlpZzNLRU5nQT09
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">Monthly Prayer Teams</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">See which team is assigned for corporate prayer each month.</p>

          {/* Dynamic Subtitle for Today's Team */}
          {todayAssignments.length > 0 && (
            <div className="mb-4 p-2 bg-secondary/10 border border-secondary/30 rounded-md">
              <h4 className="text-lg font-semibold text-secondary">The Team Assigned for Today:</h4>
              {todayAssignments.map((assignment) => (
                <p key={assignment.id} className="text-sm text-muted-foreground">
                  <span className="font-bold">{assignment.session_type === "morning" ? "Morning:" : "Evening:"}</span>{" "}
                  {assignment.team_name} (Leader: {assignment.leader_name})
                </p>
              ))}
            </div>
          )}
          {todayAssignments.length === 0 && !loadingAssignments && (
            <div className="mb-4 p-2 bg-muted/10 border border-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">No prayer team assigned for today.</p>
            </div>
          )}

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-lg font-semibold text-foreground">
              {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          {loadingAssignments ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading calendar...</p>
            </div>
          ) : errorAssignments ? (
            <div className="text-destructive text-center h-48 flex items-center justify-center">
              <p>{errorAssignments}</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-semibold text-primary text-sm">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          )}

          <CardDescription className="text-sm mt-4">
            (This calendar displays prayer team assignments fetched from your Supabase database.)
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">Submit a Prayer Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPrayerRequest} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="prayer-request">Your Prayer Request</Label>
              <Textarea
                id="prayer-request"
                placeholder="Type your prayer request here..."
                value={prayerRequest}
                onChange={(e) => setPrayerRequest(e.target.value)}
                rows={5}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Privacy Option</Label>
              <RadioGroup value={privacy} onValueChange={setPrivacy} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">Public (Share with the community)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anonymous" id="anonymous" />
                  <Label htmlFor="anonymous">Anonymous (Only visible to pastors)</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* New Card for Public Prayer Requests */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" /> Public Prayer Requests
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            See prayer requests shared by the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingPublicRequests ? (
            <div className="flex flex-col items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-muted-foreground">Loading public requests...</p>
            </div>
          ) : errorPublicRequests ? (
            <div className="text-destructive text-center">
              <p>{errorPublicRequests}</p>
            </div>
          ) : publicPrayerRequests.length > 0 ? (
            publicPrayerRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-primary/50 p-3">
                <p className="text-sm text-foreground mb-1">{request.request_text}</p>
                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(request.created_at).toLocaleString()}
                </p>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No public prayer requests yet. Be the first to share!</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
