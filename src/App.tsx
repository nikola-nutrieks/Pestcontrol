import React, { useState, useEffect } from 'react';
import { PestControlProvider, usePestControl } from './store/pestControlStore';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { QRScannerModal } from './components/modals/QRScannerModal';
import { DeviceInspectionModal } from './components/modals/DeviceInspectionModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { SitesAndZonesView } from './components/views/SitesAndZonesView';
import { FloorPlanView } from './components/views/FloorPlanView';
import { DeviceRegisterView } from './components/views/DeviceRegisterView';
import { InspectionsView } from './components/views/InspectionsView';
import { FindingsView } from './components/views/FindingsView';
import { IncidentsView } from './components/views/IncidentsView';
import { CorrectiveActionsView } from './components/views/CorrectiveActionsView';
import { ThresholdEngineView } from './components/views/ThresholdEngineView';
import { ContractorsView } from './components/views/ContractorsView';
import { BiocidesView } from './components/views/BiocidesView';
import { DocumentManagementView } from './components/views/DocumentManagementView';
import { RiskAssessmentView } from './components/views/RiskAssessmentView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ReportsAndAuditView } from './components/views/ReportsAndAuditView';
import { ManagementReviewView } from './components/views/ManagementReviewView';
import { AuditTrailView } from './components/views/AuditTrailView';
import { SettingsView } from './components/views/SettingsView';
import { MonitoringDevice } from './types';

const AppContent: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [selectedDeviceForInspection, setSelectedDeviceForInspection] = useState<MonitoringDevice | null>(null);

  // Global keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDeviceFoundFromQr = (device: MonitoringDevice) => {
    setSelectedDeviceForInspection(device);
  };

  const renderCurrentView = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardView
            onSelectModule={setActiveModule}
            onOpenQrScanner={() => setShowQrModal(true)}
          />
        );
      case 'sites':
        return <SitesAndZonesView />;
      case 'floorPlan':
        return (
          <FloorPlanView
            onInspectDevice={(dev) => setSelectedDeviceForInspection(dev)}
          />
        );
      case 'devices':
        return (
          <DeviceRegisterView
            onInspectDevice={(dev) => setSelectedDeviceForInspection(dev)}
            onOpenQrScanner={() => setShowQrModal(true)}
          />
        );
      case 'inspections':
        return (
          <InspectionsView
            onOpenQrScanner={() => setShowQrModal(true)}
          />
        );
      case 'findings':
        return <FindingsView onSelectModule={setActiveModule} />;
      case 'incidents':
        return <IncidentsView />;
      case 'correctiveActions':
        return <CorrectiveActionsView />;
      case 'thresholdEngine':
        return <ThresholdEngineView />;
      case 'contractors':
        return <ContractorsView />;
      case 'biocides':
        return <BiocidesView />;
      case 'documents':
        return <DocumentManagementView />;
      case 'riskAssessment':
        return <RiskAssessmentView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsAndAuditView />;
      case 'managementReview':
        return <ManagementReviewView />;
      case 'auditTrail':
        return <AuditTrailView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onSelectModule={setActiveModule}
            onOpenQrScanner={() => setShowQrModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] flex flex-col font-sans selection:bg-indigo-600 selection:text-white antialiased">
      {/* Top Application Header */}
      <Header
        onOpenQrScanner={() => setShowQrModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        onSelectModule={setActiveModule}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1920px] mx-auto min-h-0">
        {/* Sidebar Navigation */}
        <Navigation
          activeModule={activeModule}
          onSelectModule={setActiveModule}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-full">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals */}
      {showQrModal && (
        <QRScannerModal
          onClose={() => setShowQrModal(false)}
          onDeviceFound={handleDeviceFoundFromQr}
        />
      )}

      {selectedDeviceForInspection && (
        <DeviceInspectionModal
          device={selectedDeviceForInspection}
          onClose={() => setSelectedDeviceForInspection(null)}
        />
      )}

      {showSearchModal && (
        <GlobalSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            setShowSearchModal(false);
          }}
          onSelectDevice={(dev) => {
            setSelectedDeviceForInspection(dev);
            setShowSearchModal(false);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <PestControlProvider>
      <AppContent />
    </PestControlProvider>
  );
}
