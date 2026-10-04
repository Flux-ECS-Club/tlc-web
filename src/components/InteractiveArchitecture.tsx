import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cpu,
  Radar,
  Radio,
  Terminal,
  Download,
  Activity,
  Layers,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface Props {
  onInspectPinMap: () => void;
  onOpenSchematics: () => void;
  onSelectComponent: (componentId: string) => void;
}

type CoreView = 'rover' | 'sensor' | 'telemetry';

type EcosystemNode =
  | 'Hardware'
  | 'Embedded Systems'
  | 'Control'
  | 'Autonomous Systems'
  | 'Telemetry'
  | 'Research';

export const InteractiveArchitecture: React.FC<Props> = ({
  onInspectPinMap,
  onOpenSchematics,
  onSelectComponent
}) => {
  const { inventory } = useApp();
  const [coreView, setCoreView] = useState<CoreView>('rover');
  const [activeNode, setActiveNode] = useState<EcosystemNode>('Hardware');

  // Specs based on coreView
  const viewSpecs = {
    rover: {
      tag: 'RTOS 1.2ms',
      tagColor: 'text-[#ff5545] bg-[#ff5545]/20 border-[#ff5545]/30',
      title: 'Rover Kinematics & Motion Controller',
      desc: 'Deterministic FreeRTOS loop coordinating 6-wheel rocker-bogie differential steering, obstacle avoidance trajectory vectors, and LiDAR point-cloud clustering.',
      spec1: { label: 'Clock Rate', val: '480 MHz', sub: 'Overclock Ready', color: 'text-[#00eefc]' },
      spec2: { label: 'I/O Latency', val: '0.8 ms', sub: 'Deterministic', color: 'text-[#ff5545]' },
      spec3: { label: 'Bus Speed', val: '1 Mbps', sub: 'CAN-FD Dual', color: 'text-[#3fdeb7]' },
      chipTopBadge: 'ARM CORTEX-M7',
      chipRail: '3.3V DUAL-RAIL',
      chipCore: 'ERC-CORE v4',
      chipSub: '480MHz FPU',
      icon: <Cpu className="w-5 h-5 text-[#ff5545]" />
    },
    sensor: {
      tag: 'EKF FILTERED',
      tagColor: 'text-[#00eefc] bg-[#00eefc]/20 border-[#00eefc]/30',
      title: 'High-Speed Sensor Fusion Array',
      desc: 'Sub-millisecond polling of solid-state gyroscopes, barometric altimeters, wheel optical encoders, and RPLiDAR 2D rangefinders for instant slip correction.',
      spec1: { label: 'Clock Rate', val: '240 MHz', sub: 'I2C/SPI Bus', color: 'text-[#00eefc]' },
      spec2: { label: 'I/O Latency', val: '0.2 ms', sub: 'Interrupt Driven', color: 'text-[#ff5545]' },
      spec3: { label: 'Bus Speed', val: '10 Mbps', sub: 'SPI Bus Direct', color: 'text-[#3fdeb7]' },
      chipTopBadge: '9-AXIS IMU BUS',
      chipRail: '3.3V LOW-NOISE',
      chipCore: 'FUSION-HUB',
      chipSub: 'SPI / I2C / CAN',
      icon: <Radar className="w-5 h-5 text-[#00eefc]" />
    },
    telemetry: {
      tag: 'AES-128 MAVLINK',
      tagColor: 'text-[#3fdeb7] bg-[#3fdeb7]/20 border-[#3fdeb7]/30',
      title: 'Long-Range Field Telemetry Link',
      desc: 'Dual-band telemetry link transmitting live camera streams, rover battery rail voltages, motor torque telemetry, and GPS coordinates to ground control.',
      spec1: { label: 'Clock Rate', val: '160 MHz', sub: 'RF Transceiver', color: 'text-[#00eefc]' },
      spec2: { label: 'I/O Latency', val: '2.4 ms', sub: 'Spread Spectrum', color: 'text-[#ff5545]' },
      spec3: { label: 'Range', val: '20 km', sub: 'Sub-GHz + ROS 2', color: 'text-[#3fdeb7]' },
      chipTopBadge: '915MHz LoRa & Wi-Fi',
      chipRail: '5V HIGH-EFF',
      chipCore: 'RF-RADIO LINK',
      chipSub: 'Sub-GHz + ROS 2',
      icon: <Radio className="w-5 h-5 text-[#3fdeb7]" />
    }
  }[coreView];

  // Ecosystem node contents (Section 7)
  const ecosystemData: Record<
    EcosystemNode,
    {
      description: string;
      technologies: string[];
      relatedHardwareSkus: string[];
      eventMatch: string;
    }
  > = {
    Hardware: {
      description: 'Physical computing foundation: high-power motor drivers, micro metal gearboxes, battery telemetry circuits, and custom PCBs.',
      technologies: ['ESP32 Dev Board', 'Arduino Mega 2560', 'L298N & TB6612 Drivers', 'N20 Motors'],
      relatedHardwareSkus: ['esp32-001', 'stm32-004', 'l298n-006', 'n20-008'],
      eventMatch: 'RoboStorm 2026 Chassis Build Phase'
    },
    'Embedded Systems': {
      description: 'Bare-metal C/C++ firmware, FreeRTOS deterministic task scheduling, hardware timers, and memory-mapped DMA controllers.',
      technologies: ['STM32 HAL / CMSIS', 'FreeRTOS Tasks', 'UART/SPI/I2C Protocols', 'CAN 2.0B'],
      relatedHardwareSkus: ['stm32-004', 'esp32-001'],
      eventMatch: 'Jetson & ARM Firmware Bootcamp'
    },
    Control: {
      description: 'Closed-loop motion feedback, PID velocity tuning, trajectory prediction, and wheel odometry slip estimation on loose terrain.',
      technologies: ['PID Velocity Regulators', 'Kinematic Inversion', 'MPU6050 Complementary Filter', 'Trajectory Vectors'],
      relatedHardwareSkus: ['mpu-005', 'tb6612-007', 'mg996r-011'],
      eventMatch: 'RoboStorm Obstacle Traversal Arena'
    },
    'Autonomous Systems': {
      description: 'Perception and mapping stacks: 2D LiDAR SLAM, NVIDIA Jetson TensorRT neural models, obstacle bounding boxes, and path planning.',
      technologies: ['RPLiDAR A2M8', 'Jetson TensorRT', 'Hector SLAM', 'Cartographer'],
      relatedHardwareSkus: ['rplidar-003', 'jetson-orin-002', 'hcsr04-009'],
      eventMatch: 'Ares-IV Planetary Rover Deployment'
    },
    Telemetry: {
      description: 'Ground-station data bridges, bidirectional MAVLink packets, WebSocket dashboards, and distributed Cyclone DDS topics.',
      technologies: ['MQTT Brokers', 'MAVLink Packets', 'WebSocket HUD', 'ROS 2 Micro-XRCE'],
      relatedHardwareSkus: ['esp32-001', 'lipo-012'],
      eventMatch: 'Season 2026 Ground Telemetry Link'
    },
    Research: {
      description: 'Peer-reviewed academic research in IEEE symposiums, planetary mobility mechanics, and multi-robot decentralized swarm formations.',
      technologies: ['IEEE ICRA Papers', 'Rocker-Bogie Dynamics', 'Multi-Agent Mesh', 'Open Hardware'],
      relatedHardwareSkus: ['jetson-orin-002', 'stm32-004'],
      eventMatch: 'National University Mars Symposium'
    }
  };

  const currentEcosystem = ecosystemData[activeNode];

  return (
    <section className="relative w-full max-w-[1240px] mx-auto px-6" id="architecture-section">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1b1c25]/40 border border-[#2b2c37]/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Background glow & subtle tech grid */}
        <div className="absolute inset-0 tech-grid-pattern opacity-40 pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <div className="font-mono-code text-xs text-[#3fdeb7] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>HARDWARE TELEMETRY PREVIEW</span>
            </div>
            <h2 className="font-headline text-2xl text-white font-bold">
              Interactive Core Architecture
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#9ba0b4] mt-1">
              Explore the flight-controller silicon and sensor routing powering the guild's autonomous rovers.
            </p>
          </div>

          {/* Interactive View Toggles (From Screenshot) */}
          <div className="flex items-center gap-1 bg-[#0d0e15]/80 p-1 rounded-lg border border-[#2b2c37]/50">
            <button
              onClick={() => setCoreView('rover')}
              className={`px-3.5 py-1.5 rounded-md font-mono-code text-xs font-medium transition-all ${
                coreView === 'rover'
                  ? 'bg-[#ff5545] text-white shadow-sm'
                  : 'text-[#9ba0b4] hover:text-white'
              }`}
            >
              Rover Architecture
            </button>
            <button
              onClick={() => setCoreView('sensor')}
              className={`px-3.5 py-1.5 rounded-md font-mono-code text-xs font-medium transition-all ${
                coreView === 'sensor'
                  ? 'bg-[#00eefc] text-[#0d0e15] shadow-sm font-bold'
                  : 'text-[#9ba0b4] hover:text-white'
              }`}
            >
              Sensor Bus
            </button>
            <button
              onClick={() => setCoreView('telemetry')}
              className={`px-3.5 py-1.5 rounded-md font-mono-code text-xs font-medium transition-all ${
                coreView === 'telemetry'
                  ? 'bg-[#3fdeb7] text-[#0d0e15] shadow-sm font-bold'
                  : 'text-[#9ba0b4] hover:text-white'
              }`}
            >
              Telemetry
            </button>
          </div>
        </div>

        {/* Core Preview Grid (Exact visual match from Screenshot) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Chip Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center p-8 bg-[#0d0e15]/90 border border-[#2b2c37]/40 rounded-xl min-h-[300px]">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00eefc_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative w-64 h-64 rounded-2xl bg-[#242533]/90 border border-[#434452] p-6 flex flex-col items-center justify-between shadow-2xl transition-all duration-300">
              {/* Connector Pins Top */}
              <div className="absolute -top-2 left-6 right-6 flex justify-between">
                <span className="w-1.5 h-2.5 bg-[#00eefc] rounded-sm" />
                <span className="w-1.5 h-2.5 bg-[#00eefc] rounded-sm" />
                <span className="w-1.5 h-2.5 bg-[#ff5545] rounded-sm" />
                <span className="w-1.5 h-2.5 bg-[#00eefc] rounded-sm" />
                <span className="w-1.5 h-2.5 bg-[#00eefc] rounded-sm" />
              </div>
              {/* Connector Pins Bottom */}
              <div className="absolute -bottom-2 left-6 right-6 flex justify-between">
                <span className="w-1.5 h-2.5 bg-[#00eefc] rounded-sm" />
                <span className="w-1.5 h-2.5 bg-[#ff5545] rounded-sm" />
                <span className="w-1.5 h-2.5 bg-[#00eefc] rounded-sm" />
                <span className="w-1.5 h-2.5 bg-[#00eefc] rounded-sm" />
                <span className="w-1.5 h-2.5 bg-[#00eefc] rounded-sm" />
              </div>

              {/* Card Header inside Chip */}
              <div className="w-full flex justify-between text-[10px] font-mono-code text-[#9ba0b4]">
                <span className="text-[#ff5545] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545] animate-ping" />
                  {viewSpecs.chipTopBadge}
                </span>
                <span className="text-[#3fdeb7]">{viewSpecs.chipRail}</span>
              </div>

              {/* Center Chip Hub */}
              <div className="w-28 h-28 rounded-xl bg-[#0d0e15] border border-[#2b2c37] flex flex-col items-center justify-center p-2 text-center shadow-inner relative group cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-[#ff5545]/20 flex items-center justify-center text-[#ff5545] mb-1.5 transition-transform group-hover:scale-110">
                  {viewSpecs.icon}
                </div>
                <div className="font-headline text-xs font-bold text-white tracking-wide">
                  {viewSpecs.chipCore}
                </div>
                <div className="font-mono-code text-[9px] text-[#00eefc] mt-0.5">
                  {viewSpecs.chipSub}
                </div>
              </div>

              {/* Chip Footer */}
              <div className="w-full flex justify-between items-center text-[10px] font-mono-code">
                <span className="text-[#9ba0b4] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00eefc]" /> CAN 2.0B
                </span>
                <span className="text-[#3fdeb7] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3fdeb7]" /> RTOS SYNCED
                </span>
              </div>
            </div>
          </div>

          {/* Description & Metric Info */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="p-5 rounded-xl bg-[#161822] border border-[#2b2c37]/60 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-headline text-base font-bold text-white">
                  {viewSpecs.title}
                </span>
                <span className={`font-mono-code text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${viewSpecs.tagColor}`}>
                  {viewSpecs.tag}
                </span>
              </div>
              <p className="font-body text-sm text-[#9ba0b4] leading-relaxed">
                {viewSpecs.desc}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-[#161822] border border-[#2b2c37]/40 flex flex-col">
                <span className="font-mono-code text-[10px] text-[#9ba0b4] uppercase">
                  {viewSpecs.spec1.label}
                </span>
                <span className={`font-mono-code text-base font-bold ${viewSpecs.spec1.color}`}>
                  {viewSpecs.spec1.val}
                </span>
                <span className="font-body text-[10px] text-[#9ba0b4]/70">
                  {viewSpecs.spec1.sub}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#161822] border border-[#2b2c37]/40 flex flex-col">
                <span className="font-mono-code text-[10px] text-[#9ba0b4] uppercase">
                  {viewSpecs.spec2.label}
                </span>
                <span className={`font-mono-code text-base font-bold ${viewSpecs.spec2.color}`}>
                  {viewSpecs.spec2.val}
                </span>
                <span className="font-body text-[10px] text-[#9ba0b4]/70">
                  {viewSpecs.spec2.sub}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#161822] border border-[#2b2c37]/40 flex flex-col">
                <span className="font-mono-code text-[10px] text-[#9ba0b4] uppercase">
                  {viewSpecs.spec3.label}
                </span>
                <span className={`font-mono-code text-base font-bold ${viewSpecs.spec3.color}`}>
                  {viewSpecs.spec3.val}
                </span>
                <span className="font-body text-[10px] text-[#9ba0b4]/70">
                  {viewSpecs.spec3.sub}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onInspectPinMap}
                className="px-3.5 py-2 rounded-lg bg-[#242533] hover:bg-[#343647] text-xs font-mono-code text-[#00eefc] border border-[#2b2c37] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Inspect Pin Map</span>
              </button>
              <button
                onClick={onOpenSchematics}
                className="px-3.5 py-2 rounded-lg bg-[#242533] hover:bg-[#343647] text-xs font-mono-code text-[#9ba0b4] hover:text-white border border-[#2b2c37] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>KiCad Schematics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Ecosystem Pipeline Nodes (Section 7) */}
        <div className="relative z-10 mt-8 pt-6 border-t border-[#2b2c37]/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-code uppercase text-[#9ba0b4]">
              Club Technical Ecosystem Pipeline (Click any node to inspect stack &amp; live hardware)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(
              [
                'Hardware',
                'Embedded Systems',
                'Control',
                'Autonomous Systems',
                'Telemetry',
                'Research'
              ] as EcosystemNode[]
            ).map((node) => {
              const isSelected = activeNode === node;
              return (
                <button
                  key={node}
                  onClick={() => setActiveNode(node)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#161822] border-[#ff5545] shadow-[0_0_15px_rgba(255,85,69,0.2)]'
                      : 'bg-[#0d0e15]/70 border-[#2b2c37] hover:border-[#434452]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-headline font-bold ${
                        isSelected ? 'text-[#ffb4aa]' : 'text-white'
                      }`}
                    >
                      {node}
                    </span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545]" />}
                  </div>
                  <div className="text-[10px] font-mono-code text-[#9ba0b4] mt-1 truncate">
                    {ecosystemData[node].technologies[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Node Detail Drawer */}
          <div className="mt-4 p-4 rounded-xl bg-[#12131a] border border-[#2b2c37] text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="font-headline text-sm font-bold text-white">
                  {activeNode} Layer Stack
                </span>
                <p className="font-body text-[#9ba0b4] mt-0.5 max-w-xl">
                  {currentEcosystem.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono-code text-[#ff9f1c] block uppercase">
                  Connected Event
                </span>
                <span className="font-mono-code text-white text-xs">
                  {currentEcosystem.eventMatch}
                </span>
              </div>
            </div>

            {/* Hardware SKUs present in this node */}
            <div className="mt-3 pt-3 border-t border-[#2b2c37] flex flex-wrap items-center gap-2">
              <span className="font-mono-code text-[10px] uppercase text-[#00eefc]">
                Available Lab Components:
              </span>
              {currentEcosystem.relatedHardwareSkus.map((skuId) => {
                const item = inventory.find((i) => i.id === skuId);
                if (!item) return null;
                return (
                  <button
                    key={skuId}
                    onClick={() => onSelectComponent(skuId)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161822] hover:bg-[#23242e] border border-[#2b2c37] text-[11px] font-mono-code text-white hover:text-[#00eefc] transition-colors"
                  >
                    <span>{item.name}</span>
                    <span className="text-[#3fdeb7] font-bold">({item.availableQuantity} avail)</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
