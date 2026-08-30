import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Cloud,
  Cpu,
  Droplets,
  Flame,
  Gauge,
  HardDriveDownload,
  Info,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MoonStar,
  Radar,
  RefreshCcw,
  Search,
  Settings2,
  ShieldAlert,
  Signal,
  Smartphone,
  Sparkles,
  SunMedium,
  Thermometer,
  TimerReset,
  TrendingUp,
  Wifi,
  Wrench,
} from 'lucide-react'
import { BrowserRouter } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Monitoring', icon: Radar, href: '/monitoring' },
  { label: 'Analytics', icon: Gauge, href: '/analytics' },
  { label: 'Alerts', icon: AlertTriangle, href: '/alerts' },
  { label: 'Reports', icon: BookOpen, href: '/reports' },
  { label: 'Devices', icon: Cpu, href: '/devices' },
  { label: 'Settings', icon: Settings2, href: '/settings' },
  { label: 'About', icon: Info, href: '/about' },
]

const heroFacts = [
  { label: 'Safety', value: 'Protected', icon: ShieldAlert },
  { label: 'Cylinder', value: '68%', icon: Droplets },
  { label: 'Battery', value: '92%', icon: BatteryCharging },
]

const alerts = [
  { level: 'Critical', text: 'Leak threshold exceeded in kitchen zone', time: '2 min ago', tone: 'critical' },
  { level: 'Warning', text: 'Usage spike detected during evening hours', time: '18 min ago', tone: 'warning' },
  { level: 'Info', text: 'Cloud sync completed successfully', time: '1 hour ago', tone: 'info' },
]

const telemetry = [
  { label: 'Gas concentration', value: '14 ppm', icon: Flame, tone: 'good' },
  { label: 'Cylinder weight', value: '15.8 kg', icon: HardDriveDownload, tone: 'info' },
  { label: 'Room temperature', value: '29.4°C', icon: Thermometer, tone: 'neutral' },
  { label: 'Humidity', value: '44%', icon: Droplets, tone: 'neutral' },
  { label: 'Signal strength', value: 'Strong', icon: Signal, tone: 'good' },
  { label: 'Uptime', value: '12d 04h', icon: TimerReset, tone: 'info' },
]

const usagePoints = [28, 34, 40, 35, 48, 52, 56, 61, 58, 64, 69, 72]

const featureIdeas = [
  {
    title: 'Emergency Share',
    desc: 'Share a live incident link with family members, staff, or a technician in one tap.',
    icon: Smartphone,
  },
  {
    title: 'Auto Refill Assistant',
    desc: 'Predict the best refill window using daily and weekly consumption patterns.',
    icon: RefreshCcw,
  },
  {
    title: 'Voice Status',
    desc: 'Get spoken safety summaries and alert prompts for hands-free monitoring.',
    icon: Sparkles,
  },
  {
    title: 'Offline Safe Mode',
    desc: 'Keep local logs and automatically sync them when the network returns.',
    icon: Cloud,
  },
]

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    try {
      const saved = localStorage.getItem('oneguard-theme')
      if (saved === 'dark' || saved === 'light') return saved
    } catch {
      // Ignore storage failures in private browsing / restricted contexts.
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      localStorage.setItem('oneguard-theme', theme)
    } catch {
      // Ignore storage failures.
    }
  }, [theme])

  return [theme, setTheme]
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}

