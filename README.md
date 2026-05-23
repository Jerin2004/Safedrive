# 🛺 SafeDrive — Hands-Free Ride Acceptance

> A safety prototype for Rapido, Uber, and Ola drivers.  
> **Zero screen interaction needed while driving.**

---

## The Problem

Every rideshare driver in India faces this every single day:

- They're driving a current passenger at **40 km/h**
- A new ride request pops up — beeping, flashing
- They have **15 seconds** to look at the screen, read the pickup/drop, and tap Accept or Reject
- Miss too many → acceptance rate drops → fewer rides → platform penalty
- This creates a powerful incentive to **look at the phone while driving**

This is not a Rapido-only problem. **Uber, Ola, Lyft, and every major rideshare app works exactly the same way.**

---

## The Solution

SafeDrive adds three layers of safety:

| Feature | How it works |
|---|---|
| **Speed-based Safe Mode** | GPS detects speed > 20 km/h → automatically locks touch buttons |
| **Auto TTS Read-aloud** | Ride details (pickup, drop, fare, distance) spoken aloud via Web Speech API |
| **Voice Commands** | Driver says "accept" or "reject" — or हाँ / नहीं — completely hands-free |

---

## Demo

1. Drag the **speed slider** above 20 km/h → Safe Mode activates
2. Click **"Trigger ride request"** → ride details are read aloud automatically
3. Click **"Start voice recognition"** → say **"accept"** or **"reject"** out loud
4. Watch the after-phone respond without any screen touch

Supported voice commands:
- English: `accept`, `reject`, `ok`, `yes`, `no`, `cancel`
- Hindi: `हाँ`, `नहीं`, `haan`, `nahi`, `theek`

---

## Tech Stack

```
React 18          → UI framework
Vite              → Build tool  
Web Speech API    → Real speech recognition (built into Chrome/Edge)
SpeechSynthesis   → TTS read-aloud (built into all modern browsers)
CSS Variables     → Theming system
```

No external libraries needed for the core voice features — it's all native browser APIs.

---

## Run Locally

```bash
git clone https://github.com/your-username/safedrive.git
cd safedrive
npm install
npm run dev
```

Open `http://localhost:5173` in **Chrome or Edge** (required for Speech Recognition API).

---

## Deploy to GitHub Pages (free)

```bash
npm run build
# then push the /dist folder to your gh-pages branch
```

## How it would work in a real app

In a production implementation (React Native / Flutter):

```
1. navigator.geolocation.watchPosition()  →  real GPS speed
2. Above threshold → lock UI, start SpeechRecognition
3. SpeechSynthesis.speak(rideDetails)     →  read aloud
4. On voice match → call /rides/accept or /rides/reject API
5. Below threshold → restore normal UI
```

The only change needed from Rapido/Uber's side is:
- Add speed check before rendering the ride request UI
- Route to voice mode when speed > threshold
- Their existing accept/reject API stays the same

---

## Why this matters

- Distracted driving is one of the leading causes of road accidents in India
- Rideshare drivers are on the road 8–12 hours a day
- This problem affects **millions of drivers** daily across all platforms
- The fix is **3 browser APIs** — no hardware change, no new infrastructure

---

## Author

Built by Jerin J Abraham as a product + engineering concept.

Open to opportunities at product companies working on safety, mobility, or developer tools.

📧 jerinjabraham45@gmail.com  
🔗 https://www.linkedin.com/in/jerin-j-abraham/

---

*This is a prototype/concept demo, not affiliated with Rapido, Uber, or Ola.*
