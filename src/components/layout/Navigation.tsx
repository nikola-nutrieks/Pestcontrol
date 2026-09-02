import React from 'react';
import {
  LayoutDashboard,
  Building,
  Map,
  Radio,
  ClipboardCheck,
  Bug,
  AlertOctagon,
  CheckSquare,
  Sliders,
  Briefcase,
  FlaskConical,
  FileText,
  ShieldAlert,
  TrendingUp,
  FileOutput,
  Award,
  History,
  Settings,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { hrTranslations } from '../../i18n/hr';

interface NavigationProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  badgeVariant?: 'red' | 'amber' | 'blue' | 'gray';
  allowedRoles?: string[]; // If undefined, available to all
}

export const Navigation: React.FC<NavigationProps> = ({ activeModule, onSelectModule }) => {
  const { currentUser, findings, correctiveActions, inspections, documents } = usePestControl();

  const openFindingsCount = findings.filter((f) => f.status === 'ZABILJEZENO' || f.status === 'U_OBRADI').length;
  const openCapaCount = correctiveActions.filter((a) => a.status === 'OTVORENO' || a.status === 'CEKA_PROVJERU' || a.status === 'CEKA_DOKAZ').length;
  const pendingInspectionsCount = inspections.filter((i) => i.status === 'CEKA_PREGLED' || i.status === 'U_TIJEKU').length;
  const expiringDocsCount = documents.filter((d) => d.isExpiringSoon || d.isExpired).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: hrTranslations.nav.dashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'sites',
      label: hrTranslations.nav.sites,
      icon: Building,
    },
    {
      id: 'floorPlans',
      label: hrTranslations.nav.floorPlans,
      icon: Map,
    },
    {
      id: 'devices',
      label: hrTranslations.nav.devices,
      icon: Radio,
    },
    {
      id: 'inspections',
      label: hrTranslations.nav.inspections,
      icon: ClipboardCheck,
      badgeCount: pendingInspectionsCount > 0 ? pendingInspectionsCount : undefined,
      badgeVariant: 'blue',
    },
    {
      id: 'findings',
      label: hrTranslations.nav.findings,
      icon: Bug,
      badgeCount: openFindingsCount > 0 ? openFindingsCount : undefined,
      badgeVariant: 'red',
    },
    {
      id: 'incidents',
      label: hrTranslations.nav.incidents,
      icon: AlertOctagon,
      badgeCount: 1,
      badgeVariant: 'amber',
    },
    {
      id: 'correctiveActions',
      label: hrTranslations.nav.correctiveActions,
      icon: CheckSquare,
      badgeCount: openCapaCount > 0 ? openCapaCount : undefined,
      badgeVariant: 'amber',
    },
    {
      id: 'thresholds',
      label: 'Threshold Engine',
      icon: Sliders,
    },
    {
      id: 'contractors',
      label: hrTranslations.nav.contractors,
      icon: Briefcase,
    },
    {
      id: 'biocides',
      label: hrTranslations.nav.biocides,
      icon: FlaskConical,
    },
    {
      id: 'documents',
      label: hrTranslations.nav.documents,
      icon: FileText,
      badgeCount: expiringDocsCount > 0 ? expiringDocsCount : undefined,
      badgeVariant: 'amber',
    },
    {
      id: 'riskAssessment',
      label: hrTranslations.nav.riskAssessment,
      icon: ShieldAlert,
    },
    {
      id: 'analytics',
      label: hrTranslations.nav.analytics,
      icon: TrendingUp,
    },
    {
      id: 'reports',
      label: hrTranslations.nav.reports,
      icon: FileOutput,
    },
    {
      id: 'managementReview',
      label: hrTranslations.nav.managementReview,
      icon: Award,
    },
    {
      id: 'auditTrail',
      label: hrTranslations.nav.auditTrail,
      icon: History,
    },
    {
      id: 'settings',
      label: hrTranslations.nav.settings,
      icon: Settings,
    },
  ];

  // Role filtering if needed
  const visibleItems = navItems.filter((item) => {
    if (currentUser.role === 'EXTERNAL_DDD_TECH') {
      // DDD Technician has streamlined view
      const allowed = ['dashboard', 'floorPlans', 'devices', 'inspections', 'findings', 'biocides', 'documents'];
      return allowed.includes(item.id);
    }
    return true;
  });

  return (
    <aside className="w-64 bg-[#0c0c0c] border-r border-zinc-800/80 text-zinc-300 flex flex-col flex-shrink-0 select-none overflow-y-auto">
      {/* Scope Pill */}
      <div className="p-4 border-b border-zinc-800/80 bg-[#080808]">
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Uloga i opseg pristupa
        </div>
        <div className="text-xs font-bold text-white mt-1 truncate">
          {currentUser.name}
        </div>
        <div className="text-[11px] text-indigo-400 font-medium truncate">
          {currentUser.roleTitleHr}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1.5 flex-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/40'
                  : 'text-zinc-400 hover:bg-[#18181b] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badgeCount !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-white text-indigo-950'
                      : item.badgeVariant === 'red'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : item.badgeVariant === 'amber'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 bg-[#080808]">
        <div className="font-bold text-zinc-300 text-xs">Atlantic IPM Standard</div>
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">HACCP • IFS Food v8 • ISO 22000</div>
      </div>
    </aside>
  );
};
