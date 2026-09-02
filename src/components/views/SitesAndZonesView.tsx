import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Shield,
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { Site, Zone } from '../../types';

interface SitesAndZonesViewProps {
  onSelectModule: (module: string) => void;
}

export const SitesAndZonesView: React.FC<SitesAndZonesViewProps> = ({ onSelectModule }) => {
  const {
    sites,
    selectedSiteId,
    setSelectedSiteId,
    activeSite,
    addSite,
    updateSite,
    addZone,
    zones,
    devices,
  } = usePestControl();

  const [activeTab, setActiveTab] = useState<'zones' | 'contacts'>('zones');
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);

  // New Zone Form state
  const [zoneName, setZoneName] = useState('');
  const [zoneCode, setZoneCode] = useState('');
  const [zoneSensitivity, setZoneSensitivity] = useState<'KRITICNA' | 'VISOKA' | 'SREDNJA' | 'NISKA'>('VISOKA');
  const [haccpZone, setHaccpZone] = useState('Pakiranje i sekundarna ambalaža');

  const currentSite = activeSite || sites[0];
  const currentSiteZones = zones.filter((z) => z.siteId === currentSite.id);

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;

    addZone(currentSite.id, {
      name: zoneName,
      code: zoneCode || `Z-${Math.floor(100 + Math.random() * 900)}`,
      category: 'PROIZVODNJA',
      categoryHr: haccpZone,
      riskLevel: zoneSensitivity === 'KRITICNA' ? 'KRITICAN' : zoneSensitivity === 'VISOKA' ? 'VISOK' : 'UMJEREN',
      hygieneLevel: zoneSensitivity === 'KRITICNA' ? 'Visoka (Nulti prag)' : 'Standardna',
      openProductExposure: zoneSensitivity === 'KRITICNA',
    });

    setZoneName('');
    setZoneCode('');
    setShowAddZoneModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Site Selector Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
              LOKACIJE I ZONE
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Registar lokacija, pogona i HACCP higijenskih zona
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upravljanje organizacijskim jedinicama Atlantic Grupe, tlocrtnim zonama i stupnjevima osjetljivosti
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddZoneModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Nova zona</span>
          </button>
        </div>
      </div>

      {/* Site Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => {
          const isSelected = site.id === currentSite.id;
          const siteZonesList = zones.filter((z) => z.siteId === site.id);
          const siteDevicesCount = devices.filter((d) => d.siteId === site.id).length;

          return (
            <div
              key={site.id}
              onClick={() => setSelectedSiteId(site.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-red-500 shadow-lg shadow-red-950/20 ring-1 ring-red-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-red-400 font-mono">
                      {site.code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">({site.countryCode || 'HR'})</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-1.5">{site.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{site.legalEntityName || site.name}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    site.riskLevel === 'KRITICAN'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : site.riskLevel === 'VISOK' || (site.riskLevel as string) === 'VISOKO'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {site.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">Broj zona:</span>
                  <span className="font-bold text-slate-200">{siteZonesList.length} zona</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Broj točaka:</span>
                  <span className="font-bold text-white">{siteDevicesCount} uređaja</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] flex items-center justify-between text-slate-400">
                <span className="truncate max-w-[170px]">QA: {site.qaLeadName || 'QA Voditelj'}</span>
                <span className="text-red-400 font-medium">Odabrano</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Site Detail View */}
      {currentSite && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {/* Site Overview Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-red-400 font-semibold mb-1">
                <Building2 className="w-4 h-4" />
                <span>Detalji odabrane lokacije: {currentSite.name}</span>
              </div>
              <h2 className="text-lg font-black text-white">{currentSite.name} ({currentSite.code})</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentSite.address}, {currentSite.city} • Pravni subjekt: {currentSite.legalEntityName || currentSite.name}
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab('zones')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'zones' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                HACCP Zone ({currentSiteZones.length})
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'contacts' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Odgovorne osobe & DDD
              </button>
            </div>
          </div>

          {/* Tab 1: HACCP Zones Table */}
          {activeTab === 'zones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Popis definiranih zona i stupnjeva osjetljivosti
                  </h3>
                  <p className="text-xs text-slate-400">
                    Definirano prema HACCP i IFS Food standardu Atlantic Grupe
                  </p>
                </div>
                <button
                  onClick={() => setShowAddZoneModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-red-400" />
                  <span>Dodaj zonu</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Oznaka & Naziv zone</th>
                      <th className="py-2.5 px-3">HACCP razina / Kategorija</th>
                      <th className="py-2.5 px-3">Rizik</th>
                      <th className="py-2.5 px-3">Otvoreni proizvod</th>
                      <th className="py-2.5 px-3">Broj uređaja</th>
                      <th className="py-2.5 px-3 text-right">Tlocrt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {currentSiteZones.map((zone) => {
                      const zoneDevicesCount = devices.filter((d) => d.zoneId === zone.id).length;

                      return (
                        <tr key={zone.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{zone.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                {zone.code}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-300">{zone.categoryHr || zone.category}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                zone.riskLevel === 'KRITICAN'
                                  ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                                  : zone.riskLevel === 'VISOK'
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {zone.riskLevel}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400">
                            {zone.openProductExposure ? (
                              <span className="text-red-400 font-bold">Da (Nulti prag)</span>
                            ) : (
                              <span>Ne</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-bold text-white">{zoneDevicesCount}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => onSelectModule('floorPlans')}
                              className="text-xs text-red-400 hover:text-red-300 font-bold"
                            >
                              Prikaži na planu →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Contacts & DDD Contractor Assignment */}
          {activeTab === 'contacts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-400" />
                  Interni tim lokacije (Atlantic Grupa)
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">QA Voditelj lokacije:</span>
                    <span className="font-bold text-slate-100 text-sm">{currentSite.qaLeadName || 'QA Voditelj'}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Odgovoran za verifikaciju CAPA mjera i nadzor DDD izvođača
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">HACCP Koordinator lokacije:</span>
                    <span className="font-bold text-slate-100 text-sm">Martina Horvat, dipl. ing.</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Nadzor higijenskih barijera i sanitarnih uvjeta
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Ugovoreni vanjski DDD Izvođač
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Naziv izvođača:</span>
                    <span className="font-bold text-white text-sm">{currentSite.activeContractorName || 'Bio DDD Servis d.o.o.'}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Ugovor o obavljanju obvezatne preventivne deratizacije, dezinsekcije i dezinfekcije v3.1
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ugovor i certifikati tehničara važeći
                  </div>
                  <button
                    onClick={() => onSelectModule('contractors')}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 font-bold block"
                  >
                    Otvori karticu izvođača i certifikate →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Zone Modal */}
      {showAddZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">Nova HACCP / IPM Zona</h3>
            <form onSubmit={handleCreateZone} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Naziv zone *</label>
                <input
                  type="text"
                  required
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="Npr. Puniona napitaka - Linija 2"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Oznaka zone</label>
                <input
                  type="text"
                  value={zoneCode}
                  onChange={(e) => setZoneCode(e.target.value)}
                  placeholder="Npr. Z-PUN-02"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Stupanj osjetljivosti</label>
                <select
                  value={zoneSensitivity}
                  onChange={(e) => setZoneSensitivity(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="KRITICNA">Kritična (Otvoreni proizvod - nulti prag)</option>
                  <option value="VISOKA">Visoka (Pakiranje i sirovine)</option>
                  <option value="SREDNJA">Srednja (Skladišta gotovih proizvoda)</option>
                  <option value="NISKA">Niska (Vanjski perimetar i otpad)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">HACCP klasifikacija</label>
                <input
                  type="text"
                  value={haccpZone}
                  onChange={(e) => setHaccpZone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Dodaj zonu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
