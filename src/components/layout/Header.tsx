import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Bell,
  Search,
  QrCode,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Wifi,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { hrTranslations } from '../../i18n/hr';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenQrScanner: () => void;
  onSelectModule: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenQrScanner,
  onSelectModule,
}) => {
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    sites,
    selectedSiteId,
    setSelectedSiteId,
    activeSite,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = usePestControl();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <header className="bg-[#0c0c0c] text-[#e0e0e0] border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Banner / Breadcrumb & Synthetic Notice */}
      <div className="bg-[#080808] px-4 py-1.5 text-xs flex items-center justify-between border-b border-zinc-850 text-zinc-400">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest">
            <ShieldAlert className="w-3 h-3 text-indigo-400" />
            QA & HACCP IPM SUSTAV
          </span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="hidden sm:inline text-zinc-300 font-semibold">{hrTranslations.app.organization}</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="hidden md:inline text-amber-400/90 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            {hrTranslations.app.syntheticDataNotice}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Online</span>
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & App Title */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onSelectModule('dashboard')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950/40 font-black text-xl tracking-tight transition-transform group-hover:scale-105">
            AP
          </div>
          <div>
            <div className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5 text-white">
              <span>ATLANTIC</span>
              <span className="text-indigo-400 font-semibold">PEST CONTROL</span>
            </div>
            <div className="text-[10px] text-zinc-500 hidden sm:block uppercase tracking-widest font-bold">
              Integrated Pest Management System
            </div>
          </div>
        </div>

        {/* Site Selector Dropdown */}
        <div className="flex-1 max-w-xs md:max-w-md mx-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Building2 className="w-4 h-4" />
            </div>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full bg-[#121212] border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer hover:bg-zinc-850 hover:border-zinc-700 transition-all font-medium"
            >
              <option value="ALL">🌐 Sve lokacije (Grupni QA pregled)</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  📍 {site.name} ({site.countryCode})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Action Controls: Search, QR Scanner, Notifications, User Profile */}
        <div className="flex items-center space-x-2">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#121212] text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-semibold transition-all border border-zinc-800"
            title="Brzo pretraživanje (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden lg:inline text-zinc-300">Pretraži</span>
            <kbd className="hidden xl:inline px-1.5 py-0.5 text-[10px] bg-zinc-800 rounded-md text-zinc-400 border border-zinc-700 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Mobile QR Scan Button */}
          <button
            onClick={onOpenQrScanner}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/30 transition-all uppercase tracking-wider"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Skeniraj QR</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-[#121212] text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800 transition-colors"
              title="Obavijesti i alarmi"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 text-zinc-200">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                  <div className="font-bold text-sm flex items-center gap-2 text-white">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span>Obavijesti i alarmi</span>
                    <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-300 font-bold">
                      {unreadNotifications.length} novih
                    </span>
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Označi sve pročitanim
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-500">
                      Nema novih obavijesti
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.linkModule) {
                            onSelectModule(n.linkModule);
                            setShowNotifications(false);
                          }
                        }}
                        className={`cursor-pointer p-3 rounded-xl transition-all border ${
                          !n.read
                            ? 'bg-[#18181b] border-indigo-500/30'
                            : 'bg-[#121212] border-zinc-800/60 hover:bg-zinc-800/40 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.severity === 'CRITICAL' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                          ) : n.severity === 'WARNING' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white">{n.title}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{n.message}</div>
                            <div className="text-[10px] text-zinc-500 mt-1 flex justify-between uppercase tracking-wider font-semibold">
                              <span>{n.siteName || 'Sustav'}</span>
                              <span>{n.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#121212] hover:bg-zinc-800 border border-zinc-800 text-left transition-all"
              title="Promjena uloge (Simulacija korisnika)"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-indigo-400 leading-tight truncate max-w-[130px] font-medium">
                  {currentUser.roleTitleHr}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden sm:block" />
            </button>

            {/* Role Switcher Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 text-zinc-200">
                <div className="pb-3 mb-3 border-b border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Simulacija korisničke uloge (RBAC)
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Odaberite ulogu za testiranje dozvola i odvajanja dužnosti
                  </div>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${
                        currentUser.id === u.id
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                          : 'hover:bg-zinc-800/80 text-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-indigo-400/90">{u.roleTitleHr}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{u.company}</div>
                      </div>
                      {currentUser.id === u.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
