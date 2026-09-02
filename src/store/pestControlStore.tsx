import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  Site,
  Building,
  Floor,
  Zone,
  FloorPlan,
  MonitoringDevice,
  DeviceLocationHistory,
  PestType,
  InspectionSchedule,
  Inspection,
  DeviceReading,
  Finding,
  ThresholdRule,
  PestIncident,
  CorrectiveAction,
  Contractor,
  ContractorTechnician,
  PestControlProduct,
  ProductUsageRecord,
  AppDocument,
  RiskAssessment,
  AppNotification,
  AuditEvent,
  ManagementReview,
  FindingSeverity,
} from '../types';
import { initialPestMasterData } from '../data/pestMasterData';
import {
  initialSites,
  initialBuildings,
  initialFloors,
  initialZones,
  initialFloorPlans,
  initialDevices,
  initialInspectionSchedules,
  initialInspections,
  initialFindings,
  initialThresholdRules,
  initialIncidents,
  initialCorrectiveActions,
  initialContractors,
  initialTechnicians,
  initialBiocides,
  initialProductUsages,
  initialDocuments,
  initialRiskAssessments,
  initialNotifications,
  initialAuditEvents,
  initialUsers,
  initialManagementReview,
} from '../data/initialData';

export interface PestControlContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  setCurrentUserRole: (role: UserRole) => void;
  availableUsers: User[];
  selectedSiteId: string; // 'ALL' or specific siteId
  setSelectedSiteId: (siteId: string) => void;
  activeSite: Site | null;
  sites: Site[];
  buildings: Building[];
  floors: Floor[];
  zones: Zone[];
  floorPlans: FloorPlan[];
  devices: MonitoringDevice[];
  deviceLocationHistories: DeviceLocationHistory[];
  pestMasterData: PestType[];
  inspectionSchedules: InspectionSchedule[];
  inspections: Inspection[];
  findings: Finding[];
  thresholdRules: ThresholdRule[];
  incidents: PestIncident[];
  correctiveActions: CorrectiveAction[];
  contractors: Contractor[];
  technicians: ContractorTechnician[];
  biocides: PestControlProduct[];
  productUsages: ProductUsageRecord[];
  documents: AppDocument[];
  riskAssessments: RiskAssessment[];
  notifications: AppNotification[];
  auditEvents: AuditEvent[];
  managementReview: ManagementReview;
  managementReviews: ManagementReview[];
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Actions
  logAuditEvent: (
    siteName: string,
    entityType: string,
    entityId: string,
    action: AuditEvent['action'],
    actionHr: string,
    details: string,
    oldValue?: string,
    newValue?: string,
    reason?: string
  ) => void;

  // Sites & Zones
  addSite: (site: Partial<Site>) => void;
  updateSite: (siteId: string, updates: Partial<Site>) => void;
  addZone: (param1: string | Partial<Zone>, param2?: Partial<Zone>) => void;

  // Devices & Floor plans
  addDevice: (device: Omit<MonitoringDevice, 'id' | 'qrCodeId'>) => MonitoringDevice;
  updateDevicePosition: (
    deviceId: string,
    newPosX: number,
    newPosY: number,
    newZoneId: string,
    reason?: string
  ) => void;
  updateDeviceStatus: (deviceId: string, status: MonitoringDevice['status'], notes?: string) => void;
  addFloorPlanVersion: (plan: Omit<FloorPlan, 'id'>) => void;

  // Inspections & Readings
  createInspection: (inspection: Omit<Inspection, 'id' | 'inspectionNumber'>) => Inspection;
  submitDeviceReading: (
    inspectionId: string,
    reading: Omit<DeviceReading, 'id' | 'inspectionId'>
  ) => void;
  submitInspection: (inspectionId: string, notes?: string, signatureName?: string) => void;
  approveInspection: (inspectionId: string, approverName?: string) => void;
  qaApproveInspection: (
    inspectionId: string,
    status: 'ODOBRENO' | 'VRACENO' | 'ODBIJENO',
    comment: string
  ) => void;

  // Findings & Thresholds
  updateFindingSeverity: (findingId: string, newSeverity: FindingSeverity, justification: string) => void;
  testThresholdRule: (
    rule: Partial<ThresholdRule>,
    mockInput: { pestGroup?: string; zoneCategory?: string; count?: number; consecutive?: number }
  ) => { triggered: boolean; calculatedSeverity: FindingSeverity; message: string };

  // Incidents
  createIncident: (incident: Omit<PestIncident, 'id' | 'incidentNumber'>) => PestIncident;
  updateIncident: (incidentId: string, updates: Partial<PestIncident>) => void;
  closeIncident: (incidentId: string, summary: string) => void;

  // Corrective Actions (CAPA)
  createCorrectiveAction: (action: any) => CorrectiveAction;
  completeCorrectiveAction: (
    actionId: string,
    evidencePhotoUrl: string,
    comment: string,
    completedByName: string
  ) => void;
  submitActionCompletion: (
    actionId: string,
    name: string,
    notes: string,
    photoUrl?: string
  ) => void;
  verifyCorrectiveAction: (
    actionId: string,
    param2?: boolean | string,
    param3?: string,
    param4?: string,
    param5?: string
  ) => void;

  // Biocides & IPM
  recordProductUsage: (usage: Omit<ProductUsageRecord, 'id'>) => void;

  // Risk & Management Review
  createRiskAssessment: (assessment: Partial<RiskAssessment>) => void;
  createManagementReview: (review: Partial<ManagementReview>) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;

  // Documents & Reset
  uploadDocument: (doc: Omit<AppDocument, 'id' | 'fileHash'>) => void;
  resetToDefaultData: () => void;
  resetToDefaultState: () => void;
}

const PestControlContext = createContext<PestControlContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ATLANTIC_PEST_CONTROL_STORAGE_V1';

