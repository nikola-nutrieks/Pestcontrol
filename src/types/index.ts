// Definicije tipova za Atlantic Pest Control sustav

export type UserRole =
  | 'GROUP_QA_ADMIN' // Grupni QA administrator
  | 'COUNTRY_QA_LEAD' // QA voditelj države ili poslovnog područja
  | 'SITE_QA_LEAD' // QA voditelj lokacije
  | 'PEST_COORDINATOR' // Koordinator kontrole štetnika
  | 'INTERNAL_INSPECTOR' // Interni pregledavatelj
  | 'EXTERNAL_DDD_TECH' // Vanjski DDD tehničar
  | 'FACILITY_OPERATOR' // Odgovorna osoba skladišta, proizvodnje ili održavanja
  | 'EFFECTIVENESS_VERIFIER' // Pregledavatelj učinkovitosti
  | 'AUDITOR_READONLY' // Auditor ili korisnik samo za čitanje
  | 'SYSTEM_ADMIN' // Sistemski administrator
  | 'MANAGEMENT_VIEWER' // Uprava ili management viewer
  | 'QA_MANAGER'
  | 'PLANT_DIRECTOR'
  | 'AUDITOR_VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitleHr: string;
  country: string;
  company: string;
  allowedSiteIds: string[]; // ['*'] for all
  contractorId?: string; // Ako je vanjski izvođač
  avatar?: string;
  active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
}

export interface LegalEntity {
  id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
}

export type SiteType =
  | 'PROIZVODNI_POGON'
  | 'CENTRALNO_SKLADISTE'
  | 'REGIONALNO_SKLADISTE'
  | 'DISTRIBUCIJSKI_CENTAR'
  | 'UGOVORNO_SKLADISTE'
  | 'LOGISTICKI_CENTAR'
  | 'URED_S_HRANOM'
  | 'TEHNICKA_LOKACIJA'
  | 'OSTALO';

export type RiskLevel = 'NIZAK' | 'UMJEREN' | 'VISOK' | 'VISOKO' | 'KRITICAN' | 'KRITIČAN';

export interface Site {
  id: string;
  name: string;
  code: string;
  legalEntityId: string;
  legalEntityName: string;
  country: string;
  countryCode: string;
  address: string;
  city?: string;
  siteType: SiteType;
  siteTypeHr: string;
  areaSqMeters: number;
  mainActivity: string;
  openProductPresent: boolean;
  sensitiveZonesSummary: string;
  riskLevel: RiskLevel;
  qaLeadId: string;
  qaLeadName: string;
  coordinatorName: string;
  facilityManagerName: string;
  activeContractorId: string;
  activeContractorName: string;
  contractNumber: string;
  contractValidUntil: string;
  inspectionFrequencyHr: string;
  deviceCount: number;
  lastInspectionDate: string;
  nextInspectionDate: string;
  currentPlanVersion: string;
  lastRiskAssessmentDate: string;
  nextRiskAssessmentDate: string;
  emergencyContact: string;
  active: boolean;
  zones?: Zone[];
}

export interface Building {
  id: string;
  siteId: string;
  name: string;
  code: string;
  floorsCount: number;
}

export interface Floor {
  id: string;
  buildingId: string;
  siteId: string;
  name: string;
  level: number;
}

export type ZoneCategory =
  | 'VANJSKI_PERIMETAR'
  | 'ULAZ_ROBE'
  | 'ISTOVAR_ROBE'
  | 'SKLADISTE_SIROVINA'
  | 'SKLADISTE_AMBALAZE'
  | 'SKLADISTE_GOTOVIH_PROIZVODA'
  | 'PROIZVODNJA'
  | 'ZONA_OTVORENOG_PROIZVODA'
  | 'TEHNICKA_PROSTORIJA'
  | 'PROSTOR_ZA_OTPAD'
  | 'UTOVARNA_RAMPA'
  | 'SANITARNI_PROSTOR'
  | 'UREDSKI_PROSTOR'
  | 'KANTINA'
  | 'GARDEROBA'
  | 'STROJARNICA'
  | 'VISOKI_HIGIJENSKI_RIZIK'
  | 'NISKI_RIZIK'
  | 'OSTALO';

export interface Zone {
  id: string;
  siteId: string;
  buildingId: string;
  floorId: string;
  name: string;
  code: string;
  category: ZoneCategory;
  categoryHr: string;
  riskLevel: RiskLevel;
  openProductExposure: boolean;
  hygieneLevel: string;
  description?: string;
}

