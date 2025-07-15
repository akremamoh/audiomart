# 🎧 AudioMart – Mini Amazon‑Style Product Grid

> A responsive, accessible, and interactive e-commerce UI built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

---

## 📦 Overview

**AudioMart** is a modern, Amazon-inspired product results grid that displays “wireless earbuds” listings with filtering, sorting, modals, and a full shopping cart experience. Designed for accessibility and responsive design, it mimics a real-world online shopping experience while focusing on clean architecture, UI detail, and performance.

---

## ✨ Features

- ✅ Responsive product grid (1–5 columns depending on screen size)
- ✅ Product details modal (click to open, includes accessibility support)
- ✅ Add to cart, change quantity, and remove items
- ✅ Cart drawer with dynamic total and image previews
- ✅ Filter by product type
- ✅ Sort by price or rating
- ✅ Cart saved to localStorage (persists across refreshes)
- ✅ Keyboard navigation + screen reader friendly
- ✅ Toast notifications on actions (add/remove)
- ✅ Unit tests using Jest and React Testing Library

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/audiomart.git
cd audiomart

### 2. Install Dependencies


pnpm install
# or
npm install
# or
yarn install

 ### 3. Run The Development Server

pnpm dev
# or
npm run dev
# or
yarn dev

-> Open http://localhost:3000 to view it in your browser.



 ### 3. Testing
Run unit tests:

pnpm test
# or
npm test
# or
yarn test

---

✅ Code Quality
- ESLint 9 + Prettier formatting
- Strict TypeScript types
- Component-based architecture
- Well-structured state management with useState, useEffect
- Clean, reusable, and readable code

---

♿ Accessibility
- Full keyboard navigation
-  ARIA labels on all interactive elements
- Focus states visible
- Screen-reader compatible
- Dialogs and drawers are focus-trapped and close on Esc

---  

Built with ❤️ by Akrem Ahmed for a take-home assignment, inspired by Amazon’s product UI experience.

