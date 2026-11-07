'use client';
import React, { useState } from 'react';
import {
  X,
  Folder,
  Database,
  Mail,
  Shield,
  Cpu,
  Globe,
  Settings,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import { HostingService } from '@/types/hosting';

interface CPanelModalProps {
  service: HostingService | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePhpVersion: (serviceId: string, version: string) => void;
}

export const CPanelModal: React.FC<CPanelModalProps> = ({
  service,
  isOpen,
  onClose,
  onUpdatePhpVersion,
}) => {
  if (!isOpen || !service) return null;

  const [activeTab, setActiveTab] = useState<'tools' | 'files' | 'php'>('tools');
  const [selectedPhp, setSelectedPhp] = useState(service.phpVersion || '8.3');
  const [phpSavedToast, setPhpSavedToast] = useState(false);

  const handleSavePhp = () => {
    onUpdatePhpVersion(service.id, selectedPhp);
    setPhpSavedToast(true);
    setTimeout(() => setPhpSavedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* cPanel Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-orange-500 text-white font-extrabold text-xs tracking-wider">
              cPanel
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>cPanel Single Sign-On</span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-400 font-mono">{service.domain}</span>
              </div>
              <div className="text-[10px] text-slate-300">
                User: <code className="text-white font-mono">{service.cpanelUsername}</code> · Server Node: <span className="text-white font-mono">{service.ipAddress}</span> (Lagos MDXi)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* cPanel Navigation Tabs */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('tools')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tools' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Standard Tools
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'files' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            public_html File Tree
          </button>
          <button
            onClick={() => setActiveTab('php')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'php' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            MultiPHP Manager
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'tools' && (
            <>
              {/* Resource usage summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px] mb-1">NVMe Disk Usage</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {service.diskUsedGB} GB / {service.diskLimitGB} GB
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (service.diskUsedGB / service.diskLimitGB) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px] mb-1">Monthly Bandwidth</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {service.bandwidthUsedGB} GB / Unlimited
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px] mb-1">Active PHP Engine</div>
                  <div className="font-mono font-bold text-emerald-700 text-sm">
                    PHP {service.phpVersion} (LiteSpeed LSAPI)
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">SSL: {service.sslStatus}</div>
                </div>
              </div>

              {/* cPanel Tools Grid */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Applications &amp; Files
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div
                    onClick={() => setActiveTab('files')}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors text-left group shadow-2xs"
                  >
                    <Folder className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-105 transition-transform" />
                    <div className="font-semibold text-slate-900">File Manager</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">/home/{service.cpanelUsername}/public_html</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors text-left group shadow-2xs">
                    <Database className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
                    <div className="font-semibold text-slate-900">phpMyAdmin</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">MySQL Database Manager</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors text-left group shadow-2xs">
                    <Mail className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-105 transition-transform" />
                    <div className="font-semibold text-slate-900">Email Accounts</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Roundcube &amp; Forwarders</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors text-left group shadow-2xs">
                    <Shield className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-105 transition-transform" />
                    <div className="font-semibold text-slate-900">SSL/TLS Status</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Let's Encrypt AutoSSL</div>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pt-2">
                  Software &amp; Web Server
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div
                    onClick={() => setActiveTab('php')}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors text-left group shadow-2xs"
                  >
                    <Cpu className="w-5 h-5 text-emerald-600 mb-2" />
                    <div className="font-semibold text-slate-900">MultiPHP Manager</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">PHP 7.4, 8.1, 8.2, 8.3</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors text-left group shadow-2xs">
                    <Globe className="w-5 h-5 text-cyan-600 mb-2" />
                    <div className="font-semibold text-slate-900">Zone Editor</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">DNS Records (A, CNAME, MX)</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors text-left group shadow-2xs">
                    <Terminal className="w-5 h-5 text-rose-600 mb-2" />
                    <div className="font-semibold text-slate-900">SSH / Terminal</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Key-based shell access</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer transition-colors text-left group shadow-2xs">
                    <Settings className="w-5 h-5 text-amber-500 mb-2" />
                    <div className="font-semibold text-slate-900">JetBackup 5</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Daily automated snapshots</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-700">
                  Location: <strong className="text-emerald-700">/home/{service.cpanelUsername}/public_html/</strong>
                </span>
                <span className="text-slate-500 text-[11px]">Permissions: 0755</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 font-mono text-xs shadow-2xs">
                {[
                  { name: 'wp-admin/', type: 'Directory', size: '4 KB', modified: 'Nov 06 14:22' },
                  { name: 'wp-content/', type: 'Directory', size: '4 KB', modified: 'Nov 06 14:22' },
                  { name: 'wp-includes/', type: 'Directory', size: '4 KB', modified: 'Nov 06 14:22' },
                  { name: '.htaccess', type: 'Config file', size: '342 B', modified: 'Nov 07 08:15' },
                  { name: 'index.php', type: 'PHP script', size: '405 B', modified: 'Nov 06 14:22' },
                  { name: 'wp-config.php', type: 'Database config', size: '3.1 KB', modified: 'Nov 06 14:25' },
                ].map((file) => (
                  <div key={file.name} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      {file.type === 'Directory' ? (
                        <Folder className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Folder className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-slate-900 font-medium">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-slate-500 text-[11px]">
                      <span>{file.type}</span>
                      <span>{file.size}</span>
                      <span className="text-slate-400">{file.modified}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'php' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">MultiPHP Version Switcher</h4>
                <p className="text-xs text-slate-500">
                  Select the PHP engine for <strong className="text-emerald-700">{service.domain}</strong>. Powered by LiteSpeed LSAPI for maximum OPcache execution speed.
                </p>
              </div>

              <div className="space-y-3">
                {['8.3', '8.2', '8.1', '8.0', '7.4 (Legacy)'].map((ver) => {
                  const val = ver.split(' ')[0];
                  return (
                    <label
                      key={ver}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        selectedPhp === val
                          ? 'bg-emerald-50 border-emerald-600 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="phpVersion"
                          checked={selectedPhp === val}
                          onChange={() => setSelectedPhp(val)}
                          className="accent-emerald-600"
                        />
                        <span className="text-xs font-semibold">PHP {ver}</span>
                      </div>
                      {val === '8.3' && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                          Recommended
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSavePhp}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply PHP Version</span>
                </button>

                {phpSavedToast && (
                  <span className="text-xs text-emerald-700 font-semibold">
                    ✓ Applied PHP {selectedPhp} to Apache/LiteSpeed vhost!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
