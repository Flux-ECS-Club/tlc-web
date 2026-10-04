import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem } from '../types';
import {
  Warehouse,
  Cpu,
  PlusCircle,
  Database,
  Search,
  Filter,
  ArrowRightLeft,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Props {
  onRequestModal: (item?: InventoryItem) => void;
  onAddModal: () => void;
  onIssueReturnModal: (item?: InventoryItem, mode?: 'ISSUE' | 'RETURN') => void;
  onOpenHistory: () => void;
}

export const InventorySection: React.FC<Props> = ({
  onRequestModal,
  onAddModal,
  onIssueReturnModal,
  onOpenHistory
}) => {
  const { inventory } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter inventory
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.partNumber && item.partNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'AVAILABLE' && item.status === 'AVAILABLE') ||
      (statusFilter === 'LOW_STOCK' && item.status === 'LOW_STOCK') ||
      (statusFilter === 'OUT_OF_STOCK' && item.status === 'OUT_OF_STOCK') ||
      (statusFilter === 'ISSUED' && item.issuedQuantity > 0);

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalStockUnits = inventory.reduce((acc, curr) => acc + curr.totalQuantity, 0);
  const totalAvailableUnits = inventory.reduce((acc, curr) => acc + curr.availableQuantity, 0);
  const lowStockCount = inventory.filter((i) => i.status === 'LOW_STOCK').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'OUT_OF_STOCK').length;

  return (
    <section className="relative w-full max-w-[1240px] mx-auto px-6" id="inventory-section">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1b1c25]/40 border border-[#2b2c37]/60 backdrop-blur-xl">
        {/* Section Header (Exact from Screenshot) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6">
          <div>
            <div className="font-mono-code text-xs text-[#3fdeb7] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Warehouse className="w-3.5 h-3.5" />
              <span>HARDWARE REPOSITORY</span>
            </div>
            <h2 className="font-headline text-2xl text-white font-bold">
              Lab Component &amp; Asset Inventory
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#9ba0b4] mt-1">
              Reserve development microcontrollers, brushless motors, LiDAR sensors, and oscilloscope benches.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono-code text-xs text-[#3fdeb7] bg-[#161822] px-3 py-1.5 rounded-lg border border-[#2b2c37]/50">
            <span className="w-2 h-2 rounded-full bg-[#3fdeb7] animate-pulse" />
            <span>Live Database: {totalStockUnits}+ Units In Stock ({inventory.length} SKUs)</span>
          </div>
        </div>

        {/* 3 Featured Action Cards (Exact from Screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Component Request */}
          <div className="p-5 rounded-xl bg-[#161822] border border-[#2b2c37]/60 flex flex-col justify-between hover:border-[#00eefc]/40 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#00eefc]/15 flex items-center justify-center text-[#00eefc] mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-headline text-base font-bold text-white mb-1">
                Component Request
              </h3>
              <p className="font-body text-xs text-[#9ba0b4] leading-relaxed">
                Submit project component requisitions for semester capstones, rovers, and hackathon prototypes.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[#2b2c37]/40 flex items-center justify-between">
              <span className="font-mono-code text-[10px] text-[#9ba0b4]">
                Instant 24hr Audit
              </span>
              <button
                onClick={() => onRequestModal()}
                className="px-3 py-1 rounded bg-[#00eefc]/15 text-[#00eefc] hover:bg-[#00eefc] hover:text-[#0d0e15] font-mono-code text-xs transition-colors font-medium cursor-pointer"
              >
                Request
              </button>
            </div>
          </div>

          {/* Card 2: Add Components & Ingestion */}
          <div className="p-5 rounded-xl bg-[#161822] border border-[#2b2c37]/60 flex flex-col justify-between hover:border-[#ff5545]/40 transition-colors">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#ff5545]/15 flex items-center justify-center text-[#ff5545] mb-3">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="font-headline text-base font-bold text-white mb-1">
                Add Components &amp; Ingestion
              </h3>
              <p className="font-body text-xs text-[#9ba0b4] leading-relaxed">
                Log new lab shipments, calibrate sensor parameters, and register serial barcodes into the master cluster.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[#2b2c37]/40 flex items-center justify-between">
              <span className="font-mono-code text-[10px] text-[#9ba0b4]">
                Admin Privilege Required
              </span>
              <button
                onClick={onAddModal}
                className="px-3 py-1 rounded bg-[#ff5545]/15 text-[#ff5545] hover:bg-[#ff5545] hover:text-white font-mono-code text-xs transition-colors font-medium cursor-pointer"
              >
                Add Hardware
              </button>
            </div>
          </div>

          {/* Card 3: Hardware Database & UI */}
          <div className="p-5 rounded-xl bg-[#161822] border border-[#2b2c37]/60 flex flex-col justify-between hover:border-[#3fdeb7]/40 transition-colors sm:col-span-2 lg:col-span-1">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#3fdeb7]/15 flex items-center justify-center text-[#3fdeb7] mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-headline text-base font-bold text-white mb-1">
                Hardware Database &amp; UI
              </h3>
              <p className="font-body text-xs text-[#9ba0b4] leading-relaxed">
                Live dashboard of Jetson Orin Nano, RPLiDAR A2, STM32 Nucleo boards, and LiPo batteries availability.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[#2b2c37]/40 flex items-center justify-between">
              <span className="font-mono-code text-[10px] text-[#3fdeb7]">
                Real-time Telemetry
              </span>
              <button
                onClick={onOpenHistory}
                className="px-3 py-1 rounded bg-[#3fdeb7]/15 text-[#3fdeb7] hover:bg-[#3fdeb7] hover:text-[#0d0e15] font-mono-code text-xs transition-colors font-medium cursor-pointer"
              >
                Launch UI
              </button>
            </div>
          </div>
        </div>

        {/* Live Catalog Table & Search / Filter Controls */}
        <div className="mt-8 pt-6 border-t border-[#2b2c37]/60">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search catalog by component, SKU, or drawer..."
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-xs font-mono-code focus:outline-none focus:border-[#00eefc]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 rounded-lg bg-[#0d0e15] border border-[#2b2c37]">
                {(['ALL', 'AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK', 'ISSUED'] as const).map(
                  (tab) => {
                    const label =
                      tab === 'ALL'
                        ? 'All'
                        : tab === 'AVAILABLE'
                        ? 'Available'
                        : tab === 'LOW_STOCK'
                        ? `Low (${lowStockCount})`
                        : tab === 'OUT_OF_STOCK'
                        ? `Out (${outOfStockCount})`
                        : 'Issued';

                    const isSelected = statusFilter === tab;

                    return (
                      <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-3 py-1 text-xs font-mono-code rounded-md transition-colors ${
                          isSelected
                            ? 'bg-[#242533] text-white shadow-sm'
                            : 'text-[#9ba0b4] hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Category Dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-xs font-mono-code focus:outline-none focus:border-[#00eefc]"
              >
                <option value="ALL">All Categories</option>
                <option value="Microcontroller">Microcontrollers</option>
                <option value="Sensor">Sensors</option>
                <option value="Motor Driver">Motor Drivers</option>
                <option value="Actuator">Actuators</option>
                <option value="Power">Power & Batteries</option>
              </select>

              {/* Custody Ledger Button */}
              <button
                onClick={onOpenHistory}
                className="px-3 py-1.5 rounded-lg bg-[#161822] hover:bg-[#242533] text-xs font-mono-code text-[#00eefc] border border-[#2b2c37] flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Requisitions Ledger</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-[#2b2c37] rounded-xl overflow-x-auto bg-[#0d0e15]/70">
            <table className="w-full text-left text-xs font-mono-code min-w-[700px]">
              <thead className="bg-[#161822] text-[#9ba0b4] border-b border-[#2b2c37] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Component / Specs</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Available</th>
                  <th className="p-3 text-center">Reserved</th>
                  <th className="p-3 text-center">Issued</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Laboratory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b2c37]/60">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#9ba0b4]">
                      No matching components located in current query filter.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#161822]/80 transition-colors group"
                    >
                      <td className="p-3">
                        <div className="font-bold text-white group-hover:text-[#ffb4aa] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#9ba0b4] truncate max-w-xs">
                          {item.partNumber ? `${item.partNumber} • ` : ''}
                          {item.location}
                        </div>
                      </td>
                      <td className="p-3 text-[#9ba0b4]">{item.category}</td>
                      <td className="p-3 text-center text-white font-bold">
                        {item.totalQuantity}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-bold ${
                            item.availableQuantity <= 0
                              ? 'text-[#ff5545]'
                              : item.availableQuantity <= item.minimumStock
                              ? 'text-[#ff9f1c]'
                              : 'text-[#00eefc]'
                          }`}
                        >
                          {item.availableQuantity}
                        </span>
                      </td>
                      <td className="p-3 text-center text-[#ff9f1c]">
                        {item.reservedQuantity}
                      </td>
                      <td className="p-3 text-center text-[#9ba0b4]">
                        {item.issuedQuantity}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onRequestModal(item)}
                            disabled={item.availableQuantity <= 0}
                            title={
                              item.availableQuantity <= 0
                                ? 'Item is currently out of stock'
                                : 'Request allocation for project'
                            }
                            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-all ${
                              item.availableQuantity <= 0
                                ? 'bg-[#242533] text-[#9ba0b4] cursor-not-allowed'
                                : 'bg-[#00eefc]/15 hover:bg-[#00eefc] text-[#00eefc] hover:text-[#0d0e15] border border-[#00eefc]/30 cursor-pointer'
                            }`}
                          >
                            Request
                          </button>
                          <button
                            onClick={() => onIssueReturnModal(item, 'ISSUE')}
                            title="Sign out hardware or manage returns"
                            className="px-2.5 py-1 rounded bg-[#242533] hover:bg-[#343647] text-[#e3e1ec] border border-[#2b2c37] text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Sign Out / In
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
