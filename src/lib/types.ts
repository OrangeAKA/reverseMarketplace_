export enum RequestStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  BIDDING = "BIDDING",
  AWARDED = "AWARDED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  FULFILLED = "FULFILLED",
  CANCELLED = "CANCELLED",
}

export enum BidStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export interface Customer {
  id: string
  name: string
  email: string
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
}

export interface Seller {
  id: string
  name: string
  email: string
}

export interface TieredPricing {
  minQuantity: number
  price: number
}

export interface Participant {
  email: string
  name?: string
  status?: "invited" | "confirmed" | "declined"
}

export interface Bid {
  id: string
  requestId: string
  sellerId: string
  sellerInfo?: Seller
  price: number
  quantity: number
  estimatedDeliveryDate: string
  expiresAt: string
  status: BidStatus
  notes?: string
  tieredPricing?: TieredPricing[]
  createdAt: string
  updatedAt: string
}

export interface SmartRequest {
  id: string
  customerId: string
  customerInfo?: Customer
  productId?: string
  productInfo?: Product
  description: string
  quantity: number
  budget?: number
  requiredBy?: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
  biddingEndsAt?: string
  paymentAuthId?: string
  paymentConfirmed?: boolean
  bids?: Bid[]
  isBulkBuy?: boolean
  organizerName?: string
  organizerPhone?: string
  participants?: Participant[]
  contestId?: string
}

export interface CreateRequestInput {
  productCategory: string
  productName: string
  description: string
  quantity: number
  budget?: number
  requiredBy?: Date
  acceptAlternatives: boolean
  authorizePayment: boolean
  isBulkBuy?: boolean
  organizerName?: string
  organizerPhone?: string
  participants?: Participant[]
}

export interface SubmitBidInput {
  requestId: string
  price: number
  quantity: number
  estimatedDeliveryDate: string
  notes?: string
  tieredPricing?: TieredPricing[]
}
