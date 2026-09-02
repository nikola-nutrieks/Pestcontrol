import React, { useState } from 'react';
import {
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Bug,
  ShieldAlert,
  FileText,
  Calendar,
  Radio,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  CheckSquare,
  Sparkles,
  QrCode,
  Info,
  Layers,
  ArrowRight,
  ChevronRight,
  Activity,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { usePestControl } from '../../store/pestControlStore';
import { hrTranslations } from '../../i18n/hr';

interface DashboardViewProps {
  onSelectModule: (module: string) => void;
  onOpenQrScanner: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectModule,
  onOpenQrScanner,
}) => {
  const {
    sites,
    activeSite,
    devices,
    inspections,
    findings,
    incidents,
    correctiveActions,
    documents,
    selectedSiteId,
    setSelectedSiteId,
    currentUser,
  } = usePestControl();

  const [period, setPeriod] = useState<'30' | '90' | '12m' | 'year'>('90');

  // Filter entities by active site if single site chosen
  const filteredDevices = activeSite ? devices.filter((d) => d.siteId === activeSite.id) : devices;
  const filteredFindings = activeSite ? findings.filter((f) => f.siteId === activeSite.id) : findings;
  const filteredActions = activeSite ? correctiveActions.filter((a) => a.siteId === activeSite.id) : correctiveActions;
  const filteredInspections = activeSite ? inspections.filter((i) => i.siteId === activeSite.id) : inspections;
  const filteredDocs = activeSite ? documents.filter((d) => d.siteId === activeSite.id) : documents;
  const filteredIncidents = activeSite ? incidents.filter((i) => i.siteId === activeSite.id) : incidents;

  // Key metrics
  const activeSitesCount = sites.filter((s) => s.active).length;
  const openCriticalFindings = filteredFindings.filter(
    (f) => (f.confirmedSeverity === 'KRITICNO' || f.confirmedSeverity === 'VISOKO') && f.status !== 'ZATVORENO'
  );
  const openIncidentsCount = filteredIncidents.filter((i) => i.status !== 'ZATVORENO').length;
  const overdueActions = filteredActions.filter((a) => a.status === 'OTVORENO' || a.status === 'CEKA_DOKAZ');
  const uninspectedDevices = filteredDevices.filter((d) => d.status === 'PLANIRAN' || d.status === 'OSTECEN');
  const expiringDocs = filteredDocs.filter((d) => d.isExpiringSoon || d.isExpired);

  // Chart data: Monthly pest trends (Synthetic Food-Industry Realistic Data)
  const monthlyTrendData = [
    { month: 'Ožu', glodavci: 1, letMuhe: 8, moljci: 2, zohari: 0 },
    { month: 'Tra', glodavci: 0, letMuhe: 14, moljci: 4, zohari: 0 },
    { month: 'Svi', glodavci: 0, letMuhe: 22, moljci: 9, zohari: 0 },
    { month: 'Lip', glodavci: 0, letMuhe: 35, moljci: 15, zohari: 1 },
    { month: 'Srp', glodavci: 1, letMuhe: 42, moljci: 18, zohari: 0 },
    { month: 'Kol', glodavci: 2, letMuhe: 28, moljci: 12, zohari: 0 },
  ];

  const pestGroupDistribution = [
    { name: 'Leteći insekti (UV)', value: 48, color: '#6366f1' },
    { name: 'Skladišni moljci', value: 32, color: '#f59e0b' },
    { name: 'Glodavci (Perimetar)', value: 14, color: '#f43f5e' },
    { name: 'Gmižući insekti', value: 6, color: '#10b981' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ============================================================ */}
      {/* MASTER BENTO GRID - PRIMARY HERO SECTION */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* BENTO 1: Active Operational Workspace Hero (2x2 Span) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">
                  {activeSite ? `Aktivna lokacija • ${activeSite.code}` : 'Grupni QA Workspace'}
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white tracking-tight">
                {activeSite ? activeSite.name : 'Atlantic Grupa Sustav Kontrole Štetnika'}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-zinc-800/90 rounded-full text-[10px] border border-zinc-700 uppercase font-bold text-zinc-300">
                IFS Food v8
              </span>
              <span className="px-3 py-1 bg-zinc-800/90 rounded-full text-[10px] border border-zinc-700 uppercase font-bold text-zinc-300">
                HACCP Sukladnost
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] border border-indigo-500/30 uppercase font-bold">
                {activeSite ? activeSite.siteTypeHr : `${activeSitesCount} Lokacije`}
              </span>
            </div>
          </div>

          <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 relative z-10 border-t border-zinc-800/60 mt-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-11 h-11 rounded-full border-4 border-[#121212] bg-zinc-700 flex items-center justify-center font-bold text-xs text-white shadow-md">
                  IP
                </div>
                <div className="w-11 h-11 rounded-full border-4 border-[#121212] bg-zinc-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
                  MB
                </div>
                <div className="w-11 h-11 rounded-full border-4 border-[#121212] bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  +3
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {activeSite?.qaLeadName || 'QA & DDD Nadzorni Tim'}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  {activeSite?.activeContractorName || 'Eko-Deratizacija • Ciklus Q3'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">96.4%</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">
                Ukupni IPM Indeks Sukladnosti
              </p>
            </div>
          </div>
        </div>

        {/* BENTO 2: Daily Agenda / Corrective Action Tasks (1 Col Span) */}
        <div className="col-span-1 lg:col-span-1 bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white tracking-tight">Dnevni Plan & CAPA</h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                {overdueActions.length + 2} Aktiva
              </span>
            </div>

            <div className="space-y-4">
              {/* Task 1 */}
              <div
                onClick={() => onSelectModule('correctiveActions')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-lg border-2 border-indigo-500 flex-shrink-0 flex items-center justify-center bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                  <div className="w-2 h-2 bg-indigo-500 rounded-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                    Verifikacija CAPA: KM-2026-00045
                  </p>
                  <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Rok: 05.09.2026</p>
                </div>
              </div>

              {/* Task 2 (Completed) */}
              <div
                onClick={() => onSelectModule('inspections')}
                className="flex items-center gap-3 opacity-40 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-through text-zinc-300 truncate">
                    Tjedna kontrola UV ljepljivih ploča
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Završeno • 08:30</p>
                </div>
              </div>

              {/* Task 3 */}
              <div
                onClick={() => onSelectModule('findings')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-lg border-2 border-zinc-700 flex-shrink-0 group-hover:border-zinc-500 transition-colors"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-white transition-colors">
                    Nadzor nalaza moljaca (FER-SKL-005)
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Skladište sirovina</p>
                </div>
              </div>

              {/* Task 4 */}
              <div
                onClick={() => onSelectModule('devices')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-lg border-2 border-zinc-700 flex-shrink-0 group-hover:border-zinc-500 transition-colors"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-white transition-colors">
                    Zamjena poklopca DK-EXT-008
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Perimetar • Petak</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectModule('correctiveActions')}
            className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest mt-6 transition-all border border-zinc-700/60 shadow-md"
          >
            Svi Zadaci & CAPA →
          </button>
        </div>

        {/* BENTO 3: Indigo Highlight Productivity / Inspection Counter (1 Col Span) */}
        <div
          onClick={() => onSelectModule('devices')}
          className="col-span-1 row-span-1 bg-indigo-600 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl text-white cursor-pointer hover:bg-indigo-500 transition-all group"
        >
          <div className="flex justify-between items-start text-white/90">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Monitoring Točke</p>
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></div>
          </div>
          <div className="mt-8">
            <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {filteredDevices.filter((d) => d.status === 'AKTIVAN').length}
              <span className="text-2xl text-white/70 font-normal">/{filteredDevices.length}</span>
            </p>
            <p className="text-xs text-white/80 font-medium mt-1">
              Aktivnih nadzornih uređaja u sustavu
            </p>
          </div>
        </div>

        {/* BENTO 4: Quick QR Inspection Station / Audit Trigger */}
        <div className="col-span-1 row-span-1 bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            Brzi Terenski Nadzor
          </p>
          <p className="text-3xl sm:text-4xl font-mono font-bold text-white mb-4">
            QR SCAN
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onSelectModule('floorPlan')}
              className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-300 border border-zinc-700 transition-colors"
              title="Tlocrt"
            >
              Tlocrt
            </button>
            <button
              onClick={onOpenQrScanner}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 text-black flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 shadow-md"
            >
              <QrCode className="w-4 h-4" />
              Skeniraj
            </button>
          </div>
        </div>

        {/* BENTO 5: Team & Contractor Availability (2 Col Span) */}
        <div className="col-span-1 md:col-span-2 row-span-1 bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-center shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Dostupnost & Status Timova
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Operativno
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Person 1 */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">Ivan Perić</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">QA Voditelj • Online</p>
              </div>
            </div>

            {/* Person 2 */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">Marko Babić</p>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">DDD Tehničar • Teren</p>
              </div>
            </div>

            {/* Person 3 */}
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-11 h-11 bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">Ana Kovač</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sanitarni Nadzor</p>
              </div>
            </div>
          </div>
        </div>

        {/* BENTO 6: High-Contrast "Coming Up Next" Audit Showcase (2 Col Span) */}
        <div className="col-span-1 md:col-span-2 row-span-1 bg-white text-zinc-900 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl shadow-indigo-500/10">
          <div className="flex-1 min-w-0">
            <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
              Nadolazeći Vanjski Audit
            </h3>
            <p className="text-zinc-950 text-2xl font-bold tracking-tight">
              Godišnji IFS Food v8 & HACCP Audit
            </p>
            <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
              Certifikacijska provjera perimetra, evidencije biocida i CAPA mjera
            </p>
          </div>

          <div className="hidden sm:block h-12 w-[1px] bg-zinc-200"></div>

          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex flex-col items-start sm:items-center min-w-[70px]">
              <p className="text-zinc-400 text-[10px] font-bold uppercase mb-0.5">Početak za</p>
              <p className="text-zinc-900 text-3xl font-black">14d</p>
            </div>

            <button
              onClick={() => onSelectModule('reports')}
              className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap"
            >
              Audit Paket →
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* SECONDARY BENTO ROW - CRITICAL FINDINGS & UPCOMING DUTIES */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Bento Attention Card */}
        <div className="bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {hrTranslations.dashboard.attentionNeeded}
                </h2>
                <p className="text-xs text-zinc-500">Stavke koje zahtijevaju hitnu QA verifikaciju</p>
              </div>
            </div>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Prioritet 1
            </span>
          </div>

          <div className="space-y-3">
            {/* Critical item 1 */}
            <div
              onClick={() => onSelectModule('findings')}
              className="p-4 rounded-2xl bg-[#18181b] border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 mt-0.5 flex-shrink-0">
                    <Bug className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                      Prekoračen prag moljaca: FER-SKL-005 (7 jedinki)
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      Skladište praškastih sirovina • Pokrenuta CAPA KM-2026-00045
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase tracking-wider flex-shrink-0">
                  Kritično
                </span>
              </div>
            </div>

            {/* Critical item 2 */}
            <div
              onClick={() => onSelectModule('correctiveActions')}
              className="p-4 rounded-2xl bg-[#18181b] border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      Rok za provedbu CAPA mjere: KM-2026-00045
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      Odgovorna osoba: Petar Radić • Rok: 05.09.2026
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider flex-shrink-0">
                  Za 3 dana
                </span>
              </div>
            </div>

            {/* Critical item 3 */}
            <div
              onClick={() => onSelectModule('devices')}
              className="p-4 rounded-2xl bg-[#18181b] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5 flex-shrink-0">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Oštećena točka monitoringa: DK-EXT-008
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      Vanjski perimetar tvornice • Poklopac oštećen
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-bold uppercase tracking-wider flex-shrink-0">
                  Oštećeno
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Upcoming Duties Card */}
        <div className="bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {hrTranslations.dashboard.upcomingDuties}
                </h2>
                <p className="text-xs text-zinc-500">Raspored kontrola i revizija za Rujan 2026</p>
              </div>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-zinc-700">
              Rujan 2026
            </span>
          </div>

          <div className="space-y-3">
            {/* Duty 1 */}
            <div
              onClick={() => onSelectModule('inspections')}
              className="p-4 rounded-2xl bg-[#18181b] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="text-center px-3 py-1.5 bg-[#121212] rounded-xl border border-zinc-700 flex-shrink-0">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Pet</div>
                  <div className="text-base font-bold text-white">04</div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                    Interni HACCP kontrolni pregled čistoće
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Ivan Perić • Proizvodni pogon Cedevita Zagreb
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex-shrink-0">
                Tjedni audit
              </span>
            </div>

            {/* Duty 2 */}
            <div
              onClick={() => onSelectModule('inspections')}
              className="p-4 rounded-2xl bg-[#18181b] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="text-center px-3 py-1.5 bg-[#121212] rounded-xl border border-zinc-700 flex-shrink-0">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Pet</div>
                  <div className="text-base font-bold text-white">11</div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                    Redoviti dvotjedni DDD pregled (Ugovorni)
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Eko-Deratizacija d.o.o. • Marko Babić
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex-shrink-0">
                Ugovorni DDD
              </span>
            </div>

            {/* Duty 3 */}
            <div
              onClick={() => onSelectModule('documents')}
              className="p-4 rounded-2xl bg-[#18181b] border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="text-center px-3 py-1.5 bg-[#121212] rounded-xl border border-zinc-700 flex-shrink-0">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Ned</div>
                  <div className="text-base font-bold text-white">15</div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                    Istek Sigurnosno-tehničkog lista (STL)
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Ratak Parafinski Blok (Syngenta) • Zatražiti novu verziju
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full flex-shrink-0">
                Istek za 74 d
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* BENTO ANALYTICS SECTION - PEST ACTIVITY CHARTS */}
      {/* ============================================================ */}
      <div className="bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Bug className="w-5 h-5 text-indigo-400" />
              {hrTranslations.dashboard.pestActivityTrends}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Praćenje ulova po skupinama: UV insektokutori, feromonske klopke za moljce i deratizacijske kutije
            </p>
          </div>

          {/* Period filter buttons in Bento Style */}
          <div className="flex items-center gap-1.5 bg-[#080808] p-1.5 rounded-2xl border border-zinc-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setPeriod('30')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all ${
                period === '30' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              30 dana
            </button>
            <button
              onClick={() => setPeriod('90')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all ${
                period === '90' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              90 dana
            </button>
            <button
              onClick={() => setPeriod('12m')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all ${
                period === '12m' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              12 mjeseci
            </button>
          </div>
        </div>

        {/* Charts Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Main Bar Chart: Monthly trends */}
          <div className="lg:col-span-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#3f3f46',
                    borderRadius: '16px',
                    fontSize: '11px',
                    color: '#ffffff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="letMuhe" name="Leteće muhe (UV)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="moljci" name="Skladišni moljci" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="glodavci" name="Glodavci (Trag/Griz)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart: Pest group breakdown */}
          <div className="h-72 flex flex-col items-center justify-center bg-[#080808] rounded-3xl p-4 border border-zinc-800">
            <div className="text-xs font-bold text-zinc-300 mb-1 uppercase tracking-wider">Struktura Ulova</div>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={pestGroupDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pestGroupDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] w-full px-2 mt-1">
              {pestGroupDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-zinc-300 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SITES OVERVIEW BENTO TABLE CARD */}
      {/* ============================================================ */}
      <div className="bg-[#121212] border border-zinc-800 rounded-[2.5rem] p-8 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              {hrTranslations.dashboard.siteOverview}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Pregled razine rizika, HACCP točnosti pregleda i otvorenih mjera po lokacijama
            </p>
          </div>
          <button
            onClick={() => onSelectModule('sites')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1"
          >
            Sve lokacije →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#080808] text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Naziv lokacije</th>
                <th className="py-3 px-3">Vrsta objekta</th>
                <th className="py-3 px-3">Razina rizika</th>
                <th className="py-3 px-3">Zadnji pregled</th>
                <th className="py-3 px-3">Sljedeći pregled</th>
                <th className="py-3 px-3">Uređaja</th>
                <th className="py-3 px-3">Otvorene mjere</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Akcija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {sites.map((site) => (
                <tr
                  key={site.id}
                  onClick={() => {
                    setSelectedSiteId(site.id);
                    onSelectModule('sites');
                  }}
                  className="hover:bg-[#18181b] cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{site.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {site.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">{site.legalEntityName}</div>
                  </td>
                  <td className="py-3.5 px-3 text-zinc-300">{site.siteTypeHr}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        site.riskLevel === 'KRITICAN'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : site.riskLevel === 'VISOKO'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {site.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-zinc-400">{site.lastInspectionDate}</td>
                  <td className="py-3.5 px-3 font-semibold text-zinc-200">{site.nextInspectionDate}</td>
                  <td className="py-3.5 px-3 font-bold text-white">{site.deviceCount}</td>
                  <td className="py-3.5 px-3">
                    {site.id === 'SITE-CEDEVITA-ZG' ? (
                      <span className="text-amber-400 font-bold">1 aktivna CAPA</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">0 otvorenih</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-indigo-400 hover:text-indigo-300 font-bold text-xs">
                      Otvori →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BENTO SYSTEM INTEGRITY CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-[#121212] border border-zinc-800 flex items-center gap-3.5 shadow-xl">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white">100% QR Oznake</div>
            <div className="text-[11px] text-zinc-400">Svi uređaji imaju UUID kodove</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#121212] border border-zinc-800 flex items-center gap-3.5 shadow-xl">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white">Tlocrti Ažurni</div>
            <div className="text-[11px] text-zinc-400">Objekti pozicionirani na CAD planu</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#121212] border border-zinc-800 flex items-center gap-3.5 shadow-xl">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-amber-300">1 Dokument pred Istekom</div>
            <div className="text-[11px] text-zinc-400">Sigurnosno-tehnički list (STL)</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#121212] border border-zinc-800 flex items-center gap-3.5 shadow-xl">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white">Audit Trail Aktivan</div>
            <div className="text-[11px] text-zinc-400">Neizmjenjivi zapis svih akcija</div>
          </div>
        </div>
      </div>

    </div>
  );
};
