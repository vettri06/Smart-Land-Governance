import { createFileRoute } from "@tanstack/react-router";
import {
  Search, Map, FileText, ClipboardCheck, Plus, ArrowRight, Check, Pencil,
  ShieldCheck, X, Sun, Moon, Monitor, Bell, ChevronDown, Home as HomeIcon,
  Users, BarChart3, TrendingUp, Eye, Download, Filter, Calendar, MapPin,
  Phone, Mail, Globe, Award, Shield, Zap, ArrowUpRight, ChevronRight,
  AlertTriangle, CheckCircle2, Clock, XCircle, Info, Menu, LogOut,
  Settings, User, Building2, Landmark, TreePine, Factory, HelpCircle,
  ExternalLink, Lock, KeyRound, UserCircle, Crown,
} from "lucide-react";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth, DEMO_USERS, type AuthUser } from "@/hooks/use-auth";
import {
  landRecords as initialLandRecords,
  initialApplications,
  serviceDescriptions,
  generateAppId,
  calculateStats,
  formatDate,
  getStatusColor,
  getProgressPercent,
  type LandRecord,
  type Application,
  type ApplicationStatus,
  type ServiceType,
  type Notification,
  type LandType,
} from "@/lib/data";

type CitizenView = "home" | "map" | "search" | "apply" | "status" | "about" | "help";
type AdminView = "dashboard" | "records" | "applications" | "analytics" | "map" | "settings";
type View = CitizenView | AdminView;

export const Route = createFileRoute("/")(
  {
    head: () => ({
      meta: [
        { title: "SuryaLand — Smart Land Governance Platform" },
        { name: "description", content: "A modern, transparent, and efficient digital platform for land record management, survey mapping, and government services." },
        { property: "og:title", content: "SuryaLand — Smart Land Governance Platform" },
        { property: "og:description", content: "Explore land plots, search records, apply for services, and track applications with our digital governance portal." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    }),
    component: Index,
  },
);

/* ──────────────────────────────────────────────────────────── *
 *  ROOT COMPONENT — Login gate
 * ──────────────────────────────────────────────────────────── */

function Index() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <LoginPage auth={auth} />;
  }

  return auth.isAdmin ? <AdminApp auth={auth} /> : <CitizenApp auth={auth} />;
}

/* ════════════════════════════════════════════════════════════ *
 *                       LOGIN PAGE
 * ════════════════════════════════════════════════════════════ */

