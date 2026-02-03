# Reverse Marketplace

A **B2B rewards** prototype: when a user on a rewards platform looks for something specific (often premium) that the fixed catalog doesn't offer, they can submit a **Smart Request**. The platform pushes that request to a **vendor network** to bid. Once a bid is **approved**, the customer is notified to complete the purchase, acting as a **targeted online commerce concierge**.

**Problem & opportunity**  
Rewards platforms usually offer a fixed catalog. Users who want something specific or premium that isn't listed have no path to get it. That's a missed opportunity to capture demand and build loyalty. Reverse Marketplace gives them a **Smart Request** path so the platform can take the ask to vendors, get bids, and fulfill that demand.

**[Live prototype (Vercel)](https://v0-smart-request-bulk-buy.vercel.app/). Working application built with v0 and deployed on Vercel.

> This repo is not connected to the live deployment above, but it contains the complete setup and latest code of the prototype that was built on v0.

---

## Table of contents

- [What this is](#what-this-is)
- [Problem & opportunity](#problem--opportunity)
- [How to use the prototype](#how-to-use-the-prototype)
- [Product in one sentence](#product-in-one-sentence)
- [Product flow](#product-flow)
- [How it works](#how-it-works)
- [User flows](#user-flows)
- [Business value](#business-value)
- [Catalog vs Smart Request](#catalog-vs-smart-request)
- [Tech stack & build](#tech-stack--build)
- [Future / improvement scope](#future--improvement-scope)

---

## What this is

| | |
| --- | --- |
| **Product name** | Reverse Marketplace |
| **Repo** | [OrangeAKA/reverseMarketplace_](https://github.com/OrangeAKA/reverseMarketplace_) |
| **Live prototype** | [v0-smart-request-bulk-buy.vercel.app](https://v0-smart-request-bulk-buy.vercel.app/). Working app built with v0, deployed on Vercel. |
| **What it is** | A **functional prototype** of a full product in development. This was a **personal prototype** built to **present the business case**. |
| **How it was built** | Prototyped with **v0**, deployed on **Vercel**. Code is on **GitHub** for public visibility. Anyone can explore it. This repo is not connected to the live deployment but has the complete setup and latest code of the prototype. |

---

## Problem & opportunity

Rewards platforms typically run on a **curated, fixed catalog**. A segment of users looks for **specific or premium items** (e.g. a particular watch or device) that the catalog doesn't carry. Today they have no way to ask. The program misses that demand and the chance to build loyalty and earn commission. Reverse Marketplace adds a **Smart Request** path: the customer describes what they want, the platform pushes it to the vendor network for bids, and the program can fulfill that request once a bid is accepted.

---

## How to use the prototype

> **Use the tabs at the top of the [live app](https://v0-smart-request-bulk-buy.vercel.app/) to switch between four interfaces.** Each tab is a different user role. Follow the flow below to see the full journey.

**When does Smart Request show up?**  
In the **Customer Interface**, Smart Request is the path when what the customer wants **isn't in the fixed catalog**. From the customer home, use **Create Smart Request** to submit a request (or go via catalog/search when the item isn't found). The prototype currently offers Create Smart Request from the home page; in a full product this would also appear when catalog search returns no match.


| Tab | Role | What to do |
| --- | --- | --- |
| **Customer Interface** | Reward member | Home has links to **Create Smart Request**, **Browse Rewards Catalog**, and **My Requests**. Create a Smart Request (what, quantity, budget, date); AI pre-fills from your text. Track status in My Requests. |
| **Seller Portal** | Vendor | **Open Requests**: requests in Bidding. Open one and **Submit Bid** (price, quantity, delivery, optional tiered pricing). **My Bids**: Pending and Awarded. |
| **Procurement Dashboard** | Platform / buyer | See requests and bids. **Accept** a bid to move the request to payment and purchase order. |
| **ERP Simulation** | Operations | View **purchase orders** and **inventory** (mock). Outcome of accepted bids. |

**Quick path to try the flow:** Customer (Create Smart Request) → Seller (Submit Bid on that request) → Procurement (Accept the bid) → ERP (See the PO and inventory).

---

## Product in one sentence

**Reverse Marketplace** is a B2B rewards concept where, on a rewards platform with a **curated (fixed) catalog**, users who want something **specific and often premium** that the catalog doesn't offer can submit a **Smart Request**. The platform pushes that request to a **vendor network** to **bid**. Once a bid is **approved**, the **customer is notified** to complete the purchase, acting as a **targeted online commerce concierge**.

---

## Product flow

The flow below shows how a customer moves from search or browse to purchase: either via the fixed catalog or, when the catalog can't cater, via Smart Request and vendor bids. When you view this file on GitHub, the diagram renders as an image.

```mermaid
flowchart TD
  Start[Customer searches or browses] --> InCatalog{In catalog?}
  InCatalog -->|Yes| Complete[Customer completes transaction with points and/or cash]
  InCatalog -->|No| SmartReq[Create Smart Request]
  SmartReq --> AI[AI pre-fills intent]
  AI --> Bidding[Request in Bidding]
  Bidding --> Vendors[Vendors submit bids]
  Vendors --> Accept[Platform accepts a bid]
  Accept --> Notify[Customer notified]
  Notify --> Purchase[Customer completes purchase with points and/or cash]
```

---

## How it works

1. **Customer** browses the fixed rewards catalog or searches for something specific.
2. If the **catalog can't cater** to the search, the customer can create a **Smart Request** (natural language or structured: what, quantity, budget, required-by). **AI** (Groq/Llama) parses intent and suggests category, product name, description, quantity, budget, date, and search terms; product recommendations can pre-fill the form.
3. The request enters **bidding**. **Vendors** see open requests and submit **bids** (price, quantity, delivery date, notes, optional tiered pricing).
4. **Procurement / platform** reviews bids and **accepts** one. Request moves to payment, then to **purchase order** and fulfillment.
5. **Customer** is **notified** when an approved bid is ready and completes the purchase (e.g. with reward points and/or cash via preferred payment instrument).

**Request lifecycle:**  
`Draft → Submitted → Bidding → Awarded → Payment Pending → Fulfilled` (or `Cancelled`).  
**Bids:** `Pending → Accepted | Rejected | Expired | Cancelled`. Commission and bid management are reflected in the codebase.

---

## User flows

### Customer (reward member)

- **Rewards catalog**: Browse the fixed, curated catalog and complete the purchase with points and/or cash (e.g. preferred payment instrument).
- **Smart Request** (when catalog can't cater): Submit what they want. AI helps pre-fill. Optional **bulk buy** (organizer + participants).
- **My Requests**: Track status and get notified when a vendor bid is approved so they can complete the purchase.

### Vendor (seller)

- **Open requests**: See requests in Bidding.
- **Submit bid**: Price, quantity, estimated delivery, notes, optional tiered pricing.
- **My bids**: Track Pending and Awarded bids.

### Procurement / operations

- Manage requests, compare bids, **accept** a bid, and drive the flow to payment and **purchase order**.
- Optional **ERP** view: purchase orders and inventory (mock in prototype).

---

## Business value

**Primary use case: B2B rewards.** The rewards platform has a **curated set of products** (not a full e-commerce store). A segment of users looks for **premium or very specific high-value products** (e.g. beyond the listed catalog, such as specific luxury items). The business can serve these by checking with vendors; today, a **prescribed list** based on market and customer interest means a **missed opportunity** to capture "I want X specifically" and build loyalty. Reverse Marketplace addresses that.

**For rewards program operators (e.g. banks, employers)**

- **Differentiation**: Offer a "get what you want" path via Smart Request alongside the fixed catalog.
- **Loyalty**: Capture high-intent, premium requests → more relevant redemptions and stronger perception of the program.
- **Revenue**: Commission when vendors bid and win; the platform facilitates the match.

**For buyers (reward members)**

- **Fit**: Request exactly what they want (product, quantity, budget, date).
- **Ease**: Natural language + AI pre-fill + product recommendations.
- **Concierge**: Their ask is pushed to the vendor network; they're notified when an approved bid is ready for purchase.

**For vendors**

- **Qualified demand**: See and bid only on relevant requests (RFQ-style).
- **Pricing**: Tiered pricing and notes; compete on price and delivery.

**For procurement / operations**

- **Control**: Single place to see requests, compare bids, accept, and drive to PO.
- **Traceability**: Request → winning bid → PO; optional ERP/inventory view.

---

## Catalog vs Smart Request

| | |
| --- | --- |
| **Rewards catalog** | **Fixed**. Curated products. User browses and completes purchase with points and/or cash. |
| **When Smart Request appears** | When the user searches for something **specific** and the **catalog cannot cater** to it. |
| **Current prototype** | Smart Request is offered for **any query** as long as the product is not found in the catalog. |
| **Intended (future)** | Gate Smart Request on **contextual analysis** so it opens only for **high-value, vendor-feasible** requests (e.g. the vendor network can fulfill it), enabling healthy commission and avoiding low-value or unfeasible requests. |

---

## Tech stack & build

- **Stack**: Next.js 15, React 19, Tailwind CSS, Radix UI / shadcn, Vercel AI SDK, Groq (Llama).
- **Data**: In-memory mock (requests, bids, POs, inventory) in the prototype. No persistence or real backend yet.
- **Product data**: Rich mock catalog (electronics, office, furniture, IT) with specs, used for recommendations and pre-fill.
- **Build & deploy**: Prototyped with **v0**, deployed on **Vercel**. Source on **GitHub** for public visibility.

### AI and intent parsing

| | |
| --- | --- |
| **Groq** | [Groq](https://groq.com/) is used as the LLM inference API. It provides fast, low-latency inference for running the model that parses natural-language Smart Requests. |
| **Model** | Llama (e.g. `llama-3.1-8b-instant`) is used via Groq's API to analyze the user's free-text request and return structured fields: product category, product name, description, quantity, budget, required-by date, and search terms for product matching. |
| **Vercel AI SDK** | The app uses the Vercel AI SDK and `@ai-sdk/groq` to call Groq from server actions (e.g. `analyzeRequestIntent`), so the front end can send raw text and receive structured JSON for pre-filling the Smart Request form and driving product recommendations. |
| **Fallback** | If the Groq API call fails or the model output isn't valid JSON, the code falls back to regex and keyword-based extraction (e.g. quantity, budget, category, product name) so the flow still works without the LLM. |

---

## Future / improvement scope

- **Contextual gating of Smart Request**: Only offer Smart Request when contextual analysis shows the ask is **high-value and vendor-feasible** (e.g. vendor network can fulfill it), so the platform can earn healthy commission and avoid low-value or unfeasible requests. Today the prototype offers Smart Request for any query when the product isn't in the catalog.
- **Backend & persistence**: Replace in-memory mock with a real database and APIs.
- **Commission & bid rules**: Expand and productize commission and bid-management logic already reflected in the codebase.

---

Best viewed on GitHub.
