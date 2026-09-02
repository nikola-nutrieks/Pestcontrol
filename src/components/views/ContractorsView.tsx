import React, { useState } from 'react';
import {
  Briefcase,
  ShieldCheck,
  UserCheck,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Calendar,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { Contractor } from '../../types';

export const ContractorsView: React.FC = () => {
  const { contractors } = usePestControl();
  const [selectedContractor, setSelectedContractor] = useState<Contractor>(contractors[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              DDD IZVOĐAČI
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Registar ugovorenih DDD izvođača, certifikati i SLA ocjene
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Nadzor kvalitete rada vanjskih DDD partnera, licenciranih tehničara i valjanosti ugovorne dokumentacije
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Contractors List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Ugovoreni partneri ({contractors.length})
          </div>

          <div className="space-y-2.5">
            {contractors.map((c) => {
              const isSelected = selectedContractor?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContractor(c)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/40 shadow-lg'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">{c.name}</h3>
                      <div className="text-[11px] text-slate-400 mt-0.5">OIB: {c.oib}</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      ★ {c.slaScore} / 5.0
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                    <span>Tehničara: {c.technicians.length}</span>
                    <span className="text-slate-300 font-semibold">{c.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Contractor Detail & Technicians */}
        <div className="lg:col-span-2">
          {selectedContractor && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Ugovorni status: {selectedContractor.contractStatusHr}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1.5">{selectedContractor.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedContractor.address}, {selectedContractor.city} • Ugovor br. {selectedContractor.contractNumber}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Ugovor vrijedi do:</span>
                  <span className="font-bold text-slate-200 text-sm">{selectedContractor.contractValidUntil}</span>
                </div>
              </div>

              {/* KPI Scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Prosječna SLA ocjena:</span>
                  <div className="text-xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                    <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                    <span>{selectedContractor.slaScore}</span>
                    <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Vrijeme odziva (Hitnoće):</span>
                  <div className="text-xl font-black text-white mt-1">
                    {selectedContractor.avgResponseTimeHours} h
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Točnost provedbe pregleda:</span>
                  <div className="text-xl font-black text-emerald-400 mt-1">99.4%</div>
                </div>
              </div>

              {/* Certified Technicians Table */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Licencirani DDD tehničari i sanitarni inženjeri ({selectedContractor.technicians.length})</span>
                  <span className="text-[11px] text-slate-500">Provjereno za rad u prehrambenoj industriji</span>
                </div>

                <div className="space-y-2">
                  {selectedContractor.technicians.map((tech) => (
                    <div
                      key={tech.id}
                      className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{tech.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Licenca: <span className="font-mono text-slate-300">{tech.licenseNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {tech.email} • {tech.phone}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Licenca važeća
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Do: {tech.licenseValidUntil}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
