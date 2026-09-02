import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Clock,
  UserCheck,
  FileText,
  Lock,
  Sparkles,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';

export const AuditTrailView: React.FC = () => {
  const { auditEvents } = usePestControl();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = auditEvents.filter((log) => {
    const matchesSearch =
      log.performedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionHr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.justificationReason &&
        log.justificationReason.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-200 border border-slate-600">
              AUDIT TRAIL
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Neizmjenjivi revizijski trag promjena sustava (Audit Log)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Potpuna sljedivost svih unosa očitanja, promjena razine ozbiljnosti, odobrenja i brisanja u sustavu
          </p>
        </div>

        <button
          onClick={() => alert('Izvoz Audit Trail zapisa u CSV format...')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-red-400" />
          <span>Izvezi revizijski zapis (CSV)</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pretraži audit zapis po korisniku, radnji, entitetu ili obrazloženju..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Evidencija revizijskih događaja ({filteredLogs.length})</span>
          </div>
          <span className="text-slate-400">Zaštićeno od brisanja i izmjena</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Vrijeme (Timestamp)</th>
                <th className="py-2.5 px-3">Korisnik i Uloga</th>
                <th className="py-2.5 px-3">Radnja (Event)</th>
                <th className="py-2.5 px-3">Pogođeni entitet</th>
                <th className="py-2.5 px-3">Stara / Nova vrijednost</th>
                <th className="py-2.5 px-3">Obrazloženje promjene</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono text-slate-300 block">{log.timestamp}</span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {log.id.substring(0, 8)}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{log.performedByName}</div>
                    <div className="text-[10px] text-slate-400">{log.performedByRoleHr}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-red-400 px-2 py-0.5 rounded bg-red-950/40 border border-red-900/40">
                      {log.actionHr}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200 font-mono text-[11px]">{log.targetEntity}</div>
                    <div className="text-[10px] text-slate-500">{log.targetId}</div>
                  </td>
                  <td className="py-3 px-3">
                    {log.oldValue || log.newValue ? (
                      <div className="text-[11px] space-y-0.5">
                        {log.oldValue && (
                          <div className="text-slate-500 line-through">Prije: {log.oldValue}</div>
                        )}
                        {log.newValue && (
                          <div className="text-emerald-400 font-semibold">Novo: {log.newValue}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-[11px] text-slate-300 italic max-w-xs">
                      {log.justificationReason || '-'}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