export type DeviceCategory =
  | 'VANJSKA_DERATIZACIJSKA_KUTIJA'
  | 'UNUTARNJA_MEHANICKA_KLOPKA'
  | 'NETOKSICNA_MONITORING_STANICA'
  | 'INSEKTOLOVKA'
  | 'FEROMONSKA_KLOPKA'
  | 'KLOPKA_GMIZUCI_INSEKTI'
  | 'MONITORING_PTICE'
  | 'MONITORING_MUHE'
  | 'MONITORING_MOLJCI'
  | 'DIGITALNA_IOT_KLOPKA'
  | 'OSTALO';

export type DeviceStatus =
  | 'PLANIRAN'
  | 'CEKA_POSTAVLJANJE'
  | 'AKTIVAN'
  | 'PRIVREMENO_IZVAN_UPORABE'
  | 'OSTECEN'
  | 'NEDOSTUPAN'
  | 'NEDOSTAJE'
  | 'ZAMIJENJEN'
  | 'UKLONJEN'
  | 'ARHIVIRAN';

export type DeviceActivityStatus =
  | 'UREDNA'
  | 'POTREBNO_PRATITI'
  | 'PONAVLJAJUCA_AKTIVNOST'
  | 'PREKORACEN_PRAG'
  | 'PREGLED_KASNI'
  | 'OSTECEN_NEDOSTUPAN'
  | 'NOVI_UREDAJ';

export interface MonitoringDevice {
  id: string;
  code: string; // Npr. DK-EXT-001, UV-PROD-014
  qrCodeId: string; // UUID u QR kodu
  siteId: string;
  buildingId: string;
  floorId: string;
  zoneId: string;
  zoneName: string;
  category: DeviceCategory;
  categoryHr: string;
  targetPestGroup: PestGroup;
  targetPestGroupHr: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  installDate: string;
  installedDate?: string; // alias
  status: DeviceStatus;
  statusHr: string;
  activityStatus: DeviceActivityStatus;
  inspectionFrequency: string; // 'Tjedan', 'Dva tjedna', 'Mjesec'
  posX: number; // Postotak 0-100 na tlocrtu
  posY: number; // Postotak 0-100 na tlocrtu
  positionX?: number; // alias
  positionY?: number; // alias
  floorPlanId: string;
  lastInspectionDate?: string;
  lastResultSummary?: string;
  lastResult?: ReadingResult;
  lastResultHr?: string;
  nextInspectionDueDate?: string;
  openFindingsCount: number;
  openActionsCount: number;
  notes?: string;
  photoUrl?: string;
}

export interface DeviceLocationHistory {
  id: string;
  deviceId: string;
  deviceCode: string;
  siteId: string;
  oldZoneId: string;
  newZoneId: string;
  oldPosX: number;
  oldPosY: number;
  newPosX: number;
  newPosY: number;
  reason: string;
  changedByUserId: string;
  changedByUserName: string;
  timestamp: string;
  planVersion: string;
}

export interface FloorPlan {
  id: string;
  siteId: string;
  buildingId: string;
  floorId: string;
  name: string;
  version: string;
  status: 'SKICA' | 'U_PRIPREMI' | 'CEKA_ODOBRENJE' | 'ODOBRENO' | 'NEVAZECE' | 'ARHIVIRANO';
  statusHr: string;
  effectiveDate: string;
  uploadedBy: string;
  uploadedDate: string;
  approvedBy?: string;
  approvalDate?: string;
  imageUrl: string;
  reasonForVersion?: string;
}

export type PestGroup =
  | 'GLODAVCI'
  | 'LETECI_INSEKTI'
  | 'GMIZUCI_INSEKTI'
  | 'SKLADISNI_STETNICI'
  | 'SKLADISNI_INSEKTI'
  | 'PTICE'
  | 'OSTALI_KRALJEZNJACI'
  | 'OSTALO';

export interface PestType {
  id: string;
  nameHr: string;
  scientificName: string;
  group: PestGroup;
  groupHr: string;
  alternativeNames: string;
  description: string;
  typicalSigns: string[];
  typicalDamage: string;
  foodSafetyRelevance: string;
  commonLocations: string;
  typicalEntryPoints: string;
  monitoringMethods: string[];
  preventiveMeasures: string[];
  mechanicalControls: string[];
  chemicalControlsRestricted: string[];
  seasonalRelevance: string;
  defaultRiskCategory: RiskLevel;
  defaultAbsoluteThreshold: number;
  active: boolean;
}

