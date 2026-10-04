import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Cpu, Sparkles, Activity } from 'lucide-react';

interface Props {
  onRequestComponents: () => void;
}

export const Hero: React.FC<Props> = ({ onRequestComponents }) => {
  const { users, inventory, events } = useApp();

  // Dynamic calculated metrics from state
  const totalCadets = Math.max(500, users.length * 250);
  const totalProjects = 40 + inventory.filter((i) => i.issuedQuantity > 0).length;
  const nationalPodiums = 15;

  return (
    <section className="relative w-full max-w-[1240px] mx-auto px-6 pt-6 pb-6">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Live Node Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#23242e]/70 border border-[#434452]/60 shadow-sm backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-[#ff5545] animate-ping" />
          <span className="font-mono-code text-xs font-semibold text-[#ffb4aa] uppercase tracking-widest">
            Autonomous Systems Guild
          </span>
          <span className="text-[#434452] text-xs">•</span>
          <span className="font-mono-code text-xs text-[#00eefc] font-medium flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>Node Sync Active</span>
          </span>
        </div>

        {/* Sleek Headline */}
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-[54px] lg:leading-[1.12] text-white font-bold tracking-tight mb-5">
          Engineering{' '}
          <span className="bg-gradient-to-r from-[#ff5545] via-[#ffb4aa] to-[#00eefc] bg-clip-text text-transparent">
            Autonomous Futures
          </span>{' '}
          with Robotics &amp; Edge Intelligence
        </h1>

        {/* Clean Subtitle */}
        <p className="font-body text-base sm:text-lg text-[#9ba0b4] max-w-2xl leading-relaxed mb-8">
          The official robotics &amp; embedded systems guild. Empowering student innovators through hardware prototyping, autonomous systems, and research.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <a
            href="#events-section"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff5545] to-[#ff6f5f] text-white font-headline text-sm font-semibold flex items-center gap-2 shadow-[0_0_24px_rgba(255,85,69,0.35)] hover:shadow-[0_0_32px_rgba(255,85,69,0.55)] hover:scale-[1.02] transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Explore Events</span>
          </a>
          <button
            onClick={onRequestComponents}
            className="px-5 py-2.5 rounded-lg bg-[#23242e] hover:bg-[#2e3040] text-[#00eefc] hover:text-white border border-[#434452]/60 font-headline text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <Cpu className="w-4 h-4" />
            <span>Request Components</span>
          </button>
        </div>

        {/* Key Metrics Strip (Clean & Minimal from Screenshot) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-[#2b2c37]/60">
          <div className="p-4 rounded-xl bg-[#1b1c25]/60 border border-[#2b2c37]/60 backdrop-blur-md flex flex-col items-center">
            <div className="font-mono-code text-2xl font-bold text-white mb-0.5">
              {totalCadets}+
            </div>
            <div className="font-body text-xs text-[#00eefc] font-medium">Active Cadets</div>
            <div className="font-mono-code text-[10px] text-[#9ba0b4]/80 mt-1">
              Cross-domain innovators
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1b1c25]/60 border border-[#2b2c37]/60 backdrop-blur-md flex flex-col items-center">
            <div className="font-mono-code text-2xl font-bold text-[#ff5545] mb-0.5">
              {totalProjects}+
            </div>
            <div className="font-body text-xs text-white font-medium">Hardware Projects</div>
            <div className="font-mono-code text-[10px] text-[#9ba0b4]/80 mt-1">
              Rovers, Swarms &amp; Jetson RTOS
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1b1c25]/60 border border-[#2b2c37]/60 backdrop-blur-md flex flex-col items-center">
            <div className="font-mono-code text-2xl font-bold text-[#3fdeb7] mb-0.5">
              {nationalPodiums}+
            </div>
            <div className="font-body text-xs text-[#3fdeb7] font-medium">National Podiums</div>
            <div className="font-mono-code text-[10px] text-[#9ba0b4]/80 mt-1">
              University Robotics Challenges
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