function Shell() {
  const [theme, setTheme] = useTheme()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [settings, setSettings] = useState({
    glassmorphismDepth: true,
    criticalSms: true,
    autoSync: true,
    lowGasVibration: false,
    temperatureWarnings: true,
    batteryFallbackAlerts: true,
  })
  const now = useClock()
  const location = useLocation()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', drawerOpen)
    document.body.classList.toggle('no-scroll', drawerOpen)
    return () => {
      document.body.classList.remove('menu-open')
      document.body.classList.remove('no-scroll')
    }
  }, [drawerOpen])

  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(id)
  }, [toast])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const filteredIdeas = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return featureIdeas
    return featureIdeas.filter((item) => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q))
  }, [search])

  const notify = (message) => setToast(message)
  const toggleSetting = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }))
  const handleSearchKeyDown = (event) => {
    if (event.key !== 'Enter') return
    const q = search.trim().toLowerCase()
    if (!q) return
    const match = navItems.find((item) => item.label.toLowerCase().includes(q) || item.href.includes(q))
    if (match) {
      navigate(match.href)
      notify(`Opened ${match.label}.`)
      setSearch('')
    } else {
      notify('No matching page found.')
    }
  }

  return (
    <div className="app-shell">
      <div className="bg-orb orb-a" />
      <div className="bg-orb orb-b" />
      <div className="bg-orb orb-c" />
      {drawerOpen ? (
        <button
          type="button"
          className="drawer-backdrop show"
          aria-label="Close navigation"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <header className="topbar glass-panel">
        <div className="brand">
          <div className="brand-mark">O</div>
          <div>
            <strong>OneGuard AI</strong>
            <span>Smart LPG safety platform</span>
          </div>
        </div>

        <div className="topbar-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search modules, alerts, reports..."
            aria-label="Search pages and modules"
          />
        </div>

        <div className="status-strip">
          <StatusPill icon={Cloud} label="Cloud" value="Synced" tone="good" />
          <StatusPill icon={Wifi} label="Wi-Fi" value="Strong" tone="info" />
          <StatusPill icon={BatteryCharging} label="Battery" value="92%" tone="good" />
          <StatusPill icon={CalendarDays} label="Time" value={now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} tone="neutral" />
          <button className="icon-button" type="button" aria-label="Notifications" onClick={() => notify('No new notifications right now.')}>
            <Bell size={18} />
          </button>
          <button className="profile-badge" type="button" aria-label="Profile" onClick={() => navigate('/about')}>
            OG
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="Toggle theme"
            aria-pressed={isDark}
          >
            {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setDrawerOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={drawerOpen}
            aria-controls="sidebar-navigation"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      <aside id="sidebar-navigation" className={`sidebar glass-panel ${drawerOpen ? 'open' : ''}`}>
        <div className="sidebar-head">
          <div className="sidebar-title">Navigation</div>
          <div className="sidebar-subtitle">Separate pages for each workspace</div>
        </div>
        <nav className="nav-stack">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.href} to={item.href} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="mini-card">
            <div className="mini-card-title">Live health</div>
            <div className="mini-card-value">94%</div>
            <div className="mini-card-note">Controller connected</div>
          </div>
          <NavLink className="nav-item subtle" to="/about">
            <LogOut size={17} />
            <span>Sign out</span>
          </NavLink>
        </div>
      </aside>

      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                ideas={filteredIdeas}
                onOpenMonitoring={() => navigate('/monitoring')}
                onOpenAlerts={() => navigate('/alerts')}
              />
            }
          />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/alerts" element={<AlertsPage onNotify={notify} />} />
          <Route path="/reports" element={<ReportsPage onNotify={notify} />} />
          <Route path="/devices" element={<DevicesPage onNotify={notify} />} />
          <Route
            path="/settings"
            element={
              <SettingsPage
                settings={settings}
                onToggle={toggleSetting}
                onNotify={notify}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <nav className="bottom-nav glass-panel">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.href} to={item.href} end={item.href === '/'} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {toast ? <div className="toast glass-panel" role="status" aria-live="polite">{toast}</div> : null}
    </div>
  )
}