export type InspectionStatus =
  | 'PLANIRANO'
  | 'DODIJELJENO'
  | 'U_TIJEKU'
  | 'DJELOMICNO_DOVRSENO'
  | 'CEKA_SLANJE'
  | 'PREDANO'
  | 'CEKA_PREGLED'
  | 'VRACENO_NA_DORADU'
  | 'ODOBRENO'
  | 'ODOBRENO_QA'
  | 'DOVRŠENO'
  | 'ODBIJENO'
  | 'OTKAZANO'
  | 'KASNI';

export interface InspectionSchedule {
  id: string;
  title: string;
  siteId: string;
  siteName: string;
  inspectionType: 'REDOVITI_DDD' | 'INTERNI_KONTROLNI' | 'GODISNJI_STRUKOVNI' | 'KONTROLA_UCINKOVITOSTI' | 'IZVANREDNI_INCIDENT';
  inspectionTypeHr: string;
  assignedContractorId?: string;
  assignedContractorName?: string;
  assignedInspectorId?: string;
  assignedInspectorName?: string;
  frequency: 'DNEVNO' | 'TJEDNO' | 'SVAKA_2_TJEDNA' | 'MJESECNO' | 'DVO_MJESECNO' | 'KVARTALNO' | 'POLUGODISNJE' | 'GODISNJE';
  frequencyHr: string;
  startDate: string;
  nextDueDate: string;
  toleranceDays: number;
  requiresSignature: boolean;
  requiresQaApproval: boolean;
  active: boolean;
}

export interface Inspection {
  id: string;
  inspectionNumber: string; // Npr. PRG-2026-000142
  scheduleId?: string;
  siteId: string;
  siteName: string;
  inspectionTypeHr: string;
  inspectorName: string;
  inspectorRoleHr: string;
  isContractor: boolean;
  contractorName?: string;
  plannedDate: string;
  actualDate?: string;
  startTime?: string;
  endTime?: string;
  status: InspectionStatus;
  statusHr: string;
  totalDevicesPlanned: number;
  totalDevicesCompleted: number;
  totalDevicesSkipped: number;
  totalPositiveFindings: number;
  technicianNotes?: string;
  contractorReportNumber?: string;
  serviceReportFile?: string;
  signatureName?: string;
  signatureDate?: string;
  qaReviewerId?: string;
  qaReviewerName?: string;
  qaReviewDate?: string;
  qaReviewComment?: string;
  qaApprovalStatus?: 'CEKA' | 'ODOBRENO' | 'VRACENO' | 'ODBIJENO';
  offlineSyncedAt?: string;
  readings: DeviceReading[];
}

export type ReadingResult = 'NEMA_AKTIVNOSTI' | 'SUMNJA_NA_AKTIVNOST' | 'POTVRDJENA_AKTIVNOST' | 'PRESKOCENO_NEDOSTUPNO';

export interface DeviceReading {
  id: string;
  inspectionId: string;
  deviceId: string;
  deviceCode: string;
  deviceCategoryHr: string;
  zoneId: string;
  zoneName: string;
  scannedAt: string;
  result: ReadingResult;
  resultHr: string;
  // Rodent specific
  baitConsumedPct?: number; // 0, 25, 50, 75, 100%
  droppingsCount?: number;
  gnawMarksPresent?: boolean;
  catchCount?: number;
  snappedWithoutCatch?: boolean;
  // Insect specific
  insectsCount?: number;
  insectsPestTypeId?: string;
  insectsPestTypeName?: string;
  stickyBoardReplaced?: boolean;
  uvLampWorking?: boolean;
  uvLampOk?: boolean;
  // General checks
  deviceConditionOk: boolean;
  deviceCleanlinessOk: boolean;
  qrCodeConditionOk: boolean;
  immediateActionTaken?: string;
  usedBiocideName?: string;
  usedBiocideQuantity?: string;
  biocideJustification?: string;
  photoUrl?: string;
  skippedReason?: string;
  notes?: string;
}

export type FindingSeverity = 'OPAZANJE' | 'NISKO' | 'SREDNJE' | 'VISOKO' | 'KRITICNO';
export type FindingStatus = 'ZABILJEZENO' | 'CEKA_PREGLED' | 'POTVRDJENO' | 'ODBIJENO' | 'U_OBRADI' | 'POVEZANO_S_INCIDENTOM' | 'ZATVORENO' | 'PONOVNO_OTVORENO';

