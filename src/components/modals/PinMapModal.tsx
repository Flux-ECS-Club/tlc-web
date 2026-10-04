import React from 'react';
import { X, Cpu, Check, Terminal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PinMapModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pins = [
    { pin: 'PA0', func: 'CAN1_RX', type: 'Bus', voltage: '3.3V', desc: 'Main differential bus for rover wheel actuators' },
    { pin: 'PA1', func: 'CAN1_TX', type: 'Bus', voltage: '3.3V', desc: 'Telemetry broadcast to motor bridge boards' },
    { pin: 'PB6', func: 'I2C1_SCL', type: 'Sensor', voltage: '3.3V', desc: 'MPU6050 6-DoF accelerometer clock line' },
    { pin: 'PB7', func: 'I2C1_SDA', type: 'Sensor', voltage: '3.3V', desc: 'MPU6050 6-DoF data bidirectional trace' },
    { pin: 'PC10', func: 'UART4_TX', type: 'LiDAR', voltage: '3.3V', desc: 'RPLiDAR A2M8 start command line' },
    { pin: 'PC11', func: 'UART4_RX', type: 'LiDAR', voltage: '3.3V', desc: '8000 sample/sec laser point cloud input' },
    { pin: 'PE9', func: 'TIM1_CH1', type: 'PWM', voltage: '5.0V', desc: 'Left rocker-bogie differential steering PWM' },
    { pin: 'PE11', func: 'TIM1_CH2', type: 'PWM', voltage: '5.0V', desc: 'Right rocker-bogie differential steering PWM' },
    { pin: 'PD0', func: 'SPI1_SCK', type: 'Telemetry', voltage: '3.3V', desc: '915MHz LoRa high-speed transceiver clock' },
    { pin: 'PD1', func: 'SPI1_MISO', type: 'Telemetry', voltage: '3.3V', desc: 'Long-range telemetry RF packet data' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#12131a] border border-[#00eefc]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] my-8">
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00eefc]/15 border border-[#00eefc]/30 flex items-center justify-center text-[#00eefc]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#00eefc]">
                ERC-CORE v4 FLIGHT CONTROLLER PINOUT
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Hardware Multiplex Pin Map
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

        <p className="mt-4 text-xs text-[#9ba0b4] font-body leading-relaxed">
          Multiplex pin mappings for the Cortex-M7 autonomous flight core coordinating differential kinematics, dual CAN-FD, and LiDAR packet rings.
        </p>

        <div className="mt-4 border border-[#2b2c37] rounded-xl overflow-hidden bg-[#0d0e15]">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-[#161822] text-[#9ba0b4] uppercase text-[10px] border-b border-[#2b2c37]">
              <tr>
                <th className="p-3">Pin</th>
                <th className="p-3">Function</th>
                <th className="p-3">Subsystem</th>
                <th className="p-3">Logic Rail</th>
                <th className="p-3">Signal Routing Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b2c37]/60">
              {pins.map((p) => (
                <tr key={p.pin} className="hover:bg-[#161822]/60 transition-colors">
                  <td className="p-3 text-[#ff5545] font-bold">{p.pin}</td>
                  <td className="p-3 text-[#00eefc] font-bold">{p.func}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#242533] text-white text-[10px]">
                      {p.type}
                    </span>
                  </td>
                  <td className="p-3 text-[#3fdeb7] font-semibold">{p.voltage}</td>
                  <td className="p-3 text-[#9ba0b4] text-[11px]">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-[#2b2c37] flex items-center justify-between">
          <span className="text-xs font-mono-code text-[#3fdeb7] flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Clock Tree Calibrated @ 480 MHz</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#242533] hover:bg-[#343647] text-white text-xs font-headline uppercase font-bold transition-colors"
          >
            Close Pin Map
          </button>
        </div>
      </div>
    </div>
  );
};
