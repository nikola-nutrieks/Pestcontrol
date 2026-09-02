import React, { useState, useRef } from 'react';
import {
  Map,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Radio,
  Eye,
  Sliders,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Bug,
  Camera,
  Printer,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { MonitoringDevice } from '../../types';

interface FloorPlanViewProps {
  onInspectDevice?: (device: MonitoringDevice) => void;
  onOpenDeviceInspection?: (device: MonitoringDevice) => void;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  onInspectDevice,
  onOpenDeviceInspection,
}) => {
  const { devices, activeSite, updateDevicePosition } = usePestControl();

  const handleOpenInspection = (device: MonitoringDevice) => {
    if (onInspectDevice) onInspectDevice(device);
    else if (onOpenDeviceInspection) onOpenDeviceInspection(device);
  };

  const [activeLayer, setActiveLayer] = useState<'status' | 'heatmap' | 'pestType'>('status');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedPinDevice, setSelectedPinDevice] = useState<MonitoringDevice | null>(null);
  const [draggedDeviceId, setDraggedDeviceId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter site devices
  const siteDevices = activeSite ? devices.filter((d) => d.siteId === activeSite.id) : devices;

  const filteredDevices = siteDevices.filter((d) => {
    if (selectedFilterCategory === 'ALL') return true;
    if (selectedFilterCategory === 'GLODAVCI') return d.targetPestGroup === 'GLODAVCI';
    if (selectedFilterCategory === 'LETECI') return d.targetPestGroup === 'LETECI_INSEKTI';
    if (selectedFilterCategory === 'SKLADISNI') {
      return (
        d.targetPestGroup === 'SKLADISNI_STETNICI' ||
        d.targetPestGroup === 'SKLADISNI_INSEKTI'
      );
    }
    return true;
  });

  const handleDragStart = (e: React.DragEvent, deviceId: string) => {
    e.dataTransfer.setData('text/plain', deviceId);
    setDraggedDeviceId(deviceId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!containerRef.current || !draggedDeviceId) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(2, Math.min(98, Math.round(x)));
    const clampedY = Math.max(2, Math.min(98, Math.round(y)));

    const dev = devices.find((d) => d.id === draggedDeviceId);
    if (dev) {
      updateDevicePosition(
        draggedDeviceId,
        clampedX,
        clampedY,
        dev.zoneId,
        'Korekcija rasporeda na tlocrtu'
      );
    }
    setDraggedDeviceId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePrintMap = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
              INTERAKTIVNI TLOCRTI
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Digitalna shema rasporeda točaka monitoringa (HACCP Mapa)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Lokacija: <strong className="text-slate-200">{activeSite ? activeSite.name : 'Cedevita Zagreb'}</strong> • Prikaz pozicija deratizacijskih stanica, feromonskih klopki i UV uređaja
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintMap}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-red-400" />
            <span>Ispiši kartu za audit</span>
          </button>
        </div>
      </div>

      {/* Floor Plan Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-red-400" />
            Sloj prikaza:
          </span>
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveLayer('status')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                activeLayer === 'status' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Status aktivnosti
            </button>
            <button
              onClick={() => setActiveLayer('heatmap')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                activeLayer === 'heatmap' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Toplinska karta (Rizik)
            </button>
            <button
              onClick={() => setActiveLayer('pestType')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                activeLayer === 'pestType' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vrste štetnika
            </button>
          </div>
        </div>

        {/* Pest Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            Filter točaka:
          </span>
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">Sve točke monitoringa ({siteDevices.length})</option>
            <option value="GLODAVCI">Samo glodavci (Deratizacija)</option>
            <option value="LETECI">Samo leteći insekti (UV lampe)</option>
            <option value="SKLADISNI">Samo skladišni štetnici (Feromoni)</option>
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700"
            title="Smanji prikaz"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-[11px] text-slate-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700"
            title="Povećaj prikaz"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 ml-1"
            title="Resetiraj"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Floor Plan Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden shadow-2xl relative">
          <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Povucite i ispustite točku za promjenu pozicije (Drag & Drop)
            </span>
            <span className="text-[10px] text-slate-500">
              Prikazano {filteredDevices.length} točaka
            </span>
          </div>

          <div
            ref={containerRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease-out',
            }}
            className="relative w-full h-[520px] bg-slate-950 rounded-xl border-2 border-slate-800 overflow-hidden select-none"
          >
            {/* Architectural Layout Background (SVG Grid & Industrial Rooms) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* External Perimeter Fence */}
              <rect x="2%" y="2%" width="96%" height="96%" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="6,4" />
              <text x="4%" y="5%" fill="#64748b" fontSize="10" fontWeight="bold">VANJSKI PERIMETAR OBJEKTA (KONTROLNI POJAS)</text>

              {/* Building Outer Shell */}
              <rect x="15%" y="12%" width="70%" height="76%" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" rx="6" />

              {/* Room 1: Raw Materials Warehouse */}
              <rect x="18%" y="16%" width="32%" height="34%" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="4" />
              <text x="20%" y="22%" fill="#94a3b8" fontSize="11" fontWeight="bold">SKLADIŠTE SIROVINA</text>
              <text x="20%" y="26%" fill="#64748b" fontSize="9">Visoka osjetljivost (Feromoni)</text>

              {/* Room 2: Production Hall - OPEN PRODUCT (Critical Zone) */}
              <rect x="52%" y="16%" width="30%" height="34%" fill="#2d1215" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" rx="4" />
              <text x="54%" y="22%" fill="#fca5a5" fontSize="11" fontWeight="bold">PROIZVODNA HALA (OTVORENI PROIZVOD)</text>
              <text x="54%" y="26%" fill="#ef4444" fontSize="9" fontWeight="bold">KRITIČNA ZONA - NULTA TOLERANCIJA</text>

              {/* Room 3: Packaging & Bottling */}
              <rect x="52%" y="52%" width="30%" height="32%" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="4" />
              <text x="54%" y="58%" fill="#94a3b8" fontSize="11" fontWeight="bold">PAKIRNICA I PUNIONA</text>
              <text x="54%" y="62%" fill="#64748b" fontSize="9">UV insektolovke i snap tuneli</text>

              {/* Room 4: Finished Goods Warehouse & Dispatch */}
              <rect x="18%" y="52%" width="32%" height="32%" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="4" />
              <text x="20%" y="58%" fill="#94a3b8" fontSize="11" fontWeight="bold">SKLADIŠTE GOTOVE ROBE</text>
              <text x="20%" y="62%" fill="#64748b" fontSize="9">Utovarne rampe</text>

              {/* Waste & Technical area */}
              <rect x="86%" y="65%" width="10%" height="22%" fill="#18181b" stroke="#71717a" strokeWidth="1.5" rx="4" />
              <text x="87%" y="74%" fill="#a1a1aa" fontSize="8" fontWeight="bold">OTPAD</text>
            </svg>

            {/* Device Interactive Pins */}
            {filteredDevices.map((device) => {
              const isSelected = selectedPinDevice?.id === device.id;
              const hasActivity = device.lastResult === 'POTVRDJENA_AKTIVNOST';
              const isSuspicious = device.lastResult === 'SUMNJA_NA_AKTIVNOST';
              const isDamaged = device.status === 'OSTECEN';

              let pinColor = 'bg-emerald-500 border-emerald-300';
              if (activeLayer === 'status') {
                if (hasActivity) pinColor = 'bg-red-500 border-red-300 animate-bounce';
                else if (isSuspicious) pinColor = 'bg-amber-500 border-amber-300';
                else if (isDamaged) pinColor = 'bg-purple-500 border-purple-300';
              } else if (activeLayer === 'heatmap') {
                if (hasActivity) pinColor = 'bg-red-600 border-red-400 ring-8 ring-red-500/40';
                else if (isSuspicious) pinColor = 'bg-amber-500 border-amber-300 ring-4 ring-amber-500/30';
                else pinColor = 'bg-blue-500 border-blue-300';
              } else if (activeLayer === 'pestType') {
                if (device.targetPestGroup === 'GLODAVCI') pinColor = 'bg-red-600 border-red-400';
                else if (device.targetPestGroup === 'LETECI_INSEKTI') pinColor = 'bg-blue-500 border-blue-300';
                else pinColor = 'bg-amber-500 border-amber-300';
              }

              const pinX = device.posX ?? device.positionX ?? 50;
              const pinY = device.posY ?? device.positionY ?? 50;

              return (
                <div
                  key={device.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, device.id)}
                  onClick={() => setSelectedPinDevice(device)}
                  style={{
                    left: `${pinX}%`,
                    top: `${pinY}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 group`}
                >
                  {/* Pin Dot */}
                  <div
                    className={`w-6 h-6 rounded-full ${pinColor} border-2 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-lg ${
                      isSelected ? 'ring-4 ring-white scale-125' : 'hover:scale-110'
                    }`}
                  >
                    {device.code.split('-')[0]}
                  </div>

                  {/* Pin Label tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none z-30">
                    <div>{device.code}</div>
                    <div className="text-slate-400 font-normal">{device.zoneName}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="font-bold text-slate-300">Legenda točaka:</span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                Uredno (Bez nalaza)
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                Sumnja na aktivnost
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Potvrđena aktivnost / Prekoračenje
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                Oštećeno / Nedostupno
              </span>
            </div>
          </div>
        </div>

        {/* Selected Pin Details Side Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Detalji kontrolne točke
                </h3>
              </div>
            </div>

            {selectedPinDevice ? (
              <div className="space-y-4 mt-3 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">{selectedPinDevice.code}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {selectedPinDevice.qrCodeId}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{selectedPinDevice.categoryHr}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lokacija / Zona:</span>
                    <span className="font-semibold text-slate-200">{selectedPinDevice.zoneName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Skupina štetnika:</span>
                    <span className="font-semibold text-slate-200">{selectedPinDevice.targetPestGroupHr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Zadnji pregled:</span>
                    <span className="font-semibold text-slate-200">{selectedPinDevice.lastInspectionDate || 'Nema zapisa'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Zadnji rezultat:</span>
                    <span
                      className={`font-bold ${
                        selectedPinDevice.lastResult === 'POTVRDJENA_AKTIVNOST'
                          ? 'text-red-400'
                          : selectedPinDevice.lastResult === 'SUMNJA_NA_AKTIVNOST'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedPinDevice.lastResultHr || selectedPinDevice.lastResultSummary || 'Uredno'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Usklađeno s IFS Food v8 i HACCP planom</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <Eye className="w-8 h-8 mx-auto text-slate-600" />
                <p>Kliknite na bilo koju točku na tlocrtu za prikaz detalja, povijesti očitanja ili unos novog nalaza.</p>
              </div>
            )}
          </div>

          {selectedPinDevice && (
            <button
              onClick={() => handleOpenInspection(selectedPinDevice)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Unesi novo očitanje točke</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
