# DirtFree Web UI

Official Web Application for **DirtFree** — On-demand house cleaning & chores in 15 minutes. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

---

## 🐳 Docker Production Setup

This application is optimized for containerized deployments with Next.js standalone output and multi-stage Docker builds.

```bash
# Build and run the container
docker compose up --build -d

# Check container status
docker compose ps

# View container logs
docker compose logs -f
```

---

## 🛡️ Security & Hardening Features

- **Non-root Docker Container**: Runs under `nextjs` (UID 1001) system user.
- **Production Headers**: X-Frame-Options (Clickjacking defense), X-Content-Type-Options (MIME sniffing defense), Referrer-Policy, HSTS, Permissions-Policy.
- **Hardened Server Banner**: `poweredByHeader` disabled to hide server fingerprinting.
- **Error Handling**: Dedicated custom `404` (`not-found.tsx`), `500` (`error.tsx`), and layout fallback (`global-error.tsx`).
