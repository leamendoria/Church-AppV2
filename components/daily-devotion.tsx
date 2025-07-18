"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayCircle, Share2, Loader2, ChevronLeft, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast" // Assuming you have useToast hook
import { Merriweather } from 'next/font/google';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Define the structure of a daily devotion item, including new Tagalog fields
interface DevotionEntry {
  id: string
  published_date: string
  word_verse: string
  word_text: string
  devotion_title: string
  devotion_content: string
  audio_url?: string | null
  tagalog_word_text?: string | null
  tagalog_devotion_content?: string | null
}

// Map of Psalm chapters to NLT and MBB text (add more as needed)
const PSALMS_CHAPTERS: { [key: number]: { nlt: string; mbb: string } } = {
  67: {
    nlt: `1 May God be merciful and bless us. May his face smile with favor on us.
2 May your ways be known throughout the earth, your saving power among people everywhere.
3 May the nations praise you, O God. Yes, may all the nations praise you.
4 Let the whole world sing for joy, because you govern the nations with justice and guide the people of the whole world.
5 May the nations praise you, O God. Yes, may all the nations praise you.
6 Then the earth will yield its harvests, and God, our God, will richly bless us.
7 Yes, God will bless us, and people all over the world will fear him.`,
    mbb: `1 Pagpalain nawa tayo ng Diyos at kaawaan, at ang kanyang mukha ay lumiwanag sa atin.
2 Upang makilala sa lupa ang iyong daan, ang iyong pagliligtas sa lahat ng bansa.
3 Purihin ka ng mga bayan, O Diyos; purihin ka ng lahat ng mga bayan.
4 Magalak at umawit ng kagalakan ang mga bansa, sapagkat hinahatulan mo ang mga tao ng katuwiran, at pinapatnubayan mo ang mga bansa sa lupa.
5 Purihin ka ng mga bayan, O Diyos; purihin ka ng lahat ng mga bayan.
6 Ang lupa ay nagbigay ng kanyang bunga; pagpalain nawa tayo ng Diyos, ng ating Diyos.
7 Pagpalain nawa tayo ng Diyos, at matakot sa kanya ang lahat ng dulo ng lupa.`
  },
  68: {
    nlt: `1 Rise up, O God, and scatter your enemies. Let those who hate God run for their lives...
(Full text of Psalm 68 NLT here)`,
    mbb: `1 Bumangon ka, O Diyos, at pangalatin mo ang iyong mga kaaway...
(Buong teksto ng Awit 68 MBB dito)`
  },
  // Add more chapters as needed
};

function getPsalmChapterForToday() {
  // Start at Psalm 67 on July 18, 2025
  const startDate = new Date(2025, 6, 18); // July is month 6 (0-indexed)
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const chapter = 67 + diffDays;
  return chapter;
}

