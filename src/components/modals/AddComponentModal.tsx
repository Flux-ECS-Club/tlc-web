import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { X, PlusCircle, AlertCircle, MapPin, Tag } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddComponentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addComponent } = useApp();

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<InventoryItem['category']>('Microcontroller');
  const [quantity, setQuantity] = useState<number>(10);
  const [minimumStock, setMinimumStock] = useState<number>(3);
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [partNumber, setPartNumber] = useState<string>('');
  const [specs, setSpecs] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = addComponent({
      name,
      category,
      quantity: Number(quantity),
      minimumStock: Number(minimumStock),
      location: location || 'Intake Bin 1',
      description,
      partNumber,
      specs
    });

    if (result.success) {
      setName('');
      setDescription('');
      setPartNumber('');
      setSpecs('');
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to add component.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#12131a] border border-[#ff5545]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/30 flex items-center justify-center text-[#ff5545]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#ff5545]">
                ADMIN INVENTORY INGESTION
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Add Components & Assets
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

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/40 text-[#ffb4ab] text-xs flex items-start gap-2.5 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ff5545] mt-0.5" />
            <div>
              <span className="font-bold">Error:</span> {errorMsg}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Component Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ESP32 Dev Board"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
              >
                <option value="Microcontroller">Microcontroller</option>
                <option value="Sensor">Sensor</option>
                <option value="Motor Driver">Motor Driver</option>
                <option value="Actuator">Actuator</option>
                <option value="Power">Power & Battery</option>
                <option value="Prototyping">Prototyping & Benches</option>
                <option value="Robotics Kit">Robotics Chassis Kit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Total Ingest Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Minimum Stock Alert Level
              </label>
              <input
                type="number"
                min="0"
                value={minimumStock}
                onChange={(e) => setMinimumStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Lab Location / Bin
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Cabinet A-01, Tray 3"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                  required
                />
                <MapPin className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Part / SKU Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="e.g. ESP32-WROOM-32D"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                />
                <Tag className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
              Description & Specifications
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dual-core Xtensa 32-bit LX6 @ 240MHz with Wi-Fi & Bluetooth BLE."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
              required
            />
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
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#ff5545] to-[#ff6f5f] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,85,69,0.35)] hover:shadow-[0_0_28px_rgba(255,85,69,0.55)] transition-all"
            >
              Ingest to Lab Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
