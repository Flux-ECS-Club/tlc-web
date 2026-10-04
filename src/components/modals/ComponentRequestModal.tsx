import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { X, Cpu, AlertCircle, Calendar, Hash, User, Mail, FolderGit2 } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedItem?: InventoryItem | null;
}

export const ComponentRequestModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedItem
}) => {
  const { inventory, currentUser, requestComponent } = useApp();

  const [componentId, setComponentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [purpose, setPurpose] = useState<string>('');
  const [project, setProject] = useState<string>('');
  const [requiredDate, setRequiredDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize dates and autofill if logged in
  useEffect(() => {
    if (isOpen) {
      if (preselectedItem) {
        setComponentId(preselectedItem.id);
      } else if (inventory.length > 0 && !componentId) {
        setComponentId(inventory[0].id);
      }

      if (currentUser) {
        setStudentName(currentUser.name);
        setStudentId(currentUser.studentId);
        setEmail(currentUser.email);
      }

      const today = new Date().toISOString().split('T')[0];
      const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setRequiredDate(today);
      setReturnDate(twoWeeksLater);
      setErrorMsg(null);
    }
  }, [isOpen, preselectedItem, currentUser, inventory]);

  if (!isOpen) return null;

  const selectedItem = inventory.find((i) => i.id === componentId);
  const currentAvailable = selectedItem ? selectedItem.availableQuantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedItem) {
      setErrorMsg('Please select a valid component.');
      return;
    }

    const result = requestComponent({
      componentId,
      studentName,
      studentId,
      email,
      quantity: Number(quantity),
      purpose,
      project,
      requiredDate,
      returnDate
    });

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to submit requisition.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#12131a] border border-[#ff5545]/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/30 flex items-center justify-center text-[#ff5545]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#ff5545]">
                HARDWARE DISPATCH REQUISITION
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Request Lab Component
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

        {/* Selected Component Status Box */}
        {selectedItem && (
          <div className="mt-5 p-4 rounded-xl bg-[#161822] border border-[#2b2c37] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-headline text-sm font-bold text-white flex items-center gap-2">
                {selectedItem.name}
                <span className="text-xs text-[#9ba0b4] font-mono-code">
                  ({selectedItem.category})
                </span>
              </div>
              <div className="text-xs text-[#9ba0b4] mt-0.5">
                Location: <span className="font-mono-code text-white">{selectedItem.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono-code text-[#9ba0b4]">Available</div>
                <div className="text-lg font-bold font-mono-code text-[#00eefc]">
                  {selectedItem.availableQuantity} <span className="text-xs text-[#9ba0b4]">/ {selectedItem.totalQuantity}</span>
                </div>
              </div>
              <StatusBadge status={selectedItem.status} size="sm" />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/40 text-[#ffb4ab] text-xs flex items-start gap-2.5 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ff5545] mt-0.5" />
            <div>
              <span className="font-bold">Validation Warning:</span> {errorMsg}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Component Selection */}
          <div>
            <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
              Select Component
            </label>
            <select
              value={componentId}
              onChange={(e) => setComponentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
              required
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.availableQuantity} available ({item.status})
                </option>
              ))}
            </select>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Student Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Tanya Verma"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                  required
                />
                <User className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Student ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. ECS-2024-419"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                  required
                />
                <Hash className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cadet@university.edu"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                  required
                />
                <Mail className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Quantity Required
              </label>
              <input
                type="number"
                min="1"
                max={Math.max(1, currentAvailable)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                required
              />
              <span className="text-[10px] text-[#9ba0b4] mt-1 block">
                {currentAvailable === 0
                  ? '⚠️ Currently 0 available in stock'
                  : `Maximum currently requestable: ${currentAvailable}`}
              </span>
            </div>
          </div>

          {/* Project & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Target Project / Rover
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. RoboStorm Swarm Rover"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                  required
                />
                <FolderGit2 className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Purpose Summary
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Sensor bus testing and telemetry"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Required Issue Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                  required
                />
                <Calendar className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Scheduled Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                  required
                />
                <Calendar className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Submit */}
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
              disabled={currentAvailable <= 0}
              className={`px-5 py-2.5 rounded-lg font-headline text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                currentAvailable <= 0
                  ? 'bg-[#242533] text-[#9ba0b4] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#ff5545] to-[#ff6f5f] text-white shadow-[0_0_20px_rgba(255,85,69,0.35)] hover:shadow-[0_0_28px_rgba(255,85,69,0.55)]'
              }`}
            >
              <span>{currentAvailable <= 0 ? 'Out of Stock' : 'Submit Requisition'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