export const PestControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[1]); // Default to Maja Horvat (Site QA Lead)
  const [availableUsers] = useState<User[]>(initialUsers);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('SITE-CEDEVITA-ZG');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Main state tables
  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_sites');
    return saved ? JSON.parse(saved) : initialSites;
  });

  const [buildings] = useState<Building[]>(initialBuildings);
  const [floors] = useState<Floor[]>(initialFloors);
  const [zones, setZones] = useState<Zone[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_zones');
    return saved ? JSON.parse(saved) : initialZones;
  });

  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_plans');
    return saved ? JSON.parse(saved) : initialFloorPlans;
  });

  const [devices, setDevices] = useState<MonitoringDevice[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_devices');
    return saved ? JSON.parse(saved) : initialDevices;
  });

  const [deviceLocationHistories, setDeviceLocationHistories] = useState<DeviceLocationHistory[]>([]);
  const [pestMasterData] = useState<PestType[]>(initialPestMasterData);

  const [inspectionSchedules, setInspectionSchedules] = useState<InspectionSchedule[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_schedules');
    return saved ? JSON.parse(saved) : initialInspectionSchedules;
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_inspections');
    return saved ? JSON.parse(saved) : initialInspections;
  });

  const [findings, setFindings] = useState<Finding[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_findings');
    return saved ? JSON.parse(saved) : initialFindings;
  });

  const [thresholdRules, setThresholdRules] = useState<ThresholdRule[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_rules');
    return saved ? JSON.parse(saved) : initialThresholdRules;
  });

  const [incidents, setIncidents] = useState<PestIncident[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_incidents');
    return saved ? JSON.parse(saved) : initialIncidents;
  });

  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_capa');
    return saved ? JSON.parse(saved) : initialCorrectiveActions;
  });

  const [contractors] = useState<Contractor[]>(initialContractors);
  const [technicians] = useState<ContractorTechnician[]>(initialTechnicians);
  const [biocides] = useState<PestControlProduct[]>(initialBiocides);

  const [productUsages, setProductUsages] = useState<ProductUsageRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_usages');
    return saved ? JSON.parse(saved) : initialProductUsages;
  });

  const [documents, setDocuments] = useState<AppDocument[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_docs');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>(initialRiskAssessments);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_audit');
    return saved ? JSON.parse(saved) : initialAuditEvents;
  });

  const [managementReviews, setManagementReviews] = useState<ManagementReview[]>([initialManagementReview]);
  const managementReview = managementReviews[0] || initialManagementReview;

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_sites', JSON.stringify(sites));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_zones', JSON.stringify(zones));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_devices', JSON.stringify(devices));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_inspections', JSON.stringify(inspections));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_findings', JSON.stringify(findings));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_capa', JSON.stringify(correctiveActions));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_incidents', JSON.stringify(incidents));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_notifs', JSON.stringify(notifications));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_audit', JSON.stringify(auditEvents));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_usages', JSON.stringify(productUsages));
  }, [sites, zones, devices, inspections, findings, correctiveActions, incidents, notifications, auditEvents, productUsages]);

  // Current active site helper
  const activeSite = useMemo(() => {
    if (selectedSiteId === 'ALL') return null;
    return sites.find((s) => s.id === selectedSiteId) || sites[0] || null;
  }, [selectedSiteId, sites]);

  // Role setter
  const setCurrentUserRole = (role: UserRole) => {
    const found = availableUsers.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        role,
        roleTitleHr: role,
      }));
    }
  };

  // Audit logging helper
  const logAuditEvent = (
    siteName: string,
    entityType: string,
    entityId: string,
    action: AuditEvent['action'],
    actionHr: string,
    details: string,
    oldValue?: string,
    newValue?: string,
    reason?: string
  ) => {
    const now = new Date();
    const event: AuditEvent = {
      id: 'AUD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
      timestampUtc: now.toISOString(),
      timestamp: now.toISOString(),
      timestampDisplayHr: now.toLocaleString('hr-HR', { dateStyle: 'short', timeStyle: 'short' }),
      userId: currentUser.id,
      userName: currentUser.name,
      performedByName: currentUser.name,
      userRoleHr: currentUser.roleTitleHr,
      performedByRoleHr: currentUser.roleTitleHr,
      siteName: siteName || (activeSite?.name || 'Atlantic Grupa'),
      entityType,
      targetEntity: entityType,
      entityId,
      targetId: entityId,
      action,
      actionHr,
      details,
      oldValue,
      newValue,
      reason,
      justificationReason: reason,
    };
    setAuditEvents((prev) => [event, ...prev]);
  };

  // Notification helper
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const now = new Date();
    const newNotif: AppNotification = {
      ...notif,
      id: 'NOTIF-' + Date.now().toString(36).toUpperCase(),
      createdAt: now.toLocaleString('hr-HR', { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Site and Zone Management
  const addSite = (siteData: Partial<Site>) => {
    const id = 'SITE-' + Date.now().toString(36).toUpperCase();
    const newSite: Site = {
      id,
      name: siteData.name || 'Nova Lokacija',
      code: siteData.code || 'LOK-' + Math.floor(Math.random() * 900 + 100),
      legalEntityId: siteData.legalEntityId || 'LE-CEDEVITA-HR',
      legalEntityName: siteData.legalEntityName || 'Atlantic Cedevita d.o.o.',
      country: siteData.country || 'Hrvatska',
      countryCode: siteData.countryCode || 'HR',
      address: siteData.address || '',
      city: siteData.city || 'Zagreb',
      siteType: siteData.siteType || 'PROIZVODNI_POGON',
      siteTypeHr: siteData.siteTypeHr || 'Proizvodni pogon',
      areaSqMeters: siteData.areaSqMeters || 1000,
      mainActivity: siteData.mainActivity || 'Proizvodnja i skladištenje',
      openProductPresent: siteData.openProductPresent || false,
      sensitiveZonesSummary: siteData.sensitiveZonesSummary || 'Proizvodnja',
      riskLevel: siteData.riskLevel || 'UMJEREN',
      qaLeadId: currentUser.id,
      qaLeadName: currentUser.name,
      coordinatorName: siteData.coordinatorName || currentUser.name,
      facilityManagerName: siteData.facilityManagerName || 'Voditelj pogona',
      activeContractorId: 'CTR-CIKLON-ZG',
      activeContractorName: 'Ciklon DDD d.o.o.',
      contractNumber: 'UGOV-2026-001',
      contractValidUntil: '2026-12-31',
      inspectionFrequencyHr: 'Svaka 2 tjedna',
      deviceCount: 0,
      lastInspectionDate: new Date().toISOString().split('T')[0],
      nextInspectionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      currentPlanVersion: 'v1.0',
      lastRiskAssessmentDate: new Date().toISOString().split('T')[0],
      nextRiskAssessmentDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      emergencyContact: '+385 1 234 5678',
      active: true,
      ...siteData,
    };
    setSites((prev) => [...prev, newSite]);
    logAuditEvent(
      newSite.name,
      'Lokacija',
      newSite.code,
      'KREIRANJE',
      'Dodana nova poslovna lokacija u sustav',
      `Tip: ${newSite.siteTypeHr}, Grad: ${newSite.city}`
    );
  };

  const updateSite = (siteId: string, updates: Partial<Site>) => {
    setSites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, ...updates } : s))
    );
  };

  const addZone = (param1: string | Partial<Zone>, param2?: Partial<Zone>) => {
    let siteId = selectedSiteId;
    let zoneData: any = {};
    if (typeof param1 === 'string') {
      siteId = param1;
      zoneData = param2 || {};
    } else {
      zoneData = param1 || {};
      siteId = zoneData.siteId || selectedSiteId;
    }

    const id = 'ZONE-' + Date.now().toString(36).toUpperCase();
    const newZone: Zone = {
      id,
      siteId,
      buildingId: zoneData.buildingId || 'BLD-CED-01',
      floorId: zoneData.floorId || 'FLR-CED-01-PR',
      name: zoneData.name || 'Nova Zona',
      code: zoneData.code || 'Z-NEW',
      category: zoneData.category || 'PROIZVODNJA',
      categoryHr: zoneData.categoryHr || 'Proizvodni prostor',
      riskLevel: zoneData.riskLevel || 'UMJEREN',
      openProductExposure: zoneData.openProductExposure || false,
      hygieneLevel: zoneData.hygieneLevel || 'Srednja',
      description: zoneData.description || '',
      ...zoneData,
    };
    setZones((prev) => [...prev, newZone]);
    logAuditEvent(
      activeSite?.name || 'Lokacija',
      'Zona lokacije',
      newZone.code,
      'KREIRANJE',
      'Definirana nova radna/sigurnosna zona',
      `Naziv: ${newZone.name}, Kategorija: ${newZone.categoryHr}`
    );
  };

  // Add Device
  const addDevice = (deviceData: Omit<MonitoringDevice, 'id' | 'qrCodeId'>): MonitoringDevice => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanCode = deviceData.code.trim().toUpperCase();
    const newDevice: MonitoringDevice = {
      ...deviceData,
      id: 'DEV-' + Date.now().toString(36).toUpperCase(),
      qrCodeId: `QR-${cleanCode}-${randomHex}`,
    };
    setDevices((prev) => [...prev, newDevice]);

    logAuditEvent(
      activeSite?.name || 'Lokacija',
      'Uređaj za monitoring',
      newDevice.code,
      'KREIRANJE',
      'Dodan novi uređaj u registar',
      `Kategorija: ${newDevice.categoryHr}, Zona: ${newDevice.zoneName}, QR: ${newDevice.qrCodeId}`
    );

    return newDevice;
  };

  // Update Device Position with Location History (Plan coordinates)
  const updateDevicePosition = (
    deviceId: string,
    newPosX: number,
    newPosY: number,
    newZoneId?: string,
    reason?: string
  ) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    const targetZoneId = newZoneId || device.zoneId;
    const oldZone = zones.find((z) => z.id === device.zoneId);
    const newZone = zones.find((z) => z.id === targetZoneId);

    const historyRecord: DeviceLocationHistory = {
      id: 'LH-' + Date.now().toString(36).toUpperCase(),
      deviceId: device.id,
      deviceCode: device.code,
      siteId: device.siteId,
      oldZoneId: device.zoneId,
      newZoneId: targetZoneId,
      oldPosX: device.posX,
      oldPosY: device.posY,
      newPosX,
      newPosY,
      reason: reason || 'Korekcija pozicije na digitalnom tlocrtu',
      changedByUserId: currentUser.id,
      changedByUserName: currentUser.name,
      timestamp: new Date().toLocaleString('hr-HR'),
      planVersion: activeSite?.currentPlanVersion || 'v1.0',
    };

    setDeviceLocationHistories((prev) => [historyRecord, ...prev]);

    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              posX: newPosX,
              posY: newPosY,
              positionX: newPosX,
              positionY: newPosY,
              zoneId: targetZoneId,
              zoneName: newZone?.name || d.zoneName,
            }
          : d
      )
    );

    logAuditEvent(
      activeSite?.name || 'Lokacija',
      'Uređaj za monitoring',
      device.code,
      'POMAK_UREDAJA',
      'Promijenjena pozicija uređaja na tlocrtu',
      `Pomak sa (${device.posX}%, ${device.posY}%) [${oldZone?.name}] na (${newPosX}%, ${newPosY}%) [${newZone?.name}]`,
      `X:${device.posX}, Y:${device.posY}`,
      `X:${newPosX}, Y:${newPosY}`,
      reason
    );
  };

  const updateDeviceStatus = (deviceId: string, status: MonitoringDevice['status'], notes?: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    const statusHrMap: Record<MonitoringDevice['status'], string> = {
      PLANIRAN: 'Planiran',
      CEKA_POSTAVLJANJE: 'Čeka postavljanje',
      AKTIVAN: 'Aktivan',
      PRIVREMENO_IZVAN_UPORABE: 'Privremeno izvan uporabe',
      OSTECEN: 'Oštećen',
      NEDOSTUPAN: 'Nedostupan',
      NEDOSTAJE: 'Nedostaje',
      ZAMIJENJEN: 'Zamijenjen',
      UKLONJEN: 'Uklonjen',
      ARHIVIRAN: 'Arhiviran',
    };

    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              status,
              statusHr: statusHrMap[status] || status,
              notes: notes || d.notes,
            }
          : d
      )
    );

    logAuditEvent(
      activeSite?.name || 'Lokacija',
      'Uređaj',
      device.code,
      'STATUS_PROMJENA',
      'Promijenjen status uređaja',
      `Novi status: ${statusHrMap[status]}`,
      device.statusHr,
      statusHrMap[status],
      notes
    );
  };

  const addFloorPlanVersion = (planData: Omit<FloorPlan, 'id'>) => {
    const newPlan: FloorPlan = {
      ...planData,
      id: 'PLAN-' + Date.now().toString(36).toUpperCase(),
    };
    setFloorPlans((prev) => [newPlan, ...prev]);

    logAuditEvent(
      activeSite?.name || 'Lokacija',
      'Digitalni tlocrt',
      newPlan.name,
      'KREIRANJE',
      'Učitana nova verzija tlocrta',
      `Verzija: ${newPlan.version}, Učitao: ${newPlan.uploadedBy}`
    );
  };

  // Create Inspection
  const createInspection = (inspData: Omit<Inspection, 'id' | 'inspectionNumber'>): Inspection => {
    const seq = (inspections.length + 1).toString().padStart(5, '0');
    const newInsp: Inspection = {
      ...inspData,
      id: 'INSP-' + Date.now().toString(36).toUpperCase(),
      inspectionNumber: `PRG-${new Date().getFullYear()}-${seq}`,
    };
    setInspections((prev) => [newInsp, ...prev]);

    logAuditEvent(
      newInsp.siteName,
      'Pregled',
      newInsp.inspectionNumber,
      'KREIRANJE',
      'Pokrenut novi inspekcijski pregled',
      `Tip: ${newInsp.inspectionTypeHr}, Pregledavatelj: ${newInsp.inspectorName}`
    );

    return newInsp;
  };

  // Threshold Engine Evaluation Helper
  const evaluateThresholdsOnReading = (reading: DeviceReading, device: MonitoringDevice) => {
    const targetZone = zones.find((z) => z.id === device.zoneId);

    // Rule 1: Rodent in open product zone (Critical Event)
    if (
      device.targetPestGroup === 'GLODAVCI' &&
      (reading.result === 'POTVRDJENA_AKTIVNOST' || (reading.baitConsumedPct && reading.baitConsumedPct > 0)) &&
      targetZone?.openProductExposure
    ) {
      triggerThresholdAlert(
        'KRITICNO',
        'Kritični događaj: Glodavac u zoni otvorenog proizvoda!',
        `Potvrđena aktivnost glodavca na točki ${device.code} u zoni ${device.zoneName}. Automatski alarm za QA i Upravu!`,
        device,
        reading,
        'RULE-RODENT-PROD'
      );
      return;
    }

    // Rule 2: Stored product pests threshold
    if (
      (device.targetPestGroup === 'SKLADISNI_STETNICI' || device.targetPestGroup === 'SKLADISNI_INSEKTI') &&
      reading.insectsCount &&
      reading.insectsCount > 3
    ) {
      triggerThresholdAlert(
        'VISOKO',
        'Prekoračen prag: Skladišni moljci > 3 jedinke',
        `Na klopci ${device.code} ulovljeno ${reading.insectsCount} moljaca (Prag = 3). Potrebna izolacija sirovina.`,
        device,
        reading,
        'RULE-MOTH-WAREHOUSE'
      );
      return;
    }

    // Rule 3: Rodent bait consumed >= 50%
    if (reading.baitConsumedPct && reading.baitConsumedPct >= 50) {
      triggerThresholdAlert(
        'VISOKO',
        'Prekoračen prag: Visoka potrošnja mamca (>=50%)',
        `Na vanjskoj stanici ${device.code} pojedeno ${reading.baitConsumedPct}% mamca. Povećan pritisak glodavaca na perimetar!`,
        device,
        reading,
        'RULE-RODENT-CONSECUTIVE'
      );
      return;
    }
  };

  const triggerThresholdAlert = (
    severity: FindingSeverity,
    title: string,
    message: string,
    device: MonitoringDevice,
    reading: DeviceReading,
    ruleId: string
  ) => {
    // 1. Create automatic Finding if not already present
    const findingSeq = (findings.length + 1).toString().padStart(5, '0');
    const newFinding: Finding = {
      id: 'FIND-' + Date.now().toString(36).toUpperCase(),
      findingNumber: `NAL-${new Date().getFullYear()}-${findingSeq}`,
      siteId: device.siteId,
      siteName: activeSite?.name || 'Atlantic Lokacija',
      buildingId: device.buildingId,
      floorId: device.floorId,
      zoneId: device.zoneId,
      zoneName: device.zoneName,
      deviceId: device.id,
      deviceCode: device.code,
      category: 'AKTIVNOST_STETNIKA',
      categoryHr: 'Aktivnost štetnika (Automatska detekcija praga)',
      pestNameHr: reading.insectsPestTypeName || device.targetPestGroupHr,
      description: message,
      quantityOrIntensity: reading.insectsCount ? `${reading.insectsCount} jedinki` : `${reading.baitConsumedPct || 25}% potrošnje`,
      suggestedSeverity: severity,
      confirmedSeverity: severity,
      severityHr: severity === 'KRITICNO' ? 'Kritično - Hitan odziv' : 'Visok rizik',
      productExposureAssessed: true,
      productExposureNote: 'Automatski procijenjeno na temelju tipa zone',
      detectedAt: new Date().toLocaleString('hr-HR'),
      detectedByName: currentUser.name,
      detectedByRole: currentUser.roleTitleHr,
      photoUrl: reading.photoUrl,
      status: 'ZABILJEZENO',
      statusHr: 'Zabilježeno (Prekoračen prag)',
      triggeredThresholdRuleNames: [title],
    };

    setFindings((prev) => [newFinding, ...prev]);

    // 2. Create in-app Notification
    addNotification({
      title,
      message,
      type: 'THRESHOLD_EXCEEDED',
      severity: severity === 'KRITICNO' ? 'CRITICAL' : 'WARNING',
      siteId: device.siteId,
      siteName: activeSite?.name,
      linkModule: 'findings',
      targetId: newFinding.id,
    });

    // 3. Auto-generate CAPA action if critical or high
    const capaSeq = (correctiveActions.length + 1).toString().padStart(5, '0');
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + (severity === 'KRITICNO' ? 1 : 5));

    const newAction: CorrectiveAction = {
      id: 'CAPA-' + Date.now().toString(36).toUpperCase(),
      actionNumber: `KM-${new Date().getFullYear()}-${capaSeq}`,
      source: 'NALAZ',
      sourceHr: `Automatski nalaz (${newFinding.findingNumber})`,
      siteId: device.siteId,
      siteName: activeSite?.name || 'Atlantic Lokacija',
      zoneName: device.zoneName,
      title: `Hitna sanacija: ${title}`,
      description: `Automatski otvorena korektivna mjera uslijed prekoračenja praga na točki ${device.code}: ${message}`,
      immediateCorrection: reading.immediateActionTaken || 'Inspekcija područja i postavljanje pojačanog monitoringa',
      rootCauseCategory: 'U tijeku analiza uzroka',
      preventiveAction: 'Definirati preventivnu mjeru nakon analize 5 Zašto',
      responsiblePersonName: activeSite?.facilityManagerName || 'Odgovorna osoba pogona',
      responsiblePersonRole: 'Voditelj pogona / skladišta',
      dueDate: deadlineDate.toISOString().split('T')[0],
      priority: severity === 'KRITICNO' ? 'HITNA' : 'VISOKA',
      priorityHr: severity === 'KRITICNO' ? 'Hitno (24 sata)' : 'Visoki prioritet',
      status: 'OTVORENO',
      statusHr: 'Otvoreno (Čeka dodjelu i provedbu)',
      requiredEvidenceDescription: 'Fotodokumentacija provedene sanacije i zapisnik o kontroli',
      effectivenessCriteria: '0 aktivnosti na predmetnoj točki i susjednim uređajima u 21 dan',
      verificationDueDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
      verifierName: activeSite?.qaLeadName || 'QA Voditelj lokacije',
      verifierRole: 'QA Voditelj lokacije',
      linkedFindingId: newFinding.id,
    };

    setCorrectiveActions((prev) => [newAction, ...prev]);

    logAuditEvent(
      activeSite?.name || 'Lokacija',
      'Threshold Engine',
      ruleId,
      'STATUS_PROMJENA',
      'Prekoračen prag - Automatski generirana CAPA',
      `${title} -> Generiran nalaz ${newFinding.findingNumber} i mjera ${newAction.actionNumber}`
    );
  };

  // Submit reading during inspection
  const submitDeviceReading = (
    inspectionId: string,
    readingData: Omit<DeviceReading, 'id' | 'inspectionId'>
  ) => {
    const newReading: DeviceReading = {
      ...readingData,
      id: 'RD-' + Date.now().toString(36).toUpperCase(),
      inspectionId,
    };

    const targetDevice = devices.find((d) => d.id === readingData.deviceId);

    // Update inspection with reading
    setInspections((prev) =>
      prev.map((insp) => {
        if (insp.id !== inspectionId) return insp;
        const updatedReadings = [...insp.readings.filter((r) => r.deviceId !== readingData.deviceId), newReading];
        const positiveCount = updatedReadings.filter(
          (r) => r.result === 'POTVRDJENA_AKTIVNOST' || r.result === 'SUMNJA_NA_AKTIVNOST'
        ).length;
        return {
          ...insp,
          readings: updatedReadings,
          totalDevicesCompleted: updatedReadings.length,
          totalPositiveFindings: positiveCount,
        };
      })
    );

    // Update device activity status
    if (targetDevice) {
      let newActivityStatus: MonitoringDevice['activityStatus'] = 'UREDNA';
      if (readingData.result === 'POTVRDJENA_AKTIVNOST') {
        newActivityStatus = 'POTREBNO_PRATITI';
      }
      if (readingData.insectsCount && readingData.insectsCount > 3) {
        newActivityStatus = 'PREKORACEN_PRAG';
      }

      setDevices((prev) =>
        prev.map((d) =>
          d.id === targetDevice.id
            ? {
                ...d,
                lastInspectionDate: new Date().toISOString().split('T')[0],
                lastResultSummary: readingData.resultHr,
                lastResult: readingData.result,
                lastResultHr: readingData.resultHr,
                activityStatus: newActivityStatus,
              }
            : d
        )
      );

      // Evaluate Thresholds
      evaluateThresholdsOnReading(newReading, targetDevice);
    }
  };

  // Submit complete inspection
  const submitInspection = (inspectionId: string, notes?: string, signatureName?: string) => {
    const insp = inspections.find((i) => i.id === inspectionId);
    if (!insp) return;

    const nowStr = new Date().toLocaleString('hr-HR', { dateStyle: 'short', timeStyle: 'short' });

    setInspections((prev) =>
      prev.map((i) =>
        i.id === inspectionId
          ? {
              ...i,
              status: 'CEKA_PREGLED',
              statusHr: 'Predano - Čeka pregled i odobrenje QA voditelja',
              actualDate: new Date().toISOString().split('T')[0],
              technicianNotes: notes || i.technicianNotes,
              signatureName: signatureName || currentUser.name,
              signatureDate: nowStr,
            }
          : i
      )
    );

    addNotification({
      title: 'Predan terenski pregled na odobrenje',
      message: `Pregled ${insp.inspectionNumber} (${insp.siteName}) je predan i čeka QA verifikaciju.`,
      type: 'APPROVAL_REQUIRED',
      severity: 'INFO',
      siteId: insp.siteId,
      siteName: insp.siteName,
      linkModule: 'inspections',
      targetId: insp.id,
    });

    logAuditEvent(
      insp.siteName,
      'Pregled',
      insp.inspectionNumber,
      'IZMJENA',
      'Pregled predan na odobrenje',
      `Potpisao: ${signatureName || currentUser.name}, Broj točaka: ${insp.readings.length}`
    );
  };

  // Direct QA Approve alias
  const approveInspection = (inspectionId: string, approverName?: string) => {
    qaApproveInspection(inspectionId, 'ODOBRENO', `Odobreno od strane ${approverName || currentUser.name}`);
  };

  // QA Approve/Reject Inspection
  const qaApproveInspection = (
    inspectionId: string,
    status: 'ODOBRENO' | 'VRACENO' | 'ODBIJENO',
    comment: string
  ) => {
    const insp = inspections.find((i) => i.id === inspectionId);
    if (!insp) return;

    const statusMap: Record<'ODOBRENO' | 'VRACENO' | 'ODBIJENO', { inspStatus: Inspection['status']; hr: string }> = {
      ODOBRENO: { inspStatus: 'ODOBRENO', hr: 'Odobreno od strane QA voditelja' },
      VRACENO: { inspStatus: 'VRACENO_NA_DORADU', hr: 'Vraćeno tehničaru na doradu' },
      ODBIJENO: { inspStatus: 'ODBIJENO', hr: 'Odbijeno od strane QA voditelja' },
    };

    const targetStatus = statusMap[status];

    setInspections((prev) =>
      prev.map((i) =>
        i.id === inspectionId
          ? {
              ...i,
              status: targetStatus.inspStatus,
              statusHr: targetStatus.hr,
              qaReviewerId: currentUser.id,
              qaReviewerName: currentUser.name,
              qaReviewDate: new Date().toLocaleString('hr-HR'),
              qaReviewComment: comment,
              qaApprovalStatus: status,
            }
          : i
      )
    );

    logAuditEvent(
      insp.siteName,
      'Pregled',
      insp.inspectionNumber,
      status === 'ODOBRENO' ? 'ODOBRENJE' : 'ODBIJANJE',
      `QA verifikacija pregleda: ${targetStatus.hr}`,
      `Komentar: ${comment}`,
      insp.statusHr,
      targetStatus.hr
    );
  };

  // Update Finding Severity with Mandatory Justification
  const updateFindingSeverity = (
    findingId: string,
    newSeverity: FindingSeverity,
    justification: string
  ) => {
    const finding = findings.find((f) => f.id === findingId);
    if (!finding) return;

    const severityHrMap: Record<FindingSeverity, string> = {
      OPAZANJE: 'Opažanje',
      NISKO: 'Nizak rizik',
      SREDNJE: 'Srednji rizik',
      VISOKO: 'Visok rizik',
      KRITICNO: 'Kritično - Hitan odziv',
    };

    setFindings((prev) =>
      prev.map((f) =>
        f.id === findingId
          ? {
              ...f,
              confirmedSeverity: newSeverity,
              severityHr: severityHrMap[newSeverity],
              qaReviewedBy: currentUser.name,
              qaReviewedDate: new Date().toLocaleString('hr-HR'),
              qaJustification: justification,
              status: 'POTVRDJENO',
              statusHr: 'Potvrđeno od strane QA',
            }
          : f
      )
    );

    logAuditEvent(
      finding.siteName,
      'Nalaz štetnika',
      finding.findingNumber,
      'IZMJENA',
      'Promijenjena ozbiljnost nalaza',
      `Obrazloženje: ${justification}`,
      finding.severityHr,
      severityHrMap[newSeverity],
      justification
    );
  };

  // Test Threshold Rule Simulator
  const testThresholdRule = (
    rule: Partial<ThresholdRule>,
    mockInput: { pestGroup?: string; zoneCategory?: string; count?: number; consecutive?: number }
  ) => {
    let triggered = false;
    let calculatedSeverity: FindingSeverity = rule.resultingSeverity || rule.severityTrigger || 'SREDNJE';
    let message = 'Uvjeti pravila nisu zadovoljeni za unešene parametre.';

    if (rule.ruleType === 'KRITICNI_DOGADAJ') {
      if (mockInput.pestGroup === 'GLODAVCI' && mockInput.zoneCategory === 'ZONA_OTVORENOG_PROIZVODA' && (mockInput.count || 0) >= 1) {
        triggered = true;
        calculatedSeverity = 'KRITICNO';
        message = 'PRAVILO AKTIVIRANO! Kritični nalaz u zoni otvorenog proizvoda. Automatska eskalacija QA-u i CAPA rok: 24h.';
      }
    } else if (rule.ruleType === 'APSOLUTNI') {
      if ((mockInput.count || 0) > 3) {
        triggered = true;
        calculatedSeverity = 'VISOKO';
        message = `PRAVILO AKTIVIRANO! Prekoračen apsolutni prag (Ulov: ${mockInput.count}, Prag: 3). Zahtijeva se CAPA.`;
      }
    } else if (rule.ruleType === 'SEKVENCIJALNI') {
      if ((mockInput.consecutive || 0) >= 2) {
        triggered = true;
        calculatedSeverity = 'SREDNJE';
        message = `PRAVILO AKTIVIRANO! Ponavljajući nalaz na istom uređaju (${mockInput.consecutive}x uzastopno).`;
      }
    } else {
      triggered = (mockInput.count || 0) > 0;
      message = triggered ? 'Pravilo je aktivirano prema zadanim parametrima.' : message;
    }

    return { triggered, calculatedSeverity, message };
  };

  // Incidents
  const createIncident = (incidentData: Omit<PestIncident, 'id' | 'incidentNumber'>): PestIncident => {
    const seq = (incidents.length + 1).toString().padStart(5, '0');
    const newIncident: PestIncident = {
      ...incidentData,
      id: 'INC-' + Date.now().toString(36).toUpperCase(),
      incidentNumber: `INC-${new Date().getFullYear()}-${seq}`,
    };
    setIncidents((prev) => [newIncident, ...prev]);

    addNotification({
      title: 'Prijavljen novi Pest Incident!',
      message: `${newIncident.incidentNumber} - ${newIncident.title} (${newIncident.siteName})`,
      type: 'CRITICAL_FINDING',
      severity: 'CRITICAL',
      siteId: newIncident.siteId,
      siteName: newIncident.siteName,
      linkModule: 'incidents',
      targetId: newIncident.id,
    });

    logAuditEvent(
      newIncident.siteName,
      'Pest Incident',
      newIncident.incidentNumber,
      'KREIRANJE',
      'Prijavljen i otvoren incident štetnika',
      `Štetnik: ${newIncident.pestNameHr}, Ozbiljnost: ${newIncident.severityHr}`
    );

    return newIncident;
  };

  const updateIncident = (incidentId: string, updates: Partial<PestIncident>) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, ...updates } : inc))
    );
  };

  const closeIncident = (incidentId: string, summary: string) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: 'ZATVORENO',
              statusHr: 'Zatvoreno (QA odobrenje)',
              closedByQaName: currentUser.name,
              closedDate: new Date().toLocaleString('hr-HR'),
              closureReportSummary: summary,
            }
          : i
      )
    );

    logAuditEvent(
      inc.siteName,
      'Pest Incident',
      inc.incidentNumber,
      'STATUS_PROMJENA',
      'Zatvoren pest incident nakon uspješne verifikacije',
      `Izvještaj: ${summary}`
    );
  };

  // Corrective Actions (CAPA)
  const createCorrectiveAction = (
    actionData: any
  ): CorrectiveAction => {
    const seq = (correctiveActions.length + 1).toString().padStart(5, '0');
    const targetSite = sites.find((s) => s.id === actionData.siteId) || activeSite || sites[0];
    const newAction: CorrectiveAction = {
      id: 'CAPA-' + Date.now().toString(36).toUpperCase(),
      actionNumber: `KM-${new Date().getFullYear()}-${seq}`,
      source: actionData.source || 'RUCNO',
      sourceHr: actionData.sourceHr || 'Ručni unos',
      siteId: targetSite?.id || 'SITE-CEDEVITA-ZG',
      siteName: targetSite?.name || 'Cedevita d.o.o. Zagreb',
      zoneName: actionData.zoneName || 'Opća zona lokacije',
      title: actionData.title || 'Korektivna radnja',
      description: actionData.description || 'Opis korektivne radnje',
      immediateCorrection: actionData.immediateCorrection || 'Provedba sanacije na lokaciji',
      rootCauseCategory: actionData.rootCauseCategory || 'Fizička oštećenja i ulazne točke',
      rootCauseAnalysis5Whys: actionData.rootCauseAnalysis5Whys || actionData.rootCause5Whys || '',
      rootCause5Whys: actionData.rootCause5Whys || actionData.rootCauseAnalysis5Whys || '',
      preventiveAction: actionData.preventiveAction || 'Redoviti periodički pregled',
      responsiblePersonName: actionData.responsiblePersonName || 'Voditelj skladišta',
      responsiblePersonRole: actionData.responsiblePersonRole || 'VODITELJ_SKLADISTA',
      responsiblePersonRoleHr: actionData.responsiblePersonRoleHr || 'Odgovorna osoba / Skladište',
      dueDate: actionData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: actionData.priority || 'SREDNJA',
      priorityHr: actionData.priorityHr || 'Srednja',
      status: actionData.status || 'OTVORENO',
      statusHr: actionData.statusHr || 'Otvoreno',
      requiredEvidenceDescription: actionData.requiredEvidenceDescription || 'Fotografija sanacije i potvrda izvođača',
      effectivenessCriteria: actionData.effectivenessCriteria || 'Nema ponovljene aktivnosti štetnika unutar 14 dana',
      verificationDueDate: actionData.verificationDueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      verifierName: actionData.verifierName || 'QA Voditelj lokacije',
      verifierRole: actionData.verifierRole || 'QA_VODITELJ_LOKACIJE',
      ...actionData,
    };
    setCorrectiveActions((prev) => [newAction, ...prev]);

    logAuditEvent(
      newAction.siteName,
      'Korektivna mjera (CAPA)',
      newAction.actionNumber,
      'KREIRANJE',
      'Kreirana nova korektivna mjera',
      `Odgovorna osoba: ${newAction.responsiblePersonName}, Rok: ${newAction.dueDate}`
    );

    return newAction;
  };

  // Complete action (Step 1: Assignee completes and uploads evidence)
  const completeCorrectiveAction = (
    actionId: string,
    evidencePhotoUrl: string,
    comment: string,
    completedByName: string
  ) => {
    const action = correctiveActions.find((a) => a.id === actionId);
    if (!action) return;

    setCorrectiveActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? {
              ...a,
              status: 'CEKA_PROVJERU',
              statusHr: 'Čeka neovisnu provjeru učinkovitosti',
              completionEvidencePhotoUrl: evidencePhotoUrl,
              evidencePhotoUrl,
              completionComment: comment,
              completionNotes: comment,
              completedAt: new Date().toLocaleString('hr-HR'),
              completedByName: completedByName || currentUser.name,
            }
          : a
      )
    );

    addNotification({
      title: 'Predan dokaz provedbe korektivne mjere',
      message: `Mjera ${action.actionNumber} je provedena i čeka provjeru učinkovitosti od strane ${action.verifierName}.`,
      type: 'INFO',
      severity: 'INFO',
      siteId: action.siteId,
      siteName: action.siteName,
      linkModule: 'correctiveActions',
      targetId: action.id,
    });

    logAuditEvent(
      action.siteName,
      'Korektivna mjera (CAPA)',
      action.actionNumber,
      'IZMJENA',
      'Dostavljen dokaz provedbe mjere',
      `Izvršitelj: ${completedByName || currentUser.name}, Komentar: ${comment}`
    );
  };

  const submitActionCompletion = (
    actionId: string,
    name: string,
    notes: string,
    photoUrl?: string
  ) => {
    completeCorrectiveAction(actionId, photoUrl || '', notes, name);
  };

  // Verify effectiveness (Step 2: Segregation of Duties - Verifier checks if effective)
  const verifyCorrectiveAction = (
    actionId: string,
    param2?: boolean | string,
    param3?: string,
    param4?: string,
    param5?: string
  ) => {
    const action = correctiveActions.find((a) => a.id === actionId);
    if (!action) return;

    let isEffective = true;
    let comment = '';
    let verifierName = currentUser.name;
    let reopenReason = '';

    if (typeof param2 === 'boolean') {
      isEffective = param2;
      comment = param3 || '';
      verifierName = param4 || currentUser.name;
      reopenReason = param5 || '';
    } else if (typeof param2 === 'string') {
      verifierName = param2;
      comment = param3 || '';
      isEffective = true;
    }

    if (isEffective) {
      setCorrectiveActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                status: 'ZATVORENO',
                statusHr: 'Zatvoreno (Provjera učinkovitosti: Uspješno)',
                isEffective: true,
                verificationComment: comment,
                verificationNotes: comment,
                verifiedByName: verifierName,
                verifiedAt: new Date().toLocaleString('hr-HR'),
                closedByQaName: verifierName || currentUser.name,
                closedAt: new Date().toLocaleString('hr-HR'),
              }
            : a
        )
      );

      logAuditEvent(
        action.siteName,
        'Korektivna mjera (CAPA)',
        action.actionNumber,
        'PROVJERA_UCINKOVITOSTI',
        'Potvrđena učinkovitost i zatvorena mjera',
        `Verifikator: ${verifierName}, Komentar: ${comment}`
      );
    } else {
      // Ineffective -> Reopen action
      setCorrectiveActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                status: 'PONOVNO_OTVORENO',
                statusHr: 'Ponovno otvoreno (Mjera nije bila učinkovita)',
                isEffective: false,
                verificationComment: comment,
                verificationNotes: comment,
                verifiedByName: verifierName,
                verifiedAt: new Date().toLocaleString('hr-HR'),
                reopenReason: reopenReason || 'Aktivnost štetnika se ponovila unutar kontrolnog perioda.',
              }
            : a
        )
      );

      addNotification({
        title: 'Korektivna mjera ponovno otvorena!',
        message: `Mjera ${action.actionNumber} nije postigla učinkovitost i vraćena je u ponovnu obradu.`,
        type: 'OVERDUE_ACTION',
        severity: 'WARNING',
        siteId: action.siteId,
        siteName: action.siteName,
        linkModule: 'correctiveActions',
        targetId: action.id,
      });

      logAuditEvent(
        action.siteName,
        'Korektivna mjera (CAPA)',
        action.actionNumber,
        'STATUS_PROMJENA',
        'Korektivna mjera ocijenjena kao NEUČINKOVITA - Ponovno otvaranje',
        `Razlog: ${reopenReason || comment}`
      );
    }
  };

  // Record Biocide / Product Usage
  const recordProductUsage = (usageData: Omit<ProductUsageRecord, 'id'>) => {
    const newUsage: ProductUsageRecord = {
      ...usageData,
      id: 'USE-' + Date.now().toString(36).toUpperCase(),
    };
    setProductUsages((prev) => [newUsage, ...prev]);

    logAuditEvent(
      usageData.siteName,
      'Evidencija uporabe biocida',
      usageData.productName,
      'KREIRANJE',
      'Evidentirana primjena sredstva za DDD',
      `Količina: ${usageData.quantity} ${usageData.unit}, Lokacija: ${usageData.zoneName}, IPM obrazloženje: ${usageData.ipmJustification}`
    );
  };

  // Upload Document Metadata
  const uploadDocument = (docData: Omit<AppDocument, 'id' | 'fileHash'>) => {
    const randomHash = 'sha256-' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newDoc: AppDocument = {
      ...docData,
      id: 'DOC-' + Date.now().toString(36).toUpperCase(),
      fileHash: randomHash,
      fileSha256: randomHash,
      uploadedByName: docData.uploadedBy || currentUser.name,
      uploadedAt: docData.uploadedDate || new Date().toISOString().split('T')[0],
      validUntil: docData.expiryDate || docData.validUntil,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    logAuditEvent(
      docData.siteName || 'Atlantic Grupa',
      'Dokument',
      newDoc.title,
      'KREIRANJE',
      'Pohranjen novi dokument u registar',
      `Kategorija: ${newDoc.categoryHr}, Verzija: ${newDoc.version}`
    );
  };

  // Risk Assessment
  const createRiskAssessment = (assessment: Partial<RiskAssessment>) => {
    const newAssessment: RiskAssessment = {
      id: 'RA-' + Date.now().toString(36).toUpperCase(),
      siteId: assessment.siteId || selectedSiteId,
      siteName: assessment.siteName || (activeSite?.name || 'Atlantic Lokacija'),
      version: assessment.version || 'v1.0',
      date: assessment.date || new Date().toISOString().split('T')[0],
      assessorName: assessment.assessorName || currentUser.name,
      assessedByName: assessment.assessorName || currentUser.name,
      assessedAt: new Date().toLocaleString('hr-HR'),
      reviewDueDate: assessment.reviewDueDate || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      totalScore: assessment.totalScore || 24,
      overallRiskScore: assessment.totalScore || 24,
      calculatedRisk: assessment.calculatedRisk || 'UMJEREN',
      overallRiskLevel: assessment.calculatedRisk || 'UMJEREN',
      calculatedRiskHr: assessment.calculatedRiskHr || 'Umjeren rizik',
      recommendedRodentFrequency: assessment.recommendedRodentFrequency || 'Svaka 2 tjedna',
      recommendedInsectFrequency: assessment.recommendedInsectFrequency || 'Mjesečno',
      recommendedDeviceDensity: assessment.recommendedDeviceDensity || 'Standardna gustoća',
      status: 'ODOBRENO',
      answers: assessment.answers || [],
      ...assessment,
    };
    setRiskAssessments((prev) => [newAssessment, ...prev]);
    logAuditEvent(
      newAssessment.siteName,
      'Procjena rizika',
      newAssessment.version || 'v1.0',
      'KREIRANJE',
      'Izrađena nova procjena rizika od štetnika',
      `Rezultat: ${newAssessment.calculatedRiskHr}`
    );
  };

  // Management Review
  const createManagementReview = (reviewData: Partial<ManagementReview>) => {
    const newRev: ManagementReview = {
      ...initialManagementReview,
      id: 'REV-' + Date.now().toString(36).toUpperCase(),
      year: reviewData.year || new Date().getFullYear(),
      qaApprovedBy: currentUser.name,
      qaApprovedDate: new Date().toLocaleDateString('hr-HR'),
      status: 'ODOBRENO',
      ...reviewData,
    };
    setManagementReviews((prev) => [newRev, ...prev]);
    logAuditEvent(
      'Atlantic Grupa',
      'Godišnji pregled upravljanja',
      newRev.year.toString(),
      'ODOBRENJE',
      'Odobren godišnji pregled upravljanja sustavom kontrole štetnika',
      `Godina: ${newRev.year}, Odobrio: ${currentUser.name}`
    );
  };

  // Reset to default synthetic master state
  const resetToDefaultData = () => {
    localStorage.clear();
    setSites(initialSites);
    setZones(initialZones);
    setFloorPlans(initialFloorPlans);
    setDevices(initialDevices);
    setInspectionSchedules(initialInspectionSchedules);
    setInspections(initialInspections);
    setFindings(initialFindings);
    setThresholdRules(initialThresholdRules);
    setIncidents(initialIncidents);
    setCorrectiveActions(initialCorrectiveActions);
    setProductUsages(initialProductUsages);
    setDocuments(initialDocuments);
    setNotifications(initialNotifications);
    setAuditEvents(initialAuditEvents);
    setRiskAssessments(initialRiskAssessments);
    setManagementReviews([initialManagementReview]);
  };

  return (
    <PestControlContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setCurrentUserRole,
        availableUsers,
        selectedSiteId,
        setSelectedSiteId,
        activeSite,
        sites,
        buildings,
        floors,
        zones,
        floorPlans,
        devices,
        deviceLocationHistories,
        pestMasterData,
        inspectionSchedules,
        inspections,
        findings,
        thresholdRules,
        incidents,
        correctiveActions,
        contractors,
        technicians,
        biocides,
        productUsages,
        documents,
        riskAssessments,
        notifications,
        auditEvents,
        managementReview,
        managementReviews,
        globalSearchQuery,
        setGlobalSearchQuery,
        logAuditEvent,
        addSite,
        updateSite,
        addZone,
        addDevice,
        updateDevicePosition,
        updateDeviceStatus,
        addFloorPlanVersion,
        createInspection,
        submitDeviceReading,
        submitInspection,
        approveInspection,
        qaApproveInspection,
        updateFindingSeverity,
        testThresholdRule,
        createIncident,
        updateIncident,
        closeIncident,
        createCorrectiveAction,
        completeCorrectiveAction,
        submitActionCompletion,
        verifyCorrectiveAction,
        recordProductUsage,
        createRiskAssessment,
        createManagementReview,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        uploadDocument,
        resetToDefaultData,
        resetToDefaultState: resetToDefaultData,
      }}
    >
      {children}
    </PestControlContext.Provider>
  );
};

export const usePestControl = (): PestControlContextType => {
  const context = useContext(PestControlContext);
  if (!context) {
    throw new Error('usePestControl must be used within a PestControlProvider');
  }
  return context;
};
