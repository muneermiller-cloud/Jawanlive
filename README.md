# Live Sports Streaming Player - Self-Hosting Guide

A full-stack web application for watching live and replay sports video streams, focused strictly on the European Top 5 leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1), their domestic cup competitions (FA Cup, Carabao Cup, Copa del Rey, Coppa Italia, DFB-Pokal, Coupe de France), and major European tournaments (UEFA Champions League, Europa League, and Conference League).

---

## 🚀 Quick Start on Your Own PC

### Prerequisites
- **Node.js**: Version 18.x, 20.x, or higher ([Download Node.js](https://nodejs.org/))
- **npm** (comes automatically with Node.js) or **pnpm** / **bun**

---

### Step 1: Download the Project
In AI Studio, click on the **Settings** menu (top right) and choose either:
- **Export to GitHub** (recommended to push to your repository and `git clone`), OR
- **Download as ZIP** (extract the ZIP file to any folder on your computer, e.g., `C:\sports-player` or `~/sports-player`).

---

### Step 2: Install Dependencies
Open your terminal (PowerShell, Command Prompt, macOS Terminal, or Linux bash) and navigate into the project directory:

```bash
cd sports-player
npm install
```

---

### Step 3: Run the Application

#### Option A: 1-Click Startup
- **Windows**: Double click `start-local.bat` (defaults to port `3050` so port `3000` remains free for Homepage)
- **macOS / Linux**: Run `./start-local.sh` (defaults to port `3050`)

#### Option B: Terminal Command
```bash
# Windows PowerShell
$env:PORT=3050; npm run dev

# macOS / Linux
PORT=3050 npm run dev
```

*(You can set any port you like by changing `PORT=3050` to `PORT=3055`, `8080`, etc.)*

#### Option C: Production Mode (Optimized)
```bash
npm run build
PORT=3050 npm start
```

Once started, open your browser:
- **On this PC**: [http://localhost:3050](http://localhost:3050)
- **On other devices on your home Wi-Fi** (Phone, Tablet, Smart TV):
  Open `http://<your-pc-ip>:3050` (e.g. `http://192.168.1.50:3050`).
  *(The console will print the exact local network IP address when started!)*

---

## 🏠 Add to Your Homepage Dashboard (`gethomepage.dev`)

Since you use **Homepage** on `http://localhost:3000`, you can add this player directly to your dashboard.
In your Homepage `services.yaml` configuration file, add:

```yaml
- Media / Entertainment:
    - Live Sports HD:
        icon: si-youtube # or si-vlc, tv, etc.
        href: http://localhost:3050 # or http://192.168.x.x:3050
        description: Live & Replay Sports HD Streaming
        ping: http://localhost:3050/api/health
```

The built-in `/api/health` endpoint allows Homepage to display a real-time green online ping status badge!

---

## 🐳 Docker Setup (Optional)

If you run your servers via Docker Compose:

```bash
docker compose up -d
```
*(The included `docker-compose.yml` maps port `3050` on your host PC to keep port `3000` open for your Homepage dashboard!)*

Or using standalone Docker:
```bash
# Build the Docker image
docker build -t sports-player .

# Run container on port 3050
docker run -d -p 3050:3000 --name sports-player --restart unless-stopped sports-player
```

Open [http://localhost:3050](http://localhost:3050).

---

## ⚙️ Custom Configuration

### Custom Port
If you want to use any other port (e.g., 3055, 8080):
```bash
# Windows PowerShell
$env:PORT=8080; npm run dev

# macOS / Linux
PORT=8080 npm run dev
```

### Manifests & Feeds
The player connects to your preferred Stremio manifest URL (defaulting to the built-in streaming catalog). You can switch manifests or paste custom ones anytime from the **Addon Manifest** button in the header. All preferences and saved bookmarked matches are stored locally on your device in `localStorage`.

---

## ⌨️ Player Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Space` / `K` | Play / Pause stream |
| `F` | Toggle Fullscreen |
| `P` | Picture-in-Picture mode |
| `M` | Mute / Unmute audio |
| `T` | Toggle Theater wide mode |
| `←` / `→` | Seek -10s / +10s (replays) |
| `↑` / `↓` | Volume Up / Down |
| `?` | Show Shortcuts Cheat Sheet |
