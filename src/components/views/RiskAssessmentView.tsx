import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Layers,
  Save,
  Building2,
  Calendar,
  Award,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { RiskAssessment } from '../../types';

export const RiskAssessmentView: React.FC = () => {
  const { riskAssessments, activeSite, currentUser, createRiskAssessment } = usePestControl();

  const [activeSiteAssessment, setActiveSiteAssessment] = useState<RiskAssessment>(
    riskAssessments[0]
  );

  // Form states for risk calculation
  const [productSensitivity, setProductSensitivity] = useState(4); // 1-5
  const [processOpenness, setProcessOpenness] = useState(4); // 1-5
  const [buildingIntegrity, setBuildingIntegrity] = useState(2); // 1-5 (lower = better integrity, inverted for risk)
  const [surroundingsRisk, setSurroundingsRisk] = useState(3); // 1-5
  const [logisticsFrequency, setLogisticsFrequency] = useState(4); // 1-5

  // Calculate dynamic score (10 to 100)
  const calculatedScore =
    (productSensitivity * 5 +
      processOpenness * 6 +
      buildingIntegrity * 4 +
      surroundingsRisk * 3 +
      logisticsFrequency * 2) *
    1.0;

  const scoreNormalized = Math.min(100, Math.round((calculatedScore / 100) * 100));

  let riskLevel = 'SREDNJI';
  let riskColor = 'text-amber-400 bg-amber-950/80 border-amber-800';
  let recFrequency = 'Svaka 2 tjedna (Dvotjedni DDD ugovorni pregled)';
  let recDensity = 'Gustoća točaka: 1 stanica na svakih 10-15 metara vanjskog perimetra';

  if (scoreNormalized >= 75) {
    riskLevel = 'KRITIČAN';
    riskColor = 'text-red-400 bg-red-950/80 border-red-800';
    recFrequency = 'Tjedni DDD pregled + Stalni feromonski monitoring';
    recDensity = 'Pojačana gustoća: 1 stanica na svakih 8-10m + UV lampe na svim ulazima';
  } else if (scoreNormalized >= 50) {
    riskLevel = 'VISOKI';
    riskColor = 'text-amber-400 bg-amber-950/80 border-amber-800';
    recFrequency = 'Svaka 2 tjedna (Dvotjedni DDD ugovorni pregled)';
    recDensity = 'Standardna HACCP gustoća: 1 stanica na svakih 12-15m';
  } else {
    riskLevel = 'NISKI';
    riskColor = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    recFrequency = 'Mjesečni pregled';
    recDensity = 'Osnovna gustoća: 1 stanica na svakih 20m';
  }

  const handleSaveAssessment = () => {
    createRiskAssessment({
      siteId: activeSite?.id || 'SITE-CEDEVITA-ZG',
      siteName: activeSite?.name || 'Proizvodni pogon Cedevita Zagreb',
      year: new Date().getFullYear(),
      overallRiskLevel: riskLevel as any,
      overallRiskScore: scoreNormalized,
      assessedByName: currentUser.name,
      assessedAt: new Date().toISOString().split('T')[0],
      recommendedInspectionFrequency: recFrequency,
      recommendedDeviceDensity: recDensity,
      notes: 'Godišnja revizija procjene rizika usklađena s IFS Food v8 i HACCP planom',
    });

    alert('Procjena rizika je uspješno spremljena i zabilježena u Audit Trail!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
              PROCJENA RIZIKA
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Matrica procjene rizika od štetnika (HACCP & IFS Food v8)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Strukturirana analiza osjetljivosti pogona, izračun indeksa rizika i automatske preporuke frekvencije pregleda
          </p>
        </div>

        <button
          onClick={handleSaveAssessment}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Spremi procjenu za {new Date().getFullYear()}.</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assessment Questionnaire */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Čimbenici rizika proizvodnog pogona / skladišta
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Lokacija: <strong className="text-white">{activeSite ? activeSite.name : 'Cedevita Zagreb'}</strong>
            </p>
          </div>

          {/* Factor 1 */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>1. Osjetljivost sirovina i gotovih proizvoda</span>
              <span className="text-amber-400 font-bold">Ocjena: {productSensitivity} / 5</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Praškaste sirovine (šećer, arome, vitamini) privlačne skladišnim moljcima i glodavcima.
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={productSensitivity}
              onChange={(e) => setProductSensitivity(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Factor 2 */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>2. Izloženost procesa (Otvoreni proizvod)</span>
              <span className="text-amber-400 font-bold">Ocjena: {processOpenness} / 5</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Miješanje i punjenje praškastih napitaka s otvorenim točkama doziranja.
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={processOpenness}
              onChange={(e) => setProcessOpenness(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Factor 3 */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>3. Brtvljenje zgrade i fizičke barijere (Infiltracijski rizik)</span>
              <span className="text-amber-400 font-bold">Ocjena: {buildingIntegrity} / 5</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Stanje industrijskih vrata, zračnih zavjesa i mrežica na ventilacijskim otvorima.
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={buildingIntegrity}
              onChange={(e) => setBuildingIntegrity(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Factor 4 */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>4. Vanjsko okruženje i susjedstvo</span>
              <span className="text-amber-400 font-bold">Ocjena: {surroundingsRisk} / 5</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Blizina zelenih površina, prometnica i vanjskih skladišta ambalaže.
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={surroundingsRisk}
              onChange={(e) => setSurroundingsRisk(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          {/* Factor 5 */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>5. Frekvencija prijema paleta i logistike</span>
              <span className="text-amber-400 font-bold">Ocjena: {logisticsFrequency} / 5</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dnevni prijem sirovina i drvenih paleta iz vanjskih izvora (rizik unosa štetnika).
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={logisticsFrequency}
              onChange={(e) => setLogisticsFrequency(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </div>

        {/* Right Col: Calculated Outcome & Recommendations */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-xs shadow-2xl">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Rezultat evaluacije rizika
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-3xl font-black text-white">{scoreNormalized}</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${riskColor}`}>
                  {riskLevel} RIZIK
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 rounded-full"
                  style={{ width: `${scoreNormalized}%` }}
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Obvezne preporuke sustava:
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block">Preporučena frekvencija DDD:</span>
                <span className="font-bold text-slate-100">{recFrequency}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block">Preporučena gustoća točaka:</span>
                <span className="font-bold text-slate-100">{recDensity}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-[11px] text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Procjena je usklađena sa zahtjevima IFS Food v8 klauzula 4.13 i HACCP plana.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