export interface Finding {
  id: string;
  findingNumber: string; // Npr. NAL-2026-00084
  siteId: string;
  siteName: string;
  buildingId: string;
  floorId: string;
  zoneId: string;
  zoneName: string;
  deviceId?: string;
  deviceCode?: string;
  inspectionId?: string;
  inspectionNumber?: string;
  category: 'AKTIVNOST_STETNIKA' | 'TRAGOVI_STETNIKA' | 'MOGUCA_INFESTACIJA' | 'STRUKTURNI_NEDOSTATAK' | 'HIGIJENSKI_NEDOSTATAK' | 'NEDOSTATAK_UREDAJA' | 'NEDOSTAJE_DOKUMENTACIJA' | 'OSTALO';
  categoryHr: string;
  pestTypeId?: string;
  pestNameHr?: string;
  description: string;
  quantityOrIntensity: string;
  suggestedSeverity: FindingSeverity;
  confirmedSeverity: FindingSeverity;
  confirmedSeverityHr?: string;
  severityHr: string;
  productExposureAssessed: boolean;
  productExposureNote?: string;
  detectedAt: string;
  detectedByName?: string;
  technicianName?: string;
  detectedByRole?: string;
  pestCount?: number;
  photoUrl?: string;
  status: FindingStatus;
  statusHr: string;
  thresholdTriggerReason?: string;
  correctiveActionId?: string;
  triggeredThresholdRuleNames?: string[];
  linkedIncidentId?: string;
  linkedCorrectiveActionId?: string;
  qaReviewedBy?: string;
  qaReviewedDate?: string;
  qaJustification?: string;
}

export type ThresholdRuleType = 'APSOLUTNI' | 'RELATIVNI' | 'SEKVENCIJALNI' | 'PROSTORNI' | 'KRITICNI_DOGADAJ' | 'KOMBINIRANI';

export interface ThresholdRule {
  id: string;
  name: string;
  description: string;
  ruleType: ThresholdRuleType;
  ruleTypeHr: string;
  scopeSiteId?: string; // prazno = sve lokacije (grupa)
  targetPestGroup?: PestGroup;
  pestGroupHr?: string;
  targetZoneCategory?: ZoneCategory;
  conditionDescription: string;
  resultingSeverity: FindingSeverity;
  severityTrigger?: FindingSeverity;
  valueThreshold?: number;
  unit?: string;
  autoCreateAction: boolean;
  autoCreateCapa?: boolean;
  actionDeadlineDays: number;
  immediateNotifyRoles: UserRole[];
  active: boolean;
}

export type IncidentStatus =
  | 'SUMNJA'
  | 'U_PROCJENI'
  | 'POTVRDJENO'
  | 'OGRANICAVANJE_U_TIJEKU'
  | 'SUZBIJANJE_U_TIJEKU'
  | 'POJACANI_MONITORING'
  | 'PROVJERA_UCINKOVITOSTI'
  | 'ZATVORENO'
  | 'PONOVNO_OTVORENO';

export interface PestIncident {
  id: string;
  incidentNumber: string; // Npr. INC-2026-00012
  title: string;
  siteId: string;
  siteName: string;
  zoneName?: string;
  affectedZoneNames: string[];
  pestNameHr: string;
  pestGroup: PestGroup;
  detectedDate: string;
  reportedAt?: string;
  reportedBy?: string;
  detectionSource: string;
  description?: string;
  status: IncidentStatus;
  statusHr: string;
  severity: FindingSeverity;
  severityHr: string;
  affectedProductsNote: string;
  affectedProductBatches?: string;
  containmentMeasures: string;
  containmentActions?: string;
  rootCause: string;
  rootCauseAnalysis?: string;
  eradicationStrategy: string;
  enhancedMonitoringPlan: string;
  responsiblePersonName: string;
  assignedContractorName: string;
  linkedFindingIds: string[];
  linkedActionIds: string[];
  correctiveActionId?: string;
  effectivenessCriteria: string;
  closedByQaName?: string;
  closedDate?: string;
  closureReportSummary?: string;
}

export type Incident = PestIncident;

export type ActionStatus =
  | 'SKICA'
  | 'OTVORENO'
  | 'DODIJELJENO'
  | 'U_TIJEKU'
  | 'CEKA_DOKAZ'
  | 'CEKA_PROVJERU'
  | 'UCINKOVITO'
  | 'NEUCINKOVITO'
  | 'ZATVORENO'
  | 'ZATVORENO_PROVJERENO'
  | 'PONOVNO_OTVORENO'
  | 'OTKAZANO';

