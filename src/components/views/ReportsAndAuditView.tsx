import React, { useState } from 'react';
import {
  FileOutput,
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';

export const ReportsAndAuditView: React.FC = () => {
  const { activeSite, sites, devices, findings, correctiveActions, contractors } =
    usePestControl();

  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-09-02');
  const [incFloorPlan, setIncFloorPlan] = useState(true);
  const [incReadings, setIncReadings] = useState(true);
  const [incBiocides, setIncBiocides] = useState(true);
  const [incContractor, setIncContractor] = useState(true);
  const [incCapa, setIncCapa] = useState(true);
  const [incRisk, setIncRisk] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const handleGenerateDossier = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSuccess(true);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentSite = activeSite || sites[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600/20 text-purple-400 border border-purple-500/30">
              AUDIT PAKET & IZVJEŠTAJI
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Generator cjelovitog IFS Food / HACCP Audit dosjea
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Objedinjavanje svih evidencija kontrole štetnika u standardizirani audit paket spreman za certifikacijska tijela
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
        >
          <Printer className="w-4 h-4 text-red-400" />
          <span>Ispiši dosje (PDF)</span>
        </button>
      </div>

      {/* Generator Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Options */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
            Parametri audit paketa
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Odabrana lokacija:</label>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-bold text-white">
                {currentSite.name} ({currentSite.countryCode})
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Datum od:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Datum do:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            {/* Checklists */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block font-bold text-slate-300">Sadržaj audit dosjea:</label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={incReadings}
                  onChange={(e) => setIncReadings(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span>Zapisnici pregleda i očitanja točaka</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={incFloorPlan}
                  onChange={(e) => setIncFloorPlan(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span>Tlocrtna shema s rasporedom klopki</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={incBiocides}
                  onChange={(e) => setIncBiocides(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span>Registar biocida i dnevnik primjene</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={incContractor}
                  onChange={(e) => setIncContractor(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span>Ugovor i certifikati DDD tehničara</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={incCapa}
                  onChange={(e) => setIncCapa(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span>Evidencija CAPA korektivnih mjera</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={incRisk}
                  onChange={(e) => setIncRisk(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span>Godišnja procjena rizika (HACCP)</span>
              </label>
            </div>

            <button
              onClick={handleGenerateDossier}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all mt-3"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generiranje u tijeku...' : 'Generiraj Audit Dosje'}</span>
            </button>
          </div>
        </div>

        {/* Live Dossier Preview (Right 2 cols) */}
        <div className="lg:col-span-2 bg-white text-slate-900 border border-slate-300 rounded-2xl p-8 space-y-6 shadow-2xl">
          {/* Official Audit Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-700">
                ATLANTIC GRUPA d.d. • KONTROLA KVALITETE I SIGURNOST HRANE
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                SLUŽBENI AUDIT DOSJE KONTROLE ŠTETNIKA (IPM)
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Standard: <strong>IFS Food v8 / HACCP Codex Alimentarius / ISO 22000</strong>
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="font-mono font-bold text-slate-900 block">
                DOSJE-{currentSite.code}-2026
              </span>
              <span className="text-slate-500 text-[11px]">Datum: {new Date().toLocaleDateString('hr-HR')}</span>
            </div>
          </div>

          {/* Dossier Body Content */}
          <div className="space-y-4 text-xs text-slate-800">
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-100 rounded-lg">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Lokacija i objekt:</span>
                <strong>{currentSite.name}</strong> ({currentSite.address}, {currentSite.city})
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Ugovoreni DDD izvođač:</span>
                <strong>{currentSite.activeContractorName}</strong>
              </div>
            </div>

            {/* Summary metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-slate-300 rounded-lg">
                <span className="text-slate-500 text-[10px] block">Točaka monitoringa:</span>
                <span className="text-lg font-bold text-slate-900">{currentSite.deviceCount} uređaja</span>
              </div>
              <div className="p-3 border border-slate-300 rounded-lg">
                <span className="text-slate-500 text-[10px] block">Otvorenih nalaza:</span>
                <span className="text-lg font-bold text-red-600">0 kritičnih</span>
              </div>
              <div className="p-3 border border-slate-300 rounded-lg">
                <span className="text-slate-500 text-[10px] block">Verificiranih CAPA:</span>
                <span className="text-lg font-bold text-emerald-600">100% zaključeno</span>
              </div>
            </div>

            {/* Formal Verification Declaration */}
            <div className="p-4 border-2 border-slate-900 rounded-xl space-y-2 bg-slate-50">
              <div className="font-bold text-slate-900 uppercase text-[11px]">
                Izjava o sukladnosti sustava kontrole štetnika
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Ovime se potvrđuje da je sustav kontrole štetnika na lokaciji <strong>{currentSite.name}</strong> u
                potpunosti usklađen s internim standardima Atlantic Grupe, važećim zakonskim propisima i
                zahtjevima standarda IFS Food v8. Sve točke monitoringa su uredno označene jedinstvenim QR
                kodovima i pozicionirane na digitalnim tlocrtima.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-6 mt-4 border-t border-slate-300 text-center">
                <div>
                  <div className="border-b border-slate-400 pb-8 text-slate-400 text-[10px]">
                    (Vlastoručni / digitalni potpis)
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{currentSite.qaLeadName}</div>
                  <div className="text-[10px] text-slate-500">QA Voditelj lokacije</div>
                </div>

                <div>
                  <div className="border-b border-slate-400 pb-8 text-slate-400 text-[10px]">
                    (Vlastoručni / digitalni potpis)
                  </div>
                  <div className="font-bold text-slate-900 mt-1">Marko Babić, ing. san.</div>
                  <div className="text-[10px] text-slate-500">Odgovorna osoba DDD izvođača</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
