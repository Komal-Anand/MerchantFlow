# MerchantFlow

### Connect intent. Drive growth.

MerchantFlow is an AI-powered commerce experience designed to help shoppers discover the right products faster, make confident buying decisions, and complete checkout in a smooth, guided flow.

It combines intelligent product discovery, a personalized shopping assistant, and conversion-focused commerce UX into one streamlined storefront.

## Live Demo

Visit the app here: [merchant-flow-woad.vercel.app](https://merchant-flow-woad.vercel.app)

## Why MerchantFlow

- AI-powered shopping assistant for natural-language discovery
- Fast browsing across curated product categories and recommendations
- Product detail experience with quick add-to-cart actions
- Cart and checkout flow with Razorpay-ready payment integration
- Order tracking and confirmation views for a complete customer journey
- Growth dashboard with revenue, customer intent, and cross-sell insights
- Responsive design built for desktop and mobile shopping experiences

## Key Features

### Smart Product Discovery
Users can explore products using browsing, search, and AI recommendations that surface relevant items based on intent.

### Conversational Assistant
The assistant helps shoppers ask questions, compare options, and find products aligned with their needs.

### Conversion-Focused Experience
From product cards to cart and checkout, the flow is designed to reduce friction and improve purchase confidence.

### Business Intelligence View
The growth dashboard provides useful metrics and insights to better understand performance, customer behavior, and revenue opportunities.

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) with App Router
- [React](https://react.dev/)
- [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)
- Responsive storefront UI and interactive shopping flow

### Backend
- API routes under the App Router for assistant and checkout logic
- [Gemini API](https://ai.google.dev/) for AI-powered recommendations
- [Razorpay API](https://razorpay.com/) for payment support
- Server-side handling for product and order related operations
- [Vercel](https://vercel.com/) for deployment

## Getting Started

Requirements:

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the project root and add the following values when needed:

```env
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Notes:

- Keep `.env.local` private and never commit it to Git.
- If `GEMINI_API_KEY` is missing, the assistant falls back to local catalog behavior.
- If Razorpay keys are not configured, checkout can remain in demo mode.

## Project Structure

```text
app/          Main pages and API routes
components/   Reusable UI components
context/      Cart and app-level state management
lib/          Product data, catalog logic, and assistant services
public/       Static assets and product images
```

## Production Build

```bash
npm run build
npm run start
```

## Repository

- GitHub: [Komal-Anand/MerchantFlow](https://github.com/Komal-Anand/MerchantFlow)
