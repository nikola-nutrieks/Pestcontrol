import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Radio,
  ClipboardCheck,
  Bug,
  AlertOctagon,
  CheckSquare,
  FileText,
  Briefcase,
  FlaskConical,
  Building,
  ArrowRight,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const {
    devices,
    inspections,
    findings,
    incidents,
    correctiveActions,
    contractors,
    biocides,
    documents,
    sites,
  } = usePestControl();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const filteredDevices = q
    ? devices.filter(
        (d) =>
          d.code.toLowerCase().includes(q) ||
          d.qrCodeId.toLowerCase().includes(q) ||
          d.zoneName.toLowerCase().includes(q) ||
          d.categoryHr.toLowerCase().includes(q)
      )
    : [];

  const filteredInspections = q
    ? inspections.filter(
        (i) =>
          i.inspectionNumber.toLowerCase().includes(q) ||
          i.siteName.toLowerCase().includes(q) ||
          i.inspectorName.toLowerCase().includes(q)
      )
    : [];

  const filteredFindings = q
    ? findings.filter(
        (f) =>
          f.findingNumber.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          (f.pestNameHr && f.pestNameHr.toLowerCase().includes(q))
      )
    : [];

  const filteredActions = q
    ? correctiveActions.filter(
        (a) =>
          a.actionNumber.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.responsiblePersonName.toLowerCase().includes(q)
      )
    : [];

  const filteredIncidents = q
    ? incidents.filter(
        (inc) =>
          inc.incidentNumber.toLowerCase().includes(q) ||
          inc.title.toLowerCase().includes(q) ||
          inc.pestNameHr.toLowerCase().includes(q)
      )
    : [];

  const filteredDocs = q
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.categoryHr.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    filteredDevices.length +
    filteredInspections.length +
    filteredFindings.length +
    filteredActions.length +
    filteredIncidents.length +
    filteredDocs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
          <Search className="w-5 h-5 text-red-500 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraži uređaje (DK-001), nalaze (NAL-042), CAPA mjere (KM-045), dokumente..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="text-center py-8 text-xs text-slate-500 space-y-2">
              <p>Upišite pojam za pretraživanje u svim registrima sustava Atlantic Pest Control.</p>
              <div className="flex justify-center gap-2 text-[11px] text-slate-400 pt-2">
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Oznaka točke: DK-EXT-001</span>
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Nalaz: NAL-2026-00042</span>
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">Štetnik: Moljac</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Nema rezultata za upit "{query}".
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Devices */}
              {filteredDevices.length > 0 && (
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-400" />
                    Uređaji ({filteredDevices.length})
                  </div>
                  <div className="space-y-1">
                    {filteredDevices.slice(0, 4).map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onSelectModule('devices');
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <span className="font-bold text-slate-100 mr-2">{d.code}</span>
                          <span className="text-slate-400">{d.categoryHr}</span>
                          <span className="text-slate-500 ml-2">({d.zoneName})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings */}
              {filteredFindings.length > 0 && (
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                    <Bug className="w-3.5 h-3.5 text-red-400" />
                    Nalazi štetnika ({filteredFindings.length})
                  </div>
                  <div className="space-y-1">
                    {filteredFindings.slice(0, 3).map((f) => (
                      <div
                        key={f.id}
                        onClick={() => {
                          onSelectModule('findings');
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <span className="font-bold text-red-400 mr-2">{f.findingNumber}</span>
                          <span className="text-slate-200">{f.pestNameHr || f.categoryHr}</span>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{f.description}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corrective Actions */}
              {filteredActions.length > 0 && (
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                    Korektivne mjere - CAPA ({filteredActions.length})
                  </div>
                  <div className="space-y-1">
                    {filteredActions.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onSelectModule('correctiveActions');
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <span className="font-bold text-amber-400 mr-2">{a.actionNumber}</span>
                          <span className="text-slate-200">{a.title}</span>
                          <span className="text-slate-500 ml-2">Rok: {a.dueDate}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incidents */}
              {filteredIncidents.length > 0 && (
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                    Pest Incidenti ({filteredIncidents.length})
                  </div>
                  <div className="space-y-1">
                    {filteredIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          onSelectModule('incidents');
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <span className="font-bold text-red-400 mr-2">{inc.incidentNumber}</span>
                          <span className="text-slate-200">{inc.title}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {filteredDocs.length > 0 && (
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    Dokumentacija ({filteredDocs.length})
                  </div>
                  <div className="space-y-1">
                    {filteredDocs.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          onSelectModule('documents');
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-slate-200 font-medium">{doc.title}</span>
                          <span className="text-slate-500 ml-2">({doc.categoryHr})</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
