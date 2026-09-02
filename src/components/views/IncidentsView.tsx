import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { Incident } from '../../types';

export const IncidentsView: React.FC = () => {
  const { incidents, activeSite, currentUser } = usePestControl();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);

  const siteIncidents = activeSite
    ? incidents.filter((i) => i.siteId === activeSite.id)
    : incidents;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
              PEST INCIDENTI
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Protokol upravljanja incidentima i karantene proizvoda
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upravljanje eskalacijama štetnika, blokada pogođenih LOT-ova proizvoda i IFS Food / HACCP izvještaji
          </p>
        </div>
      </div>

      {/* Incident layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Incident List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Popis incidenata</span>
            <span>{siteIncidents.length} evidentirano</span>
          </div>

          <div className="space-y-2.5">
            {siteIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isCritical = inc.severity === 'KRITICNO';

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-red-500 ring-1 ring-red-500/40 shadow-lg'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono font-bold text-xs text-red-400">{inc.incidentNumber}</div>
                      <div className="font-bold text-white text-xs mt-0.5">{inc.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[170px]">{inc.siteName}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                    <span>Štetnik: {inc.pestNameHr}</span>
                    <span className="text-slate-300 font-semibold">{inc.reportedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Incident Detail */}
        <div className="lg:col-span-2">
          {selectedIncident ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
              {/* Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                      {selectedIncident.incidentNumber}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                      Status: {selectedIncident.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1.5">{selectedIncident.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Lokacija: {selectedIncident.siteName} • Zona: {selectedIncident.zoneName}
                  </p>
                </div>
              </div>

              {/* Description & Containment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-red-400" />
                    Opis događaja i zabilježeni nalaz
                  </div>
                  <p className="text-slate-300">{selectedIncident.description}</p>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    Prijavio: {selectedIncident.reportedBy} ({selectedIncident.reportedAt})
                  </div>
                </div>

                {/* Containment Actions & Blocked LOT */}
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 space-y-2">
                  <div className="font-bold text-red-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-red-400" />
                    Mjere zadržavanja i blokada sirovina (Karantena)
                  </div>
                  <p className="text-red-200">{selectedIncident.containmentActions}</p>
                  {selectedIncident.affectedProductBatches && (
                    <div className="p-2 rounded bg-red-950/80 border border-red-800 text-[11px] font-mono text-red-200 mt-2">
                      Blokirani LOT-ovi: <strong>{selectedIncident.affectedProductBatches}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Root Cause Analysis (5-Whys) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Analiza temeljnog uzroka (Root Cause Analysis - 5 Whys)
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedIncident.rootCauseAnalysis}
                </div>
              </div>

              {/* Closure Report & CAPA link */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Povezana korektivna radnja (CAPA):</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedIncident.correctiveActionId} • Provodi se pojačano feromonsko praćenje i sanacija
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-red-400" />
                  <span>Ispiši izvještaj incidenta</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              Odaberite incident s popisa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
