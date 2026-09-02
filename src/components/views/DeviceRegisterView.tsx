import React, { useState } from 'react';
import {
  Radio,
  Search,
  Filter,
  Plus,
  QrCode,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  Calendar,
  Layers,
  Edit,
  Trash2,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { MonitoringDevice, DeviceCategory, PestGroup } from '../../types';

interface DeviceRegisterViewProps {
  onInspectDevice?: (device: MonitoringDevice) => void;
  onOpenDeviceInspection?: (device: MonitoringDevice) => void;
  onOpenQrScanner?: () => void;
}

export const DeviceRegisterView: React.FC<DeviceRegisterViewProps> = ({
  onInspectDevice,
  onOpenDeviceInspection,
  onOpenQrScanner,
}) => {
  const {
    devices,
    zones,
    activeSite,
    sites,
    addDevice,
    updateDeviceStatus,
  } = usePestControl();

  const handleOpenInspection = (device: MonitoringDevice) => {
    if (onInspectDevice) onInspectDevice(device);
    else if (onOpenDeviceInspection) onOpenDeviceInspection(device);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQrSheetModal, setShowQrSheetModal] = useState(false);

  // New device form
  const [newCode, setNewCode] = useState('');
  const [newCategory, setNewCategory] = useState<DeviceCategory>('VANJSKA_DERATIZACIJSKA_KUTIJA');
  const [newZoneId, setNewZoneId] = useState('');
  const [newInstallationDate, setNewInstallationDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const siteDevices = activeSite ? devices.filter((d) => d.siteId === activeSite.id) : devices;
  const currentSiteZones = activeSite ? zones.filter((z) => z.siteId === activeSite.id) : zones;

  const filteredDevices = siteDevices.filter((d) => {
    const matchesSearch =
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.qrCodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.zoneName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSite = activeSite || sites[0];
    const selectedZone = currentSiteZones.find((z) => z.id === newZoneId) || currentSiteZones[0] || {
      id: 'ZONE-DEFAULT',
      name: 'Glavni prostor',
      buildingId: 'BLD-01',
      floorId: 'FLR-01',
    };

    const categoryMap: Record<DeviceCategory, { name: string; pest: PestGroup; pestHr: string }> = {
      VANJSKA_DERATIZACIJSKA_KUTIJA: {
        name: 'Vanjska deratizacijska kutija',
        pest: 'GLODAVCI',
        pestHr: 'Glodavci (Štakor, Miš)',
      },
      UNUTARNJA_MEHANICKA_KLOPKA: {
        name: 'Unutarnja mehanička klopka (Snap)',
        pest: 'GLODAVCI',
        pestHr: 'Glodavci (Miš)',
      },
      NETOKSICNA_MONITORING_STANICA: {
        name: 'Netoksična monitoring stanica',
        pest: 'GLODAVCI',
        pestHr: 'Glodavci',
      },
      INSEKTOLOVKA: {
        name: 'UV Insektolovka s ljepljivom pločom',
        pest: 'LETECI_INSEKTI',
        pestHr: 'Leteći insekti (Muhe)',
      },
      FEROMONSKA_KLOPKA: {
        name: 'Feromonska klopka za moljce',
        pest: 'SKLADISNI_STETNICI',
        pestHr: 'Skladišni moljci',
      },
      KLOPKA_GMIZUCI_INSEKTI: {
        name: 'Podna ljepljiva klopka',
        pest: 'GMIZUCI_INSEKTI',
        pestHr: 'Gmižući insekti (Žohari)',
      },
      MONITORING_PTICE: {
        name: 'Monitoring stanica za ptice',
        pest: 'PTICE',
        pestHr: 'Ptice',
      },
      MONITORING_MUHE: {
        name: 'Monitoring stanica za muhe',
        pest: 'LETECI_INSEKTI',
        pestHr: 'Leteći insekti',
      },
      MONITORING_MOLJCI: {
        name: 'Klopka za skladišne moljce',
        pest: 'SKLADISNI_STETNICI',
        pestHr: 'Skladišni štetnici',
      },
      DIGITALNA_IOT_KLOPKA: {
        name: 'Digitalna IoT senzorska klopka',
        pest: 'GLODAVCI',
        pestHr: 'Glodavci',
      },
      OSTALO: {
        name: 'Ostala monitoring stanica',
        pest: 'OSTALO',
        pestHr: 'Ostali štetnici',
      },
    };

    const catInfo = categoryMap[newCategory] || categoryMap.VANJSKA_DERATIZACIJSKA_KUTIJA;

    addDevice({
      siteId: targetSite.id,
      buildingId: selectedZone.buildingId || 'BLD-01',
      floorId: selectedZone.floorId || 'FLR-01',
      floorPlanId: 'PLAN-01',
      code: newCode || `DK-${Math.floor(100 + Math.random() * 900)}`,
      category: newCategory,
      categoryHr: catInfo.name,
      targetPestGroup: catInfo.pest,
      targetPestGroupHr: catInfo.pestHr,
      manufacturer: 'Victor / PestWest',
      model: 'Industrial Pro',
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      status: 'AKTIVAN',
      statusHr: 'Aktivan',
      activityStatus: 'UREDNA',
      inspectionFrequency: 'Dva tjedna',
      installDate: newInstallationDate,
      installedDate: newInstallationDate,
      posX: 50,
      posY: 50,
      positionX: 50,
      positionY: 50,
      openFindingsCount: 0,
      openActionsCount: 0,
    });

    setNewCode('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
              REGISTAR UREĐAJA
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Registar točaka monitoringa i kontrolnih stanica (IPM)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Jedinstvena evidencija svih deratizacijskih kutija, UV insektolovki i feromonskih klopki s QR kodovima
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenQrScanner && (
            <button
              onClick={onOpenQrScanner}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Skeniraj QR</span>
            </button>
          )}

          <button
            onClick={() => setShowQrSheetModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-red-400" />
            <span>Ispiši QR naljepnice</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nova točka</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pretraži po oznaci (DK-001), QR UUID-u ili zoni..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">Sve kategorije uređaja</option>
            <option value="VANJSKA_DERATIZACIJSKA_KUTIJA">Deratizacijske kutije (Vanjske)</option>
            <option value="UNUTARNJA_MEHANICKA_KLOPKA">Mehaničke klopke (Unutarnje)</option>
            <option value="INSEKTOLOVKA">UV Insektolovke</option>
            <option value="FEROMONSKA_KLOPKA">Feromonske klopke</option>
            <option value="KLOPKA_GMIZUCI_INSEKTI">Gmižući insekti</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">Svi statusi</option>
            <option value="AKTIVAN">Aktivan</option>
            <option value="OSTECEN">Oštećen</option>
            <option value="NEDOSTUPAN">Nedostupan</option>
            <option value="PRIVREMENO_IZVAN_UPORABE">Izvan uporabe</option>
          </select>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="font-bold text-white uppercase tracking-wider">
            Popis točaka ({filteredDevices.length} uređaja)
          </div>
          <span className="text-slate-400">
            {activeSite ? activeSite.name : 'Sve lokacije'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Oznaka & QR UUID</th>
                <th className="py-2.5 px-3">Kategorija uređaja</th>
                <th className="py-2.5 px-3">HACCP Zona</th>
                <th className="py-2.5 px-3">Ciljani štetnik</th>
                <th className="py-2.5 px-3">Zadnje očitanje</th>
                <th className="py-2.5 px-3">Status točke</th>
                <th className="py-2.5 px-3 text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDevices.map((device) => {
                const isPositive = device.lastResult === 'POTVRDJENA_AKTIVNOST';
                const isWarning = device.lastResult === 'SUMNJA_NA_AKTIVNOST';

                return (
                  <tr key={device.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{device.code}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-red-400">
                          {device.qrCodeId}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Instalirano: {device.installDate || device.installedDate}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-200">{device.categoryHr}</td>
                    <td className="py-3 px-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {device.zoneName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{device.targetPestGroupHr}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold block ${
                          isPositive ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {device.lastResultHr || device.lastResultSummary || 'Nema očitanja'}
                      </span>
                      <span className="text-[10px] text-slate-500">{device.lastInspectionDate || 'Nema datuma'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          device.status === 'AKTIVAN'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                            : device.status === 'OSTECEN'
                            ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {device.statusHr}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenInspection(device)}
                        className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/40 text-xs font-bold transition-all"
                      >
                        Unesi očitanje
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable QR Sheet Modal */}
      {showQrSheetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl p-5 shadow-2xl text-slate-100 space-y-4 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base text-white">
                  Generirani arak QR naljepnica za označavanje točaka
                </h3>
              </div>
              <button
                onClick={() => setShowQrSheetModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Zatvori
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Ispiši standardizirane naljepnice otporne na vlagu i kemikalije za postavljanje na terenske točke.
            </p>

            {/* Simulated Grid of Printable Labels */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-3 bg-white text-slate-900 rounded-xl">
              {filteredDevices.slice(0, 12).map((dev) => (
                <div
                  key={dev.id}
                  className="border-2 border-slate-900 rounded-lg p-2.5 flex flex-col justify-between text-center bg-white"
                >
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
                    ATLANTIC GRUPA • HACCP IPM
                  </div>
                  <div className="my-2 flex justify-center">
                    <div className="w-16 h-16 bg-slate-900 rounded p-1 flex items-center justify-center text-white font-mono text-[9px]">
                      [ QR KOD ]
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">{dev.code}</div>
                    <div className="text-[8px] font-mono text-slate-600">{dev.qrCodeId}</div>
                    <div className="text-[9px] text-slate-700 font-semibold truncate mt-0.5">
                      {dev.zoneName}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Format: Standard A4 naljepnice (3x8)</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Ispiši arak naljepnica</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">Nova točka monitoringa</h3>
            <form onSubmit={handleAddDevice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Oznaka točke (Kôd) *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Npr. DK-EXT-015 ili UV-PRO-006"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Kategorija točke</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DeviceCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="VANJSKA_DERATIZACIJSKA_KUTIJA">Deratizacijska kutija (Vanjska)</option>
                  <option value="UNUTARNJA_MEHANICKA_KLOPKA">Unutarnja mehanička klopka</option>
                  <option value="INSEKTOLOVKA">UV Insektolovka</option>
                  <option value="FEROMONSKA_KLOPKA">Feromonska klopka za moljce</option>
                  <option value="KLOPKA_GMIZUCI_INSEKTI">Podna klopka za gmižuće insekte</option>
                  <option value="NETOKSICNA_MONITORING_STANICA">Netoksična stanica</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">HACCP Zona lokacije</label>
                <select
                  value={newZoneId}
                  onChange={(e) => setNewZoneId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {currentSiteZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.categoryHr || z.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Datum instalacije</label>
                <input
                  type="date"
                  value={newInstallationDate}
                  onChange={(e) => setNewInstallationDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Spremi točku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
