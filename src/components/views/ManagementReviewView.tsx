import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calendar,
  Building2,
  TrendingUp,
  Sparkles,
  Save,
  Clock,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { ManagementReview } from '../../types';

export const ManagementReviewView: React.FC = () => {
  const { managementReviews, activeSite, currentUser, createManagementReview } =
    usePestControl();

  const [reviewYear, setReviewYear] = useState(2026);
  const [contractorEval, setContractorEval] = useState(
    'Ugovoreni izvođač Eko-Deratizacija d.o.o. uredno i u roku provodi sve dvotjedne preglede. Prosječna ocjena SLA 4.9/5.0.'
  );
  const [strategicDecisions, setStrategicDecisions] = useState(
    '1. Nastavak ugovora s postojećim izvođačem.\n2. Zamjena 10 dotrajalih deratizacijskih stanica na vanjskom perimetru novim zaključanim metalnim kućištima.\n3. Uvođenje sezonskog feromonskog monitoringa za skladišne moljce u zoni sirovina od travnja do listopada.'
  );
  const [isSigned, setIsSigned] = useState(false);

  const handleSignReview = () => {
    createManagementReview({
      siteId: activeSite?.id || 'SITE-CEDEVITA-ZG',
      siteName: activeSite?.name || 'Proizvodni pogon Cedevita Zagreb',
      reviewYear: reviewYear,
      status: 'ZATVORENO_ODOBRENO',
      qaManagerName: currentUser.name,
      approvedAt: new Date().toISOString().split('T')[0],
      totalInspectionsConducted: 24,
      totalFindingsRecorded: 8,
      totalCapasCompleted: 8,
      contractorPerformanceSummary: contractorEval,
      strategicDecisions: strategicDecisions,
      nextYearGoals:
        'Održati nultu stopu aktivnosti štetnika u čistim zonama i postići 100% pravovremenost zatvaranja CAPA mjera unutar 7 radnih dana.',
    });

    setIsSigned(true);
    alert('Godišnji pregled sustava je formalno odobren i potpisan!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600/20 text-amber-400 border border-amber-500/30">
              MANAGEMENT REVIEW
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Godišnji pregled sustava kontrole štetnika od strane uprave (QA Review)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Godišnja reevaluacija učinkovitosti IPM programa, ocjena rada izvođača i strateške odluke za iduću godinu
          </p>
        </div>

        <button
          onClick={handleSignReview}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Formalno potpiši i zaključi pregled ({reviewYear}.)</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form & Evaluation */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Izvještaj o funkcioniranju sustava za {reviewYear}. godinu
              </h2>
              <p className="text-slate-400 text-xs">
                Lokacija: <strong className="text-white">{activeSite ? activeSite.name : 'Cedevita Zagreb'}</strong>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-bold">
              Status: {isSigned ? 'Odobreno i potpisano' : 'U pripremi'}
            </span>
          </div>

          {/* KPI Summary Block */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Provedeno DDD pregleda:</span>
              <span className="text-xl font-black text-white">24 ugovorna</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Ukupno zabilježenih nalaza:</span>
              <span className="text-xl font-black text-amber-400">8 nalaza</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Zatvorenih CAPA mjera:</span>
              <span className="text-xl font-black text-emerald-400">8 / 8 (100%)</span>
            </div>
          </div>

          {/* Evaluation Text Areas */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Ocjena efikasnosti ugovorenog DDD izvođača:
              </label>
              <textarea
                rows={3}
                value={contractorEval}
                onChange={(e) => setContractorEval(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Strateške odluke i plan unaprjeđenja za iduću godinu:
              </label>
              <textarea
                rows={4}
                value={strategicDecisions}
                onChange={(e) => setStrategicDecisions(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Sign-off summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs shadow-2xl">
            <div className="pb-3 border-b border-slate-800">
              <div className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Odobrenje Uprave i QA Rukovodstva
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Potpisnik:</span>
                <span className="font-bold text-white">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Funkcija:</span>
                <span className="text-slate-300">{currentUser.roleTitleHr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Datum verifikacije:</span>
                <span className="text-slate-300">{new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-[11px] text-emerald-300 space-y-1">
              <span className="font-bold block">Usklađenost s normom:</span>
              <p>Zadovoljava zahtjeve IFS Food v8 klauzula 1.4 (Godišnji pregled od strane uprave).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
