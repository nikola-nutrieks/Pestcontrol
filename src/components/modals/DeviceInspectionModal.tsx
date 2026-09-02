import React, { useState } from 'react';
import {
  X,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Save,
  Send,
  FileText,
  Sliders,
  Sparkles,
  ShieldAlert,
  Info,
  Layers,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { MonitoringDevice, ReadingResult, PestGroup } from '../../types';
import { hrTranslations } from '../../i18n/hr';

interface DeviceInspectionModalProps {
  device: MonitoringDevice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceInspectionModal: React.FC<DeviceInspectionModalProps> = ({
  device,
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    inspections,
    biocides,
    pestMasterData,
    submitDeviceReading,
    createInspection,
    activeSite,
    recordProductUsage,
  } = usePestControl();

  if (!isOpen || !device) return null;

  // Find or create active inspection for current site
  const activeInspection =
    inspections.find((i) => i.siteId === device.siteId && i.status === 'U_TIJEKU') ||
    inspections.find((i) => i.siteId === device.siteId && i.status === 'PLANIRANO') ||
    inspections[0];

  // Form states
  const [result, setResult] = useState<ReadingResult>('NEMA_AKTIVNOSTI');
  const [baitConsumedPct, setBaitConsumedPct] = useState<number>(0);
  const [droppingsCount, setDroppingsCount] = useState<number>(0);
  const [gnawMarksPresent, setGnawMarksPresent] = useState<boolean>(false);
  const [insectsCount, setInsectsCount] = useState<number>(0);
  const [insectsPestTypeId, setInsectsPestTypeId] = useState<string>('PEST-003');
  const [stickyBoardReplaced, setStickyBoardReplaced] = useState<boolean>(false);
  const [uvLampWorking, setUvLampWorking] = useState<boolean>(true);

  // Quality checks
  const [deviceConditionOk, setDeviceConditionOk] = useState<boolean>(true);
  const [deviceCleanlinessOk, setDeviceCleanlinessOk] = useState<boolean>(true);
  const [qrCodeConditionOk, setQrCodeConditionOk] = useState<boolean>(true);

  // Immediate actions & Biocides
  const [immediateActionTaken, setImmediateActionTaken] = useState<string>('');
  const [usedBiocideId, setUsedBiocideId] = useState<string>('');
  const [usedBiocideQty, setUsedBiocideQty] = useState<string>('');
  const [biocideJustification, setBiocideJustification] = useState<string>('');

  // Skipped reason
  const [skippedReason, setSkippedReason] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Quick Photo Simulation Presets
  const samplePhotos = [
    { label: 'Uredan mamac', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ulov moljaca na ljepljivoj ploči', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80' },
    { label: 'Ulov UV insektolovke', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80' },
    { label: 'Oštećen poklopac kutije', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleSubmitReading = (e: React.FormEvent) => {
    e.preventDefault();

    let targetInsp = activeInspection;
    if (!targetInsp) {
      targetInsp = createInspection({
        siteId: device.siteId,
        siteName: activeSite?.name || 'Proizvodni pogon Cedevita Zagreb',
        inspectionTypeHr: 'Izvanredni terenski unos očitanja',
        inspectorName: currentUser.name,
        inspectorRoleHr: currentUser.roleTitleHr,
        isContractor: currentUser.role === 'EXTERNAL_DDD_TECH',
        plannedDate: new Date().toISOString().split('T')[0],
        status: 'U_TIJEKU',
        statusHr: 'U tijeku',
        totalDevicesPlanned: 1,
        totalDevicesCompleted: 0,
        totalDevicesSkipped: 0,
        totalPositiveFindings: 0,
        readings: [],
      });
    }

    const selectedPest = pestMasterData.find((p) => p.id === insectsPestTypeId);
    const selectedBiocide = biocides.find((b) => b.id === usedBiocideId);

    const resultMapHr: Record<ReadingResult, string> = {
      NEMA_AKTIVNOSTI: 'Nema aktivnosti',
      SUMNJA_NA_AKTIVNOST: 'Sumnja na aktivnost',
      POTVRDJENA_AKTIVNOST: 'Potvrđena aktivnost',
      PRESKOCENO_NEDOSTUPNO: `Preskočeno (${skippedReason || 'Nedostupno'})`,
    };

    submitDeviceReading(targetInsp.id, {
      deviceId: device.id,
      deviceCode: device.code,
      deviceCategoryHr: device.categoryHr,
      zoneId: device.zoneId,
      zoneName: device.zoneName,
      scannedAt: new Date().toLocaleString('hr-HR', { dateStyle: 'short', timeStyle: 'short' }),
      result,
      resultHr: resultMapHr[result],
      baitConsumedPct: device.targetPestGroup === 'GLODAVCI' ? baitConsumedPct : undefined,
      droppingsCount: device.targetPestGroup === 'GLODAVCI' ? droppingsCount : undefined,
      gnawMarksPresent: device.targetPestGroup === 'GLODAVCI' ? gnawMarksPresent : undefined,
      insectsCount: device.targetPestGroup !== 'GLODAVCI' ? insectsCount : undefined,
      insectsPestTypeId: device.targetPestGroup !== 'GLODAVCI' ? insectsPestTypeId : undefined,
      insectsPestTypeName: selectedPest ? `${selectedPest.nameHr} (${selectedPest.scientificName})` : undefined,
      stickyBoardReplaced,
      uvLampWorking,
      deviceConditionOk,
      deviceCleanlinessOk,
      qrCodeConditionOk,
      immediateActionTaken,
      usedBiocideName: selectedBiocide?.name,
      usedBiocideQuantity: usedBiocideQty ? `${usedBiocideQty} g` : undefined,
      biocideJustification: selectedBiocide ? biocideJustification : undefined,
      photoUrl,
      skippedReason: result === 'PRESKOCENO_NEDOSTUPNO' ? skippedReason : undefined,
      notes,
    });

    // If biocide was applied, log usage
    if (selectedBiocide && usedBiocideQty) {
      recordProductUsage({
        siteId: device.siteId,
        siteName: activeSite?.name || 'Lokacija',
        zoneName: device.zoneName,
        date: new Date().toISOString().split('T')[0],
        productId: selectedBiocide.id,
        productName: selectedBiocide.name,
        activeSubstance: selectedBiocide.activeSubstance,
        batchNumber: 'LOT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        quantity: usedBiocideQty,
        unit: 'grama',
        targetPest: selectedPest?.nameHr || device.targetPestGroupHr,
        technicianName: currentUser.name,
        contractorName: currentUser.company || 'Eko-Deratizacija d.o.o.',
        ipmJustification: biocideJustification || 'Potrošnja mamca na perimetru',
        previousPreventiveMeasures: 'Pregledan fizički perimetar, ispravne zračne zavjese i snap tuneli',
      });
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 my-4">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white">{device.code}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-red-400 border border-slate-800">
                  {device.qrCodeId}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{device.zoneName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-medium">{device.categoryHr}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {submittedSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-800 p-4 text-emerald-200 flex items-center justify-center gap-2 text-sm font-bold animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Očitanje za uređaj {device.code} je uspješno spremljeno i evaluirano!</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmitReading} className="p-4 sm:p-5 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Result Selector (Main Action) */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              1. Glavni rezultat pregleda točke *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setResult('NEMA_AKTIVNOSTI')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  result === 'NEMA_AKTIVNOSTI'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30 font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-lg mb-1">🟢</div>
                <div className="text-xs leading-tight">Nema aktivnosti</div>
              </button>

              <button
                type="button"
                onClick={() => setResult('SUMNJA_NA_AKTIVNOST')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  result === 'SUMNJA_NA_AKTIVNOST'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 ring-2 ring-amber-500/30 font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-lg mb-1">🟡</div>
                <div className="text-xs leading-tight">Sumnja na aktivnost</div>
              </button>

              <button
                type="button"
                onClick={() => setResult('POTVRDJENA_AKTIVNOST')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  result === 'POTVRDJENA_AKTIVNOST'
                    ? 'bg-red-950/60 border-red-500 text-red-300 ring-2 ring-red-500/30 font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-lg mb-1">🔴</div>
                <div className="text-xs leading-tight">Potvrđena aktivnost</div>
              </button>

              <button
                type="button"
                onClick={() => setResult('PRESKOCENO_NEDOSTUPNO')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  result === 'PRESKOCENO_NEDOSTUPNO'
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300 ring-2 ring-purple-500/30 font-bold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-lg mb-1">🟣</div>
                <div className="text-xs leading-tight">Preskočeno</div>
              </button>
            </div>
          </div>

          {/* If Skipped -> Mandatory reason */}
          {result === 'PRESKOCENO_NEDOSTUPNO' && (
            <div className="bg-purple-950/40 border border-purple-800/60 rounded-xl p-3 space-y-2">
              <label className="block text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                Obvezan razlog nemogućnosti pregleda uređaja *
              </label>
              <select
                value={skippedReason}
                onChange={(e) => setSkippedReason(e.target.value)}
                required
                className="w-full bg-slate-800 border border-purple-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Odaberite razlog --</option>
                <option value="Uređaj nedostupan (Zakrčeno paletama)">Uređaj nedostupan (Zakrčeno robom/paletama)</option>
                <option value="Prostor zaključan (Nema ključa)">Prostor zaključan (Nema dežurnog operatera)</option>
                <option value="Sigurnosno ograničenje (Rad strojeva)">Sigurnosno ograničenje (Rad u zoni)</option>
                <option value="Uređaj nedostaje (Fizički uklonjen)">Uređaj nedostaje (Fizički nije pronađen)</option>
                <option value="Oštećen i ne može se otvoriti">Oštećen i ne može se otvoriti</option>
              </select>
            </div>
          )}

          {/* Conditional: Rodent checks */}
          {device.targetPestGroup === 'GLODAVCI' && result !== 'PRESKOCENO_NEDOSTUPNO' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-4">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>2. Očitanje stanice za glodavce</span>
                <span className="text-[11px] text-slate-400 font-normal">Deratizacija i snap klopke</span>
              </div>

              {/* Bait consumed slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Potrošnja mamca / indikacijskog bloka:</span>
                  <span className="font-bold text-amber-400">{baitConsumedPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="25"
                  value={baitConsumedPct}
                  onChange={(e) => setBaitConsumedPct(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0% (Netaknuto)</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100% (Pojedeno)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Broj pronađenih izmeta:</label>
                  <input
                    type="number"
                    min="0"
                    value={droppingsCount}
                    onChange={(e) => setDroppingsCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={gnawMarksPresent}
                      onChange={(e) => setGnawMarksPresent(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500"
                    />
                    <span>Vidljivi tragovi grizenja na kutiji</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Conditional: Insect & Pheromone checks */}
          {device.targetPestGroup !== 'GLODAVCI' && result !== 'PRESKOCENO_NEDOSTUPNO' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-4">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>2. Očitanje insektolovke / feromonske klopke</span>
                <span className="text-[11px] text-slate-400 font-normal">Leteći i skladišni štetnici</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">Vrsta štetnika:</label>
                  <select
                    value={insectsPestTypeId}
                    onChange={(e) => setInsectsPestTypeId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-red-500"
                  >
                    {pestMasterData
                      .filter((p) => p.group !== 'GLODAVCI')
                      .map((pest) => (
                        <option key={pest.id} value={pest.id}>
                          {pest.nameHr} ({pest.scientificName})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">
                    Ukupan broj ulovljenih jedinki:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={insectsCount}
                    onChange={(e) => setInsectsCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={stickyBoardReplaced}
                    onChange={(e) => setStickyBoardReplaced(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500"
                  />
                  <span>Zamijenjena ljepljiva ploča</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={uvLampWorking}
                    onChange={(e) => setUvLampWorking(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>UV-A lampa radi (Ispravna emisija)</span>
                </label>
              </div>
            </div>
          )}

          {/* Quality, Cleanliness & QR Checks */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-3.5 space-y-2">
            <div className="text-xs font-bold text-slate-300 mb-2">3. Kontrola ispravnosti točke (HACCP provjera)</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-800 border border-slate-700">
                <input
                  type="checkbox"
                  checked={deviceCleanlinessOk}
                  onChange={(e) => setDeviceCleanlinessOk(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded"
                />
                <span>Čistoća uredna</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-800 border border-slate-700">
                <input
                  type="checkbox"
                  checked={deviceConditionOk}
                  onChange={(e) => setDeviceConditionOk(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded"
                />
                <span>Stanje neoštećeno</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-800 border border-slate-700">
                <input
                  type="checkbox"
                  checked={qrCodeConditionOk}
                  onChange={(e) => setQrCodeConditionOk(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded"
                />
                <span>QR naljepnica čitljiva</span>
              </label>
            </div>
          </div>

          {/* Photo Evidence */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-red-400" />
                Fotodokumentacija nalaza / stanja
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Preporučeno za pozitivne nalaze</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {samplePhotos.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoUrl(p.url)}
                  className={`p-1.5 rounded-lg border text-left text-[11px] transition-colors truncate ${
                    photoUrl === p.url
                      ? 'border-red-500 bg-red-950/40 text-red-300 font-semibold'
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  📷 {p.label}
                </button>
              ))}
            </div>

            {photoUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-36 bg-slate-950 flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Nalaz"
                  className="w-full h-36 object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Immediate Action Taken & Optional Biocide IPM Justification */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Provedena hitna mjera na licu mjesta (Opis):
              </label>
              <input
                type="text"
                value={immediateActionTaken}
                onChange={(e) => setImmediateActionTaken(e.target.value)}
                placeholder="Npr. Postavljena nova ljepljiva ploča, očišćen prostor, obaviješten poslovođa"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            {/* Chemical Treatment IPM Accordion */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-3">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Primjena kemijskog pripravka / biocida (IPM načelo)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ispuniti isključivo ako je primijenjen rodenticid ili insekticidni gel. Zahtijeva strogo obrazloženje.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Korišteno sredstvo:</label>
                  <select
                    value={usedBiocideId}
                    onChange={(e) => setUsedBiocideId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                  >
                    <option value="">-- Bez kemijskog tretmana --</option>
                    {biocides.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.activeSubstance})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Količina (g ili ml):</label>
                  <input
                    type="text"
                    value={usedBiocideQty}
                    onChange={(e) => setUsedBiocideQty(e.target.value)}
                    placeholder="Npr. 40 g"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {usedBiocideId && (
                <div>
                  <label className="block text-[11px] font-bold text-red-300 mb-1">
                    Obvezno IPM obrazloženje (Zašto preventivne/mehaničke mjere nisu bile dovoljne) *
                  </label>
                  <textarea
                    value={biocideJustification}
                    onChange={(e) => setBiocideJustification(e.target.value)}
                    required
                    rows={2}
                    placeholder="Unesite stručno obrazloženje za primjenu kemijskog sredstva..."
                    className="w-full bg-slate-800 border border-red-500/50 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Interna napomena pregledavatelja:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Dodatne operativne zabilješke..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Odustani
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-950/40 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Spremi i predaj očitanje</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
