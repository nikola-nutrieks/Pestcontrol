import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  Plus,
  Camera,
  FileText,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { CorrectiveAction, CapaStatus } from '../../types';

export const CorrectiveActionsView: React.FC = () => {
  const {
    correctiveActions,
    activeSite,
    currentUser,
    createCorrectiveAction,
    submitActionCompletion,
    verifyCorrectiveAction,
  } = usePestControl();

  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(
    correctiveActions[0] || null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Complete action form state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
  );

  // Verify action form state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPerson, setNewPerson] = useState(currentUser.name);
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [new5Whys, setNew5Whys] = useState('');

  const siteActions = activeSite
    ? correctiveActions.filter((a) => a.siteId === activeSite.id)
    : correctiveActions;

  const filteredActions = siteActions.filter(
    (a) =>
      a.actionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.responsiblePersonName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCapa = (e: React.FormEvent) => {
    e.preventDefault();
    const newA = createCorrectiveAction({
      siteId: activeSite?.id || 'SITE-CEDEVITA-ZG',
      title: newTitle,
      description: newDesc,
      status: 'OTVORENO',
      statusHr: 'Otvoreno',
      responsiblePersonName: newPerson,
      responsiblePersonRoleHr: 'Odgovorna osoba / Skladište',
      dueDate: newDueDate,
      rootCause5Whys: new5Whys,
    });

    setSelectedAction(newA);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleSubmitCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    submitActionCompletion(
      selectedAction.id,
      currentUser.name,
      completionNotes,
      evidencePhoto
    );

    setShowCompleteModal(false);
    setSelectedAction((prev) =>
      prev ? { ...prev, status: 'CEKA_PROVJERU', statusHr: 'Čeka verifikaciju' } : null
    );
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    verifyCorrectiveAction(
      selectedAction.id,
      currentUser.name,
      verificationNotes || 'Mjera je pregledana na licu mjesta i ocijenjena učinkovitom.'
    );

    setShowVerifyModal(false);
    setSelectedAction((prev) =>
      prev ? { ...prev, status: 'ZATVORENO_PROVJERENO', statusHr: 'Verificirano i zatvoreno' } : null
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600/20 text-amber-400 border border-amber-500/30">
              KOREKTIVNE MJERE (CAPA)
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Korektivne i preventivne radnje (HACCP & IPM CAPA)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Praćenje izvršenja mjera, analiza 5-Zašto (5-Whys) i nezavisna QA provjera učinkovitosti (Segregation of Duties)
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nova CAPA mjera</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pretraži CAPA radnje po broju (KM-045), nazivu ili zaduženoj osobi..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: CAPA list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Popis CAPA mjera</span>
            <span>{filteredActions.length} mjera</span>
          </div>

          <div className="space-y-2.5">
            {filteredActions.map((action) => {
              const isSelected = selectedAction?.id === action.id;
              const isClosed = action.status === 'ZATVORENO_PROVJERENO';
              const isPendingVerify = action.status === 'CEKA_PROVJERU';

              return (
                <div
                  key={action.id}
                  onClick={() => setSelectedAction(action)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono font-bold text-xs text-amber-400">
                        {action.actionNumber}
                      </div>
                      <div className="font-bold text-white text-xs mt-0.5">{action.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Zadužen: {action.responsiblePersonName}
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isClosed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isPendingVerify
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {action.statusHr}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                    <span>Rok: {action.dueDate}</span>
                    <span className="text-amber-400 font-medium">Pregledaj →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected CAPA Detail, 5-Whys, Evidence & Verification */}
        <div className="lg:col-span-2">
          {selectedAction ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {selectedAction.actionNumber}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {selectedAction.statusHr}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1.5">{selectedAction.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Zadužena osoba: <strong>{selectedAction.responsiblePersonName}</strong> ({selectedAction.responsiblePersonRoleHr}) • Rok: <strong>{selectedAction.dueDate}</strong>
                  </p>
                </div>

                {/* Workflow Actions */}
                <div className="flex items-center gap-2">
                  {selectedAction.status === 'OTVORENO' && (
                    <button
                      onClick={() => setShowCompleteModal(true)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Predaj dokaz o izvršenju</span>
                    </button>
                  )}

                  {selectedAction.status === 'CEKA_PROVJERU' && (
                    <button
                      onClick={() => setShowVerifyModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>QA Provjera učinkovitosti</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Opis korektivne mjere
                </div>
                <p className="text-slate-300 leading-relaxed">{selectedAction.description}</p>
              </div>

              {/* 5-Whys Root Cause */}
              {selectedAction.rootCause5Whys && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Analiza temeljnog uzroka (5-Whys)
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedAction.rootCause5Whys}</p>
                </div>
              )}

              {/* Evidence of Completion */}
              {selectedAction.evidencePhotoUrl && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    Dokaz o izvršenju mjere
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={selectedAction.evidencePhotoUrl}
                      alt="Dokaz mjere"
                      className="w-48 h-32 object-cover rounded-lg border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-slate-300">
                      <p>{selectedAction.completionNotes}</p>
                      <div className="text-[11px] text-slate-500 mt-2">
                        Izvršio: {selectedAction.completedByName} ({selectedAction.completedAt})
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Record */}
              {selectedAction.verifiedAt && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-2">
                  <div className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Zapis o QA verifikaciji učinkovitosti
                  </div>
                  <p className="text-emerald-200">{selectedAction.verificationNotes}</p>
                  <div className="text-[11px] text-emerald-400 pt-1 border-t border-emerald-900/60">
                    Verificirao QA voditelj: <strong>{selectedAction.verifiedByName}</strong> (
                    {selectedAction.verifiedAt})
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              Odaberite CAPA mjeru s popisa.
            </div>
          )}
        </div>
      </div>

      {/* Complete CAPA Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">Predaja dokaza o izvršenju mjere</h3>
            <form onSubmit={handleSubmitCompletion} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Opis provedenih radnji *</label>
                <textarea
                  required
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Npr. Obavljena sanacija brtvi, zamijenjene podne rešetke, očišćen prostor..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL / Fotografija dokaza</label>
                <input
                  type="text"
                  value={evidencePhoto}
                  onChange={(e) => setEvidencePhoto(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
                >
                  Predaj na QA verifikaciju
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify CAPA Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">QA Verifikacija učinkovitosti mjere</h3>
            <p className="text-xs text-slate-400">
              Potvrdom jamčite da je mjera pregledana na licu mjesta i da je rizik od štetnika uklonjen.
            </p>

            <form onSubmit={handleVerify} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-emerald-300 mb-1">
                  Zapis o inspekcijskoj provjeri na licu mjesta *
                </label>
                <textarea
                  required
                  rows={3}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Provjereno na terenu: prostor saniran, u kontrolnim klopkama nema novih ulova."
                  className="w-full bg-slate-800 border border-emerald-500/50 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Verificiraj i zaključi CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New CAPA Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">Nova CAPA mjera</h3>
            <form onSubmit={handleCreateCapa} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Naziv mjere *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Npr. Zamjena brtvi na utovarnim vratima 3"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Detaljan opis mjere *</label>
                <textarea
                  required
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Opisati što točno treba napraviti radi sprječavanja ulaza štetnika..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Odgovorna osoba</label>
                <input
                  type="text"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Rok izvršenja</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">5-Whys analiza uzroka</label>
                <textarea
                  rows={2}
                  value={new5Whys}
                  onChange={(e) => setNew5Whys(e.target.value)}
                  placeholder="1. Zašto? Brtva dotrajala..."
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
                  Kreiraj CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
