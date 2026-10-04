import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, History, Search, ArrowRightLeft, FileSpreadsheet, CheckCircle2, RotateCcw } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenIssueModal?: (componentId: string, requestId?: string) => void;
  onOpenReturnModal?: (componentId: string, requestId?: string) => void;
}

export const RequestHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenIssueModal,
  onOpenReturnModal
}) => {
  const { requests, transactions, inventory } = useApp();

  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'TRANSACTIONS'>('REQUESTS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions.filter((t) => {
    return (
      t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#12131a] border border-[#00eefc]/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00eefc]/15 border border-[#00eefc]/30 flex items-center justify-center text-[#00eefc]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#00eefc]">
                LAB REQUISITION & AUDIT TRAIL
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Requisitions & Custody Log
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Controls */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
          <div className="flex items-center p-1 rounded-xl bg-[#0d0e15] border border-[#2b2c37]">
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`px-4 py-1.5 text-xs font-mono-code uppercase font-semibold rounded-lg transition-all ${
                activeTab === 'REQUESTS'
                  ? 'bg-[#00eefc] text-[#0d0e15] shadow-sm'
                  : 'text-[#9ba0b4] hover:text-white'
              }`}
            >
              Component Requisitions ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('TRANSACTIONS')}
              className={`px-4 py-1.5 text-xs font-mono-code uppercase font-semibold rounded-lg transition-all ${
                activeTab === 'TRANSACTIONS'
                  ? 'bg-[#ff5545] text-white shadow-sm'
                  : 'text-[#9ba0b4] hover:text-white'
              }`}
            >
              Hardware Transactions ({transactions.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#9ba0b4] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter logs..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-xs font-mono-code focus:outline-none focus:border-[#00eefc]"
              />
            </div>
            {activeTab === 'REQUESTS' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-xs font-mono-code focus:outline-none focus:border-[#00eefc]"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="ISSUED">Issued</option>
                <option value="RETURNED">Returned</option>
                <option value="REJECTED">Rejected</option>
              </select>
            )}
          </div>
        </div>

        {/* Content Table */}
        <div className="mt-4 flex-1 overflow-y-auto border border-[#2b2c37] rounded-xl bg-[#0d0e15]/60">
          {activeTab === 'REQUESTS' ? (
            filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono-code text-[#9ba0b4]">
                No matching requisitions recorded.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono-code">
                <thead className="bg-[#161822] text-[#9ba0b4] border-b border-[#2b2c37] sticky top-0 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Req ID</th>
                    <th className="p-3">Cadet</th>
                    <th className="p-3">Component</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Project / Purpose</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b2c37]/60">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#161822]/60 transition-colors">
                      <td className="p-3 text-[#00eefc] font-bold">{req.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{req.studentName}</div>
                        <div className="text-[10px] text-[#9ba0b4]">{req.studentId}</div>
                      </td>
                      <td className="p-3 text-white font-medium">{req.componentName}</td>
                      <td className="p-3 text-[#3fdeb7] font-bold">{req.quantity}</td>
                      <td className="p-3 max-w-[180px] truncate text-[#9ba0b4]" title={req.purpose}>
                        {req.project}: {req.purpose}
                      </td>
                      <td className="p-3 text-[10px] text-[#9ba0b4]">
                        Req: {req.requiredDate}
                        <br />
                        Ret: {req.returnDate}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="p-3 text-right">
                        {req.status === 'APPROVED' && onOpenIssueModal && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenIssueModal(req.componentId, req.id);
                            }}
                            className="px-2.5 py-1 rounded bg-[#ff5545]/20 hover:bg-[#ff5545] text-[#ff5545] hover:text-white border border-[#ff5545]/40 text-[10px] font-bold uppercase transition-all inline-flex items-center gap-1"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Dispatch</span>
                          </button>
                        )}
                        {req.status === 'ISSUED' && onOpenReturnModal && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenReturnModal(req.componentId, req.id);
                            }}
                            className="px-2.5 py-1 rounded bg-[#3fdeb7]/20 hover:bg-[#3fdeb7] text-[#3fdeb7] hover:text-[#0d0e15] border border-[#3fdeb7]/40 text-[10px] font-bold uppercase transition-all inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Return</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono-code text-[#9ba0b4]">
              No transactions recorded in custody log.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono-code">
              <thead className="bg-[#161822] text-[#9ba0b4] border-b border-[#2b2c37] sticky top-0 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">User / Cadet</th>
                  <th className="p-3">Component</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b2c37]/60">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#161822]/60 transition-colors">
                    <td className="p-3 text-[#ff5545] font-bold">{txn.id}</td>
                    <td className="p-3 text-[10px] text-[#9ba0b4]">
                      {new Date(txn.date).toLocaleDateString()} {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3">
                      <div className="text-white font-medium">{txn.user}</div>
                      <div className="text-[10px] text-[#9ba0b4]">{txn.studentId}</div>
                    </td>
                    <td className="p-3 text-white font-medium">{txn.componentName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          txn.action === 'ISSUE'
                            ? 'bg-[#ff5545]/20 text-[#ff5545] border border-[#ff5545]/30'
                            : txn.action === 'RETURN'
                            ? 'bg-[#3fdeb7]/20 text-[#3fdeb7] border border-[#3fdeb7]/30'
                            : 'bg-[#00eefc]/20 text-[#00eefc] border border-[#00eefc]/30'
                        }`}
                      >
                        {txn.action}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-white">{txn.quantity}</td>
                    <td className="p-3 text-[11px] text-[#9ba0b4] max-w-[200px] truncate" title={txn.notes}>
                      {txn.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#2b2c37] flex items-center justify-between text-xs font-mono-code text-[#9ba0b4]">
          <div>Permanent local telemetry & ledger active.</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#242533] hover:bg-[#343647] text-white text-xs font-headline uppercase font-bold transition-colors"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
