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

## Deployment
Deploy on a Node.js host that supports persistent storage and WebSockets. Set `JWT_SECRET`, expose the assigned `PORT`, and use HTTPS. Keep the SQLite database on persistent storage; ephemeral serverless storage is not suitable for this setup.

## Prototype limitations
This is a starter foundation, not a complete MMORPG. It does not yet include authoritative combat, monster AI, drops, inventory/equipment, skills, quests, parties, guilds, trading, maps/portals, anti-cheat, admin tools, or production-grade scaling. The multiplayer demo broadcasts player movement, but remote player avatars are not yet rendered.

## Security before public launch
Change the development JWT secret, use HTTPS, and add rate limiting, email verification, password reset, backups, moderation, and server-side gameplay validation. Never commit your real `.env` file or database.

## License
Choose a license before accepting outside contributions.
