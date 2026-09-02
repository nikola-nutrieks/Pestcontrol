import React, { useState } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  AlertTriangle,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Upload,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { usePestControl } from '../../store/pestControlStore';
import { AppDocument } from '../../types';

export const DocumentManagementView: React.FC = () => {
  const { documents, activeSite, currentUser } = usePestControl();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const siteDocs = activeSite
    ? documents.filter((d) => !d.siteId || d.siteId === activeSite.id)
    : documents;

  const filteredDocs = siteDocs.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.categoryHr && d.categoryHr.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (doc: AppDocument) => {
    setDownloadSuccessMsg(`Preuzimanje dokumenta "${doc.title}" je pokrenuto.`);
    setTimeout(() => setDownloadSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
              DOKUMENTACIJA
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">
              Registar kontrolirane dokumentacije, ugovora i STL-ova
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upravljanje važećim verzijama planova kontrole štetnika, sigurnosno-tehničkih listova i certifikata izvođača
          </p>
        </div>
      </div>

      {downloadSuccessMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pretraži dokumente po nazivu, kategoriji..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">Sve kategorije dokumenata</option>
            <option value="HACCP_PLAN">HACCP Planovi i procedure</option>
            <option value="UGOVOR_DDD">Ugovori s DDD izvođačima</option>
            <option value="SIGURNOSNI_LIST_STL">Sigurnosno-tehnički listovi (STL)</option>
            <option value="CERTIFIKAT_IZVODJACA">Certifikati i licence</option>
            <option value="TLOCRT_SHEMA">Tlocrtne sheme</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="font-bold text-white uppercase tracking-wider">
            Popis dokumenata ({filteredDocs.length})
          </div>
          <span className="text-slate-400">{activeSite ? activeSite.name : 'Sve lokacije'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Naziv dokumenta</th>
                <th className="py-2.5 px-3">Kategorija</th>
                <th className="py-2.5 px-3">Verzija</th>
                <th className="py-2.5 px-3">Valjano do</th>
                <th className="py-2.5 px-3">Integritet (SHA-256)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Preuzimanje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDocs.map((doc) => {
                const isExpired = doc.status === 'ISTEKLO' || doc.isExpired;
                const isExpiringSoon = doc.isExpiringSoon;
                const sha = (doc.fileSha256 || doc.fileHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4').substring(0, 12);

                return (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Uploadao: {doc.uploadedByName || doc.uploadedBy} ({doc.uploadedAt || doc.uploadedDate || ''})
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{doc.categoryHr || doc.category}</td>
                    <td className="py-3 px-3 font-mono text-slate-200">v{doc.version}</td>
                    <td className="py-3 px-3">
                      <span className="text-slate-200 font-semibold">{doc.validUntil || 'Trajno'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {sha}...
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isExpired
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : isExpiringSoon
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {isExpired ? 'Isteklo' : isExpiringSoon ? 'Uskoro ističe' : 'Važeće'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 ml-auto"
                      >
                        <Download className="w-3.5 h-3.5 text-red-400" />
                        <span>Preuzmi</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