export type CapaStatus = ActionStatus;

export type ActionPriority = 'NISKA' | 'SREDNJA' | 'VISOKA' | 'HITNA';

export interface CorrectiveAction {
  id: string;
  actionNumber: string; // Npr. KM-2026-00045
  source: 'NALAZ' | 'INCIDENT' | 'PREGLED' | 'PROCJENA_RIZIKA' | 'AUDIT' | 'OCJENA_IZVODACA' | 'RUCNO';
  sourceHr: string;
  siteId: string;
  siteName: string;
  zoneName: string;
  title: string;
  description: string;
  immediateCorrection: string;
  rootCauseCategory: string;
  rootCauseAnalysis5Whys?: string;
  rootCause5Whys?: string;
  preventiveAction: string;
  responsiblePersonName: string;
  responsiblePersonRole: string;
  responsiblePersonRoleHr?: string;
  dueDate: string;
  priority: ActionPriority;
  priorityHr: string;
  status: ActionStatus;
  statusHr: string;
  requiredEvidenceDescription: string;
  completionEvidencePhotoUrl?: string;
  evidencePhotoUrl?: string;
  completionComment?: string;
  completionNotes?: string;
  completedAt?: string;
  completedByName?: string;
  effectivenessCriteria: string;
  verificationDueDate: string;
  verifierName: string;
  verifiedByName?: string;
  verifierRole: string;
  verificationEvidencePhotoUrl?: string;
  verificationComment?: string;
  verificationNotes?: string;
  verifiedAt?: string;
  isEffective?: boolean;
  closedByQaName?: string;
  closedAt?: string;
  reopenReason?: string;
  linkedFindingId?: string;
  linkedIncidentId?: string;
}

export interface Contractor {
  id: string;
  name: string;
  code: string;
  country: string;
  city?: string;
  address: string;
  oib: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  emergencyPhone: string;
  phone?: string;
  slaScore?: number;
  avgResponseTimeHours?: number;
  contractStatusHr?: string;
  contractNumber: string;
  contractStartDate: string;
  contractEndDate: string;
  contractValidUntil?: string;
  assignedSiteIds: string[];
  assignedSiteNames: string[];
  licenseStatus: 'VAZECA' | 'PRED_ISTEKOM' | 'ISTEKLA';
  licenseNumber: string;
  licenseValidUntil: string;
  insuranceValidUntil: string;
  techniciansCount: number;
  technicians?: ContractorTechnician[];
  overallScore: number; // 0-100
  onTimeVisitRate: number; // %
  completeInspectionRate: number; // %
  active: boolean;
}

export interface ContractorTechnician {
  id: string;
  contractorId: string;
  contractorName: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber?: string;
  licenseValidUntil?: string;
  certificateNumber: string;
  certificateValidUntil: string;
  active: boolean;
  assignedSiteIds: string[];
}

export interface PestControlProduct {
  id: string;
  name: string;
  category: 'RODENTICID' | 'INSEKTICID' | 'FEROMON' | 'MEHANICKA_KLOPKA' | 'REPELENT' | 'NETOKSICNI_MAMAC';
  categoryHr: string;
  activeSubstance: string;
  activeSubstanceConcentration?: string;
  formulation?: string;
  targetPestGroup: PestGroup;
  targetPestGroupHr: string;
  manufacturer: string;
  authorizationNumber: string;
  registrationNumber?: string;
  casNumber?: string;
  antidoteInfo?: string;
  approvedCountries?: string[];
  authorizationValidUntil: string;
  allowedOutdoor: boolean;
  allowedIndoor: boolean;
  requiresStrictQaApproval: boolean;
  safetySheetUrl?: string;
  status: 'ODOBRENO' | 'POTREBNA_PROVJERA' | 'ISTEKLO_ODOBRENJE' | 'ZABRANJENO';
  statusHr: string;
}

export type BiocideProduct = PestControlProduct;

export interface ProductUsageRecord {
  id: string;
  siteId: string;
  siteName: string;
  zoneName: string;
  date: string;
  productId: string;
  productName: string;
  activeSubstance: string;
  batchNumber: string;
  quantity: string;
  unit: string;
  targetPest: string;
  technicianName: string;
  contractorName: string;
  ipmJustification: string;
  previousPreventiveMeasures: string;
}

