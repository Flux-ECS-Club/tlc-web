import React from 'react';
import { X, Cpu, Layers, Download, CheckCircle, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SchematicsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#12131a] border border-[#ff5545]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] my-8">
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/30 flex items-center justify-center text-[#ff5545]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#ff5545]">
                OPEN HARDWARE REPOSITORY
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                KiCad v8 Electrical Schematics
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

        {/* Schematic Mock View */}
        <div className="mt-5 p-5 rounded-xl bg-[#08090d] border border-[#2b2c37] font-mono-code text-xs relative overflow-hidden">
          <div className="absolute top-3 right-3 text-[10px] text-[#3fdeb7] bg-[#3fdeb7]/10 px-2 py-0.5 rounded border border-[#3fdeb7]/30">
            REV 4.2 • OSHW VERIFIED
          </div>
          
          <div className="text-[#9ba0b4] mb-3">
            // SHEET 1/3: 3.3V DUAL-RAIL BUCK CONVERTER & FILTER ARRAY
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-[#12131a] border border-[#2b2c37]">
              <div className="text-[#ff5545] font-bold">U1: TPS54302 Buck</div>
              <div className="text-[#9ba0b4] mt-1">Vin: 7.4V - 12.6V (3S LiPo)</div>
              <div className="text-[#9ba0b4]">Vout: 5.0V @ 3A (93% eff.)</div>
              <div className="text-[#00eefc] mt-1">L1: 10uH Shielded Inductor</div>
            </div>
            <div className="p-3 rounded-lg bg-[#12131a] border border-[#2b2c37]">
              <div className="text-[#ff5545] font-bold">U2: LP5907 Ultra-Low Noise</div>
              <div className="text-[#9ba0b4] mt-1">Vin: 5.0V Regulated</div>
              <div className="text-[#9ba0b4]">Vout: 3.3V Analog (IMU/LiDAR)</div>
              <div className="text-[#3fdeb7] mt-1">Ripple: &lt;6.5 uVrms</div>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-[#12131a] border border-[#2b2c37] flex items-center justify-between text-[11px]">
            <div>
              <span className="text-white font-bold">CAN-FD Transceiver:</span>{' '}
              <span className="text-[#00eefc]">TCAN334GDCNR (5 Mbps capable)</span>
            </div>
            <div className="text-[#9ba0b4]">120Ω Differential Termination</div>
          </div>
        </div>

        {/* Specs List */}
        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs font-mono-code">
          <div className="p-2.5 rounded-lg bg-[#161822] border border-[#2b2c37]">
            <div className="text-[#9ba0b4] text-[10px] uppercase">Layers</div>
            <div className="text-white font-bold text-sm">4-Layer Stack</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#161822] border border-[#2b2c37]">
            <div className="text-[#9ba0b4] text-[10px] uppercase">Copper Weight</div>
            <div className="text-[#00eefc] font-bold text-sm">2 oz Inner</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#161822] border border-[#2b2c37]">
            <div className="text-[#9ba0b4] text-[10px] uppercase">Design Rule Check</div>
            <div className="text-[#3fdeb7] font-bold text-sm">0 Errors</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#2b2c37] flex items-center justify-between">
          <button
            onClick={() => {
              const blob = new Blob([
                JSON.stringify({
                  project: "ERC-CORE v4",
                  schematic: "KiCad v8",
                  gitCommit: "b8a912e",
                  bom: [
                    { ref: "U1", part: "STM32H743VIT6", footprint: "LQFP-100" },
                    { ref: "U2", part: "MPU6050", footprint: "QFN-24" },
                    { ref: "U3", part: "TCAN334", footprint: "SOT-23-8" }
                  ]
                }, null, 2)
              ], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "flux_ecs_flight_controller_schematic.json";
              a.click();
            }}
            className="px-4 py-2 rounded-lg bg-[#ff5545] hover:bg-[#ff3b30] text-white text-xs font-headline uppercase font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download CAD Archive</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#242533] hover:bg-[#343647] text-white text-xs font-headline uppercase font-bold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
