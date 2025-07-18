"use client"

import type React from "react"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText, CheckCircle, UserPlus, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"
import { Progress } from "@/components/ui/progress" // Assuming shadcn/ui progress component is available

export function Trainings() {
  const [email, setEmail] = useState("")
  const [progress, setProgress] = useState(75) // Example progress

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      console.log("Signed up for session with email:", email)
      toast({
        title: "Signed Up!",
        description: "You've successfully signed up for the training session.",
      })
      setEmail("")
    } else {
      toast({
        title: "Error",
        description: "Please enter your email to sign up.",
        variant: "destructive",
      })
    }
  }

  const trainingMaterials = [
    {
      id: 1,
      title: "Foundations of Faith (Video Series)",
      type: "video",
      description: "A comprehensive video series on the core tenets of Christian faith.",
      link: "#", // Placeholder link
    },
    {
      id: 2,
      title: "Leadership Principles (PDF Guide)",
      type: "document",
      description: "Downloadable guide for developing effective spiritual leadership.",
      link: "#", // Placeholder link
    },
    {
      id: 3,
      title: "Prayer & Intercession (Audio Teaching)",
      type: "audio",
      description: "An audio teaching on the power and practice of prayer.",
      link: "#", // Placeholder link
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">Trainings & Mentorings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            Access valuable training materials and sign up for mentoring sessions to grow in your walk with God.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Training Materials
          </h3>
          <div className="grid gap-4">
            {trainingMaterials.map((material) => (
              <Card key={material.id} className="border-l-4 border-secondary">
                <CardContent className="flex items-center gap-4 p-4">
                  {material.type === "video" && <PlayCircle className="h-8 w-8 text-secondary" />}
                  {material.type === "document" && <FileText className="h-8 w-8 text-secondary" />}
                  {material.type === "audio" && <PlayCircle className="h-8 w-8 text-secondary" />}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{material.title}</h4>
                    <p className="text-sm text-muted-foreground">{material.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="bg-transparent text-secondary border-secondary hover:bg-secondary/20"
                  >
                    <a href={material.link} target="_blank" rel="noopener noreferrer">
                      Access
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <CardDescription className="text-sm text-center mt-4">
            (Uploading and managing these materials would require backend storage like Firebase Storage or Vercel Blob.)
          </CardDescription>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" /> Track Your Progress
          </h3>
          <Card className="text-center p-4 bg-card border-border">
            <p className="text-lg font-semibold text-foreground mb-2">Overall Progress: {progress}%</p>
            <Progress value={progress} className="w-full h-3 bg-muted" indicatorClassName="bg-primary" />
            <p className="text-muted-foreground text-sm mt-4">
              (This feature would involve tracking completed modules or sessions, requiring user authentication and
              database integration.)
            </p>
          </Card>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Sign-up for Sessions
          </h3>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-signup">Your Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="Enter your email to sign up"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Sign Up for Session
                </Button>
              </form>
              <CardDescription className="text-sm text-center mt-4">
                (Session sign-ups would typically involve a backend to manage registrations and send confirmations.)
              </CardDescription>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
