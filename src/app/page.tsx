import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Package, ShoppingCart, TrendingUp } from "lucide-react"
import RewardsHeader from "@/components/rewards/rewards-header"

export default function Home() {
  return (
    <div className="space-y-8">
      <RewardsHeader />

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">R360 Rewards</h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Get what you're looking for with Smart Request. And yes, you can use your reward points!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/create-request">
                  <Button size="lg" className="gap-1">
                    Create Smart Request <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/rewards-catalog">
                  <Button size="lg" variant="outline" className="gap-1">
                    Browse Rewards Catalog <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <img
              alt="Two friends laughing together while shopping online with a tablet and gift"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg border"
              src="/friends-shopping-together.png"
            />
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform helps you get exactly what you need using your reward points.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <ShoppingCart className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">1. Submit Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tell us what you're looking for, how many you need, and when you need it by.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">2. We Find the Best Deal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our team works with trusted suppliers to get you the best possible price.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Package className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">3. Confirm & Receive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Confirm your order using your reward points and receive your items at your doorstep.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
