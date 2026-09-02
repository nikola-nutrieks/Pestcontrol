import React, { useState } from 'react';
import {
  ClipboardCheck,
  Calendar,
  UserCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  FileText,
  Camera,
  ChevronRight,
  ShieldCheck,
  Radio,
  Printer,
  Sparkles,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { Inspection, InspectionStatus } from '../../types';

interface InspectionsViewProps {
  onOpenQrScanner: () => void;
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({ onOpenQrScanner }) => {
  const {
    inspections,
    activeSite,
    sites,
    currentUser,
    createInspection,
    approveInspection,
  } = usePestControl();

  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [qaReturnReason, setQaReturnReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);

  // New inspection form
  const [inspType, setInspType] = useState('Redoviti dvotjedni DDD pregled (Ugovorni)');
  const [inspDate, setInspDate] = useState(new Date().toISOString().split('T')[0]);
  const [inspectorName, setInspectorName] = useState(currentUser.name);

  const siteInspections = activeSite
    ? inspections.filter((i) => i.siteId === activeSite.id)
    : inspections;

  const handleCreateNewInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSite = activeSite || sites[0];

    const newInsp = createInspection({
      siteId: targetSite.id,
      siteName: targetSite.name,
      inspectionTypeHr: inspType,
      inspectorName: inspectorName,
      inspectorRoleHr: currentUser.roleTitleHr,
      isContractor: currentUser.role === 'EXTERNAL_DDD_TECH',
      plannedDate: inspDate,
      status: 'U_TIJEKU',
      statusHr: 'U tijeku',
      totalDevicesPlanned: targetSite.deviceCount || 10,
      totalDevicesCompleted: 0,
      totalDevicesSkipped: 0,
      totalPositiveFindings: 0,
      readings: [],
    });

    setSelectedInspection(newInsp);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
              PREGLEDI I OČITANJA
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Raspored i verifikacija DDD pregleda
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Praćenje planiranih ugovornih obilazaka, evidencija očitanja točaka i QA odobravanje zapisnika
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenQrScanner}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-all"
          >
            <Radio className="w-4 h-4" />
            <span>Terenski unos (QR)</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 text-red-400" />
            <span>Novi radni nalog</span>
          </button>
        </div>
      </div>

      {/* Main Inspections List & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Inspections */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Popis radnih naloga i pregleda</span>
            <span>{siteInspections.length} ukupno</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {siteInspections.map((insp) => {
              const isSelected = selectedInspection?.id === insp.id;
              const isCompleted = insp.status === 'DOVRŠENO' || insp.status === 'ODOBRENO_QA';
              const isPendingQa = insp.status === 'CEKA_PREGLED';

              return (
                <div
                  key={insp.id}
                  onClick={() => setSelectedInspection(insp)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-red-500 ring-1 ring-red-500/40 shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-red-400">
                        {insp.inspectionNumber}
                      </div>
                      <div className="font-bold text-white text-xs mt-0.5">{insp.inspectionTypeHr}</div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[180px]">{insp.siteName}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        insp.status === 'ODOBRENO_QA'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                          : insp.status === 'CEKA_PREGLED'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800/50'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                      }`}
                    >
                      {insp.statusHr}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                    <span>Pregledao: {insp.inspectorName}</span>
                    <span className="text-slate-300 font-semibold">{insp.plannedDate}</span>
                  </div>

                  {/* Device completion bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Obrađeno točaka:</span>
                      <span className="font-bold text-white">
                        {insp.totalDevicesCompleted} / {insp.totalDevicesPlanned}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((insp.totalDevicesCompleted / (insp.totalDevicesPlanned || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Inspection Detail & QA Review */}
        <div className="lg:col-span-2">
          {selectedInspection ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              {/* Inspection Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                      {selectedInspection.inspectionNumber}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {selectedInspection.statusHr}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1.5">
                    {selectedInspection.inspectionTypeHr}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Lokacija: {selectedInspection.siteName} • Pregledao: {selectedInspection.inspectorName} (
                    {selectedInspection.inspectorRoleHr})
                  </p>
                </div>

                {/* QA Verification Action */}
                {selectedInspection.status !== 'ODOBRENO_QA' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveInspection(selectedInspection.id, currentUser.name)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>QA Odobrenje zapisnika</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Inspection Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Planirano točaka:</span>
                  <span className="text-lg font-bold text-white">{selectedInspection.totalDevicesPlanned}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Pregledano točaka:</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {selectedInspection.totalDevicesCompleted}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Preskočeno / Nedostupno:</span>
                  <span className="text-lg font-bold text-purple-400">
                    {selectedInspection.totalDevicesSkipped}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Pozitivni nalazi štetnika:</span>
                  <span className="text-lg font-bold text-red-400">
                    {selectedInspection.totalPositiveFindings}
                  </span>
                </div>
              </div>

              {/* Readings list for this inspection */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Evidentirana očitanja točaka ({selectedInspection.readings.length})</span>
                  <span className="text-[11px] text-slate-500">Uključuje HACCP i IPM detalje</span>
                </div>

                {selectedInspection.readings.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                    Nema unesenih očitanja. Koristite gumb "Terenski unos (QR)" za unos stanja uređaja.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {selectedInspection.readings.map((reading) => {
                      const isPositive = reading.result === 'POTVRDJENA_AKTIVNOST';
                      const isWarning = reading.result === 'SUMNJA_NA_AKTIVNOST';

                      return (
                        <div
                          key={reading.id}
                          className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-bold text-white flex items-center gap-2">
                                <span>{reading.deviceCode}</span>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  ({reading.deviceCategoryHr})
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{reading.zoneName}</div>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isPositive
                                  ? 'bg-red-950 text-red-400 border border-red-800'
                                  : isWarning
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {reading.resultHr}
                            </span>
                          </div>

                          {/* Specific readings info */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                            {reading.baitConsumedPct !== undefined && (
                              <div>
                                <span className="text-slate-500 block text-[10px]">Mamac:</span>
                                <span className="font-bold text-amber-400">{reading.baitConsumedPct}% potrošeno</span>
                              </div>
                            )}
                            {reading.droppingsCount !== undefined && (
                              <div>
                                <span className="text-slate-500 block text-[10px]">Izmet glodavaca:</span>
                                <span>{reading.droppingsCount} kom</span>
                              </div>
                            )}
                            {reading.insectsCount !== undefined && (
                              <div>
                                <span className="text-slate-500 block text-[10px]">Broj insekata:</span>
                                <span className="font-bold text-red-400">{reading.insectsCount} jedinki</span>
                              </div>
                            )}
                            {reading.usedBiocideName && (
                              <div className="col-span-2">
                                <span className="text-slate-500 block text-[10px]">Korišten biocide:</span>
                                <span className="text-red-300 font-semibold">{reading.usedBiocideName} ({reading.usedBiocideQuantity})</span>
                              </div>
                            )}
                          </div>

                          {reading.biocideJustification && (
                            <div className="text-[11px] p-2 rounded bg-red-950/30 border border-red-900/40 text-red-200">
                              <span className="font-bold block">IPM Obrazloženje primjene kemikalije:</span>
                              {reading.biocideJustification}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              <ClipboardCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p>Odaberite radni nalog s lijevog popisa za pregled evidencije očitanja i QA verifikaciju.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Inspection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">Novi nalog za DDD pregled</h3>
            <form onSubmit={handleCreateNewInspection} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Vrsta pregleda *</label>
                <select
                  value={inspType}
                  onChange={(e) => setInspType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Redoviti dvotjedni DDD pregled (Ugovorni)">
                    Redoviti dvotjedni DDD pregled (Ugovorni)
                  </option>
                  <option value="Izvanredni ciljani pregled (Nakon incidenta)">
                    Izvanredni ciljani pregled (Nakon incidenta)
                  </option>
                  <option value="Interni HACCP kontrolni pregled čistoće">
                    Interni HACCP kontrolni pregled čistoće
                  </option>
                  <option value="Sezonska procjena gustoće (Godišnji audit)">
                    Sezonska procjena gustoće (Godišnji audit)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Datum planiranog pregleda</label>
                <input
                  type="date"
                  value={inspDate}
                  onChange={(e) => setInspDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Ime pregledavatelja / tehničara</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Kreiraj nalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
