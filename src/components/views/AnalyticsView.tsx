import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  Filter,
  Download,
  Building2,
  CheckCircle2,
  Bug,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { usePestControl } from '../../store/pestControlStore';

export const AnalyticsView: React.FC = () => {
  const { activeSite, sites } = usePestControl();
  const [metricType, setMetricType] = useState<'total' | 'normalized'>('total');

  const trendData = [
    { month: 'Sij', glodavci: 1, muhe: 4, moljci: 1, ukupno: 6 },
    { month: 'Velj', glodavci: 0, muhe: 6, moljci: 1, ukupno: 7 },
    { month: 'Ožu', glodavci: 1, muhe: 8, moljci: 2, ukupno: 11 },
    { month: 'Tra', glodavci: 0, muhe: 14, moljci: 4, ukupno: 18 },
    { month: 'Svi', glodavci: 0, muhe: 22, moljci: 9, ukupno: 31 },
    { month: 'Lip', glodavci: 0, muhe: 35, moljci: 15, ukupno: 50 },
    { month: 'Srp', glodavci: 1, muhe: 42, moljci: 18, ukupno: 61 },
    { month: 'Kol', glodavci: 2, muhe: 28, moljci: 12, ukupno: 42 },
    { month: 'Ruj', glodavci: 0, muhe: 19, moljci: 7, ukupno: 26 },
  ];

  const zoneBreakdownData = [
    { zone: 'Vanjski perimetar', ulov: 14, udio: '18%' },
    { zone: 'Skladište sirovina', ulov: 28, udio: '36%' },
    { zone: 'Pakirnica i puniona', ulov: 24, udio: '31%' },
    { zone: 'Otvoreni proizvod', ulov: 1, udio: '1%' },
    { zone: 'Otpad i tehnički', ulov: 11, udio: '14%' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
              ANALITIKA I TRENDOVI
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Statistička analiza kretanja štetnika i efikasnosti mjera
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sezonski indeksi, usporedba lokacija Atlantic Grupe i normalizirani pokazatelji za godišnji HACCP pregled
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>Izvoz analitičkog izvješća</span>
          </button>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Line / Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Mjesečni trend ulova po skupinama štetnika
              </h2>
              <p className="text-xs text-slate-400">Prikaz kretanja kroz tekuću godinu (2026.)</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setMetricType('total')}
                className={`px-2.5 py-1 rounded font-semibold ${
                  metricType === 'total' ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                Ukupan broj
              </button>
              <button
                onClick={() => setMetricType('normalized')}
                className={`px-2.5 py-1 rounded font-semibold ${
                  metricType === 'normalized' ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                Po točki
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="muhe" name="Leteće muhe (UV)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="moljci" name="Skladišni moljci" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Area type="monotone" dataKey="glodavci" name="Glodavci (Mamac/Griz)" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Distribution Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Udio ulova po HACCP zonama
            </h2>
            <p className="text-xs text-slate-400">Identifikacija kritičnih žarišta</p>
          </div>

          <div className="space-y-3 text-xs">
            {zoneBreakdownData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>{item.zone}</span>
                  <span className="text-red-400">{item.ulov} nalaza ({item.udio})</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: item.udio }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Kritična zona otvorenog proizvoda bilježi minimalnu aktivnost (0.2%), što potvrđuje efikasnost sanitarnih barijera.
          </div>
        </div>
      </div>
    </div>
  );
};
