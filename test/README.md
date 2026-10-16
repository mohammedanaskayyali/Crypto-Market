---

---

# 🚀 Crypto Market Intelligence Dashboard

> **NMO Business | Senior Frontend Developer Challenge**  
> A production-grade, real-time cryptocurrency intelligence and analytics dashboard built using **Next.js (App Router)**, **TypeScript**, **Redux Toolkit**, **Tailwind CSS**, and **Framer Motion**.

---

## 🔗 Live URL & Repository

* **Live Application:** [https://crypto-market-kappa.vercel.app](https://crypto-market-kappa.vercel.app) 
* **GitHub Repository:** [https://github.com/mohammedanaskayyali/Crypto-Market](https://github.com/mohammedanaskayyali/Crypto-Market) 

---

## 📐 Architecture & Data Flow


```

+-----------------------------------------------------------------------------------+
|                                 NEXT.JS APP ROUTER                                |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  |     Market Overview    |  |     Asset Details      |  |      Watchlist      |  |
|  |          (/)           |  |      (/market/[id])    |  |     (/watchlist)    |  |
|  |  [ISR: revalidate 60]  |  |   [SSR: cache no-store]  |  |   [CSR / Redux RTK] |  |
|  +-----------+------------+  +-----------+------------+  +----------+----------+  |
+--------------|---------------------------|--------------------------|-------------+
|                           |                          |
v                           v                          v
+------------------+        +------------------+       +------------------+
| CoinGecko REST   |        | CoinGecko REST   |       | LocalStorage     |
| Public API v3    |        | Public API v3    |       | Sync Slice       |
+------------------+        +------------------+       +------------------+
^
| (Real-time price ticks)
+------------------+
| Binance WebSockets|
| Live Stream      |
+------------------+

```

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router, Server Actions, Suspense Streaming)
* **Language:** TypeScript (Strict Mode, Zero `any` policy)
* **State Management:** Redux Toolkit (Shared Client State + LocalStorage Persistence)
* **Styling:** Tailwind CSS (Custom Dark Fintech Palette)
* **Animations:** Framer Motion (`AnimatePresence`, `prefers-reduced-motion` handling)
* **APIs & Streaming:** CoinGecko REST API v3, Binance WebSocket Stream
* **Icons & UI Utilities:** Custom SVG Primitives

---

## ⚙️ Local Setup Commands

```bash
# 1. Clone the repository
git clone [https://github.com/mohammedanaskayyali/Crypto-Market](https://github.com/mohammedanaskayyali/Crypto-Market)
cd crypto-market-intelligence

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Build for production
npm run build

# 5. Start production build locally
npm start

```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Public REST API Base URL
NEXT_PUBLIC_COINGECKO_API_URL=[https://api.coingecko.com/api/v3](https://api.coingecko.com/api/v3)

# Public WebSocket Base Stream URL
NEXT_PUBLIC_BINANCE_WS_URL=wss://[stream.binance.com:9443/ws](https://stream.binance.com:9443/ws)

```

---

## 📡 REST API & WebSocket Sources

1. **CoinGecko REST API v3:** Used for server-side fetching of market overviews, search/sort endpoints, and comprehensive asset statistics.
2. **Binance Public WebSocket Stream:** Used for real-time live ticker price updates (`<symbol>@ticker`) with automatic reconnection handling and status indicators.

---

## 🌐 Rendering Strategy Decisions (SSR / ISR / CSR)

* **Market Overview (`/`) — ISR (`revalidate: 60`):**
* **Rationale:** Market cap standings and volume rankings do not change millisecond by millisecond. Static generation with 60-second revalidation delivers sub-100ms initial page loads and optimal SEO crawling while staying fresh.


* **Asset Detail Route (`/market/[id]`) — SSR (`cache: 'no-store'`):**
* **Rationale:** Deep analytics and price metrics require real-time accuracy when a user accesses a specific coin URL directly. Utilizes dynamic metadata and Next.js `notFound()` handling for invalid asset IDs.


* **Watchlist Route (`/watchlist`) — CSR (Client Component):**
* **Rationale:** User favorites are user-specific local data stored in Redux/LocalStorage. Keeping this route client-rendered prevents unnecessary server load and hydration mismatches.



---

## 📦 Redux State Design

* **Watchlist Slice (`watchlistSlice.ts`):** Manages user bookmarked assets (`items: string[]`).
* **Why Redux instead of Server Data?** Bookmarking is a purely local client interaction. Storing asset IDs in Redux coupled with a custom LocalStorage middleware guarantees zero server round-trips and instant local bookmark toggling.
* **Hydration Protection:** Implemented an `isInitialized` flag and `useRef` optimistic state filtering to eliminate client/server HTML mismatches and prevent redundant API re-fetching on item removal.

---

## ⚡ Performance Engineering & Optimizations

* **WebSocket Isolation:** Isolated the WebSocket subscription inside the `LiveTickerWidget` component to contain high-frequency live price ticks and prevent re-rendering the entire market table.
* **Selective `React.memo`:** Applied to `CryptoRow` components to isolate row-level updates when market state changes.
* **`useCallback` & `useMemo`:**
* `useMemo` is used to execute expensive client-side fallback sorting (e.g., 24h price change percentage) without re-calculating on un-related renders.
* `useCallback` is used for stable event listener references and API retry handles.


* **Streaming & Suspense:** Wrapped the server-fetched market table in `<Suspense fallback={...}>` to provide instant UX feedback when changing search queries or sort options.

---

## 🔍 SEO & Accessibility (a11y)

* **Dynamic Metadata API:** Implemented `generateMetadata` on `/market/[id]` to inject dynamic titles, descriptions, and Open Graph tags for social sharing.
* **Structured Data:** Embedded JSON-LD schema on asset detail pages for search engine rich snippets.
* **Sitemap & Robots:** Built native Next.js `sitemap.ts` and `robots.ts`.
* **Accessibility:** Full keyboard focus states (`ring-2`), semantic HTML table markup (`<th>`, `<td>`), clear input aria-labels, and Framer Motion motion reduction (`useReducedMotion`).

---

## 🤖 AI Usage Notes

* **Tools Used:** ChatGPT / Gemini / Cursor as engineering accelerators.
* **What was Accelerated:** Rapid boilerplate generation for TypeScript domain interfaces, Tailwind layout setup, and initial Framer Motion wrapper configurations.
* **AI Suggestions Corrected / Rejected:**
* **Rejected:** AI suggested using `RTK Query` for fetching market table data on the client side. **Correction:** Rejected in favor of Next.js Server Components and Server Actions to maintain SSR/ISR architectural benefits and superior SEO.
* **Corrected:** Fixed incorrect CoinGecko API parameters (`order=price_change_desc`) generated by AI by implementing a client-side fallback sort for 24h price change calculations.



---

## 🚧 Known Limitations & Future Improvements

Given an additional day, the following enhancements would be prioritized:

1. **Interactive Price Charts:** Integrate lightweight Canvas/SVG financial candlestick charts (e.g., TradingView or ApexCharts).
2. **Automated Testing:** Add Jest unit tests for Redux watchlist selectors and Playwright E2E tests for search/sort user flows.
3. **PWA / Offline Support:** Integrate Service Workers for offline market caching and Web Push alerts for price targets.

```

---