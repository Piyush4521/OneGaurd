<div align="center">

# ⚡ OneFlux
### Non-Invasive IoT Appliance Auditing System

> **Monitor every watt. Control every socket. Know every appliance.**
> Real-time, cloud-connected energy monitoring — without touching a single wire.

<br/>

[![ESP32](https://img.shields.io/badge/ESP32-DevKit%20V1-red?style=flat-square&logo=espressif)](https://www.espressif.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React.js-Dashboard-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Arduino](https://img.shields.io/badge/Arduino-Firmware-00979D?style=flat-square&logo=arduino)](https://www.arduino.cc/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Made in India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-orange?style=flat-square)]()
[![Hardware Cost](https://img.shields.io/badge/Hardware%20Cost-₹1%2C466-brightgreen?style=flat-square)]()

<br/>

[🌐 Live Dashboard](https://your-oneflux-dashboard.web.app) &nbsp;|&nbsp;
[📖 Project Report](docs/OneFlux_Project_Report.pdf) &nbsp;|&nbsp;
[🎥 Demo Video](#demo) &nbsp;|&nbsp;
[⚙️ Hardware Setup](#hardware-setup)

</div>

---

## 📌 Table of Contents

- [What is OneFlux?](#what-is-oneflux)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Hardware Components](#hardware-components)
- [Software Stack](#software-stack)
- [How It Works](#how-it-works)
- [Device Fingerprinting](#device-fingerprinting)
- [Getting Started](#getting-started)
  - [Hardware Setup](#hardware-setup)
  - [Firmware Setup](#firmware-setup)
  - [Firebase Setup](#firebase-setup)
  - [Dashboard Setup](#dashboard-setup)
- [Project Results](#project-results)
- [Limitations](#limitations)
- [Future Scope](#future-scope)
- [Team](#team)
- [Acknowledgements](#acknowledgements)
- [References](#references)
- [License](#license)

---

## 🔍 What is OneFlux?

**OneFlux** is an open-source, non-invasive IoT appliance energy auditing system built for Indian residential and educational environments. It lets you monitor the real-time power consumption of any household appliance — without cutting a single wire, hiring an electrician, or spending thousands on commercial smart plugs.

The name **OneFlux** reflects the system's core purpose: tracking the continuous **flux of electrical energy** in real time, from the physical socket all the way to a live web dashboard accessible from anywhere in the world.

### The Problem It Solves

Most Indian households have **zero appliance-level visibility** into their electricity consumption. The utility meter only shows aggregate monthly usage. You have no idea whether it is your geyser, your old refrigerator, or your desktop computer draining the most power — and consequently, your money.

OneFlux answers that question — safely, affordably, and intelligently.

| Without OneFlux | With OneFlux |
|---|---|
| One monthly number from the utility meter | Live per-appliance wattage, updated every 2 seconds |
| No idea which appliance costs the most | Real-time cost in ₹ per appliance |
| Cannot switch off appliances remotely | One-click remote relay cut-off from anywhere |
| Standby loads invisible and forgotten | Phantom load detection with alerts |
| Requires an electrician for any monitoring | Self-install in under 5 minutes, no wiring needed |

---

## ✨ Key Features

```
🔌  Non-Invasive Installation    →   Split-core CT coil clamps around the wire. Nothing is cut.
⚡  5-Parameter Live Monitoring  →   Voltage, Current, Power, Energy (kWh), Frequency
☁️  Real-Time Cloud Sync         →   Firebase Realtime Database, updates every 2 seconds
📊  Live Power Graph             →   Recharts-powered waveform showing load changes live
💰  Electricity Cost in ₹       →   Configurable per-unit tariff (default ₹6.50/kWh)
🌿  CO₂ Emission Tracking        →   Indian grid factor: 0.82 kg CO₂/kWh
🤖  Device Auto-Identification   →   Power fingerprinting detects your appliance automatically
✋  Manual Device Labeling        →   Override auto-detection when needed
🔴  Remote Relay Cut-Off         →   Switch off the socket from your dashboard, anywhere
📱  Works on Any Device          →   Responsive dashboard — laptop, phone, tablet
💸  Total Hardware Cost: ₹1,466  →   5× cheaper than commercial smart plugs
🆓  Zero Software Cost           →   Firebase free tier + all open-source tools
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PHYSICAL LAYER                                  │
│                                                                         │
│   230V AC ──► RELAY MODULE ──► PZEM-004T AC Terminals ──► APPLIANCE    │
│                    ▲                    │                               │
│                    │            CT Coil (clamps around live wire)       │
│               GPIO26 (ESP32)           │ (non-invasive)                 │
│                                        ▼                               │
│                         PZEM reads: V, I, P, E, Hz                     │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ UART2 (GPIO16/17 @ 9600 baud)
┌────────────────────────────▼────────────────────────────────────────────┐
│                       MICROCONTROLLER LAYER (ESP32)                     │
│                                                                         │
│   • Polls PZEM every 2 seconds                                          │
│   • Validates readings (NaN check)                                      │
│   • Controls Relay via GPIO26                                           │
│   • Connects to Wi-Fi (2.4GHz)                                          │
│   • Makes HTTPS PUT requests to Firebase REST API                       │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ HTTPS / REST API (Wi-Fi)
┌────────────────────────────▼────────────────────────────────────────────┐
│                    CLOUD LAYER (Firebase Realtime Database)              │
│                                                                         │
│   /devices/socket1/                                                     │
│       ├── voltage      → 231.4                                          │
│       ├── current      → 0.26                                           │
│       ├── power        → 62.7                                           │
│       ├── energy       → 0.012                                          │
│       ├── frequency    → 50.0                                           │
│       └── relay        → 1  (1=ON, 0=OFF)                              │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ Firebase JS SDK (onValue listener)
┌────────────────────────────▼────────────────────────────────────────────┐
│                    DASHBOARD LAYER (React.js Web App)                   │
│                                                                         │
│   • Live stat cards (V, A, W, kWh, Hz)                                 │
│   • Real-time power graph (Recharts LineChart)                          │
│   • Electricity cost (₹) and CO₂ (kg) trackers                         │
│   • Device fingerprinting display with confidence score                 │
│   • Relay ON/OFF control button                                         │
│   • Manual device labeling dropdown                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Hardware Components

| Component | Model | Specification | Cost |
|---|---|---|---|
| Microcontroller | ESP32 DevKit V1 (DOIT, 30-pin) | 240MHz dual-core, 520KB SRAM, Wi-Fi 802.11 b/g/n | ₹350 |
| Power Sensor | PZEM-004T V4.0 + Split-Core CT | 80-260V AC, 0-100A, UART 9600 baud, ±0.5% accuracy | ₹606 |
| Power Supply | HLK-PM01 | 100-240V AC in, 5V/600mA DC out, isolated | ₹200 |
| Relay Module | SRD-05VDC-SL-C | SPDT, 10A/250V AC, optocoupler isolated | ₹60 |
| Prototyping | 830-pt Breadboard + Jumper Wires | Full size, male-to-male and male-to-female | ₹150 |
| Enclosure | Extension Board (230V, 5A) | Indian standard 1-socket with fuse and switch | ₹100 |
| **TOTAL** | | | **₹1,466** |

> All components sourced from [Robu.in](https://robu.in) (Pune) and local Solapur electronics market.

---

## 💻 Software Stack

### Firmware (ESP32)
- **Language:** C++ with Arduino Framework
- **IDE:** Arduino IDE 2.3.6
- **Libraries:**
  - `PZEM004Tv30` v1.2.1 by Jakub Mandula — PZEM sensor abstraction over Modbus RTU
  - `WiFiClientSecure` + `HTTPClient` — TLS-encrypted HTTPS to Firebase REST API
  - `ArduinoJson` — JSON payload construction

### Backend (Cloud)
- **Platform:** Firebase Realtime Database (Google, Spark Free Tier)
- **Communication:** HTTPS REST API with Firebase API key authentication
- **Data Structure:** JSON tree at `/devices/socket1/`

### Frontend (Dashboard)
- **Framework:** React.js with Vite (v5.x)
- **Database SDK:** Firebase JavaScript SDK v10.x
- **Charting:** Recharts (LineChart with real-time data)
- **Runtime:** Node.js v22.19.0

---

## ⚙️ How It Works

### Stage 1 — Physical Measurement
The PZEM-004T V4.0 measures AC parameters using two mechanisms:
1. The **split-core CT coil** clamps around the live wire without breaking the circuit. Electromagnetic induction produces a proportional secondary current → PZEM measures RMS current.
2. The **AC voltage terminals** connect across the supply to measure true RMS voltage.

The PZEM internally computes: `Active Power (W) = V × I × cos φ`, energy accumulation (kWh), and grid frequency (Hz).

### Stage 2 — ESP32 Processing
Every 2 seconds, the ESP32:
1. Polls all 5 parameters from PZEM via UART2 using Modbus RTU protocol.
2. Validates readings (NaN check for sensor failure).
3. Reads relay command from Firebase and toggles GPIO26 accordingly.
4. Transmits all sensor values to Firebase via HTTPS PUT requests.

### Stage 3 — Cloud Storage
Firebase Realtime Database stores data at `/devices/socket1/`. Each parameter has its own child node updated independently on every ESP32 poll cycle.

### Stage 4 — Dashboard Display
The React.js dashboard uses Firebase's `onValue()` listener which fires on every database change. React state updates trigger UI re-renders delivering data to the screen within milliseconds of the ESP32 measurement.

---

## 🤖 Device Fingerprinting

OneFlux automatically identifies the connected appliance by comparing live wattage against stored power profiles.

| Device | Min (W) | Max (W) | Confidence |
|---|---|---|---|
| Phone Charger | 5 | 25 | High |
| Laptop Computer | 25 | 90 | Medium |
| LED Monitor | 20 | 50 | Medium |
| Desktop Computer | 90 | 250 | High |
| Cooler / Fan | 30 | 100 | Medium |
| Refrigerator | 100 | 200 | Medium |
| Microwave Oven | 600 | 1200 | High |
| Electric Iron | 1000 | 2500 | High |
| Electric Geyser | 1500 | 3000 | High |

When the algorithm confidence is low (overlapping ranges), a **manual override dropdown** allows the user to label the device. All fingerprinting runs client-side in the React dashboard — zero extra load on the ESP32.

---

## 🚀 Getting Started

### Prerequisites
- Arduino IDE 2.3.6 or later
- Node.js v18 or later
- A Firebase account (free)
- Git

---

### Hardware Setup

```
Step 1:  Mount HLK-PM01 on breadboard. Connect its AC IN to 230V Live and Neutral.
         Connect its DC OUT (5V, GND) to ESP32 VIN and GND.

Step 2:  Connect PZEM-004T:
         → 5V and GND from HLK-PM01 to PZEM power pins
         → PZEM TX  →  ESP32 GPIO16  (UART2 RX)
         → PZEM RX  →  ESP32 GPIO17  (UART2 TX)
         → PZEM L-IN, N-IN  →  Relay NO terminal and AC Neutral
         → PZEM L-OUT, N-OUT  →  Appliance socket

Step 3:  Clamp the split-core CT coil around the L-OUT wire only.
         Connect CT coil cable to PZEM CT port.

Step 4:  Connect Relay Module:
         → VCC  →  5V from HLK-PM01
         → GND  →  Common GND
         → IN   →  ESP32 GPIO26
         → COM  →  AC Live input
         → NO   →  PZEM L-IN

Step 5:  Double-check all connections. Ensure 6mm+ clearance
         between AC and DC traces before powering on.
```

> ⚠️ **Safety Warning:** This project involves 230V AC mains electricity. Ensure the breadboard and all components are securely mounted and insulated before energising. Never touch live terminals when powered.

---

### Firmware Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/oneflux.git
cd oneflux/firmware

# 2. Open Arduino IDE and install ESP32 board support
# Tools → Board → Boards Manager → search "esp32" → Install Espressif Systems ESP32

# 3. Install required libraries
# Tools → Manage Libraries → search and install:
#   - PZEM-004T-v30 by Jakub Mandula (v1.2.1)
#   - ArduinoJson by Benoit Blanchon

# 4. Create your credentials file
cp config_template.h config.h
```

Edit `config.h` with your credentials:
```cpp
// config.h
#define WIFI_SSID        "Your_WiFi_Name"
#define WIFI_PASSWORD    "Your_WiFi_Password"
#define FIREBASE_HOST    "your-project-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH    "your-firebase-database-secret"
#define SOCKET_ID        "socket1"
```

```bash
# 5. Select board and port
# Tools → Board → ESP32 Arduino → DOIT ESP32 DEVKIT V1
# Tools → Port → COMx (Windows) or /dev/ttyUSB0 (Linux/Mac)

# 6. Upload firmware
# Click Upload (Ctrl+U)

# 7. Open Serial Monitor at 115200 baud to verify sensor readings
```

---

### Firebase Setup

```
1. Go to https://console.firebase.google.com
2. Create a new project (e.g., "oneflux-monitor")
3. Add a Realtime Database → Start in test mode
4. Copy your database URL (e.g., https://oneflux-monitor-default-rtdb.firebaseio.com)
5. Go to Project Settings → Service Accounts → Database Secrets → Copy secret
6. Paste both values into config.h (firmware) and .env (dashboard)

Database rules for development (Realtime Database → Rules):
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

---

### Dashboard Setup

```bash
# Navigate to dashboard folder
cd oneflux/dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_TARIFF_PER_UNIT=6.50
VITE_CO2_FACTOR=0.82
```

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase Hosting (optional)
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 📊 Project Results

Measurements taken during testing across common household appliances:

| Appliance | Rated (W) | Measured Voltage (V) | Measured Current (A) | Measured Power (W) | Error |
|---|---|---|---|---|---|
| Phone Charger | 5 | 231.4 | 0.02 | 4.9 | 2.0% |
| Laptop (HP 65W) | 65 | 231.8 | 0.26 | 62.7 | 3.5% |
| LED Bulb (9W) | 9 | 232.1 | 0.04 | 8.8 | 2.2% |
| Cooler (120W) | 120 | 230.9 | 0.55 | 117.6 | 2.0% |
| Electric Iron (1000W) | 1000 | 231.2 | 4.41 | 985.3 | 1.5% |
| Geyser (2000W) | 2000 | 230.5 | 8.76 | 1968.4 | 1.6% |

**System Performance:**
- End-to-end latency: 2 to 4 seconds (dominated by polling interval)
- Measurement accuracy: better than ±3.5% across all load types
- Device fingerprinting accuracy: above 80% for distinct appliance signatures
- Relay response time: within 2 seconds of dashboard button press
- Firebase free tier data usage: approximately 75MB per month per unit (well within 10GB limit)

---

## ⚠️ Limitations

- Requires active Wi-Fi and internet connection for dashboard updates (no offline buffering yet)
- One hardware unit monitors one socket at a time
- Fingerprinting accuracy degrades for appliances with overlapping power ranges
- Relay rated at 10A / 250V AC — not suitable for geysers above 2.3kW through the relay path
- Designed for single-phase 230V AC / 50Hz (Indian residential standard only)
- No local display — dashboard access requires internet

---

## 🔭 Future Scope

- [ ] Native mobile app (React Native) with push notifications
- [ ] Machine learning based device fingerprinting (TensorFlow.js)
- [ ] Multi-socket centralized dashboard with whole-home view
- [ ] MSEDCL time-of-use tariff API integration
- [ ] Local data buffering via SD card with offline-to-cloud sync
- [ ] PDF / CSV monthly energy report export
- [ ] Gamified energy leaderboard for hostel / institutional deployments
- [ ] Automated relay scheduling (time-based and threshold-based)

---

## 👨‍💻 Team

This project was developed as a Hardware Mini Project for T. Y. B. Tech. in Electronics and Telecommunication Engineering at N. B. Navale Sinhgad College of Engineering, Solapur.

| Name | Roll No. |
|---|---|
| Mr. Piyush Rohidas Sonawane | 338 |
| Ms. Sakshi Dnyaneshwar Shinde | 339 |
| Ms. Shailja Ashok Sargam | 336 |

**Project Guide:** Prof. S. P. Tapkire
**Department:** Electronics and Telecommunication Engineering
**Institution:** N. B. Navale Sinhgad College of Engineering, Kegaon, Solapur
**University:** Punyashlok Ahilyadevi Holkar Solapur University, Solapur
**Academic Year:** 2025-26

---

## 🙏 Acknowledgements

We sincerely thank **Prof. S. P. Tapkire** for his invaluable guidance throughout this project. We also thank **Dr. S. S. Shirgan** (HOD, E&TC), **Dr. M. H. Naikwadi** (Mini Project Coordinator), and **Dr. S. D. Nawale** (Principal) for their encouragement and support.

---

## 📚 References

1. Espressif Systems. (2023). *ESP32 Technical Reference Manual v5.1.* https://docs.espressif.com/projects/esp-idf/en/latest/esp32/
2. Google Firebase. (2024). *Firebase Realtime Database Documentation.* https://firebase.google.com/docs/database
3. Mandula, J. (2021). *PZEM-004T-v30 Arduino Library v1.2.1.* https://github.com/mandulaj/PZEM-004T-v30
4. Recharts Team. (2024). *Recharts: A Composable Charting Library for React.* https://recharts.org
5. Sharma, V. and Gupta, M. (2022). Non-Invasive Current Measurement Techniques for Smart Energy Metering. *IEEE Transactions on Instrumentation and Measurement,* Vol. 71, pp. 1-12.
6. Bureau of Energy Efficiency (BEE). (2023). *Residential Energy Consumption Survey.* https://beeindia.gov.in
7. Central Electricity Authority, India. (2023). *CO₂ Baseline Database for the Indian Power Sector (Version 17).* Grid Emission Factor: 0.82 kg CO₂/kWh.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full details.

---

<div align="center">

**⚡ Built with purpose. Powered by curiosity. Made in Solapur. 🇮🇳**

*If OneFlux helped you or inspired your project, please consider giving it a ⭐ on GitHub!*

[⭐ Star this repo on GitHub](https://github.com/yourusername/oneflux)

</div>
