# Bisdak MU Pinas

A mobile- and desktop-friendly browser MMORPG starter inspired by classic fantasy action RPGs. This is an original prototype, not an official MU Online client or server.

## Included
- Account registration and login (bcrypt password hashing, JWT sessions)
- SQLite-backed accounts and character slots (up to five per account)
- Ten selectable classes: Dark Knight, Dark Wizard, Fairy Elf, Magic Gladiator, Dark Lord, Summoner, Rage Fighter, Grow Lancer, Rune Wizard, and Slayer
- Three.js 3D test area with keyboard and touch movement
- Socket.IO multiplayer presence and movement broadcasts
- Responsive UI for phones and desktop browsers

## Requirements
- Node.js 20+
- npm

## Run locally
```bash
npm install
cp .env.example .env
# Set JWT_SECRET to a long random value in .env
npm start
```

Open http://localhost:3000

On Windows PowerShell, use `Copy-Item .env.example .env`.

## Deploy a free test server on Render
This repository includes a `render.yaml` Blueprint for a single free Node.js web service.

1. Sign in at https://render.com/ and connect the GitHub account that can access this repository.
2. In the Render Dashboard, choose **New → Blueprint**.
3. Select `mccoy2987/Bisdak-MU-pinas` and the `main` branch.
4. Render reads `render.yaml`. Review the service named `bisdak-mu-pinas` and choose **Apply**.
5. Wait for the first deploy to finish. Open the `onrender.com` URL shown on the service page.
6. Check `/api/health`; it should return JSON with `"ok":true`.

The Blueprint generates a private `JWT_SECRET` in Render and uses `/tmp/bisdakmu.db` for the prototype database. Do not add real secrets to GitHub.

**Free-tier warning:** Render free web services spin down after 15 minutes without inbound traffic and can take about a minute to wake up. Their filesystem is ephemeral: the SQLite database can be erased when the service restarts, sleeps, or redeploys. This free setup is for demos and testing only; do not collect valuable player accounts or progress. For persistent accounts, migrate SQLite to a managed PostgreSQL database and review the database provider's free-tier retention/expiry limits, or use paid persistent storage.

## Prototype limitations
This is a starter foundation, not a complete MMORPG. It does not yet include authoritative combat, monster AI, drops, inventory/equipment, skills, quests, parties, guilds, trading, maps/portals, anti-cheat, admin tools, or production-grade scaling. The multiplayer demo broadcasts player movement, but remote player avatars are not yet rendered.

## Security before public launch
Change the development JWT secret, use HTTPS, and add rate limiting, email verification, password reset, backups, moderation, and server-side gameplay validation. Never commit your real `.env` file or database.

## License
Choose a license before accepting outside contributions.
