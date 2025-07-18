import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export function SowingSeed() {
  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">
            Sowing a Seed (Tithes & Offering)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg text-muted-foreground">
            Thank you for your faithfulness in giving. Your tithes and offerings enable us to continue the work of God's
            kingdom.
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="font-semibold text-xl text-foreground">Scan to Give:</p>
            <Image
              src="/placeholder.svg?height=250&width=250"
              width={250}
              height={250}
              alt="QR Code for Giving"
              className="rounded-lg border border-border p-2 bg-card"
            />
            <CardDescription className="text-sm">
              (Replace this placeholder with your actual giving QR code image.)
            </CardDescription>
          </div>
          <p className="text-muted-foreground text-sm">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion,
            for God loves a cheerful giver." - 2 Corinthians 9:7
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