function LoginPage({ auth }: { auth: ReturnType<typeof useAuth> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = auth.login(username, password);
    if (!result.success) setError(result.error ?? "Login failed.");
  }

  function quickLogin(role: "citizen" | "admin") {
    const entry = DEMO_USERS[role];
    if (entry) {
      setUsername(role);
      setPassword(entry.password);
      auth.login(role, entry.password);
    }
  }

  return (
    <div className="min-h-screen bg-sand font-sans text-ink transition-colors duration-300 flex flex-col">
      {/* Theme toggle in corner */}
      <div className="absolute right-4 top-4 z-10">
        <div className="flex items-center gap-0.5 rounded-lg border border-line bg-paper/60 p-0.5">
          <button onClick={() => setTheme("light")} className={`grid size-7 place-items-center rounded-md transition-all ${theme === "light" ? "bg-paper shadow-sm text-brand" : "text-muted-foreground hover:text-ink"}`} aria-label="Light mode">
            <Sun className="size-3.5" />
          </button>
          <button onClick={() => setTheme("dark")} className={`grid size-7 place-items-center rounded-md transition-all ${theme === "dark" ? "bg-paper shadow-sm text-brand" : "text-muted-foreground hover:text-ink"}`} aria-label="Dark mode">
            <Moon className="size-3.5" />
          </button>
          <button onClick={() => setTheme("system")} className={`grid size-7 place-items-center rounded-md transition-all ${theme === "system" ? "bg-paper shadow-sm text-brand" : "text-muted-foreground hover:text-ink"}`} aria-label="System theme">
            <Monitor className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[960px] grid gap-8 lg:grid-cols-2 items-center">

          {/* Left — Branding */}
          <div className="hidden lg:block">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="grid size-12 place-items-center rounded-2xl gradient-brand text-xl font-bold text-brand-foreground shadow-lg">S</span>
                <div>
                  <div className="font-display text-2xl font-semibold tracking-tight">SuryaLand</div>
                  <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Smart Land Governance</div>
                </div>
              </div>
              <h1 className="font-display text-4xl font-semibold tracking-tight leading-tight mb-3">
                Transparent Land<br />
                <span className="text-gradient">Governance Portal</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                A modern digital platform for land record management, survey mapping, and government services. Access your land records, apply for services, and track applications.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 mt-8">
              {[
                { icon: <Shield className="size-4" />, text: "Verified & Authentic Records" },
                { icon: <Zap className="size-4" />, text: "Fast Application Processing" },
                { icon: <Map className="size-4" />, text: "Interactive Land Maps" },
                { icon: <Globe className="size-4" />, text: "24/7 Online Access" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login Card */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile branding */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl gradient-brand text-lg font-bold text-brand-foreground shadow-sm">S</span>
              <div>
                <div className="font-display text-xl font-semibold tracking-tight">SuryaLand</div>
                <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">Smart Land Governance</div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-7 shadow-xl shadow-brand/5">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="size-4 text-brand" />
                  <h2 className="font-display text-2xl font-semibold">Sign In</h2>
                </div>
                <p className="text-sm text-muted-foreground">Enter your credentials to access the portal</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <label className="form-label">
                  Username
                  <div className="relative mt-1.5">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      required className="field pl-10" value={username}
                      onChange={(e) => { setUsername(e.target.value); setError(""); }}
                      placeholder="Enter username"
                      autoComplete="username"
                    />
                  </div>
                </label>

                <label className="form-label">
                  Password
                  <div className="relative mt-1.5">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      required type={showPassword ? "text" : "password"} className="field pl-10 pr-10"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink transition-colors"
                      onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                      <Eye className="size-4" />
                    </button>
                  </div>
                </label>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                    <AlertTriangle className="size-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full gap-2 shadow-md mt-2">
                  <Lock className="size-4" /> Sign In
                </Button>
              </form>

              {/* Quick login */}
              <div className="mt-6 pt-6 border-t border-line">
                <p className="text-xs font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">Quick Demo Access</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => quickLogin("citizen")}
                    className="group rounded-xl border-2 border-line p-4 text-left transition-all hover:border-brand/40 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="grid size-9 place-items-center rounded-lg bg-info/10 text-info">
                        <User className="size-4" />
                      </span>
                      <span className="font-display text-sm font-semibold">Citizen</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground space-y-0.5">
                      <div className="flex items-center justify-between"><span>User:</span> <code className="font-mono text-ink">citizen</code></div>
                      <div className="flex items-center justify-between"><span>Pass:</span> <code className="font-mono text-ink">citizen123</code></div>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                      Login <ArrowRight className="size-3" />
                    </span>
                  </button>

                  <button
                    onClick={() => quickLogin("admin")}
                    className="group rounded-xl border-2 border-line p-4 text-left transition-all hover:border-brand/40 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
                        <Crown className="size-4" />
                      </span>
                      <span className="font-display text-sm font-semibold">Admin</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground space-y-0.5">
                      <div className="flex items-center justify-between"><span>User:</span> <code className="font-mono text-ink">admin</code></div>
                      <div className="flex items-center justify-between"><span>Pass:</span> <code className="font-mono text-ink">admin123</code></div>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                      Login <ArrowRight className="size-3" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              © 2024 SuryaLand — Smart Land Governance. Prototype for demonstration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ *
 *                    CITIZEN APP
 * ════════════════════════════════════════════════════════════ */

function CitizenApp({ auth }: { auth: ReturnType<typeof useAuth> }) {
  const [view, setView] = useState<CitizenView>("home");
  const [selectedSurvey, setSelectedSurvey] = useState("125/3");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<"survey" | "owner" | "village">("survey");
  const [hasSearched, setHasSearched] = useState(false);
  const [applications, setApplications] = useState(initialApplications.filter(a => a.name === auth.user?.name));
  const [allApplications, setAllApplications] = useState(initialApplications);
  const [statusTerm, setStatusTerm] = useState("");
  const [statusResult, setStatusResult] = useState<Application | null>(null);
  const [form, setForm] = useState({
    name: auth.user?.name ?? "", email: auth.user?.email ?? "", phone: auth.user?.phone ?? "",
    survey: "", service: "Land Record Verification" as ServiceType, priority: "Normal" as "Normal" | "Urgent",
  });
  const [adminRecords] = useState(initialLandRecords);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { theme, setTheme } = useTheme();
  const { notifications, addNotification, removeNotification } = useNotifications();

  const selectedRecord = adminRecords.find((r) => r.survey === selectedSurvey) ?? adminRecords[0]!;
  const stats = useMemo(() => calculateStats(adminRecords, allApplications), [adminRecords, allApplications]);

  const results = useMemo(() => {
    let filtered = adminRecords;
    if (filterType !== "all") filtered = filtered.filter(r => r.type === filterType);
    if (filterStatus !== "all") filtered = filtered.filter(r => r.status === filterStatus);
    if (hasSearched && searchTerm.trim()) {
      const normalized = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((r) => {
        if (searchBy === "survey") return r.survey.toLowerCase().includes(normalized);
        if (searchBy === "owner") return r.owner.toLowerCase().includes(normalized);
        return r.village.toLowerCase().includes(normalized);
      });
    }
    return filtered;
  }, [adminRecords, hasSearched, searchBy, searchTerm, filterType, filterStatus]);

  function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name || !form.survey) {
      addNotification("Please fill in all required fields.", "warning");
      return;
    }
    const nextId = generateAppId(allApplications.length);
    const today = new Date().toISOString().slice(0, 10);
    const nextApp: Application = {
      id: nextId, name: form.name, email: form.email, phone: form.phone,
      survey: form.survey, service: form.service, status: "Submitted",
      appliedDate: today, lastUpdated: today, priority: form.priority,
    };
    setApplications((cur) => [nextApp, ...cur]);
    setAllApplications((cur) => [nextApp, ...cur]);
    setStatusTerm(nextId);
    setStatusResult(nextApp);
    addNotification(`Application ${nextId} submitted successfully! Track it under My Applications.`, "success");
    setForm({ ...form, survey: "", service: "Land Record Verification", priority: "Normal" });
    setView("status");
  }

  function nav(viewName: CitizenView) {
    setView(viewName);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const navItems: { key: CitizenView; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <HomeIcon className="size-4" /> },
    { key: "map", label: "Land Map", icon: <Map className="size-4" /> },
    { key: "search", label: "Search", icon: <Search className="size-4" /> },
    { key: "apply", label: "Apply", icon: <FileText className="size-4" /> },
    { key: "status", label: "My Applications", icon: <ClipboardCheck className="size-4" /> },
  ];

  return (
    <div className="min-h-screen bg-sand font-sans text-ink transition-colors duration-300">
      <NotificationStack notifications={notifications} removeNotification={removeNotification} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-line/60 glass-card" style={{ borderRadius: 0 }}>
        <div className="mx-auto flex min-h-16 max-w-[1400px] items-center justify-between gap-4 px-5 py-2.5 lg:px-8">
          <button className="flex items-center gap-3 text-left transition-transform hover:scale-[1.02]" onClick={() => nav("home")} aria-label="Go to home">
            <span className="grid size-10 place-items-center rounded-xl gradient-brand text-lg font-bold text-brand-foreground shadow-sm">S</span>
            <span className="leading-tight">
              <span className="block font-display text-[18px] font-semibold tracking-tight">SuryaLand</span>
              <span className="block text-[10px] font-medium tracking-wider text-muted-foreground uppercase">Citizen Portal</span>
            </span>
          </button>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Button key={item.key} variant={view === item.key ? "default" : "ghost"} size="sm"
                className={`gap-1.5 transition-all duration-200 ${view === item.key ? "shadow-sm" : "hover:bg-sand-2/60"}`}
                onClick={() => nav(item.key)}>
                {item.icon}{item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <UserBadge user={auth.user!} onLogout={auth.logout} />
            <button className="grid size-9 place-items-center rounded-lg border border-line bg-paper/60 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="animate-fade-in border-t border-line/60 px-5 py-3 lg:hidden">
            <div className="flex flex-wrap gap-1.5">
              {navItems.map((item) => (
                <Button key={item.key} variant={view === item.key ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => nav(item.key)}>
                  {item.icon}{item.label}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive" onClick={auth.logout}>
                <LogOut className="size-4" /> Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-10">
        {view === "home" && <CitizenHomePage onNavigate={nav} adminRecords={adminRecords} applications={applications} stats={stats} user={auth.user!} />}
        {view === "map" && <MapPage records={adminRecords} selectedSurvey={selectedSurvey} onSelect={setSelectedSurvey} selectedRecord={selectedRecord} onNavigate={(v) => nav(v as CitizenView)} />}
        {view === "search" && (
          <SearchPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchBy={searchBy} setSearchBy={setSearchBy}
            onSearch={() => setHasSearched(true)} results={results}
            onSelect={(s) => { setSelectedSurvey(s); nav("map"); }}
            filterType={filterType} setFilterType={setFilterType}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            onReset={() => { setSearchTerm(""); setHasSearched(false); setFilterType("all"); setFilterStatus("all"); }}
          />
        )}
        {view === "apply" && <ApplyPage form={form} setForm={setForm} onSubmit={submitApplication} records={adminRecords} />}
        {view === "status" && (
          <CitizenStatusPage
            statusTerm={statusTerm} setStatusTerm={setStatusTerm}
            result={statusResult}
            onTrack={() => setStatusResult(applications.find(a => a.id.toLowerCase() === statusTerm.trim().toLowerCase()) ?? null)}
            applications={applications}
          />
        )}
        {view === "about" && <AboutPage onNavigate={(v) => nav(v as CitizenView)} />}
        {view === "help" && <HelpPage />}
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ *
 *                     ADMIN APP
 * ════════════════════════════════════════════════════════════ */

function AdminApp({ auth }: { auth: ReturnType<typeof useAuth> }) {
  const [view, setView] = useState<AdminView>("dashboard");
  const [selectedSurvey, setSelectedSurvey] = useState("125/3");
  const [adminRecords, setAdminRecords] = useState(initialLandRecords);
  const [applications, setApplications] = useState(initialApplications);
  const [newRecord, setNewRecord] = useState({ survey: "", owner: "", area: "", type: "Agricultural" as LandType, village: "Talikota", description: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const { notifications, addNotification, removeNotification } = useNotifications();

  const stats = useMemo(() => calculateStats(adminRecords, applications), [adminRecords, applications]);
  const selectedRecord = adminRecords.find((r) => r.survey === selectedSurvey) ?? adminRecords[0]!;

  function addLandRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newRecord.survey || !newRecord.owner || !newRecord.area) {
      addNotification("Please fill in survey number, owner, and area.", "warning");
      return;
    }
    if (adminRecords.some(r => r.survey === newRecord.survey)) {
      addNotification(`Survey ${newRecord.survey} already exists in records.`, "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const record: LandRecord = {
      id: `LR${String(adminRecords.length + 1).padStart(3, "0")}`,
      survey: newRecord.survey, owner: newRecord.owner,
      area: `${newRecord.area} Acres`, type: newRecord.type,
      status: "Pending", village: newRecord.village,
      taluk: "Muddebihal", district: "Vijayapura",
      registeredDate: today, marketValue: "—",
      description: newRecord.description,
    };
    setAdminRecords((cur) => [record, ...cur]);
    setNewRecord({ survey: "", owner: "", area: "", type: "Agricultural", village: "Talikota", description: "" });
    addNotification(`Land record ${record.survey} added to the register.`, "success");
  }

  function verifyRecord(survey: string) {
    setAdminRecords((cur) => cur.map((r) => r.survey === survey ? { ...r, status: "Verified" as const } : r));
    addNotification(`Survey ${survey} has been verified successfully.`, "success");
  }

  function deleteRecord(survey: string) {
    setAdminRecords((cur) => cur.filter(r => r.survey !== survey));
    addNotification(`Record ${survey} has been removed.`, "info");
  }

  function updateAppStatus(id: string, status: ApplicationStatus) {
    setApplications(cur => cur.map(a => a.id === id ? { ...a, status, lastUpdated: new Date().toISOString().slice(0, 10) } : a));
    addNotification(`Application ${id} status updated to ${status}.`, "info");
  }

  function nav(viewName: AdminView) {
    setView(viewName);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const navItems: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 className="size-4" /> },
    { key: "records", label: "Land Records", icon: <FileText className="size-4" /> },
    { key: "applications", label: "Applications", icon: <ClipboardCheck className="size-4" /> },
    { key: "map", label: "Survey Map", icon: <Map className="size-4" /> },
    { key: "analytics", label: "Analytics", icon: <TrendingUp className="size-4" /> },
  ];

  return (
    <div className="min-h-screen bg-sand font-sans text-ink transition-colors duration-300">
      <NotificationStack notifications={notifications} removeNotification={removeNotification} />

      {/* ── Admin Header ── */}
      <header className="sticky top-0 z-50 border-b border-line/60 glass-card" style={{ borderRadius: 0 }}>
        <div className="mx-auto flex min-h-16 max-w-[1400px] items-center justify-between gap-4 px-5 py-2.5 lg:px-8">
          <button className="flex items-center gap-3 text-left transition-transform hover:scale-[1.02]" onClick={() => nav("dashboard")} aria-label="Go to dashboard">
            <span className="grid size-10 place-items-center rounded-xl gradient-brand text-lg font-bold text-brand-foreground shadow-sm">S</span>
            <span className="leading-tight">
              <span className="block font-display text-[18px] font-semibold tracking-tight">SuryaLand</span>
              <span className="block text-[10px] font-medium tracking-wider text-accent uppercase flex items-center gap-1">
                <Crown className="size-3" /> Admin Panel
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Admin navigation">
            {navItems.map((item) => (
              <Button key={item.key} variant={view === item.key ? "default" : "ghost"} size="sm"
                className={`gap-1.5 transition-all duration-200 ${view === item.key ? "shadow-sm" : "hover:bg-sand-2/60"}`}
                onClick={() => nav(item.key)}>
                {item.icon}{item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold text-accent sm:flex">
              <Crown className="size-3" /> ADMIN
            </div>
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <UserBadge user={auth.user!} onLogout={auth.logout} />
            <button className="grid size-9 place-items-center rounded-lg border border-line bg-paper/60 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="animate-fade-in border-t border-line/60 px-5 py-3 lg:hidden">
            <div className="flex flex-wrap gap-1.5">
              {navItems.map((item) => (
                <Button key={item.key} variant={view === item.key ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => nav(item.key)}>
                  {item.icon}{item.label}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive" onClick={auth.logout}>
                <LogOut className="size-4" /> Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-10">
        {view === "dashboard" && <AdminDashboard stats={stats} records={adminRecords} applications={applications} onNavigate={nav} user={auth.user!} />}
        {view === "records" && (
          <AdminRecordsPage records={adminRecords} newRecord={newRecord} setNewRecord={setNewRecord}
            onAdd={addLandRecord} onVerify={verifyRecord} onDelete={deleteRecord} />
        )}
        {view === "applications" && <AdminApplicationsPage applications={applications} onStatusChange={updateAppStatus} />}
        {view === "map" && <MapPage records={adminRecords} selectedSurvey={selectedSurvey} onSelect={setSelectedSurvey} selectedRecord={selectedRecord} onNavigate={() => nav("records")} isAdmin />}
        {view === "analytics" && <AdminAnalyticsPage stats={stats} records={adminRecords} applications={applications} />}
      </main>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  SHARED COMPONENTS
 * ──────────────────────────────────────────────────────────── */

function NotificationStack({ notifications, removeNotification }: { notifications: Notification[]; removeNotification: (id: string) => void }) {
  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2" style={{ maxWidth: 380 }}>
      {notifications.map((n, i) => (
        <div key={n.id} className="animate-slide-in-right glass-card flex items-start gap-3 px-4 py-3 shadow-lg" style={{ animationDelay: `${i * 50}ms` }}>
          {n.type === "success" && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />}
          {n.type === "error" && <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />}
          {n.type === "warning" && <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" />}
          {n.type === "info" && <Info className="mt-0.5 size-4 shrink-0 text-info" />}
          <span className="flex-1 text-sm font-medium">{n.message}</span>
          <button onClick={() => removeNotification(n.id)} className="shrink-0 p-0.5 text-muted-foreground hover:text-ink transition-colors" aria-label="Dismiss"><X className="size-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

function ThemeToggle({ theme, setTheme }: { theme: string; setTheme: (t: "light" | "dark" | "system") => void }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-line bg-sand/60 p-0.5">
      <button onClick={() => setTheme("light")} className={`grid size-7 place-items-center rounded-md transition-all ${theme === "light" ? "bg-paper shadow-sm text-brand" : "text-muted-foreground hover:text-ink"}`} aria-label="Light mode"><Sun className="size-3.5" /></button>
      <button onClick={() => setTheme("dark")} className={`grid size-7 place-items-center rounded-md transition-all ${theme === "dark" ? "bg-paper shadow-sm text-brand" : "text-muted-foreground hover:text-ink"}`} aria-label="Dark mode"><Moon className="size-3.5" /></button>
      <button onClick={() => setTheme("system")} className={`grid size-7 place-items-center rounded-md transition-all ${theme === "system" ? "bg-paper shadow-sm text-brand" : "text-muted-foreground hover:text-ink"}`} aria-label="System theme"><Monitor className="size-3.5" /></button>
    </div>
  );
}

function UserBadge({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative hidden sm:block">
      <button className="flex items-center gap-2.5 rounded-lg border border-line bg-paper/60 px-3 py-1.5 transition-all hover:border-brand/30"
        onClick={() => setOpen(!open)}>
        <div className="text-right leading-tight">
          <div className="text-sm font-semibold">{user.name}</div>
          <div className="text-[10px] text-muted-foreground">{user.role === "admin" ? user.designation : `Citizen · ${user.village}`}</div>
        </div>
        <span className={`grid size-8 place-items-center rounded-full text-xs font-bold text-brand-foreground ${user.role === "admin" ? "bg-accent" : "gradient-brand"}`}>
          {user.avatar}
        </span>
        <ChevronDown className={`size-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 w-56 animate-scale-in rounded-xl border border-line bg-paper p-1.5 shadow-xl">
            <div className="px-3 py-2.5 border-b border-line mb-1">
              <div className="text-sm font-semibold">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider
                ${user.role === 'admin' ? 'border-accent/30 bg-accent/10 text-accent' : 'border-brand/30 bg-brand/10 text-brand'}">
                {user.role === "admin" ? <Crown className="size-2.5" /> : <User className="size-2.5" />}
                {user.role}
              </div>
            </div>
            <button onClick={onLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
              <LogOut className="size-4" /> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action, children, badge }: { eyebrow: string; title: string; description: string; action?: React.ReactNode; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <>
      <AnimatedSection className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">{eyebrow}</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight lg:text-4xl">{title}</h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-3">{badge}{action}</div>
      </AnimatedSection>
      {children}
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls = getStatusColor(status);
  const icon = status === "Verified" || status === "Completed" || status === "Approved" ? <Check className="size-3" />
    : status === "Disputed" || status === "Rejected" ? <AlertTriangle className="size-3" /> : <Clock className="size-3" />;
  return <span className={cls}>{icon}{status}</span>;
}

function StatCard({ label, value, icon, trend, color = "brand" }: { label: string; value: string | number; icon: React.ReactNode; trend?: string; color?: string }) {
  return (
    <div className="group rounded-xl border border-line bg-paper p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-brand/30">
      <div className="flex items-center justify-between mb-3">
        <span className={`grid size-10 place-items-center rounded-lg bg-${color}/15 text-${color} transition-transform group-hover:scale-110`}>{icon}</span>
        {trend && <span className="flex items-center gap-1 text-xs font-semibold text-success"><TrendingUp className="size-3" />{trend}</span>}
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-sand-2/60 text-muted-foreground mb-4">{icon}</div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function RecordCard({ record, onNavigate, admin = false, onVerify, onDelete }: { record: LandRecord; onNavigate?: (view: string) => void; admin?: boolean; onVerify?: () => void; onDelete?: () => void }) {
  const typeIcon = record.type === "Agricultural" ? <TreePine className="size-4" /> : record.type === "Residential" ? <Building2 className="size-4" />
    : record.type === "Commercial" ? <Landmark className="size-4" /> : record.type === "Industrial" ? <Factory className="size-4" /> : <MapPin className="size-4" />;
  return (
    <div className="rounded-xl border border-brand/20 bg-gradient-to-br from-brand/5 to-transparent p-6 lg:col-span-5">
      <div className="flex items-center justify-between mb-1"><span className="eyebrow text-brand">Land Record Details</span><StatusPill status={record.status} /></div>
      <h2 className="mt-2 font-display text-2xl font-semibold">Survey {record.survey}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{record.description || `${record.type} land in ${record.village}`}</p>
      <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
        <div><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><User className="size-3" />Owner</dt><dd className="mt-0.5 font-semibold">{record.owner}</dd></div>
        <div><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3" />Area</dt><dd className="mt-0.5 font-semibold">{record.area}</dd></div>
        <div><dt className="flex items-center gap-1.5 text-xs text-muted-foreground">{typeIcon}Land Type</dt><dd className="mt-0.5 font-semibold">{record.type}</dd></div>
        <div><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Building2 className="size-3" />Village</dt><dd className="mt-0.5 font-semibold">{record.village}</dd></div>
        <div><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3" />District</dt><dd className="mt-0.5 font-semibold">{record.district}</dd></div>
        <div><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar className="size-3" />Registered</dt><dd className="mt-0.5 font-semibold">{formatDate(record.registeredDate)}</dd></div>
        {record.marketValue !== "—" && <div className="col-span-2"><dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><BarChart3 className="size-3" />Market Value</dt><dd className="mt-0.5 text-lg font-bold text-brand">{record.marketValue}</dd></div>}
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        {admin && onVerify && record.status !== "Verified" ? <Button className="flex-1" onClick={onVerify}><ShieldCheck className="size-4" /> Verify</Button>
          : <Button className="flex-1" variant="outline" onClick={() => onNavigate?.("apply")}><FileText className="size-4" /> Apply for Service</Button>}
        {admin && onDelete && <Button size="icon" variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={onDelete}><X className="size-4" /></Button>}
        <Button size="icon" variant="outline" aria-label="Download"><Download className="size-4" /></Button>
      </div>
    </div>
  );
}


/* ──────────────────────────────────────────────────────────── *
 *  CITIZEN HOME PAGE
 * ──────────────────────────────────────────────────────────── */

function CitizenHomePage({ onNavigate, adminRecords, applications, stats, user }: { onNavigate: (v: CitizenView) => void; adminRecords: LandRecord[]; applications: Application[]; stats: ReturnType<typeof calculateStats>; user: AuthUser }) {
  return (
    <>
      {/* Hero */}
      <AnimatedSection className="mb-10">
        <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 lg:p-12">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-brand/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-info/5 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                <span className="size-1.5 rounded-full bg-brand animate-pulse-glow" /> Citizen Portal
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight lg:text-5xl">
              Welcome back,<br /><span className="text-gradient">{user.name.split(" ")[0]}</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground leading-relaxed lg:text-base">
              Search land records, apply for government services, and track your applications — all from your personal dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2 shadow-md" onClick={() => onNavigate("search")}><Search className="size-4" /> Search Records</Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => onNavigate("apply")}><FileText className="size-4" /> Apply for Service</Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection delay={100} className="mb-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Land Records" value={stats.totalRecords} icon={<FileText className="size-5" />} trend="+12%" />
          <StatCard label="Verified Records" value={stats.verifiedRecords} icon={<ShieldCheck className="size-5" />} color="success" />
          <StatCard label="My Applications" value={applications.length} icon={<ClipboardCheck className="size-5" />} color="accent" />
          <StatCard label="Total Area Mapped" value={`${stats.totalArea} Ac`} icon={<Map className="size-5" />} color="info" />
        </div>
      </AnimatedSection>

      {/* Action Cards */}
      <AnimatedSection delay={200} className="mb-10">
        <div className="mb-5"><p className="eyebrow">Services</p><h2 className="font-display text-2xl font-semibold">What would you like to do?</h2></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard step="01" icon={<Search className="size-5" />} title="Search Land" description="Find records by survey number, owner name, or village." onClick={() => onNavigate("search")} />
          <ActionCard step="02" icon={<FileText className="size-5" />} title="Apply for Service" description="Request verification, survey, mutation, or certificates." onClick={() => onNavigate("apply")} />
          <ActionCard step="03" icon={<ClipboardCheck className="size-5" />} title="My Applications" description="Track your applications with reference numbers." onClick={() => onNavigate("status")} />
          <ActionCard step="04" icon={<Map className="size-5" />} title="View Land Map" description="Interactive village map with parcel details." onClick={() => onNavigate("map")} />
        </div>
      </AnimatedSection>

      {/* My Applications Preview */}
      {applications.length > 0 && (
        <AnimatedSection delay={300} className="mb-10">
          <div className="rounded-xl border border-line bg-paper p-6">
            <div className="mb-5 flex items-center justify-between">
              <div><p className="eyebrow">My Applications</p><h2 className="font-display text-xl font-semibold">Your recent submissions</h2></div>
              <Button variant="outline" size="sm" onClick={() => onNavigate("status")} className="gap-1.5">View all <ArrowRight className="size-3.5" /></Button>
            </div>
            <div className="space-y-2.5">
              {applications.slice(0, 3).map(a => (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-4 transition-all hover:border-brand/20">
                  <div><p className="font-bold">{a.id}</p><p className="text-sm text-muted-foreground">{a.service} · Survey {a.survey}</p></div>
                  <StatusPill status={a.status} />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}
    </>
  );
}

function ActionCard({ step, icon, title, description, onClick }: { step: string; icon: React.ReactNode; title: string; description: string; onClick: () => void }) {
  return (
    <button className="group relative rounded-xl border border-line bg-paper p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg" onClick={onClick}>
      <div className="mb-4 flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110 group-hover:rotate-3">{icon}</span>
        <span className="eyebrow text-muted-foreground/50">{step}</span>
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">Get started <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" /></span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  ADMIN DASHBOARD
 * ──────────────────────────────────────────────────────────── */

function AdminDashboard({ stats, records, applications, onNavigate, user }: { stats: ReturnType<typeof calculateStats>; records: LandRecord[]; applications: Application[]; onNavigate: (v: AdminView) => void; user: AuthUser }) {
  const pendingApps = applications.filter(a => a.status !== "Completed" && a.status !== "Rejected");
  const recentRecords = records.slice(0, 5);

  return (
    <>
      <AnimatedSection className="mb-8">
        <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 lg:p-10">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-brand/5 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  <Crown className="size-3" /> Admin Dashboard
                </span>
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight lg:text-4xl">Welcome, {user.name.split(" ")[0]}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{user.designation} · District Office, Vijayapura</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1.5" onClick={() => onNavigate("records")}><Plus className="size-4" /> Add Record</Button>
              <Button className="gap-1.5" onClick={() => onNavigate("applications")}><ClipboardCheck className="size-4" /> Process Applications</Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection delay={100} className="mb-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Records" value={stats.totalRecords} icon={<FileText className="size-5" />} />
          <StatCard label="Verified" value={stats.verifiedRecords} icon={<ShieldCheck className="size-5" />} color="success" />
          <StatCard label="Pending Verification" value={stats.pendingRecords} icon={<Clock className="size-5" />} color="accent" />
          <StatCard label="Active Applications" value={stats.pendingApplications} icon={<ClipboardCheck className="size-5" />} color="info" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending applications */}
          <div className="rounded-xl border border-line bg-paper p-6">
            <div className="mb-4 flex items-center justify-between">
              <div><p className="eyebrow">Attention Needed</p><h2 className="font-display text-xl font-semibold">Pending Applications</h2></div>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => onNavigate("applications")}><ArrowRight className="size-3.5" /></Button>
            </div>
            {pendingApps.length > 0 ? (
              <div className="space-y-2.5">
                {pendingApps.slice(0, 5).map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-line p-3.5 hover:border-brand/20 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand">{a.id}</span>
                        {a.priority === "Urgent" && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">Urgent</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{a.name} · {a.service}</p>
                    </div>
                    <StatusPill status={a.status} />
                  </div>
                ))}
              </div>
            ) : <EmptyState icon={<Check className="size-6" />} title="All clear!" description="No pending applications." />}
          </div>

          {/* Recent records */}
          <div className="rounded-xl border border-line bg-paper p-6">
            <div className="mb-4 flex items-center justify-between">
              <div><p className="eyebrow">Land Register</p><h2 className="font-display text-xl font-semibold">Recent Records</h2></div>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => onNavigate("records")}><ArrowRight className="size-3.5" /></Button>
            </div>
            <div className="space-y-2.5">
              {recentRecords.map(r => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-line p-3.5 hover:border-brand/20 transition-all">
                  <div>
                    <span className="font-bold">{r.survey}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{r.owner} · {r.area}</span>
                  </div>
                  <StatusPill status={r.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  ADMIN RECORDS PAGE
 * ──────────────────────────────────────────────────────────── */

function AdminRecordsPage({ records, newRecord, setNewRecord, onAdd, onVerify, onDelete }: {
  records: LandRecord[]; newRecord: { survey: string; owner: string; area: string; type: LandType; village: string; description: string };
  setNewRecord: (r: typeof newRecord) => void; onAdd: (e: React.FormEvent<HTMLFormElement>) => void; onVerify: (s: string) => void; onDelete: (s: string) => void;
}) {
  return (
    <PageHeading eyebrow="Land Records" title="Manage Land Register" description="Add new land records, verify entries, and manage the register."
      badge={<span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">{records.length} records</span>}>
      <AnimatedSection>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,440px)_1fr]">
          <form className="rounded-xl border border-line bg-paper p-5" onSubmit={onAdd}>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand"><Plus className="size-4" /></span>
              <h2 className="font-display text-xl font-semibold">Add Land Record</h2>
            </div>
            <div className="space-y-3">
              <label className="form-label">Survey Number *<input required className="field mt-1" value={newRecord.survey} onChange={(e) => setNewRecord({ ...newRecord, survey: e.target.value })} placeholder="e.g. 126/1" /></label>
              <label className="form-label">Owner Name *<input required className="field mt-1" value={newRecord.owner} onChange={(e) => setNewRecord({ ...newRecord, owner: e.target.value })} placeholder="e.g. Ramesh Kumar" /></label>
              <label className="form-label">Area (Acres) *<input required type="number" min="0" step="0.1" className="field mt-1" value={newRecord.area} onChange={(e) => setNewRecord({ ...newRecord, area: e.target.value })} placeholder="e.g. 2.5" /></label>
              <label className="form-label">Land Type<select className="field mt-1" value={newRecord.type} onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as LandType })}><option>Agricultural</option><option>Residential</option><option>Commercial</option><option>Industrial</option></select></label>
              <label className="form-label">Village<input className="field mt-1" value={newRecord.village} onChange={(e) => setNewRecord({ ...newRecord, village: e.target.value })} placeholder="Talikota" /></label>
              <label className="form-label">Description<textarea className="field mt-1 min-h-[70px] resize-none" value={newRecord.description} onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })} placeholder="Optional..." /></label>
            </div>
            <Button type="submit" className="mt-5 w-full gap-1.5"><Plus className="size-4" /> Add Record</Button>
          </form>

          <div className="rounded-xl border border-line bg-paper p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">All Records</h2>
              <span className="text-sm text-muted-foreground">{records.length} entries</span>
            </div>
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {records.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3.5 transition-all hover:border-brand/20 hover:bg-sand/30">
                  <div className="flex-1 min-w-[160px]">
                    <div className="flex items-center gap-2"><span className="font-bold text-brand">{r.survey}</span><StatusPill status={r.status} /></div>
                    <span className="text-sm text-muted-foreground">{r.owner} · {r.area} · {r.type}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {r.status !== "Verified" && <Button size="sm" variant="outline" className="gap-1" onClick={() => onVerify(r.survey)}><ShieldCheck className="size-3.5" /> Verify</Button>}
                    <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => onDelete(r.survey)}><X className="size-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageHeading>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  ADMIN APPLICATIONS PAGE
 * ──────────────────────────────────────────────────────────── */

function AdminApplicationsPage({ applications, onStatusChange }: { applications: Application[]; onStatusChange: (id: string, s: ApplicationStatus) => void }) {
  return (
    <PageHeading eyebrow="Applications" title="Process Applications" description="Review, approve, or update the status of citizen applications."
      badge={<span className="rounded-full border border-info/20 bg-info/10 px-3 py-1 text-xs font-semibold text-info">{applications.length} total</span>}>
      <AnimatedSection>
        <div className="rounded-xl border border-line bg-paper p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-3 font-semibold">ID</th>
                  <th className="px-3 py-3 font-semibold">Applicant</th>
                  <th className="px-3 py-3 font-semibold">Service</th>
                  <th className="px-3 py-3 font-semibold">Survey</th>
                  <th className="px-3 py-3 font-semibold">Priority</th>
                  <th className="px-3 py-3 font-semibold">Applied</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(a => (
                  <tr key={a.id} className="border-b border-line/50 last:border-0 hover:bg-sand/30 transition-colors">
                    <td className="px-3 py-3.5 font-bold text-brand">{a.id}</td>
                    <td className="px-3 py-3.5"><div className="font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.email || a.phone || "—"}</div></td>
                    <td className="px-3 py-3.5">{a.service}</td>
                    <td className="px-3 py-3.5">{a.survey}</td>
                    <td className="px-3 py-3.5"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${a.priority === "Urgent" ? "bg-destructive/10 text-destructive" : "bg-sand-2 text-muted-foreground"}`}>{a.priority}</span></td>
                    <td className="px-3 py-3.5 text-muted-foreground">{formatDate(a.appliedDate)}</td>
                    <td className="px-3 py-3.5">
                      <select className="field py-1.5 text-xs" value={a.status} onChange={(e) => onStatusChange(a.id, e.target.value as ApplicationStatus)}>
                        <option>Submitted</option><option>Under Review</option><option>Under Verification</option><option>Approved</option><option>Completed</option><option>Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </PageHeading>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  ADMIN ANALYTICS PAGE
 * ──────────────────────────────────────────────────────────── */

function AdminAnalyticsPage({ stats, records, applications }: { stats: ReturnType<typeof calculateStats>; records: LandRecord[]; applications: Application[] }) {
  return (
    <PageHeading eyebrow="Analytics" title="Reports & Analytics" description="Overview of land records, application processing, and distribution statistics.">
      <AnimatedSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-paper p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Land Type Distribution</h3>
            <div className="space-y-3">
              {["Agricultural", "Residential", "Commercial", "Industrial"].map(type => {
                const count = records.filter(r => r.type === type).length;
                const pct = records.length > 0 ? Math.round((count / records.length) * 100) : 0;
                return (<div key={type}><div className="flex items-center justify-between text-sm mb-1"><span className="font-medium">{type}</span><span className="text-muted-foreground">{count} ({pct}%)</span></div><div className="h-2 rounded-full bg-sand-2"><div className="h-full rounded-full gradient-brand transition-all duration-500" style={{ width: `${pct}%` }} /></div></div>);
              })}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-paper p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Application Status Breakdown</h3>
            <div className="space-y-3">
              {(["Submitted", "Under Review", "Under Verification", "Approved", "Completed", "Rejected"] as ApplicationStatus[]).map(status => {
                const count = applications.filter(a => a.status === status).length;
                const pct = applications.length > 0 ? Math.round((count / applications.length) * 100) : 0;
                return (<div key={status}><div className="flex items-center justify-between text-sm mb-1"><StatusPill status={status} /><span className="text-muted-foreground">{count}</span></div><div className="h-2 rounded-full bg-sand-2"><div className={`h-full rounded-full transition-all duration-500 ${status === "Rejected" ? "bg-destructive" : "gradient-brand"}`} style={{ width: `${pct}%` }} /></div></div>);
              })}
            </div>
          </div>
          <div className="lg:col-span-2 rounded-xl border border-line bg-paper p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-sand/60 p-4 text-center"><div className="text-2xl font-bold text-brand">{stats.totalArea}</div><div className="text-xs text-muted-foreground font-medium mt-1">Total Acres</div></div>
              <div className="rounded-lg bg-sand/60 p-4 text-center"><div className="text-2xl font-bold text-success">{stats.verifiedRecords}</div><div className="text-xs text-muted-foreground font-medium mt-1">Verified Records</div></div>
              <div className="rounded-lg bg-sand/60 p-4 text-center"><div className="text-2xl font-bold text-accent">{stats.completedApplications}</div><div className="text-xs text-muted-foreground font-medium mt-1">Completed Services</div></div>
              <div className="rounded-lg bg-sand/60 p-4 text-center"><div className="text-2xl font-bold text-info">{records.filter(r => r.type === "Agricultural").length}</div><div className="text-xs text-muted-foreground font-medium mt-1">Agricultural Plots</div></div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageHeading>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  MAP PAGE (shared)
 * ──────────────────────────────────────────────────────────── */

function MapPage({ records, selectedSurvey, onSelect, selectedRecord, onNavigate, isAdmin = false }: { records: LandRecord[]; selectedSurvey: string; onSelect: (s: string) => void; selectedRecord: LandRecord; onNavigate: (v: string) => void; isAdmin?: boolean }) {
  const legend = [
    { label: "Verified", cls: "bg-success/20 border-success/40" },
    { label: "Pending", cls: "bg-accent/20 border-accent/40" },
    { label: "Disputed", cls: "bg-destructive/20 border-destructive/40" },
    { label: "Selected", cls: "bg-brand/20 border-brand" },
  ];
  return (
    <PageHeading eyebrow="Land Map" title="Village Survey Map" description="Click any parcel to view its detailed land record."
      action={<span className="text-xs text-muted-foreground">Talikota · Taluka Muddebihal · Vijayapura</span>}
      badge={<div className="hidden items-center gap-3 sm:flex">{legend.map(l => <span key={l.label} className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold ${l.cls}`}><span className={`size-2 rounded-full ${l.cls.split(" ")[0]}`} />{l.label}</span>)}</div>}>
      <AnimatedSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-xl border border-line bg-paper p-5 lg:col-span-7">
            <div className="grid aspect-[4/3] grid-cols-4 grid-rows-3 gap-2.5 rounded-xl bg-sand-2/30 p-3">
              {records.slice(0, 12).map((r) => (
                <button key={r.survey} onClick={() => onSelect(r.survey)}
                  className={`relative rounded-xl border-2 p-2.5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                    selectedSurvey === r.survey ? "border-brand bg-brand/10 shadow-md ring-2 ring-brand/20" :
                    r.status === "Disputed" ? "border-destructive/40 bg-destructive/5" :
                    r.status === "Pending" ? "border-accent/30 bg-accent/5" : "border-success/20 bg-success/5"}`}>
                  <span className="block text-sm font-bold">{r.survey}</span>
                  <span className="text-[10px] text-muted-foreground">{r.type}</span>
                  <span className="mt-0.5 block text-[9px] font-medium text-muted-foreground/70">{r.owner.split(" ")[0]}</span>
                  {selectedSurvey === r.survey && <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-brand text-brand-foreground shadow-sm"><Check className="size-3" /></span>}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Selected: <strong className="text-ink">{selectedSurvey}</strong></span>
              <span>{records.length} records total</span>
            </div>
          </div>
          <RecordCard record={selectedRecord} onNavigate={onNavigate} admin={isAdmin} />
        </div>
      </AnimatedSection>
    </PageHeading>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  SEARCH PAGE (citizen)
 * ──────────────────────────────────────────────────────────── */

function SearchPage({ searchTerm, setSearchTerm, searchBy, setSearchBy, onSearch, results, onSelect, filterType, setFilterType, filterStatus, setFilterStatus, onReset }: {
  searchTerm: string; setSearchTerm: (v: string) => void; searchBy: "survey" | "owner" | "village"; setSearchBy: (v: "survey" | "owner" | "village") => void;
  onSearch: () => void; results: LandRecord[]; onSelect: (s: string) => void;
  filterType: string; setFilterType: (v: string) => void; filterStatus: string; setFilterStatus: (v: string) => void; onReset: () => void;
}) {
  return (
    <PageHeading eyebrow="Search Records" title="Find a land record" description="Search by survey number, owner name, or village."
      badge={<span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">{results.length} records found</span>}>
      <AnimatedSection>
        <div className="rounded-xl border border-line bg-paper p-5 mb-5">
          <form className="grid gap-3 md:grid-cols-[1fr_160px_160px_auto]" onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="field pl-10"
                placeholder={searchBy === "survey" ? "e.g. 125/3" : searchBy === "owner" ? "e.g. Ravi Kumar" : "e.g. Talikota"} />
            </div>
            <select className="field" value={searchBy} onChange={(e) => setSearchBy(e.target.value as typeof searchBy)}>
              <option value="survey">Survey Number</option><option value="owner">Owner Name</option><option value="village">Village</option>
            </select>
            <select className="field" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option><option value="Agricultural">Agricultural</option><option value="Residential">Residential</option><option value="Commercial">Commercial</option><option value="Industrial">Industrial</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="gap-1.5"><Search className="size-4" /> Search</Button>
              <Button type="button" variant="outline" onClick={onReset}>Reset</Button>
            </div>
          </form>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1"><Filter className="inline size-3 mr-1" />Status:</span>
          {["all", "Verified", "Pending", "Disputed"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${filterStatus === s ? "border-brand bg-brand/10 text-brand" : "border-line bg-paper text-muted-foreground hover:border-brand/30"}`}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-line bg-paper p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Search Results</h2><span className="text-sm text-muted-foreground">{results.length} record{results.length !== 1 ? "s" : ""}</span></div>
          {results.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead><tr className="border-b border-line text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-3 font-semibold">Survey No.</th><th className="px-3 py-3 font-semibold">Owner</th><th className="px-3 py-3 font-semibold">Area</th>
                  <th className="px-3 py-3 font-semibold">Land Type</th><th className="px-3 py-3 font-semibold">Village</th><th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Registered</th><th className="px-3 py-3" />
                </tr></thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id} className="border-b border-line/50 last:border-0 transition-colors hover:bg-sand/40">
                      <td className="px-3 py-3.5 font-bold text-brand">{r.survey}</td><td className="px-3 py-3.5 font-medium">{r.owner}</td><td className="px-3 py-3.5">{r.area}</td>
                      <td className="px-3 py-3.5">{r.type}</td><td className="px-3 py-3.5">{r.village}</td><td className="px-3 py-3.5"><StatusPill status={r.status} /></td>
                      <td className="px-3 py-3.5 text-muted-foreground">{formatDate(r.registeredDate)}</td>
                      <td className="px-3 py-3.5 text-right"><Button size="sm" variant="outline" className="gap-1" onClick={() => onSelect(r.survey)}><Eye className="size-3.5" /> View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState icon={<Search className="size-6" />} title="No records found" description="Try adjusting your search terms or filters." />}
        </div>
      </AnimatedSection>
    </PageHeading>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  APPLY PAGE (citizen)
 * ──────────────────────────────────────────────────────────── */

function ApplyPage({ form, setForm, onSubmit, records }: { form: { name: string; email: string; phone: string; survey: string; service: ServiceType; priority: "Normal" | "Urgent" }; setForm: (f: typeof form) => void; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; records: LandRecord[] }) {
  return (
    <PageHeading eyebrow="Apply for Service" title="Request a land service" description="Complete the form to submit a service request.">
      <AnimatedSection>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,640px)_1fr]">
          <form className="rounded-xl border border-line bg-paper p-6" onSubmit={onSubmit}>
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand"><FileText className="size-5" /></span>
              <div><h2 className="font-display text-xl font-semibold">Application Form</h2><p className="text-xs text-muted-foreground">Fields marked * are required</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-label">Full Name *<input required className="field mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" /></label>
              <label className="form-label">Email<input type="email" className="field mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" /></label>
              <label className="form-label">Phone<input type="tel" className="field mt-1.5" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" /></label>
              <label className="form-label">Survey Number *
                <select className="field mt-1.5" value={form.survey} onChange={(e) => setForm({ ...form, survey: e.target.value })}>
                  <option value="">Select survey number</option>
                  {records.map(r => <option key={r.id} value={r.survey}>{r.survey} — {r.owner}</option>)}
                </select>
              </label>
              <label className="form-label sm:col-span-2">Service Type *
                <select className="field mt-1.5" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value as ServiceType })}>
                  {Object.keys(serviceDescriptions).map(s => <option key={s}>{s}</option>)}
                </select>
                <p className="mt-1.5 text-xs text-muted-foreground">{serviceDescriptions[form.service]}</p>
              </label>
              <label className="form-label">Priority
                <select className="field mt-1.5" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as "Normal" | "Urgent" })}>
                  <option value="Normal">Normal</option><option value="Urgent">Urgent</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg" className="gap-2 shadow-md"><FileText className="size-4" /> Submit Application</Button>
              <span className="text-xs text-muted-foreground">You'll get an ID for tracking</span>
            </div>
          </form>
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-paper p-5">
              <h3 className="font-display text-lg font-semibold mb-4">Available Services</h3>
              <div className="space-y-3">
                {Object.entries(serviceDescriptions).map(([name, desc]) => (
                  <div key={name} className={`rounded-lg border p-3.5 transition-all cursor-pointer ${form.service === name ? "border-brand/40 bg-brand/5" : "border-line hover:border-brand/20"}`}
                    onClick={() => setForm({ ...form, service: name as ServiceType })}>
                    <div className="flex items-center justify-between"><span className="text-sm font-semibold">{name}</span>{form.service === name && <Check className="size-4 text-brand" />}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-5">
              <h3 className="font-display text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">Contact our help desk for assistance.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-3.5" /> 1800-425-0001 (Toll Free)</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="size-3.5" /> support@suryaland.gov.in</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-3.5" /> Mon-Sat, 9:00 AM - 5:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageHeading>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  CITIZEN STATUS PAGE
 * ──────────────────────────────────────────────────────────── */

function CitizenStatusPage({ statusTerm, setStatusTerm, result, onTrack, applications }: { statusTerm: string; setStatusTerm: (v: string) => void; result: Application | null; onTrack: () => void; applications: Application[] }) {
  const steps: ApplicationStatus[] = ["Submitted", "Under Review", "Under Verification", "Approved", "Completed"];
  return (
    <PageHeading eyebrow="My Applications" title="Track your applications" description="View the status and progress of your submitted applications."
      badge={<span className="rounded-full border border-info/20 bg-info/10 px-3 py-1 text-xs font-semibold text-info">{applications.length} application{applications.length !== 1 ? "s" : ""}</span>}>
      <AnimatedSection>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,540px)_1fr]">
          <div className="space-y-5">
            <form className="rounded-xl border border-line bg-paper p-5" onSubmit={(e) => { e.preventDefault(); onTrack(); }}>
              <label className="form-label">Application ID
                <div className="mt-1.5 flex gap-2">
                  <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input className="field pl-10" value={statusTerm} onChange={(e) => setStatusTerm(e.target.value)} placeholder="e.g. APP001" /></div>
                  <Button type="submit" className="gap-1.5 shrink-0"><Search className="size-4" /> Track</Button>
                </div>
              </label>
            </form>
            {result ? (
              <div className="rounded-xl border border-brand/20 bg-gradient-to-br from-brand/5 to-transparent p-6">
                <div className="flex items-center justify-between mb-4"><div><span className="eyebrow text-brand">Application Found</span><h3 className="mt-1 font-display text-2xl font-bold">{result.id}</h3></div><StatusPill status={result.status} /></div>
                <dl className="grid grid-cols-2 gap-3 text-sm mb-5">
                  <div><dt className="text-xs text-muted-foreground">Service</dt><dd className="font-semibold">{result.service}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Survey</dt><dd className="font-semibold">{result.survey}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Applied</dt><dd className="font-semibold">{formatDate(result.appliedDate)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Last Updated</dt><dd className="font-semibold">{formatDate(result.lastUpdated)}</dd></div>
                </dl>
                <div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold text-muted-foreground">Progress</span><span className="font-bold text-brand">{getProgressPercent(result.status)}%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-sand-2"><div className={`h-full rounded-full transition-all duration-700 ${result.status === "Rejected" ? "bg-destructive" : "gradient-brand"}`} style={{ width: `${getProgressPercent(result.status)}%` }} /></div>
                <div className="mt-5 flex items-center justify-between">
                  {steps.map((step, i) => {
                    const currentIdx = steps.indexOf(result.status);
                    const isActive = i <= currentIdx;
                    return (<div key={step} className="flex flex-col items-center gap-1"><div className={`grid size-6 place-items-center rounded-full text-[10px] font-bold transition-all ${isActive ? "gradient-brand text-brand-foreground" : "bg-sand-2 text-muted-foreground"}`}>{isActive ? <Check className="size-3" /> : i + 1}</div><span className={`text-[9px] font-medium max-w-[60px] text-center leading-tight ${isActive ? "text-brand" : "text-muted-foreground"}`}>{step}</span></div>);
                  })}
                </div>
                {result.remarks && <div className="mt-4 rounded-lg border border-success/20 bg-success/5 p-3 text-sm text-success"><strong>Remarks:</strong> {result.remarks}</div>}
              </div>
            ) : statusTerm ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center">
                <XCircle className="mx-auto size-8 text-destructive/60 mb-2" /><p className="text-sm font-semibold text-destructive">No application found</p><p className="mt-1 text-xs text-muted-foreground">Check the ID and try again.</p>
              </div>
            ) : null}
          </div>
          <div className="rounded-xl border border-line bg-paper p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Your Applications</h2><span className="text-sm text-muted-foreground">{applications.length} total</span></div>
            {applications.length > 0 ? (
              <div className="space-y-2.5">
                {applications.map((a) => (
                  <button key={a.id} className={`w-full text-left rounded-lg border p-4 transition-all hover:shadow-sm ${statusTerm === a.id ? "border-brand/40 bg-brand/5" : "border-line hover:border-brand/20"}`}
                    onClick={() => { setStatusTerm(a.id); }}>
                    <div className="flex items-center justify-between"><span className="font-bold">{a.id}</span><StatusPill status={a.status} /></div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.service} · Survey {a.survey}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-sand-2"><div className="h-full rounded-full gradient-brand transition-all" style={{ width: `${getProgressPercent(a.status)}%` }} /></div>
                  </button>
                ))}
              </div>
            ) : <EmptyState icon={<FileText className="size-6" />} title="No applications yet" description="Submit a service request from the Apply page." />}
          </div>
        </div>
      </AnimatedSection>
    </PageHeading>
  );
}

/* ──────────────────────────────────────────────────────────── *
 *  ABOUT & HELP PAGES
 * ──────────────────────────────────────────────────────────── */

function AboutPage({ onNavigate }: { onNavigate: (v: string) => void }) {
  const features = [
    { icon: <Search className="size-5" />, title: "Digital Land Search", desc: "Search and access land records instantly." },
    { icon: <Map className="size-5" />, title: "Interactive Maps", desc: "Visual survey maps with parcel info." },
    { icon: <Shield className="size-5" />, title: "Verified Records", desc: "Government-verified land records." },
    { icon: <Zap className="size-5" />, title: "Fast Processing", desc: "Quick application processing." },
    { icon: <Award className="size-5" />, title: "Transparent System", desc: "Complete transparency in governance." },
    { icon: <Globe className="size-5" />, title: "Online Services", desc: "Apply from anywhere, anytime." },
  ];
  return (
    <PageHeading eyebrow="About" title="About SuryaLand" description="A modern digital platform for transparent land governance.">
      <AnimatedSection>
        <div className="mb-10 rounded-2xl gradient-hero p-8 lg:p-10">
          <h2 className="font-display text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed lg:text-base">SuryaLand is committed to transforming land governance through digital innovation, providing a transparent, efficient, and accessible platform for all citizens.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 80} className="rounded-xl border border-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand mb-3">{f.icon}</span>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center"><Button size="lg" className="gap-2" onClick={() => onNavigate("home")}><HomeIcon className="size-4" /> Back to Home</Button></div>
      </AnimatedSection>
    </PageHeading>
  );
}

function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "How do I search for a land record?", a: "Navigate to Search from the menu. You can search by survey number, owner name, or village. Use filters to narrow results." },
    { q: "How do I apply for a land service?", a: "Go to Apply, fill in your details, select survey number and service type, then submit. You'll receive an application ID." },
    { q: "How can I track my application?", a: "Visit My Applications and enter your ID (e.g., APP001). You'll see current status and progress." },
    { q: "What services are available?", a: "Land Record Verification, Boundary Survey, Record Correction, Mutation, Encumbrance Certificate, and Title Deed." },
    { q: "How long does processing take?", a: "Normal: 7-15 working days. Urgent: faster processing (additional fees may apply)." },
    { q: "How do I contact support?", a: "Call 1800-425-0001 (toll free) or email support@suryaland.gov.in. Office hours: Mon-Sat, 9 AM - 5 PM." },
  ];
  return (
    <PageHeading eyebrow="Help Center" title="Frequently Asked Questions" description="Find answers to common questions about the platform.">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-line bg-paper overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-sand/40" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-semibold pr-4">{faq.q}</span>
                <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <div className="px-5 pb-5 pt-0 animate-fade-in"><p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center rounded-xl border border-brand/20 bg-brand/5 p-8 max-w-3xl mx-auto">
          <HelpCircle className="mx-auto size-10 text-brand/60 mb-3" />
          <h3 className="font-display text-xl font-semibold">Still need help?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Contact our support team for personalized assistance.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground"><Phone className="size-3.5" /> 1800-425-0001</span>
            <span className="flex items-center gap-2 text-muted-foreground"><Mail className="size-3.5" /> support@suryaland.gov.in</span>
          </div>
        </div>
      </AnimatedSection>
    </PageHeading>
  );
}