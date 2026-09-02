import React, { useState } from 'react';
import { X, QrCode, Camera, Check, Search, Radio, Building2, MapPin, Sparkles } from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { MonitoringDevice } from '../../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDeviceForInspection: (device: MonitoringDevice) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectDeviceForInspection,
}) => {
  const { devices, activeSite } = usePestControl();
  const [searchCode, setSearchCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanSimulatedProgress, setScanSimulatedProgress] = useState(false);
  const [selectedFoundDevice, setSelectedFoundDevice] = useState<MonitoringDevice | null>(null);

  if (!isOpen) return null;

  const siteDevices = activeSite
    ? devices.filter((d) => d.siteId === activeSite.id)
    : devices;

  const filteredDevices = searchCode.trim()
    ? siteDevices.filter(
        (d) =>
          d.code.toLowerCase().includes(searchCode.toLowerCase()) ||
          d.qrCodeId.toLowerCase().includes(searchCode.toLowerCase()) ||
          d.zoneName.toLowerCase().includes(searchCode.toLowerCase())
      )
    : siteDevices.slice(0, 8);

  const handleSimulateScan = (device: MonitoringDevice) => {
    setSelectedFoundDevice(device);
    setScanSimulatedProgress(true);
    setTimeout(() => {
      setScanSimulatedProgress(false);
      onSelectDeviceForInspection(device);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Skeniranje QR koda uređaja</h3>
              <p className="text-xs text-slate-400">
                {activeSite ? activeSite.name : 'Sve aktivne točke monitoringa'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder Simulator */}
        <div className="p-4 space-y-4">
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[200px] overflow-hidden">
            {/* Viewfinder crosshairs */}
            <div className="relative w-44 h-44 border-2 border-red-500/60 rounded-xl flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-400 -mt-0.5 -ml-0.5" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-400 -mt-0.5 -mr-0.5" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-400 -mb-0.5 -ml-0.5" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-400 -mb-0.5 -mr-0.5" />

              {/* Scanning red laser beam animation */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-pulse" />

              <Camera className="w-8 h-8 text-slate-600" />
            </div>

            <div className="text-center mt-3">
              <span className="text-xs font-semibold text-slate-300">
                Usmjerite kameru prema QR naljepnici na kutiji ili klopci
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatski prepoznaje oznaku kontrolne točke (ISO/HACCP)
              </p>
            </div>
          </div>

          {/* Search by Code / Manual input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Ili ručno unesite oznaku uređaja (npr. DK-EXT-001)</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {siteDevices.length} točaka na lokaciji
              </span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Pretraži po oznaci (DK-001, UV-004) ili zoni..."
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Quick Select Grid for demonstration & instant inspection */}
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>Brzi odabir točke za unos očitanja:</span>
              <span className="text-[10px] text-amber-400/90 flex items-center gap-1 font-normal">
                <Sparkles className="w-3 h-3" />
                Klikom simulirate skeniranje
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredDevices.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  Nema pronađenih uređaja za uneseni pojam.
                </div>
              ) : (
                filteredDevices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => handleSimulateScan(device)}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center justify-between text-xs transition-all hover:border-red-500/50 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-slate-900 text-red-400 group-hover:text-red-300">
                        <Radio className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-2">
                          <span>{device.code}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
                            {device.qrCodeId}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[200px]">{device.zoneName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-red-400 group-hover:underline">
                        Otvori pregled →
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Kompatibilno s kamerama pametnih telefona i terenskim tabletima
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};
