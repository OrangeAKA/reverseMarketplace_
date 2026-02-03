import type { SmartRequest, CreateRequestInput, SubmitBidInput } from "./types"
import { RequestStatus, BidStatus } from "./types"

// Mock data for demo purposes
let mockRequests: SmartRequest[] = [
  {
    id: "req_1234567890",
    customerId: "cust_1",
    customerInfo: {
      id: "cust_1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    description: "High-performance laptops for development team",
    quantity: 10,
    budget: 1200,
    requiredBy: "2023-12-15",
    status: RequestStatus.BIDDING,
    createdAt: "2023-11-01T10:00:00Z",
    updatedAt: "2023-11-01T10:00:00Z",
    biddingEndsAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    productInfo: {
      id: "prod_1",
      sku: "LPT-DEV-001",
      name: "Developer Laptop",
      description: "High-performance laptop for software development",
      price: 1299,
      category: "electronics",
    },
    bids: [
      {
        id: "bid_1",
        requestId: "req_1234567890",
        sellerId: "seller_1",
        sellerInfo: {
          id: "seller_1",
          name: "TechSupplier Inc.",
          email: "sales@techsupplier.com",
        },
        price: 1150,
        quantity: 10,
        estimatedDeliveryDate: "2023-12-10T00:00:00Z",
        expiresAt: "2023-11-15T00:00:00Z",
        status: BidStatus.PENDING,
        notes: "Includes 3-year warranty and on-site support",
        tieredPricing: [
          { minQuantity: 10, price: 1150 },
          { minQuantity: 20, price: 1100 },
          { minQuantity: 50, price: 1050 },
        ],
        createdAt: "2023-11-02T14:30:00Z",
        updatedAt: "2023-11-02T14:30:00Z",
      },
      {
        id: "bid_2",
        requestId: "req_1234567890",
        sellerId: "seller_2",
        sellerInfo: {
          id: "seller_2",
          name: "Enterprise Solutions",
          email: "bids@enterprisesolutions.com",
        },
        price: 1199,
        quantity: 10,
        estimatedDeliveryDate: "2023-12-05T00:00:00Z",
        expiresAt: "2023-11-15T00:00:00Z",
        status: BidStatus.PENDING,
        notes: "Expedited shipping included",
        createdAt: "2023-11-03T09:15:00Z",
        updatedAt: "2023-11-03T09:15:00Z",
      },
    ],
  },
  {
    id: "req_0987654321",
    customerId: "cust_1",
    customerInfo: {
      id: "cust_1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    description: "Office chairs for new headquarters",
    quantity: 50,
    budget: 200,
    requiredBy: "2023-12-30",
    status: RequestStatus.AWARDED,
    createdAt: "2023-10-15T08:00:00Z",
    updatedAt: "2023-10-25T14:30:00Z",
    productInfo: {
      id: "prod_2",
      sku: "CHR-OFF-002",
      name: "Ergonomic Office Chair",
      description: "Comfortable ergonomic chair for office use",
      price: 249,
      category: "furniture",
    },
    bids: [
      {
        id: "bid_3",
        requestId: "req_0987654321",
        sellerId: "seller_3",
        sellerInfo: {
          id: "seller_3",
          name: "Office Furnish Pro",
          email: "sales@officefurnish.com",
        },
        price: 189,
        quantity: 50,
        estimatedDeliveryDate: "2023-12-20T00:00:00Z",
        expiresAt: "2023-11-15T00:00:00Z",
        status: BidStatus.ACCEPTED,
        notes: "Includes assembly service",
        tieredPricing: [
          { minQuantity: 50, price: 189 },
          { minQuantity: 100, price: 179 },
        ],
        createdAt: "2023-10-18T11:20:00Z",
        updatedAt: "2023-10-25T14:30:00Z",
      },
    ],
  },
  {
    id: "req_5678901234",
    customerId: "cust_2",
    customerInfo: {
      id: "cust_2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    description: "Wireless keyboards and mice for the marketing team",
    quantity: 15,
    budget: 100,
    status: RequestStatus.FULFILLED,
    createdAt: "2023-10-05T09:30:00Z",
    updatedAt: "2023-10-20T16:45:00Z",
    productInfo: {
      id: "prod_3",
      sku: "KBM-WRL-003",
      name: "Wireless Keyboard and Mouse",
      description: "Wireless keyboard and mouse combo with long battery life",
      price: 89,
      category: "electronics",
    },
    bids: [
      {
        id: "bid_4",
        requestId: "req_5678901234",
        sellerId: "seller_1",
        sellerInfo: {
          id: "seller_1",
          name: "TechSupplier Inc.",
          email: "sales@techsupplier.com",
        },
        price: 85,
        quantity: 15,
        estimatedDeliveryDate: "2023-10-15T00:00:00Z",
        expiresAt: "2023-10-10T00:00:00Z",
        status: BidStatus.ACCEPTED,
        createdAt: "2023-10-06T10:15:00Z",
        updatedAt: "2023-10-07T11:30:00Z",
      },
    ],
    contestId: "hdfc",
  },
  {
    id: "req_2468013579",
    customerId: "cust_1",
    customerInfo: {
      id: "cust_1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    description: "27-inch 4K monitors for the design team",
    quantity: 8,
    budget: 450,
    requiredBy: "2023-12-01",
    status: RequestStatus.BIDDING,
    createdAt: "2023-11-05T14:20:00Z",
    updatedAt: "2023-11-05T14:20:00Z",
    biddingEndsAt: new Date(Date.now() + 40 * 60 * 1000).toISOString(), // 40 minutes from now
    productInfo: {
      id: "prod_4",
      sku: "MON-4K-004",
      name: "27-inch 4K Monitor",
      description: "Ultra HD 4K monitor with wide color gamut for professional use",
      price: 399,
      category: "electronics",
    },
    bids: [],
  },
  {
    id: "req_1357924680",
    customerId: "cust_3",
    customerInfo: {
      id: "cust_3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
    },
    description: "Standing desks for the engineering department",
    quantity: 12,
    budget: 600,
    requiredBy: "2023-12-20",
    status: RequestStatus.BIDDING,
    createdAt: "2023-11-08T09:45:00Z",
    updatedAt: "2023-11-08T09:45:00Z",
    biddingEndsAt: new Date(Date.now() + 35 * 60 * 1000).toISOString(), // 35 minutes from now
    productInfo: {
      id: "prod_5",
      sku: "DSK-STD-005",
      name: "Adjustable Standing Desk",
      description: "Electric height-adjustable standing desk with memory settings",
      price: 549,
      category: "furniture",
    },
    bids: [
      {
        id: "bid_5",
        requestId: "req_1357924680",
        sellerId: "seller_3",
        sellerInfo: {
          id: "seller_3",
          name: "Office Furnish Pro",
          email: "sales@officefurnish.com",
        },
        price: 520,
        quantity: 12,
        estimatedDeliveryDate: "2023-12-15T00:00:00Z",
        expiresAt: "2023-11-20T00:00:00Z",
        status: BidStatus.PENDING,
        notes: "Includes installation and cable management",
        createdAt: "2023-11-09T10:30:00Z",
        updatedAt: "2023-11-09T10:30:00Z",
      },
    ],
  },
  {
    id: "req_9876543210",
    customerId: "cust_2",
    customerInfo: {
      id: "cust_2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    description: "Noise-cancelling headphones for open office",
    quantity: 25,
    budget: 220,
    status: RequestStatus.BIDDING,
    createdAt: "2023-11-10T11:15:00Z",
    updatedAt: "2023-11-10T11:15:00Z",
    biddingEndsAt: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 minutes from now
    isBulkBuy: true,
    organizerName: "Jane Smith",
    organizerPhone: "555-123-4567",
    participants: [
      { email: "participant1@example.com", name: "Participant 1", status: "confirmed" },
      { email: "participant2@example.com", name: "Participant 2", status: "confirmed" },
      { email: "participant3@example.com", name: "Participant 3", status: "confirmed" },
      { email: "participant4@example.com", name: "Participant 4", status: "invited" },
      { email: "participant5@example.com", name: "Participant 5", status: "invited" },
    ],
    productInfo: {
      id: "prod_6",
      sku: "HPH-NC-006",
      name: "Wireless Headphones",
      description: "Noise-cancelling wireless headphones with 30-hour battery life",
      price: 199,
      category: "electronics",
    },
    bids: [
      {
        id: "bid_6",
        requestId: "req_9876543210",
        sellerId: "seller_1",
        sellerInfo: {
          id: "seller_1",
          name: "TechSupplier Inc.",
          email: "sales@techsupplier.com",
        },
        price: 185,
        quantity: 25,
        estimatedDeliveryDate: "2023-12-01T00:00:00Z",
        expiresAt: "2023-11-25T00:00:00Z",
        status: BidStatus.PENDING,
        tieredPricing: [
          { minQuantity: 25, price: 185 },
          { minQuantity: 50, price: 175 },
        ],
        createdAt: "2023-11-11T09:20:00Z",
        updatedAt: "2023-11-11T09:20:00Z",
      },
    ],
  },
]

// Mock purchase orders
const mockPurchaseOrders = [
  {
    id: "PO-123456",
    requestId: "req_5678901234",
    sellerId: "seller_1",
    sellerName: "TechSupplier Inc.",
    productId: "prod_3",
    productName: "Wireless Keyboard and Mouse",
    sku: "KBM-WRL-003",
    quantity: 15,
    unitPrice: 85,
    totalPrice: 1275,
    expectedDeliveryDate: "2023-10-15T00:00:00Z",
    status: "delivered",
    createdAt: "2023-10-07T11:30:00Z",
  },
]

// Mock inventory data
const mockInventory = [
  {
    id: "inv_1",
    sku: "LPT-DEV-001",
    name: "Developer Laptop",
    description: "High-performance laptop for software development",
    category: "electronics",
    quantity: 25,
    reserved: 10,
    available: 15,
    lastUpdated: "2023-11-01T10:00:00Z",
  },
  {
    id: "inv_2",
    sku: "CHR-OFF-002",
    name: "Ergonomic Office Chair",
    description: "Comfortable ergonomic chair for office use",
    category: "furniture",
    quantity: 100,
    reserved: 50,
    available: 50,
    lastUpdated: "2023-10-15T08:00:00Z",
  },
  {
    id: "inv_3",
    sku: "KBM-WRL-003",
    name: "Wireless Keyboard and Mouse",
    description: "Wireless keyboard and mouse combo with long battery life",
    category: "electronics",
    quantity: 50,
    reserved: 15,
    available: 35,
    lastUpdated: "2023-10-05T09:30:00Z",
  },
  {
    id: "inv_4",
    sku: "MON-4K-004",
    name: "27-inch 4K Monitor",
    description: "Ultra HD 4K monitor with wide color gamut for professional use",
    category: "electronics",
    quantity: 20,
    reserved: 8,
    available: 12,
    lastUpdated: "2023-11-05T14:20:00Z",
  },
  {
    id: "inv_5",
    sku: "DSK-STD-005",
    name: "Adjustable Standing Desk",
    description: "Electric height-adjustable standing desk with memory settings",
    category: "furniture",
    quantity: 30,
    reserved: 12,
    available: 18,
    lastUpdated: "2023-11-08T09:45:00Z",
  },
  {
    id: "inv_6",
    sku: "HPH-NC-006",
    name: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones with 30-hour battery life",
    category: "electronics",
    quantity: 40,
    reserved: 25,
    available: 15,
    lastUpdated: "2023-11-10T11:15:00Z",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// API functions
export async function fetchMyRequests(): Promise<SmartRequest[]> {
  await delay(800) // Simulate network delay
  return mockRequests.filter((req) => req.customerId === "cust_1")
}

export async function fetchOpenRequests(): Promise<SmartRequest[]> {
  await delay(800)
  return mockRequests.filter((req) => req.status === RequestStatus.BIDDING)
}

export async function fetchAllRequests(): Promise<SmartRequest[]> {
  await delay(800)
  return mockRequests
}

export async function fetchRequestDetails(requestId: string): Promise<SmartRequest | null> {
  await delay(600)
  const request = mockRequests.find((req) => req.id === requestId)
  return request || null
}

export async function createSmartRequest(input: CreateRequestInput): Promise<SmartRequest> {
  console.log("API: Creating smart request with input:", input)
  await delay(1000)

  // Create a new request with a simpler structure
  const newRequest: SmartRequest = {
    id: `req_${Math.random().toString(36).substring(2, 12)}`,
    customerId: "cust_1",
    customerInfo: {
      id: "cust_1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    description: input.description,
    quantity: input.quantity,
    budget: input.budget,
    requiredBy: input.requiredBy ? new Date(input.requiredBy).toISOString() : undefined,
    status: RequestStatus.BIDDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    biddingEndsAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    productInfo: {
      id: `prod_${Math.random().toString(36).substring(2, 10)}`,
      sku: `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      name: input.productName,
      description: input.description,
      price: input.budget || 0,
      category: input.productCategory,
    },
    bids: [],
    isBulkBuy: input.isBulkBuy,
    organizerName: input.organizerName,
    organizerPhone: input.organizerPhone,
    participants: input.participants,
  }

  // Add the new request to the mock data
  mockRequests = [newRequest, ...mockRequests]
  console.log("API: Created new request:", newRequest)
  return newRequest
}

export async function submitBid(input: SubmitBidInput): Promise<void> {
  await delay(800)

  const requestIndex = mockRequests.findIndex((req) => req.id === input.requestId)
  if (requestIndex === -1) throw new Error("Request not found")

  const request = mockRequests[requestIndex]
  if (request.status !== RequestStatus.BIDDING) throw new Error("Request is not in bidding state")

  const newBid = {
    id: `bid_${Math.random().toString(36).substring(2, 10)}`,
    requestId: input.requestId,
    sellerId: "seller_1", // Assuming current seller
    sellerInfo: {
      id: "seller_1",
      name: "TechSupplier Inc.",
      email: "sales@techsupplier.com",
    },
    price: input.price,
    quantity: input.quantity,
    estimatedDeliveryDate: input.estimatedDeliveryDate,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: BidStatus.PENDING,
    notes: input.notes,
    tieredPricing: input.tieredPricing,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!request.bids) {
    request.bids = []
  }

  request.bids.push(newBid)
  request.updatedAt = new Date().toISOString()

  // Update the request in the mock data
  mockRequests[requestIndex] = request
}

export async function acceptBid(requestId: string, bidId: string): Promise<void> {
  await delay(800)

  const requestIndex = mockRequests.findIndex((req) => req.id === requestId)
  if (requestIndex === -1) throw new Error("Request not found")

  const request = mockRequests[requestIndex]
  if (!request.bids) throw new Error("No bids found")

  const bidIndex = request.bids.findIndex((bid) => bid.id === bidId)
  if (bidIndex === -1) throw new Error("Bid not found")

  // Update the accepted bid
  request.bids[bidIndex].status = BidStatus.ACCEPTED

  // Reject all other bids
  request.bids.forEach((bid, index) => {
    if (index !== bidIndex) {
      bid.status = BidStatus.REJECTED
    }
  })

  // Update the request status to PAYMENT_PENDING instead of AWARDED
  request.status = RequestStatus.PAYMENT_PENDING
  request.updatedAt = new Date().toISOString()

  // Update the request in the mock data
  mockRequests[requestIndex] = request
}

export async function confirmPayment(requestId: string): Promise<void> {
  await delay(800)

  const requestIndex = mockRequests.findIndex((req) => req.id === requestId)
  if (requestIndex === -1) throw new Error("Request not found")

  const request = mockRequests[requestIndex]
  if (request.status !== RequestStatus.PAYMENT_PENDING) throw new Error("Request is not in payment pending state")

  // Update the request status
  request.status = RequestStatus.AWARDED
  request.paymentConfirmed = true
  request.updatedAt = new Date().toISOString()

  // Update the request in the mock data
  mockRequests[requestIndex] = request
}

export async function endBidding(requestId: string): Promise<void> {
  await delay(600)

  const requestIndex = mockRequests.findIndex((req) => req.id === requestId)
  if (requestIndex === -1) throw new Error("Request not found")

  const request = mockRequests[requestIndex]
  if (request.status !== RequestStatus.BIDDING) throw new Error("Request is not in bidding state")

  // End the bidding by setting the bidding end time to now
  request.biddingEndsAt = new Date().toISOString()
  request.updatedAt = new Date().toISOString()

  // Update the request in the mock data
  mockRequests[requestIndex] = request
}

export async function createPurchaseOrder(requestId: string, bidId: string, contestId: string): Promise<void> {
  await delay(1000)

  const requestIndex = mockRequests.findIndex((req) => req.id === requestId)
  if (requestIndex === -1) throw new Error("Request not found")

  const request = mockRequests[requestIndex]
  if (request.status !== RequestStatus.AWARDED) throw new Error("Request is not in awarded state")

  // Check if payment is confirmed
  if (!request.paymentConfirmed) throw new Error("Payment has not been confirmed")

  const acceptedBid = request.bids?.find((bid) => bid.id === bidId && bid.status === BidStatus.ACCEPTED)
  if (!acceptedBid) throw new Error("Accepted bid not found")

  // Create a new purchase order
  const newPO = {
    id: `PO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    requestId: requestId,
    sellerId: acceptedBid.sellerId,
    sellerName: acceptedBid.sellerInfo?.name || "Unknown Supplier",
    productId: request.productInfo?.id || "",
    productName: request.productInfo?.name || request.description,
    sku: request.productInfo?.sku || `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    quantity: acceptedBid.quantity,
    unitPrice: acceptedBid.price,
    totalPrice: acceptedBid.price * acceptedBid.quantity,
    expectedDeliveryDate: acceptedBid.estimatedDeliveryDate,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  // Add the purchase order to the mock data
  mockPurchaseOrders.push(newPO)

  // Update the request status and contest ID
  request.status = RequestStatus.FULFILLED
  request.contestId = contestId
  request.updatedAt = new Date().toISOString()

  // Update the request in the mock data
  mockRequests[requestIndex] = request
}

export async function fetchPurchaseOrders(): Promise<any[]> {
  await delay(700)
  return mockPurchaseOrders
}

export async function fetchInventory(): Promise<any[]> {
  await delay(700)
  return mockInventory
}
