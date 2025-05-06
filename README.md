# FieldFlow Test Project

## Setup

This is a [Convex](https://convex.dev/) project created with [`npm create convex`](https://www.npmjs.com/package/create-convex).

After the initial setup (<2 minutes) you'll have a working full-stack app using:

- Convex as your backend (database, server logic)
- [React](https://react.dev/) as your frontend (web page interactivity)
- [Vite](https://vitest.dev/) for optimized web hosting
- [HeroUI](https://www.heroui.com/) and [Tailwind](https://tailwindcss.com/) for building great looking UI
- [Convex Auth](https://labs.convex.dev/auth) for authentication
- [TanStack Router](https://tanstack.com/router/latest) for routing

## Get started

Create a free [Convex](https://convex.dev) account.

After cloning this repo, run:

```
npm install
npm run dev
```

The CLI will ask you to login to your Convex account and create a new project. Choose cloud deployment.

### Seed the app data

Go to the [Convex Dashboard](https://dashboard.convex.dev) and select your project. Go to "Functions" and click on the seedData function, click the Run Function button, then click the Run Mutation button.

This will create 3 organizations and 3 users.

| Name | Email | Memberships
| -- | -- | -- |
| Test User 1 | test1@test.com | Org 1 (admin)
| Test User 2 | test2@test.com | Org 2 (member)
| Test User 3 | test2@test.com | Org 1 (member), Org 3 (admin)

You will be able to login to the app as any of these users with the password "password!"

## Assignment

### 📝 Overview

You’ll be building a **multi‑tenant contact‑management app with live notes** on top of the pre‑seeded Convex schema.

- **Multi‑organization support:**  
  Each signed‑in user may belong to one or more organizations. All data—contacts, notes, org settings—must be isolated to the organization that owns it.

- **Core entities:**  
  - **Organizations** – containers for all data.  
  - **Contacts** – people tied to a single organization.  
  - **Notes** – time‑stamped comments attached to contacts.

- **Key user flows:**  
  1. **Select or browse organizations** the user belongs to (home page).  
  2. **Manage contacts** inside an org: list, add, view, archive.  
  3. **Add real‑time notes** under each contact; updates appear instantly in every open tab.  
  4. **Admin‑only settings** to rename an organization.

- **Tech you’ll exercise:**  
  - **Convex** for schema, queries, mutations, and live updates.  
  - **Convex Auth** to gate access and derive `organizationId` membership.  
  - **React + Vite** for the SPA front‑end.  
  - **HeroUI + Tailwind** for UI components and styling.  
  - **TanStack Router** for route protection and navigation.

The finished mini‑CRM should let multiple users interact concurrently—each seeing only their own organization’s contacts and notes—demonstrating secure data scoping, real‑time reactivity, and clean TypeScript code.


Your goal is to connect the pre‑seeded schema to a minimal UI that demonstrates:

1. **Org‑level access control** (only see what you’re a member of).  
2. **Real‑time Convex queries + mutations**.  
3. **Clean, idiomatic React + HeroUI/Tailwind code**.

### 🔭 What to build

| Route | Purpose | Must‑haves |
|-------|---------|------------|
| `/` (Home) | List **only** the organizations the signed‑in user belongs to. | • Table/list with org **name** and membership **role**.<br>• Click row → `./orgs/$orgId`. |
| `/orgs/$orgId` | Org workspace. | • Header with org name and “Admin” link (if role =`admin`).<br>• Contacts table showing **firstName**, **lastName**, **email**, **phone**.<br>• “Add Contact” button → modal or route. |
| `/orgs/$orgId/contacts/$contactId` | Contact detail. | • Contact info.<br>• Timeline of **notes** (live‑updated).<br>• Textarea to add note (writes mutation). |
| `/orgs/$orgId/admin` | Org admin panel (admins only). | • Form to **edit org name**.<br>• Guard so non‑admins are redirected. |

> **Data scoping rule**  
> All queries/mutations must filter by `organizationId` from the URL **and** verify the user is in `organizationMembers` for that org. A user must never see or mutate data from another org.

### 🛠️  Technical guidelines

* **Convex**  
  * Add any tables needed to the schema
  * Write all mutations/queries in `/convex/`.  
  * Use `useQuery` to keep contact list & notes real‑time.  
  * Apply a server‑side `hasRole(ctx, orgId, "admin")` helper for the admin route.

* **React / TanStack Router**  
  * Use file-based routing. This has already been setup for you.

* **UI**  
  * Use HeroUI components where possible (Table, Modal, Button).  
  * Tailwind utility classes for layout and responsive spacing.  

* **TypeScript**  
  * No `any` types
  * All code is typed and error-free 

### 🚀 Stretch goals (optional)

* Search/filter contacts.  
* Pagination or infinite scroll when contacts > 25.  
* Deploy the front-end using static site hosting of your choosing

---

## Submission

1. Push code to GitHub (public **or** private + invite `@eorenstein1`).  
2. Ensure `npm run dev` works on a fresh clone.  
3. Update this README with any stretch items you implemented.  
4. Email the repo link—and, if you deployed, the live URL—to **eli@fieldflowapp.com**.  

---

## Timing & support

* **Target effort:** 4 hours for core requirements.  
* **Deadline:** please return within **72 hours** of receiving the brief.  
* **Questions?** Open an issue in the repo or email us—happy to clarify.

Good luck & have fun! We’re excited to see your approach.