export function DailyDevotion() {
  const [todayDevotion, setTodayDevotion] = useState<DevotionEntry | null>(null)
  const [recentDevotions, setRecentDevotions] = useState<DevotionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [showChapter, setShowChapter] = useState(false)
  const [reflection, setReflection] = useState("")
  const [chapter, setChapter] = useState(getPsalmChapterForToday())

  // Optionally, update chapter if date changes
  useEffect(() => {
    const interval = setInterval(() => {
      setChapter(getPsalmChapterForToday())
    }, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval)
  }, [])

  // Get devotion data for the current chapter
  const psalm = PSALMS_CHAPTERS[chapter] || PSALMS_CHAPTERS[67];
  const devotionTitle = `Psalm ${chapter}`;
  const devotionContent = `Reflect on Psalm ${chapter} today. How does this chapter speak to your life?`;
  const wordVerse = `Psalm ${chapter}`;
  const wordText = psalm.nlt.split('\n')[0]; // First verse as the "word"
  const tagalogWordText = psalm.mbb.split('\n')[0];

  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchDevotions = async () => {
      setLoading(true)
      setError(null)
      try {
        const todayDate = new Date()
        const year = todayDate.getFullYear()
        const month = String(todayDate.getMonth() + 1).padStart(2, "0")
        const day = String(todayDate.getDate()).padStart(2, "0")
        const todayFormatted = `${year}-${month}-${day}`

        console.log("App is looking for date:", todayFormatted)

        // Fetch today's devotion
        const { data: todayData, error: todayError } = await supabase
          .from("daily_devotions")
          .select("*") // Select all columns now, including new Tagalog ones
          .eq("published_date", todayFormatted)
          .single()

        if (todayError && todayError.code !== "PGRST116") {
          throw todayError
        }
        setTodayDevotion(todayData as DevotionEntry | null)

        // Fetch recent devotions (excluding today's, ordered by date)
        const { data: recentData, error: recentError } = await supabase
          .from("daily_devotions")
          .select("id, published_date, word_verse, devotion_title") // Only fetch necessary fields for recent list
          .neq("published_date", todayFormatted) // Exclude today's devotion
          .order("published_date", { ascending: false }) // Most recent first
          .limit(3) // Get 3 recent ones

        if (recentError) {
          throw recentError
        }
        setRecentDevotions(recentData as DevotionEntry[] || [])
      } catch (err: any) {
        console.error("Error fetching daily devotion:", err)
        setError("Failed to load devotions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDevotions()
  }, [supabase])

  const handleShare = () => {
    if (navigator.share && todayDevotion) {
      navigator
        .share({
          title: todayDevotion.devotion_title,
          text: `Daily Word: ${todayDevotion.word_verse} - "${todayDevotion.word_text}"\n\nRead more:`, // You might want to link to the app's specific devotion page
          url: window.location.href,
        })
        .then(() => toast({ title: "Shared!", description: "Daily Word shared successfully." }))
        .catch((error) =>
          toast({ title: "Share Failed", description: `Error sharing: ${error.message}`, variant: "destructive" }),
        )
    } else {
      toast({ title: "Share Not Supported", description: "Your browser does not support the Web Share API." })
    }
  }

  const handleGenerateDevotion = async () => {
    setGenerating(true)
    setError(null)
    
    try {
      // First, generate the devotion using OpenAI
      const generateResponse = await fetch('/api/generate-devotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verse: 'Psalms 67' }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate devotion')
      }

      const devotionData = await generateResponse.json()

      // Try to save it to the database, but don't fail if it doesn't work
      try {
        const saveResponse = await fetch('/api/save-devotion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(devotionData),
        })

        if (saveResponse.ok) {
          const savedDevotion = await saveResponse.json()
          setTodayDevotion(savedDevotion)
          toast({ 
            title: "Success!", 
            description: "Today's word has been generated and saved." 
          })
        } else {
          // If save fails, still show the generated content
          setTodayDevotion(devotionData)
          toast({ 
            title: "Generated!", 
            description: "Today's word has been generated (not saved to database)." 
          })
        }
      } catch (saveError) {
        // If save fails, still show the generated content
        setTodayDevotion(devotionData)
        toast({ 
          title: "Generated!", 
          description: "Today's word has been generated (not saved to database)." 
        })
      }

    } catch (err: any) {
      console.error('Error generating devotion:', err)
      setError(err.message || 'Failed to generate devotion')
      toast({ 
        title: "Error", 
        description: "Failed to generate today's word. Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setGenerating(false)
    }
  }

  const todayFormattedDisplay = todayDevotion
    ? new Date(todayDevotion.published_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : ""

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen-minus-header-footer">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading daily word and devotions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen-minus-header-footer text-destructive">
        <p className="font-semibold text-xl">Error Loading Content</p>
        <p className="text-center mt-2">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl md:text-4xl">📖</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Daily Word</h1>
        </div>
        <div className="text-muted-foreground text-lg font-medium flex items-center gap-2">
          <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="hidden md:inline">|</span>
          <span className="italic text-primary/80 hidden md:inline">“Let the Word dwell in you richly”</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Left: Devotion Content */}
        <div className="space-y-8 flex flex-col h-full">
          {/* Today’s Word Card */}
          <Card className="bg-gradient-to-br from-blue-100 to-purple-50 border-primary/20 shadow-lg rounded-2xl flex-1 min-h-[220px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <span role="img" aria-label="sparkles">✨</span> Today’s Word
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">Psalm {chapter}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <blockquote className="text-xl md:text-2xl italic text-center text-primary font-medium mb-2">“{wordText}”</blockquote>
            </CardContent>
          </Card>

          {/* Tabs for English/Tagalog */}
          <Tabs defaultValue="english" className="w-full mt-4 flex-1">
            <TabsList className="w-full flex rounded-full bg-secondary/30 mb-4">
              <TabsTrigger value="english" className="flex-1 rounded-full">English (NLT)</TabsTrigger>
              <TabsTrigger value="tagalog" className="flex-1 rounded-full">Tagalog (MBB)</TabsTrigger>
            </TabsList>
            <TabsContent value="english" className="mt-2">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{devotionTitle}</h3>
                <p className="text-muted-foreground mb-2">{devotionContent}</p>
                <h4 className="font-bold mt-4">Full Verse: Psalm {chapter}</h4>
                <p>{wordText}</p>
                {/* Collapsible Full Chapter */}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowChapter((v) => !v)}
                >
                  {showChapter ? "Hide Full Chapter" : "Show Full Chapter"}
                </Button>
                {showChapter && (
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-100 border border-blue-200 rounded-2xl shadow-md mt-4">
                    <CardContent className="p-0">
                      <pre className={`whitespace-pre-wrap text-base p-4 rounded-2xl font-chapter leading-relaxed pl-8 relative verse-gutter ${merriweather.className} bg-transparent border-0`}> 
                        {psalm.nlt}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tagalog" className="mt-2">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{devotionTitle}</h3>
                <p className="text-muted-foreground mb-2">{devotionContent}</p>
                <h4 className="font-bold mt-4">Buong Talata: Awit {chapter}</h4>
                <p>{tagalogWordText}</p>
                {/* Collapsible Full Chapter */}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowChapter((v) => !v)}
                >
                  {showChapter ? "Itago ang Buong Kabanata" : "Ipakita ang Buong Kabanata"}
                </Button>
                {showChapter && (
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-100 border border-blue-200 rounded-2xl shadow-md mt-4">
                    <CardContent className="p-0">
                      <pre className={`whitespace-pre-wrap text-base p-4 rounded-2xl font-chapter leading-relaxed pl-8 relative verse-gutter ${merriweather.className} bg-transparent border-0`}> 
                        {psalm.mbb}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Trivia for this Chapter */}
          <Card className="bg-yellow-50 border-yellow-200 rounded-xl mt-6 flex-1 min-h-[220px]">
            <CardHeader>
              <CardTitle className="text-yellow-700 font-bold flex items-center gap-2">
                <span role="img" aria-label="bulb">💡</span> Trivia for Psalm {chapter}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-yellow-900 text-[15px] space-y-2">
                {chapter === 67 && (
                  <>
                    <li>Psalm 67 is often called the "Missionary Psalm" because it prays for God’s blessing on Israel so that all nations may know and praise Him.</li>
                    <li>It is sometimes sung during Jewish harvest festivals and is known for its repeated refrain: "May the nations praise you, O God."</li>
                    <li>The structure of Psalm 67 is symmetrical, with the central verse (v.4) as the focus: God’s just rule over all nations.</li>
                  </>
                )}
                {/* Add more trivia for other chapters as needed */}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-8 flex flex-col h-full">
          {/* Devotion Image - Larger and Proportional */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Devotion Inspiration"
              className="rounded-2xl shadow-lg object-cover w-full max-w-md h-64"
              style={{ minHeight: '220px', maxHeight: '260px' }}
            />
          </div>
          {/* Instruction Section */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-100 border border-blue-200 rounded-2xl shadow-md p-6">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <span role="img" aria-label="lightbulb">💡</span> How to Use This Devotion
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-4 mt-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">🙏</span>
                  <span><b>Start with Prayer:</b> Take a moment to invite God to speak to your heart today.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">📖</span>
                  <span><b>Read &amp; Reflect:</b> Go through the devotion and the full chapter in your preferred language. Let the words sink in.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">💭</span>
                  <span><b>Personalize:</b> Think about how the message applies to your life right now. What is God saying to you?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">📝</span>
                  <span><b>Pray &amp; Respond:</b> Talk to God about what you’ve learned. Ask for strength and guidance to live it out.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">🎵</span>
                  <span><b>Worship:</b> (Optional) Play the worship song below and let it inspire your praise and meditation.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          {/* Worship Song Recommendation - Larger */}
          <Card className="bg-primary/5 border-primary/20 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                <span role="img" aria-label="music">🎶</span> Worship Song Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="mb-2 px-6 pt-4 text-muted-foreground">Let this song help you worship and reflect on today’s Word:</p>
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/0YUGwUgBvTU"
                  title="The Blessing - Worship Song"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ borderRadius: '1rem' }}
                ></iframe>
              </div>
              <div className="text-sm text-muted-foreground px-6 pb-4">"The Blessing" by Kari Jobe, Cody Carnes, Elevation Worship</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
