import React, { useState } from 'react';
import {
  FlaskConical,
  ShieldAlert,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Plus,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { BiocideProduct } from '../../types';

export const BiocidesView: React.FC = () => {
  const { biocides, productUsages, activeSite } = usePestControl();
  const [activeTab, setActiveTab] = useState<'catalog' | 'usageLog'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<BiocideProduct | null>(biocides[0] || null);

  const filteredBiocides = biocides.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.activeSubstance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsages = activeSite
    ? productUsages.filter((u) => u.siteId === activeSite.id)
    : productUsages;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600/20 text-amber-400 border border-amber-500/30">
              SREDSTVA I BIOCIDI
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Registar odobrenih biocidnih pripravaka i evidencija potrošnje
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Usklađeno s Uredbom o biocidima (BPR), registracijama u HR/SI/RS i načelom minimalne uporabe kemikalija (IPM)
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'catalog' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Katalog pripravaka ({biocides.length})
          </button>
          <button
            onClick={() => setActiveTab('usageLog')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'usageLog' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dnevnik potrošnje ({filteredUsages.length})
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        /* Catalog View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pretraži pripravak ili djelatnu tvar..."
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredBiocides.map((product) => {
                const isSelected = selectedProduct?.id === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                        : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-xs">{product.name}</h3>
                        <div className="text-[11px] text-amber-400 mt-0.5 font-medium">
                          {product.activeSubstance} ({product.activeSubstanceConcentration})
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {product.formulation}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                      <span>Proizvođač: {product.manufacturer}</span>
                      <span className="text-emerald-400 font-semibold">Odobren</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Product Specification */}
          <div className="lg:col-span-2">
            {selectedProduct && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {selectedProduct.categoryHr}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Reg. broj: {selectedProduct.registrationNumber}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-white mt-1.5">{selectedProduct.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Proizvođač: {selectedProduct.manufacturer} • CAS br.: {selectedProduct.casNumber}
                    </p>
                  </div>

                  <button
                    onClick={() => alert(`Preuzimanje Sigurnosno-tehničkog lista (STL) za ${selectedProduct.name}`)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-red-400" />
                    <span>Preuzmi STL (Sigurnosni list)</span>
                  </button>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                      Sastav i registracije
                    </div>
                    <div className="space-y-1 text-slate-300">
                      <div>
                        <span className="text-slate-500">Aktivna tvar:</span>{' '}
                        <strong>{selectedProduct.activeSubstance}</strong> ({selectedProduct.activeSubstanceConcentration})
                      </div>
                      <div>
                        <span className="text-slate-500">Formulacija:</span> {selectedProduct.formulation}
                      </div>
                      <div>
                        <span className="text-slate-500">Odobreno u državama:</span>{' '}
                        <span className="text-emerald-400 font-bold">{selectedProduct.approvedCountries.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
                    <div className="font-bold text-red-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      Sigurnost i protuotrov (Antidot)
                    </div>
                    <div className="text-red-200">
                      <div>
                        <span className="text-slate-400">Specifični antidot:</span>{' '}
                        <strong>{selectedProduct.antidoteInfo}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-2">
                        Dozvoljeno postavljanje isključivo unutar zaključanih deratizacijskih kutija s ključem.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Usage Log Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="font-bold text-white uppercase tracking-wider">
              Dnevnik primjene biocida s obveznim IPM obrazloženjem
            </div>
            <span className="text-slate-400">{activeSite ? activeSite.name : 'Sve lokacije'}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Datum & LOT</th>
                  <th className="py-2.5 px-3">Lokacija & Zona</th>
                  <th className="py-2.5 px-3">Sredstvo</th>
                  <th className="py-2.5 px-3">Količina</th>
                  <th className="py-2.5 px-3">Aplikator / Tehničar</th>
                  <th className="py-2.5 px-3">IPM Obrazloženje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsages.map((usage) => (
                  <tr key={usage.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{usage.date}</div>
                      <div className="text-[10px] font-mono text-slate-500">{usage.batchNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200">{usage.siteName}</div>
                      <div className="text-[11px] text-slate-400">{usage.zoneName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-amber-400">{usage.productName}</span>
                      <div className="text-[10px] text-slate-500">{usage.activeSubstance}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {usage.quantity} {usage.unit}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200">{usage.technicianName}</div>
                      <div className="text-[10px] text-slate-500">{usage.contractorName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-[11px] text-slate-300 italic">"{usage.ipmJustification}"</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
