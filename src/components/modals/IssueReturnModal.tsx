import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { X, ArrowRightLeft, AlertCircle, User, Hash, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedItem?: InventoryItem | null;
  defaultMode?: 'ISSUE' | 'RETURN';
  associatedRequestId?: string;
}

export const IssueReturnModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedItem,
  defaultMode = 'ISSUE',
  associatedRequestId
}) => {
  const { inventory, requests, currentUser, issueHardware, returnHardware } = useApp();

  const [mode, setMode] = useState<'ISSUE' | 'RETURN'>(defaultMode);
  const [componentId, setComponentId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [studentName, setStudentName] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      if (preselectedItem) {
        setComponentId(preselectedItem.id);
      } else if (inventory.length > 0) {
        setComponentId(inventory[0].id);
      }

      if (associatedRequestId) {
        const req = requests.find((r) => r.id === associatedRequestId);
        if (req) {
          setComponentId(req.componentId);
          setQuantity(req.quantity);
          setStudentName(req.studentName);
          setStudentId(req.studentId);
          setNotes(`Fulfilling requisition ${req.id}`);
        }
      } else if (currentUser) {
        setStudentName(currentUser.name);
        setStudentId(currentUser.studentId);
      }
      setErrorMsg(null);
    }
  }, [isOpen, preselectedItem, defaultMode, associatedRequestId, requests, currentUser, inventory]);

  if (!isOpen) return null;

  const selectedItem = inventory.find((i) => i.id === componentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedItem) {
      setErrorMsg('Component not found.');
      return;
    }

    if (mode === 'ISSUE') {
      const res = issueHardware(
        componentId,
        Number(quantity),
        studentName,
        studentId,
        notes,
        associatedRequestId
      );
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to issue hardware.');
      }
    } else {
      const res = returnHardware(
        componentId,
        Number(quantity),
        studentName,
        studentId,
        notes,
        associatedRequestId
      );
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to return hardware.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#12131a] border border-[#00eefc]/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00eefc]/15 border border-[#00eefc]/30 flex items-center justify-center text-[#00eefc]">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#00eefc]">
                LAB DISPATCH & RETURN DESK
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Hardware Custody Management
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

        {/* Mode Toggle */}
        <div className="mt-5 grid grid-cols-2 p-1 rounded-xl bg-[#0d0e15] border border-[#2b2c37]">
          <button
            type="button"
            onClick={() => setMode('ISSUE')}
            className={`py-2 text-xs font-mono-code uppercase font-semibold rounded-lg transition-all ${
              mode === 'ISSUE'
                ? 'bg-[#ff5545] text-white shadow-md'
                : 'text-[#9ba0b4] hover:text-white'
            }`}
          >
            Issue / Sign Out
          </button>
          <button
            type="button"
            onClick={() => setMode('RETURN')}
            className={`py-2 text-xs font-mono-code uppercase font-semibold rounded-lg transition-all ${
              mode === 'RETURN'
                ? 'bg-[#3fdeb7] text-[#0d0e15] shadow-md font-bold'
                : 'text-[#9ba0b4] hover:text-white'
            }`}
          >
            Return / Check In
          </button>
        </div>

        {/* Component Live Status */}
        {selectedItem && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#161822] border border-[#2b2c37] text-xs">
            <div className="font-headline text-sm font-bold text-white mb-1">
              {selectedItem.name}
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono-code text-[11px] text-center pt-2 border-t border-[#2b2c37]">
              <div>
                <span className="text-[#9ba0b4] block text-[9px] uppercase">Available</span>
                <span className="text-[#00eefc] font-bold text-sm">{selectedItem.availableQuantity}</span>
              </div>
              <div>
                <span className="text-[#9ba0b4] block text-[9px] uppercase">Reserved</span>
                <span className="text-[#ff9f1c] font-bold text-sm">{selectedItem.reservedQuantity}</span>
              </div>
              <div>
                <span className="text-[#9ba0b4] block text-[9px] uppercase">Currently Issued</span>
                <span className="text-[#ff5545] font-bold text-sm">{selectedItem.issuedQuantity}</span>
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/40 text-[#ffb4ab] text-xs flex items-start gap-2.5 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ff5545] mt-0.5" />
            <div>
              <span className="font-bold">Custody Check Failed:</span> {errorMsg}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
              Select Component
            </label>
            <select
              value={componentId}
              onChange={(e) => setComponentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#00eefc]"
              required
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Issued: {item.issuedQuantity} | Avail: {item.availableQuantity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                {mode === 'ISSUE' ? 'Issue Quantity' : 'Return Quantity'}
              </label>
              <input
                type="number"
                min="1"
                max={
                  mode === 'ISSUE'
                    ? selectedItem?.totalQuantity || 10
                    : selectedItem?.issuedQuantity || 1
                }
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#00eefc]"
                required
              />
              <span className="text-[10px] text-[#9ba0b4] mt-1 block">
                {mode === 'RETURN' && selectedItem
                  ? `Max returnable: ${selectedItem.issuedQuantity} issued`
                  : ''}
              </span>
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Cadet Student ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. ECS-2024-419"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#00eefc]"
                  required
                />
                <Hash className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
              Cadet Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Tanya Verma"
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#00eefc]"
                required
              />
              <User className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
              Inspection / Custody Notes
            </label>
            <div className="relative">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  mode === 'ISSUE'
                    ? 'e.g. Serial verified, jumper kit attached'
                    : 'e.g. Tested on multimeter, pins intact'
                }
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#00eefc]"
              />
              <FileText className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2b2c37]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-lg font-headline text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'ISSUE'
                  ? 'bg-gradient-to-r from-[#ff5545] to-[#ff6f5f] text-white shadow-[0_0_20px_rgba(255,85,69,0.35)]'
                  : 'bg-gradient-to-r from-[#3fdeb7] to-[#00eefc] text-[#0d0e15] shadow-[0_0_20px_rgba(63,222,183,0.35)]'
              }`}
            >
              {mode === 'ISSUE' ? 'Confirm Sign Out' : 'Confirm Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
