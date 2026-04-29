# Hugo Revenue Forecast

Internal revenue forecasting tool for Hugo operations. Built with React + Vite.

## What it does

- **Forecast Builder** — Set headcount and hours per person for each project and month. Revenue computes automatically from billing rates. Jan–Mar are locked as actuals.
- **Dashboard** — Stacked bar chart of monthly revenue, KPI cards, project breakdown.
- **Projects** — Add, edit, or delete accounts. Set billing mode (hourly vs direct), rates, OT multipliers.
- **Analysis** — OT% trends, headcount snapshot, revenue anomaly detection.

All data is stored in your browser's localStorage — no backend, no database.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deploy to Vercel via GitHub

### Step 1 — Push to GitHub

```bash
# If you haven't set up git yet:
git init
git add .
git commit -m "initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/hugo-forecast.git
git branch -M main
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use your GitHub account).
2. Click **Add New → Project**.
3. Import your `hugo-forecast` repo from GitHub.
4. Vercel auto-detects Vite. The settings should be:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

Done. Vercel gives you a URL like `hugo-forecast.vercel.app`.

### Step 3 — Future updates

Every `git push` to `main` auto-deploys to Vercel.

```bash
git add .
git commit -m "update forecast"
git push
```

---

## Adding a new project

Go to the **Projects** tab → **Add Project**. Fill in:
- Name, type (CX / Ops), geography
- Billing mode: **Hourly** (HC × hrs × rate) or **Direct** (you enter revenue manually)
- If hourly: billing rate + OT multiplier

The new project appears in all months in the Forecast Builder immediately.

## Adding a new month

In the **Forecast Builder**, click **+ Add Month** in the top right. It adds the next calendar month and seeds each project with default values from its most recent forecast month.

## Resetting data

Click **Reset Data** in the top nav bar. This restores all data to the original defaults loaded from the sheets.

---

## Data notes

- Jan–Mar 2026 actuals are pre-loaded from the billing sheets (Feb revenue tab + March invoices).
- GiftHealth and Outschool use direct revenue entry because their multi-tier rate structures can't be reconstructed from a single $/hr rate.
- Aurora billing is per model (rate = $3.30/model avg), so "Hrs/HC" in Aurora's cells represents models per person, not clock hours.
- OT hours for locked months are internal tracking figures from the OT summary sheet. Not all OT is billable to the client.
