import React, { useState } from 'react';
import {
  Bug,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  ShieldAlert,
  ArrowRight,
  Camera,
  Edit,
  Sparkles,
  FileText,
  AlertOctagon,
  CheckSquare,
  Plus,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { Finding, FindingSeverity } from '../../types';

interface FindingsViewProps {
  onSelectModule: (module: string) => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({ onSelectModule }) => {
  const {
    findings,
    activeSite,
    currentUser,
    updateFindingSeverity,
  } = usePestControl();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  // Severity change override modal
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideSeverity, setOverrideSeverity] = useState<FindingSeverity>('VISOKO');
  const [overrideReason, setOverrideReason] = useState('');

  const siteFindings = activeSite
    ? findings.filter((f) => f.siteId === activeSite.id)
    : findings;

  const filteredFindings = siteFindings.filter((f) => {
    const matchesSearch =
      f.findingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.pestNameHr && f.pestNameHr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      f.zoneName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || f.confirmedSeverity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleSaveSeverityOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFinding) return;

    updateFindingSeverity(
      selectedFinding.id,
      overrideSeverity,
      overrideReason || 'Stručna procjena QA voditelja lokacije'
    );

    setShowOverrideModal(false);
    setSelectedFinding((prev) =>
      prev ? { ...prev, confirmedSeverity: overrideSeverity, confirmedSeverityHr: overrideSeverity } : null
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
              NALAZI ŠTETNIKA
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Registar nalaza, prekoračenja pragova i identifikacije
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evidencija svih pozitivnih aktivnosti, izračun razine ozbiljnosti i povezivanje s CAPA mjerama
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectModule('correctiveActions')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>Povezane CAPA mjere</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pretraži nalaze (NAL-042), vrstu štetnika ili zonu..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">Sve razine ozbiljnosti</option>
            <option value="KRITICNO">Kritično (Prag premašen u zoni)</option>
            <option value="VISOKO">Visoko</option>
            <option value="SREDNJE">Srednje</option>
            <option value="NISKO">Nisko</option>
          </select>
        </div>
      </div>

      {/* Findings List & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between pb-3 border-b border-slate-800">
            <span>Popis evidentiranih nalaza ({filteredFindings.length})</span>
            <span className="text-slate-400">{activeSite ? activeSite.name : 'Sve lokacije'}</span>
          </div>

          <div className="space-y-2.5">
            {filteredFindings.map((finding) => {
              const isSelected = selectedFinding?.id === finding.id;
              const isCritical = finding.confirmedSeverity === 'KRITICNO';
              const isHigh = finding.confirmedSeverity === 'VISOKO';

              return (
                <div
                  key={finding.id}
                  onClick={() => setSelectedFinding(finding)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-850 border-red-500 ring-1 ring-red-500/40 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-red-400">
                          {finding.findingNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-100">
                          {finding.pestNameHr || finding.categoryHr}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{finding.description}</p>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Zona: {finding.zoneName} • Točka: {finding.deviceCode || 'Opći vizualni pregled'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : isHigh
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}
                      >
                        {finding.confirmedSeverity}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1">{finding.detectedAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Finding Detail View */}
        <div className="lg:col-span-1">
          {selectedFinding ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-red-400">{selectedFinding.findingNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Status: {selectedFinding.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mt-1">
                  {selectedFinding.pestNameHr || selectedFinding.categoryHr}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedFinding.zoneName}</p>
              </div>

              {/* Photo Evidence if present */}
              {selectedFinding.photoUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={selectedFinding.photoUrl}
                    alt="Dokaz nalaza"
                    className="w-full h-36 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-1.5 text-[10px] text-slate-400 text-center">
                    Fotodokumentacija s terena
                  </div>
                </div>
              )}

              {/* Finding Data fields */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Razina ozbiljnosti:</span>
                  <span className="font-bold text-red-400">{selectedFinding.confirmedSeverity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Broj jedinki:</span>
                  <span className="font-bold text-white">{selectedFinding.pestCount || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Zabilježio:</span>
                  <span className="text-slate-200">{selectedFinding.technicianName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Datum detekcije:</span>
                  <span className="text-slate-200">{selectedFinding.detectedAt}</span>
                </div>
              </div>

              {/* Threshold engine reason */}
              {selectedFinding.thresholdTriggerReason && (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-[11px] text-red-200 space-y-1">
                  <span className="font-bold block flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    Razlog aktiviranja Threshold Engine-a:
                  </span>
                  <p>{selectedFinding.thresholdTriggerReason}</p>
                </div>
              )}

              {/* QA Severity Override Action */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setOverrideSeverity(selectedFinding.confirmedSeverity);
                    setShowOverrideModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center justify-center gap-2"
                >
                  <Edit className="w-3.5 h-3.5 text-red-400" />
                  <span>QA Promjena razine ozbiljnosti</span>
                </button>

                {selectedFinding.correctiveActionId ? (
                  <button
                    onClick={() => onSelectModule('correctiveActions')}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Otvori CAPA mjeru ({selectedFinding.correctiveActionId})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectModule('correctiveActions')}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Pokreni novu CAPA mjeru</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 text-xs">
              <Bug className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p>Odaberite nalaz s popisa za pregled fotodokumentacije i pokretanje CAPA korektivnih radnji.</p>
            </div>
          )}
        </div>
      </div>

      {/* QA Severity Override Modal */}
      {showOverrideModal && selectedFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">
              QA Promjena razine ozbiljnosti ({selectedFinding.findingNumber})
            </h3>
            <p className="text-xs text-slate-400">
              Svaka promjena razine ozbiljnosti se trajno bilježi u neizmjenjivi Audit Trail zapis.
            </p>

            <form onSubmit={handleSaveSeverityOverride} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nova razina ozbiljnosti *</label>
                <select
                  value={overrideSeverity}
                  onChange={(e) => setOverrideSeverity(e.target.value as FindingSeverity)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="KRITICNO">Kritično</option>
                  <option value="VISOKO">Visoko</option>
                  <option value="SREDNJE">Srednje</option>
                  <option value="NISKO">Nisko</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-red-300 mb-1">
                  Obvezno QA obrazloženje promjene *
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Navedite stručni razlog korekcije klasifikacije nalaza..."
                  className="w-full bg-slate-800 border border-red-500/50 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Potvrdi i zapiši u Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
