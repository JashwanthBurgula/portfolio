# Jashwanth Burugula — Cinematic 3D Portfolio

> **AI/ML & Generative AI Engineer Portfolio** · Awwwards-standard, production-ready.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript) ![Three.js](https://img.shields.io/badge/Three.js-r3f-black?style=flat&logo=threedotjs) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat&logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)

---

## ✨ Feature Highlights

| Feature | Details |
|---|---|
| **Preloader** | Dot expand → typewriter (JASHWANTH → BURUGULA → PORTFOLIO) → particle dissolve |
| **Hero** | Depth-displaced 3D portrait, typewriter role rotation, floating AI badges |
| **About** | Animated counters (10 engineers, 85% latency, 92% accuracy), live terminal |
| **What I Build** | Numbered accordion with red-line hover, number glitch effect |
| **Work (04)** | 7 projects, each with a unique interactive 3D world (orbs, DNA, eyes, embeddings…) |
| **Skills** | Filterable skill clusters with animated hover |
| **Journey** | Horizontal pinned timeline 2021 → 2026 |
| **Certifications** | 3D perspective flip-cards |
| **Contact** | Validated form + confetti email copy |
| **Easter Eggs** | Konami code → Bujji Mode (cyan HUD), tab blur title change |
| **Custom Cursor** | Morphing dot/ring that tracks cursor state |
| **Progress Rail** | Right-side section indicator |

---

## 🚀 Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

---

## 📸 Adding Your Portrait

1. Remove background from your photo (use [remove.bg](https://remove.bg) or rembg CLI)
2. Save as `public/portrait.jpg` (or `.png` with transparency)
3. The Hero section will automatically display it with the depth-parallax effect

```bash
# Optional: Use rembg CLI for background removal
pip install rembg
rembg i your_photo.jpg public/portrait.png
```

---

## 🗂 Folder Structure

```
src/
├── components/
│   ├── sections/     # Page sections (Hero, About, Work, Skills…)
│   ├── scenes/       # R3F 3D scenes (lazy-loaded)
│   └── ui/           # Navbar, Cursor, ProgressRail, ScrollCounter
├── data/
│   └── index.ts      # ALL content — single source of truth
├── hooks/
│   ├── useCursor.ts       # Cursor tracking
│   └── useEasterEggs.ts   # Konami code, tab visibility
├── shaders/          # Custom GLSL shaders (particle, displacement)
├── store/
│   └── index.ts      # Zustand global state
└── types/            # TypeScript types
```

---

## 🌐 Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deploys.

**Environment Variables** (optional for contact form):
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 🎮 Easter Eggs

| Trigger | Effect |
|---|---|
| ↑↑↓↓←→←→BA (Konami code) | Activates **Bujji Mode** (cyan HUD theme) |
| Switch browser tab | Title changes to "Come back, I'm still building… 👾" |
| Contact section → Copy Email button | Confetti burst 🎊 |

---

## 📧 Contact Form Setup (EmailJS)

1. Create account at [emailjs.com](https://emailjs.com)
2. Create a service + email template
3. Add env vars above
4. Update `Contact.tsx` to use `emailjs.send()`

---

## 🔧 Customisation

All content lives in **`src/data/index.ts`** — edit it to update:
- Personal info, bio, tagline
- Project descriptions, metrics, tech stacks
- Skills by category
- Journey/timeline milestones
- Certifications

---

## 📐 Tech Stack

| Layer | Library |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS 4 |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Animation | Framer Motion + GSAP |
| State | Zustand |
| Fonts | Space Grotesk, JetBrains Mono, DotGothic16 |
| Deploy | Vercel |

---

*Built with ❤️ and React Three Fiber · Hyderabad, India · 2026*
