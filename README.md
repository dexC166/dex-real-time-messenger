# Real-Time-Messenger 📨

A full-featured, real-time chat platform built with **Next.js 14 (App Router)** and **TypeScript**.

---

## 📑 Table of Contents

- 📌 [Project Overview](#project-overview)
- 🛠️ [Tech Stack](#tech-stack)
- 📦 [package.json at a Glance](#packagejson-at-a-glance)
- 🚀 [Getting Started](#getting-started)
- 🧩 [Feature Breakdown](#feature-breakdown)
- 📚 [Documentation](#documentation)
- 🗂️ [Project Structure](#project-structure)
- 🛠️ [Available Commands](#available-commands)
- 🚢 [Deployment](#deployment)
- 📜 [License](#license)
- 👨‍💻 [About Me](#about-me)
- 🙏 [Acknowledgments](#acknowledgments)
- 📌 [Note](#note)

---

<a name="project-overview"></a>

## 📌 Project Overview

This is **my** implementation of a Facebook-style messenger.  
It delivers instant chat, read receipts, media sharing, and presence indicators all wrapped in a sleek, responsive UI.

**Highlights**

- 💬 Instant messaging with real-time updates (Pusher)
- 👀 Read receipts & online/offline indicators
- 📎 Image / file uploads (Cloudinary)
- 👥 One-on-one **and** group conversations
- 🔍 In-thread message search
- 🔐 Secure auth (credentials + Google / GitHub OAuth)
- 🖥️ Mobile-first responsive design

> **Inspiration:** Antonio Erdeljac’s Messenger Clone tutorial jump-started this build, but files have been reviewed, refactored, and expanded to match **my** standards.

---

<a name="tech-stack"></a>

## 🛠️ Tech Stack

| Layer / Purpose        | Technology                             |
| ---------------------- | -------------------------------------- |
| **Framework**          | Next.js 14 (App Router) + React        |
| **Language**           | TypeScript                             |
| **Styling**            | Tailwind CSS                           |
| **Realtime**           | Pusher & Pusher-JS                     |
| **Database**           | MongoDB + Prisma ORM                   |
| **Auth**               | NextAuth (Credentials, Google, GitHub) |
| **Storage / CDN**      | Cloudinary                             |
| **Forms / Validation** | React-Hook-Form                        |
| **State**              | Zustand                                |
| **Notifications**      | react-hot-toast                        |
| **Build / Deploy**     | Vercel                                 |

---

<a name="packagejson-at-a-glance"></a>

## 📦 `package.json` at a Glance

### Major Runtime Dependencies

| Package                 | Version                 |
| ----------------------- | ----------------------- |
| next                    | `^14.2.28`              |
| react / react-dom       | `^18`                   |
| typescript              | `^5`                    |
| prisma & @prisma/client | `^6.6.0`                |
| next-auth               | `^4.24.5`               |
| pusher / pusher-js      | `^5.2.0` / `^8.4.0-rc2` |
| axios                   | `^1.6.5`                |
| tailwindcss             | `^3.3.0`                |
| bcrypt                  | `^5.1.1`                |
| react-hook-form         | `^7.49.3`               |
| zustand                 | `^4.5.0`                |
| react-hot-toast         | `^2.4.1`                |

<details>
<summary>View full <code>package.json</code></summary>

```json
{
  "name": "messenger-clone",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@headlessui/react": "^1.7.18",
    "@next-auth/prisma-adapter": "^1.0.7",
    "@prisma/client": "^6.6.0",
    "@tailwindcss/forms": "^0.5.7",
    "axios": "^1.6.5",
    "bcrypt": "^5.1.1",
    "clsx": "^2.1.0",
    "date-fns": "^3.3.1",
    "lodash": "^4.17.21",
    "next": "^14.2.28",
    "next-auth": "^4.24.5",
    "next-cloudinary": "^5.20.0",
    "next-superjson-plugin": "^0.6.3",
    "pusher": "^5.2.0",
    "pusher-js": "^8.4.0-rc2",
    "react": "^18",
    "react-dom": "^18",
    "react-hook-form": "^7.49.3",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^5.0.1",
    "react-select": "^5.8.0",
    "react-spinners": "^0.13.8",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/lodash": "^4.14.202",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "postcss": "^8",
    "prisma": "^6.6.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

</details>

---

<a name="getting-started"></a>

## 🚀 Getting Started

### ✅ Prerequisites

- Node 16 +
- MongoDB (local or Atlas)
- `npm` or `pnpm`

### 🧪 Environment Variables

Create a **`.env`** file in the project root:

```env
DATABASE_URL=

NEXTAUTH_SECRET=

NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_ID=
PUSHER_SECRET=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 📦 Installation

```bash
# 1 – Clone
git clone https://github.com/dexC166/real-time-messenger.git
cd real-time-messenger

# 2 – Install deps
npm install            # or pnpm install

# 3 – Sync Prisma schema
npx prisma db push

# 4 – Run dev server
npm run dev
# Visit http://localhost:3000
```

---

<a name="feature-breakdown"></a>

## 🧩 Feature Breakdown

### Authentication

- Credentials sign-up / login
- Google & GitHub OAuth
- Secure JWT sessions (NextAuth)

### Chat Core

- Realtime Pusher channels
- Read receipts & presence indicators
- Media attachments (Cloudinary)
- Group chat CRUD & avatars
- Client-side message search

### UI / UX

- Tailwind-powered mobile-first layouts
- Animated sidebar & modals
- Profile drawer with member list

### My Enhancements

- Migrated to **Next.js 14 App Router**
- Refactored API routes for clean contracts
- Hardened message rendering for edge-case files
- Improved group profile drawer layout & info density

---

<a name="documentation"></a>

## 📚 Documentation

- 🛠️ [Architecture Overview](./architecture.md)
- 🔄 [User Flow Diagram](./flowchart.md)

---

<a name="project-structure"></a>

## 🗂️ Project Structure

```
app/              # Next.js entrypoints (App Router)
components/       # Reusable UI elements
hooks/            # Custom React hooks
lib/              # Helpers (Pusher, Cloudinary, etc.)
prisma/           # Schema & migrations
public/           # Static assets
```

---

<a name="available-commands"></a>

## 🛠️ Available Commands

| Command | Purpose                         |
| ------- | ------------------------------- |
| `dev`   | Launch local development server |
| `build` | Create a production build       |
| `start` | Run the production build        |
| `lint`  | ESLint code-quality checks      |

---

<a name="deployment"></a>

## 🚢 Deployment (Vercel)

1. Push the repo to GitHub.
2. Import it into **Vercel**.
3. Add the environment variables above.
4. Click **Deploy**, done!

_(Any platform that supports Next.js 14 works; Vercel just makes it painless.)_

---

<a name="license"></a>

## 📜 License

© 2025 **Dayle Cortes** – All rights reserved.  
Please contact me for licensing or commercial inquiries.

---

<a name="about-me"></a>

## 👨‍💻 About Me

I’m **Dayle Cortes**, a full-stack developer focused on responsive web experiences.  
This messenger app showcases my ability to integrate modern frameworks, realtime infrastructure, and elegant UI design into a production-ready app.

---

<a name="acknowledgments"></a>

## 🙏 Acknowledgments

- **Antonio Erdeljac** aka "_codewithantonio_", his tutorial kick-started this build.
- The open-source communities behind **Next.js**, **Prisma**, **Tailwind CSS**, and **Pusher**.

---

<a name="note"></a>

## 📌 Note

This app was originally built by following @codewithantonio’s YouTube tutorial for learning and inspiration.  
The project was developed entirely in my local IDE (outside of GitHub) without initializing git, and I’ve reconstructed the commit history solely to reflect a realistic development flow and demonstrate my understanding of fullstack architecture, not as a record of the actual chronological build.

---

## 📨

_Happy chatting!_ 🚀
