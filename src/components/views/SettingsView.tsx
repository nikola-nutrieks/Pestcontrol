import React from 'react';
import {
  Settings,
  UserCheck,
  Building2,
  Database,
  RotateCcw,
  ShieldCheck,
  Server,
  Cloud,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    setCurrentUserRole,
    sites,
    activeSite,
    resetToDefaultState,
  } = usePestControl();

  const handleReset = () => {
    if (
      window.confirm(
        'Jeste li sigurni da želite resetirati cjelokupnu bazu podataka na tvorničke početne vrijednosti?'
      )
    ) {
      resetToDefaultState();
      window.location.reload();
    }
  };

  const roles: { role: UserRole; label: string; desc: string }[] = [
    {
      role: 'QA_MANAGER',
      label: 'QA Voditelj lokacije (Quality Assurance Lead)',
      desc: 'Puni pristup: odobravanje zapisnika, verifikacija CAPA mjera, reevaluacija rizika, potpisivanje dosjea.',
    },
    {
      role: 'EXTERNAL_DDD_TECH',
      label: 'Vanjski DDD tehničar (Sanitarni inženjer)',
      desc: 'Terenski unos očitanja točaka, evidentiranje primjene biocida i podnošenje dokaza o provedenim mjerama.',
    },
    {
      role: 'PLANT_DIRECTOR',
      label: 'Direktor proizvodnog pogona / Skladišta',
      desc: 'Pregled statusa usklađenosti, odobravanje investicija u građevinsku sanaciju i rješavanje incidentnih stanja.',
    },
    {
      role: 'AUDITOR_VIEWER',
      label: 'Eksterni IFS / HACCP Auditor (Samo pregled)',
      desc: 'Režim za revizore: samo pregled verificiranih zapisnika, tlocrta, evidencija biocida i audit trail zapisa.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-200 border border-slate-600">
              POSTAVKE SUSTAVA
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Postavke korisničkih uloga, lokacija i integracija
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulacija korisničkih rola, parametri integracija i upravljanje trajnom pohranom
          </p>
        </div>
      </div>

      {/* Role Switcher Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-red-400" />
            <span>Simulacija korisničke uloge (Role-Based Access Control)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Odaberite ulogu za testiranje specifičnih dozvola i načela odvajanja dužnosti (Segregation of Duties).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roles.map((r) => {
            const isActive = currentUser.role === r.role;
            return (
              <div
                key={r.role}
                onClick={() => setCurrentUserRole(r.role)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-850 border-red-500 ring-1 ring-red-500/40 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{r.label}</span>
                  {isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">
                      Aktivno
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enterprise Integrations Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Enterprise integracije Atlantic Grupe</span>
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Microsoft Entra ID (Azure AD SSO)</div>
                <div className="text-[11px] text-slate-400">Jedinstvena prijava zaposlenika</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Povezano
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">SAP ERP / Materijalno knjigovodstvo</div>
                <div className="text-[11px] text-slate-400">Automatsko knjiženje utroška biocida</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Povezano
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Cloud Object Storage (S3 / GCS)</div>
                <div className="text-[11px] text-slate-400">Pohrana fotodokumentacije i STL listova</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Povezano
              </span>
            </div>
          </div>
        </div>

        {/* Persistence & Database Reset */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Stanje baze podataka i perzistencija</span>
            </h2>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Pohrana:</span>
              <span className="font-mono text-slate-200">Local Browser Storage V1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status integriteta:</span>
              <span className="font-bold text-emerald-400">Usklađeno (HACCP Validated)</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Vrati sve podatke na tvorničko stanje (Factory Reset)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