function DashboardPage({ ideas, onOpenMonitoring, onOpenAlerts }) {
  return (
    <div className="page-stack">
      <section className="hero glass-panel">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={14} />
            Product-grade safety intelligence
          </div>
          <h1>Your home is protected. All monitored sensors are operating normally.</h1>
          <p>
            OneGuard AI combines live LPG telemetry, predictive refill intelligence, and polished incident handling into a premium
            monitoring experience for homes, apartments, restaurants, and commercial kitchens.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={onOpenMonitoring}>
              <ShieldAlert size={16} />
              View safety overview
            </button>
            <button className="secondary-button" type="button" onClick={onOpenAlerts}>
              <ArrowRight size={16} />
              Open alerts
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <CylinderGraphic value={68} />
          <div className="hero-facts">
            {heroFacts.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="hero-fact">
                  <Icon size={16} />
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="Cylinder" value="68%" caption="18 days estimated" icon={Droplets} />
        <StatCard title="Battery" value="92%" caption="Charging and healthy" icon={BatteryCharging} />
        <StatCard title="Sensor Health" value="99.1%" caption="All calibrated" icon={CheckCircle2} />
      </section>

      <section className="section-grid">
        <Panel title="Refill Intelligence" subtitle="A single clear recommendation instead of repeated status cards.">
          <div className="insight-list">
            <InsightRow label="Remaining LPG" value="12.4 kg" />
            <InsightRow label="Daily average" value="0.68 kg" />
            <InsightRow label="Best refill window" value="Book this week" />
            <InsightRow label="Forecast confidence" value="94%" />
          </div>
        </Panel>

        <Panel title="Feature Ideas" subtitle="Useful product additions around the core safety workflow.">
          <div className="feature-grid">
            {ideas.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="feature-card">
                  <Icon size={18} />
                  <strong>{feature.title}</strong>
                  <p>{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </Panel>
      </section>
    </div>
  )
}

function MonitoringPage() {
  return (
    <div className="page-stack">
      <PageHeader title="Live Monitoring" subtitle="Realtime device telemetry without duplicate summary blocks." />
      <section className="section-grid">
        <Panel title="Controller Feed" subtitle="Fresh readings from the ESP32 device.">
          <div className="telemetry-grid">
            {telemetry.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className={`telemetry tone-${item.tone}`}>
                  <Icon size={18} />
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel title="Connection State" subtitle="Clear online/offline status and sync readiness.">
          <div className="timeline">
            <TimelineRow title="Cloud sync" detail="Completed successfully" time="Now" />
            <TimelineRow title="Local cache" detail="Ready for offline buffering" time="Always on" />
            <TimelineRow title="Wi-Fi link" detail="Stable and healthy" time="Live" />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function AnalyticsPage() {
  return (
    <div className="page-stack">
      <PageHeader title="Cylinder Analytics" subtitle="One focused page for capacity, usage, and prediction." />
      <section className="section-grid">
        <Panel title="3D Cylinder Model" subtitle="A single hero visualization instead of repeated cards.">
          <CylinderGraphic value={68} compact />
        </Panel>
        <Panel title="Usage Curve" subtitle="Weekly consumption pattern.">
          <div className="sparkline-card">
            <div className="sparkline">
              {usagePoints.map((point, index) => (
                <span key={index} style={{ height: `${point}%` }} />
              ))}
            </div>
            <div className="chart-foot">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
          </div>
          <div className="insight-list" style={{ marginTop: 16 }}>
            <InsightRow label="Estimated empty date" value="18 days" />
            <InsightRow label="Consumption trend" value="Stable" />
            <InsightRow label="Refill recommendation" value="Book now" />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function AlertsPage({ onNotify }) {
  return (
    <div className="page-stack">
      <PageHeader title="Alerts" subtitle="Critical, warning, and informational incidents in one clean view." />
      <section className="section-grid">
        <Panel title="Recent Incidents" subtitle="No duplicated status tiles, just the events that matter.">
          <div className="alert-list">
            {alerts.map((alert) => (
              <div key={alert.text} className={`alert-item ${alert.tone}`}>
                <div>
                  <strong>{alert.level}</strong>
                  <p>{alert.text}</p>
                </div>
                <span>{alert.time}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Response Actions" subtitle="Suggested next steps.">
          <div className="action-row">
            <ActionButton icon={Bell} label="Notify contacts" onClick={() => onNotify('Emergency contacts notified.')} />
            <ActionButton icon={LifeBuoy} label="Open incident" onClick={() => onNotify('Incident workspace opened.')} />
            <ActionButton icon={RefreshCcw} label="Acknowledge" onClick={() => onNotify('Alert acknowledged.')} />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function ReportsPage({ onNotify }) {
  return (
    <div className="page-stack">
      <PageHeader title="Reports" subtitle="Daily, weekly, and monthly export-ready summaries." />
      <section className="section-grid">
        <Panel title="Report Packs" subtitle="Choose a timeframe and export format.">
          <div className="reports-grid">
            <ReportCard title="Daily" value="96% uptime" tone="good" />
            <ReportCard title="Weekly" value="4 alerts" tone="warning" />
            <ReportCard title="Monthly" value="18 kg used" tone="info" />
            <ReportCard title="Annual" value="94% prediction" tone="good" />
          </div>
        </Panel>
        <Panel title="Export Options" subtitle="Quick delivery for stakeholders and maintenance logs.">
          <div className="action-row">
            <ActionButton icon={BookOpen} label="PDF" onClick={() => onNotify('PDF export prepared.')} />
            <ActionButton icon={CalendarDays} label="CSV" onClick={() => onNotify('CSV export prepared.')} />
            <ActionButton icon={TrendingUp} label="Excel" onClick={() => onNotify('Excel export prepared.')} />
            <ActionButton icon={CheckCircle2} label="JSON" onClick={() => onNotify('JSON export prepared.')} />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function DevicesPage({ onNotify }) {
  return (
    <div className="page-stack">
      <PageHeader title="Devices" subtitle="Firmware, health, and maintenance controls in one page." />
      <section className="section-grid">
        <Panel title="Device Health" subtitle="Technical details without clutter.">
          <div className="device-grid">
            <Detail label="Firmware" value="v3.8.1" />
            <Detail label="Memory" value="72% free" />
            <Detail label="IP" value="192.168.1.23" />
            <Detail label="MAC" value="A4:1B:..." />
          </div>
        </Panel>
        <Panel title="Maintenance" subtitle="Operational tools and diagnostics.">
          <div className="action-row">
            <ActionButton icon={RefreshCcw} label="Reconnect" onClick={() => onNotify('Reconnecting to device...')} />
            <ActionButton icon={LifeBuoy} label="Diagnostics" onClick={() => onNotify('Diagnostics started.')} />
            <ActionButton icon={Wrench} label="Calibration" onClick={() => onNotify('Calibration mode opened.')} />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function SettingsPage({ settings, onToggle, onNotify }) {
  return (
    <div className="page-stack">
      <PageHeader title="Settings" subtitle="Appearance, notification, and threshold preferences." />
      <section className="section-grid">
        <Panel title="Appearance" subtitle="A couple of core controls instead of repeated toggles everywhere.">
          <div className="settings-row">
            <Toggle label="Glassmorphism depth" value={settings.glassmorphismDepth} onToggle={() => { onToggle('glassmorphismDepth'); onNotify('Glassmorphism depth updated.'); }} />
            <Toggle label="Critical SMS" value={settings.criticalSms} onToggle={() => { onToggle('criticalSms'); onNotify('Critical SMS setting updated.'); }} />
            <Toggle label="Auto sync on reconnect" value={settings.autoSync} onToggle={() => { onToggle('autoSync'); onNotify('Auto sync preference saved.'); }} />
          </div>
        </Panel>
        <Panel title="Thresholds" subtitle="Fine-tune the behavior of safety alerts.">
          <div className="settings-row">
            <Toggle label="Low gas vibration" value={settings.lowGasVibration} onToggle={() => { onToggle('lowGasVibration'); onNotify('Low gas vibration preference saved.'); }} />
            <Toggle label="Temperature warnings" value={settings.temperatureWarnings} onToggle={() => { onToggle('temperatureWarnings'); onNotify('Temperature warning updated.'); }} />
            <Toggle label="Battery fallback alerts" value={settings.batteryFallbackAlerts} onToggle={() => { onToggle('batteryFallbackAlerts'); onNotify('Battery fallback alerts updated.'); }} />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="page-stack">
      <PageHeader title="About" subtitle="Product story, value, and a few smart extensions." />
      <section className="section-grid">
        <Panel title="OneGuard AI" subtitle="A polished commercial-style LPG safety platform.">
          <p className="body-copy">
            OneGuard AI turns sensor data into a premium safety workflow with predictive refill intelligence, incident management,
            and resilient offline synchronization. The interface is intentionally designed to feel like a modern product, not a
            student project.
          </p>
        </Panel>
        <Panel title="Extra Ideas" subtitle="Optional features that fit the product well.">
          <div className="feature-grid">
            <IdeaCard icon={Smartphone} title="Emergency Share" text="Send live incidents to family or staff." />
            <IdeaCard icon={Cloud} title="Offline Safe Mode" text="Store and sync data reliably." />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">
          <Sparkles size={14} />
          OneGuard AI
        </div>
        <h1>{title}</h1>
      </div>
      <p>{subtitle}</p>
    </div>
  )
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="glass-panel panel">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function StatCard({ title, value, caption, icon: Icon }) {
  return (
    <article className="stat-card glass-panel">
      <div className="stat-top">
        <span>{title}</span>
        <Icon size={18} />
      </div>
      <strong>{value}</strong>
      <p>{caption}</p>
    </article>
  )
}

function InsightRow({ label, value }) {
  return (
    <div className="metric-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function TimelineRow({ title, detail, time }) {
  return (
    <div className="timeline-item">
      <div className="timeline-dot" />
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
      <span>{time}</span>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="detail-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function StatusPill({ icon: Icon, label, value, tone }) {
  return (
    <div className={`status-pill tone-${tone}`}>
      <Icon size={14} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ActionButton({ label, icon: Icon, onClick }) {
  return (
    <button className="action-button" type="button" onClick={onClick}>
      <Icon size={16} />
      {label}
    </button>
  )
}

function Toggle({ label, value = false, onToggle }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button className={`toggle ${value ? 'on' : ''}`} type="button" aria-pressed={value} onClick={onToggle}>
        <span />
      </button>
    </div>
  )
}

function ReportCard({ title, value, tone }) {
  return (
    <div className={`report-card tone-${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  )
}

function IdeaCard({ icon: Icon, title, text }) {
  return (
    <div className="feature-card">
      <Icon size={18} />
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  )
}

function CylinderGraphic({ value, compact = false }) {
  const fill = Math.max(10, Math.min(100, value))
  return (
    <div className={`cylinder-graphic ${compact ? 'compact' : ''}`}>
      <div className="cylinder-shadow" />
      <div className="cylinder-body">
        <div className="cylinder-top" />
        <div className="cylinder-core">
          <div className="cylinder-fill" style={{ height: `${fill}%` }} />
          <div className="cylinder-glow" />
          <div className="cylinder-hero-text">
            <span>LPG remaining</span>
            <strong>{fill}%</strong>
          </div>
        </div>
        <div className="cylinder-base" />
      </div>
    </div>
  )
}

export default App
