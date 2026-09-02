import React, { useState } from 'react';
import {
  Sliders,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Radio,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { ThresholdRule, ThresholdRuleType } from '../../types';

export const ThresholdEngineView: React.FC = () => {
  const { thresholdRules } = usePestControl();

  // Test bench state
  const [testZone, setTestZone] = useState('PROIZVODNA_HALA_OTVORENI');
  const [testPest, setTestPest] = useState('GLODAVCI');
  const [testCount, setTestCount] = useState(1);
  const [testBaitConsumed, setTestBaitConsumed] = useState(50);
  const [testSequential, setTestSequential] = useState(1);
  const [simulationResult, setSimulationResult] = useState<{
    triggered: boolean;
    ruleName?: string;
    severity?: string;
    action?: string;
  } | null>(null);

  const runSimulation = () => {
    // Check critical zone zero-tolerance
    if (testZone === 'PROIZVODNA_HALA_OTVORENI' && testCount > 0) {
      setSimulationResult({
        triggered: true,
        ruleName: 'Nulti prag - Otvoreni proizvod (Kritična zona)',
        severity: 'KRITIČNO (Eskalacija u incident)',
        action: 'Automatsko kreiranje CAPA mjere, obavijest QA voditelju i karantena zone',
      });
      return;
    }

    if (testPest === 'GLODAVCI' && testBaitConsumed >= 50) {
      setSimulationResult({
        triggered: true,
        ruleName: 'Visoka potrošnja mamca na perimetru (≥50%)',
        severity: 'VISOKO',
        action: 'Kreiranje nalaza, zamjena mamca i postavljanje dopunskih snap tunela',
      });
      return;
    }

    if (testCount >= 5) {
      setSimulationResult({
        triggered: true,
        ruleName: 'Apsolutni prag ulova insekata (≥5 jedinki)',
        severity: 'VISOKO',
        action: 'Kreiranje CAPA naloga i izvanredna provjera UV lampe',
      });
      return;
    }

    setSimulationResult({
      triggered: false,
      action: 'Očitanje je unutar dopuštenih granica (Redoviti monitoring bez alarma).',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
              THRESHOLD ENGINE
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Pravila pragova osjetljivosti i automatske eskalacije
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurabilna logika za detekciju incidentnih situacija, nultu toleranciju u čistim zonama i automatsko generiranje CAPA
          </p>
        </div>
      </div>

      {/* Rules Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Cards (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Aktivna pravila i pragovi Atlantic IPM standarda</span>
            <span>{thresholdRules.length} pravila</span>
          </div>

          <div className="space-y-3">
            {thresholdRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rule.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-red-400">
                        {rule.ruleType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{rule.description}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rule.severityTrigger === 'KRITICNO'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {rule.severityTrigger}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Ciljana skupina:</span>
                    <span className="font-semibold text-slate-200">{rule.pestGroupHr}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Vrijednost praga:</span>
                    <span className="font-bold text-amber-400">
                      {rule.valueThreshold} {rule.unit || 'jedinki'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Automatska radnja:</span>
                    <span className="text-emerald-400 font-semibold">
                      {rule.autoCreateCapa ? 'Automatska CAPA' : 'Zabilježi nalaz'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Simulation Test Bench (Right col) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs sticky top-20 shadow-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-xs">
                  Simulator Threshold Engine-a
                </h3>
                <p className="text-[10px] text-slate-400">
                  Testirajte okidanje alarma za proizvoljna očitanja
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Zona objekta:</label>
                <select
                  value={testZone}
                  onChange={(e) => setTestZone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs"
                >
                  <option value="PROIZVODNA_HALA_OTVORENI">
                    Proizvodna hala - Otvoreni proizvod (Kritična)
                  </option>
                  <option value="SKLADISTE_SIROVINA">Skladište sirovina (Visoka)</option>
                  <option value="VANJSKI_PERIMETAR">Vanjski perimetar (Niska)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skupina štetnika:</label>
                <select
                  value={testPest}
                  onChange={(e) => setTestPest(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs"
                >
                  <option value="GLODAVCI">Glodavci (Deratizacija)</option>
                  <option value="LETECI">Leteći insekti (UV lampe)</option>
                  <option value="SKLADISNI">Skladišni moljci (Feromoni)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Broj pronađenih jedinki: {testCount}
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={testCount}
                  onChange={(e) => setTestCount(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              {testPest === 'GLODAVCI' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Potrošnja mamca: {testBaitConsumed}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={testBaitConsumed}
                    onChange={(e) => setTestBaitConsumed(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              )}

              <button
                onClick={runSimulation}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all mt-2"
              >
                <Play className="w-4 h-4" />
                <span>Pokreni evaluaciju praga</span>
              </button>
            </div>

            {/* Simulation Result Output Box */}
            {simulationResult && (
              <div
                className={`p-3.5 rounded-xl border space-y-2 animate-in fade-in duration-150 ${
                  simulationResult.triggered
                    ? 'bg-red-950/40 border-red-800 text-red-200'
                    : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  {simulationResult.triggered ? (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>
                    {simulationResult.triggered ? 'PRAG PREKORAČEN!' : 'AKTIVNOST UREDNA'}
                  </span>
                </div>

                {simulationResult.ruleName && (
                  <div className="text-[11px]">
                    Aktivirano pravilo: <strong>{simulationResult.ruleName}</strong>
                  </div>
                )}
                {simulationResult.severity && (
                  <div className="text-[11px]">
                    Razina ozbiljnosti: <strong>{simulationResult.severity}</strong>
                  </div>
                )}
                <div className="text-[11px] pt-1 border-t border-slate-800/80">
                  {simulationResult.action}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
