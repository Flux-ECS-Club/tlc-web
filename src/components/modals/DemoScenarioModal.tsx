import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Play, CheckCircle2, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoScenarioModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { inventory, runDemoScenarioStep, resetToInitialDemoData } = useApp();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [stepOutputs, setStepOutputs] = useState<{ [key: number]: { success: boolean; message: string } }>({});

  if (!isOpen) return null;

  const esp32Item = inventory.find((i) => i.id === 'esp32-001') || {
    id: 'esp32-001',
    name: 'ESP32 Dev Board',
    totalQuantity: 10,
    reservedQuantity: 2,
    issuedQuantity: 3,
    availableQuantity: 5,
    minimumStock: 3,
    status: 'AVAILABLE'
  };

  const handleExecute = (stepNum: 1 | 2 | 3) => {
    const res = runDemoScenarioStep(stepNum);
    setStepOutputs((prev) => ({ ...prev, [stepNum]: res }));
    if (stepNum < 3) {
      setActiveStep((stepNum + 1) as 1 | 2 | 3);
    }
  };

  const handleReset = () => {
    resetToInitialDemoData();
    setStepOutputs({});
    setActiveStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#12131a] border border-[#ff5545]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] my-8">
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/30 flex items-center justify-center text-[#ff5545]">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#ff5545]">
                SPECIFICATION SECTION 35 VALIDATOR
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Live Interactive Scenario Benchmark
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

        {/* Current Live ESP32 Status Card */}
        <div className="mt-5 p-4 rounded-xl bg-[#161822] border border-[#2b2c37]">
          <div className="flex items-center justify-between">
            <div className="font-headline text-sm font-bold text-white">
              Target Component: ESP32 Dev Board (esp32-001)
            </div>
            <StatusBadge status={esp32Item.status} size="sm" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 font-mono-code text-center text-xs">
            <div className="p-2 rounded bg-[#0d0e15] border border-[#2b2c37]">
              <span className="text-[#9ba0b4] text-[9px] uppercase block">Total</span>
              <span className="text-white font-bold text-base">{esp32Item.totalQuantity}</span>
            </div>
            <div className="p-2 rounded bg-[#0d0e15] border border-[#2b2c37]">
              <span className="text-[#9ba0b4] text-[9px] uppercase block">Reserved</span>
              <span className="text-[#ff9f1c] font-bold text-base">{esp32Item.reservedQuantity}</span>
            </div>
            <div className="p-2 rounded bg-[#0d0e15] border border-[#2b2c37]">
              <span className="text-[#9ba0b4] text-[9px] uppercase block">Issued</span>
              <span className="text-[#ff5545] font-bold text-base">{esp32Item.issuedQuantity}</span>
            </div>
            <div className="p-2 rounded bg-[#0d0e15] border border-[#2b2c37]">
              <span className="text-[#9ba0b4] text-[9px] uppercase block">Available</span>
              <span className="text-[#00eefc] font-bold text-base">{esp32Item.availableQuantity}</span>
            </div>
          </div>
        </div>

        {/* 3 Step Scenario List */}
        <div className="mt-5 space-y-3.5">
          {/* Step 1 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeStep === 1
                ? 'bg-[#161822] border-[#00eefc]/50 shadow-[0_0_15px_rgba(0,238,252,0.15)]'
                : 'bg-[#0d0e15] border-[#2b2c37]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#00eefc] font-bold">
                  Step 1 • Requisition Approval (4 Units)
                </span>
                <p className="text-xs text-[#e3e1ec] font-body mt-1">
                  User requests <strong>4x ESP32</strong>. System checks <code>4 &lt;= available (5)</code>. Requisition approved, stock drops to <strong>1</strong> (LOW STOCK).
                </p>
                {stepOutputs[1] && (
                  <div className="mt-2 text-xs font-mono-code text-[#3fdeb7] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{stepOutputs[1].message}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleExecute(1)}
                className="px-3.5 py-1.5 rounded-lg bg-[#00eefc] hover:bg-[#7df4ff] text-[#0d0e15] font-headline text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1 shadow-sm"
              >
                <span>Run Step 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeStep === 2
                ? 'bg-[#161822] border-[#ff5545]/50 shadow-[0_0_15px_rgba(255,85,69,0.15)]'
                : 'bg-[#0d0e15] border-[#2b2c37]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#ff5545] font-bold">
                  Step 2 • Over-Capacity Request Rejection (2 Units)
                </span>
                <p className="text-xs text-[#e3e1ec] font-body mt-1">
                  Second user requests <strong>2x ESP32</strong>. System checks <code>2 &gt; available (1)</code>. System REJECTS with exact error message and keeps inventory unchanged.
                </p>
                {stepOutputs[2] && (
                  <div className="mt-2 text-xs font-mono-code text-[#ff5545] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{stepOutputs[2].message}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleExecute(2)}
                className="px-3.5 py-1.5 rounded-lg bg-[#ff5545] hover:bg-[#ff3b30] text-white font-headline text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1 shadow-sm"
              >
                <span>Run Step 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              activeStep === 3
                ? 'bg-[#161822] border-[#3fdeb7]/50 shadow-[0_0_15px_rgba(63,222,183,0.15)]'
                : 'bg-[#0d0e15] border-[#2b2c37]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#3fdeb7] font-bold">
                  Step 3 • Ingestion Restock (+10 Units)
                </span>
                <p className="text-xs text-[#e3e1ec] font-body mt-1">
                  Admin ingests <strong>10x ESP32</strong>. Total increases to <strong>20</strong>, Available becomes <strong>11</strong>, Status transitions back to <strong>AVAILABLE</strong>.
                </p>
                {stepOutputs[3] && (
                  <div className="mt-2 text-xs font-mono-code text-[#3fdeb7] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{stepOutputs[3].message}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleExecute(3)}
                className="px-3.5 py-1.5 rounded-lg bg-[#3fdeb7] hover:bg-[#63fbd3] text-[#0d0e15] font-headline text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1 shadow-sm"
              >
                <span>Run Step 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#2b2c37] flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg bg-[#1b1c25] hover:bg-[#242533] text-xs font-mono-code text-[#ff9f1c] hover:text-white border border-[#2b2c37] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo to Initial State</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#242533] hover:bg-[#343647] text-white text-xs font-headline uppercase font-bold transition-colors"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