export interface AppDocument {
  id: string;
  title: string;
  category:
    | 'DDD_UGOVOR'
    | 'PLAN_KONTROLE_STETNIKA'
    | 'KARTA_UREDAJA'
    | 'PROCJENA_RIZIKA'
    | 'SERVISNI_IZVJESTAJ'
    | 'GODISNJI_STRUKOVNI_PREGLED'
    | 'LICENCA_IZVODACA'
    | 'SIGURNOSNO_TEHNICKI_LIST'
    | 'ODOBRENJE_BIOCIDA'
    | 'DOKAZ_KOREKTIVNE_MJERE'
    | 'AUDIT_PAKET'
    | 'HACCP_PLAN'
    | 'UGOVOR_DDD'
    | 'SIGURNOSNI_LIST_STL'
    | 'CERTIFIKAT_IZVODJACA'
    | 'TLOCRT_SHEMA'
    | 'OSTALO';
  categoryHr: string;
  siteId?: string;
  siteName?: string;
  contractorId?: string;
  contractorName?: string;
  version: string;
  effectiveDate: string;
  expiryDate?: string;
  validUntil?: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
  status: 'ODOBRENO' | 'CEKA_PREGLED' | 'ISTEKLO' | 'ARHIVIRANO';
  statusHr: string;
  fileSize: string;
  fileFormat: string;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedDate: string;
  uploadedAt?: string;
  fileHash: string;
  fileSha256?: string;
}

export type DocumentItem = AppDocument;

export interface RiskAssessment {
  id: string;
  siteId: string;
  siteName: string;
  version?: string;
  year?: number;
  assessorName?: string;
  assessedByName?: string;
  assessedAt?: string;
  date: string;
  reviewDueDate: string;
  totalScore?: number;
  overallRiskScore?: number;
  calculatedRisk: RiskLevel;
  overallRiskLevel?: RiskLevel;
  calculatedRiskHr: string;
  recommendedRodentFrequency: string;
  recommendedInsectFrequency: string;
  recommendedInspectionFrequency?: string;
  recommendedDeviceDensity: string;
  status: 'ODOBRENO' | 'U_PRIJEDLOGU' | 'ARHIVIRANO';
  notes?: string;
  answers: {
    category: string;
    question: string;
    score: number; // 1-5
    notes?: string;
  }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'CRITICAL_FINDING' | 'OVERDUE_INSPECTION' | 'OVERDUE_ACTION' | 'EXPIRED_DOCUMENT' | 'THRESHOLD_EXCEEDED' | 'APPROVAL_REQUIRED' | 'INFO';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  siteId?: string;
  siteName?: string;
  createdAt: string;
  read: boolean;
  linkModule?: string;
  targetId?: string;
}

export interface AuditEvent {
  id: string;
  timestampUtc: string;
  timestamp?: string;
  timestampDisplayHr: string;
  userId: string;
  userName: string;
  performedByName?: string;
  userRoleHr: string;
  performedByRoleHr?: string;
  siteName: string;
  entityType: string;
  targetEntity?: string;
  entityId: string;
  targetId?: string;
  action: 'KREIRANJE' | 'IZMJENA' | 'ODOBRENJE' | 'ODBIJANJE' | 'POMAK_UREDAJA' | 'ZATVARANJE_MJERE' | 'PROVJERA_UCINKOVITOSTI' | 'IZVOZ_IZVJESTAJA' | 'STATUS_PROMJENA';
  actionHr: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  justificationReason?: string;
}

export interface ManagementReview {
  id: string;
  year: number;
  reviewYear?: number;
  periodDescription: string;
  siteIds: string[];
  siteId?: string;
  siteName?: string;
  totalInspections: number;
  totalInspectionsConducted?: number;
  completedRatePct: number;
  totalFindings: number;
  totalFindingsRecorded?: number;
  criticalIncidentsCount: number;
  totalCapasCompleted?: number;
  capaEffectiveRatePct: number;
  biocideReductionTrend: string;
  contractorScoreAverage: number;
  contractorPerformanceSummary?: string;
  keyRisksIdentified: string;
  strategicDecisions: string;
  resourceAllocations: string;
  nextYearGoals?: string;
  qaApprovedBy?: string;
  qaManagerName?: string;
  approvedAt?: string;
  qaApprovedDate: string;
  status: 'SKICA' | 'ODOBRENO' | 'ZATVORENO_ODOBRENO';
}
