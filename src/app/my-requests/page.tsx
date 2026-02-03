"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type SmartRequest, RequestStatus } from "@/lib/types"
import { fetchMyRequests } from "@/lib/api"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Loader2, Users } from "lucide-react"
import CustomerHeader from "@/components/customer/customer-header"

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<SmartRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchMyRequests()
        setRequests(data)
      } catch (error) {
        console.error("Failed to load requests:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [])

  const activeRequests = requests.filter((req) => [RequestStatus.SUBMITTED, RequestStatus.BIDDING].includes(req.status))

  const completedRequests = requests.filter((req) =>
    [RequestStatus.AWARDED, RequestStatus.FULFILLED].includes(req.status),
  )

  const getStatusBadgeVariant = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.DRAFT:
        return "secondary"
      case RequestStatus.SUBMITTED:
        return "outline"
      case RequestStatus.BIDDING:
        return "default"
      case RequestStatus.AWARDED:
        return "success"
      case RequestStatus.FULFILLED:
        return "success"
      case RequestStatus.CANCELLED:
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CustomerHeader />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Requests</h1>
        <div className="flex gap-2">
          <Link href="/create-request">
            <Button>Create Smart Request</Button>
          </Link>
          <Link href="/create-request?mode=bulk">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-1" /> Create Bulk Buy
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeRequests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">You don't have any active requests.</p>
                <Link href="/create-request" className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    Create Your First Request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            activeRequests.map((request) => <RequestCard key={request.id} request={request} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">You don't have any completed requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            completedRequests.map((request) => <RequestCard key={request.id} request={request} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">You haven't created any requests yet.</p>
                <Link href="/create-request" className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    Create Your First Request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => <RequestCard key={request.id} request={request} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RequestCard({ request }: { request: SmartRequest }) {
  const statusBadgeVariant =
    request.status === RequestStatus.BIDDING
      ? "default"
      : request.status === RequestStatus.AWARDED
        ? "success"
        : request.status === RequestStatus.CANCELLED
          ? "destructive"
          : "outline"

  return (
    <Link href={`/my-requests/${request.id}`}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {request.productInfo?.name || request.description.substring(0, 30)}
                {request.isBulkBuy && (
                  <Badge variant="outline" className="ml-2">
                    <Users className="h-3 w-3 mr-1" /> Bulk Buy
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Request #{request.id.substring(0, 8)} • {request.quantity} units
              </CardDescription>
            </div>
            <Badge variant={statusBadgeVariant as any}>{request.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground line-clamp-2 mb-2">{request.description}</div>
          <div className="flex justify-between text-sm">
            <span>Status: {getRequestStatusText(request.status)}</span>
            <span>Created {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function getRequestStatusText(status: RequestStatus): string {
  switch (status) {
    case RequestStatus.DRAFT:
      return "Draft"
    case RequestStatus.SUBMITTED:
      return "Submitted"
    case RequestStatus.BIDDING:
      return "Awaiting bids"
    case RequestStatus.PAYMENT_PENDING:
      return "Payment required"
    case RequestStatus.AWARDED:
      return "Payment confirmed"
    case RequestStatus.FULFILLED:
      return "Order fulfilled"
    case RequestStatus.CANCELLED:
      return "Cancelled"
    default:
      return "Unknown"
  }
}
