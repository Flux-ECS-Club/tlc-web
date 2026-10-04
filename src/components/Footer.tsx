import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface Props {
  onOpenPortal: () => void;
  onOpenComponentRequest: () => void;
  onOpenAddComponent: () => void;
  onOpenHistory: () => void;
}

export const Footer: React.FC<Props> = ({
  onOpenPortal,
  onOpenComponentRequest,
  onOpenAddComponent,
  onOpenHistory
}) => {
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);

  return (
    <footer className="w-full bg-[#08090d] border-t border-[#2b2c37]/60 pt-12 pb-8 text-[#9ba0b4]">
      <div className="max-w-[1240px] mx-auto px-6 flex flex-col gap-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {/* Guild Brand Info */}
          <div className="col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg p-0.5 bg-gradient-to-br from-[#ff5545] to-[#00eefc] flex items-center justify-center overflow-hidden">
                <img
                  src="/src/assets/images/club_insignia_logo_1791089828251.jpg"
                  alt="Flux ECS Club Logo"
                  className="w-full h-full object-cover rounded"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-headline text-base font-bold text-white tracking-tight">
                Flux ECS Club
              </span>
            </div>
            <p className="font-body text-xs text-[#9ba0b4]/80 max-w-sm leading-relaxed">
              Autonomous systems, embedded computing, and cyber-physical experimentation under the student robotics mentorship framework.
            </p>
            <div className="font-mono-code text-[11px] text-[#3fdeb7] flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3fdeb7]" />
              <span>Official University Tech Chapter</span>
            </div>
          </div>

          {/* Col 1: Council */}
          <div className="flex flex-col gap-2">
            <span className="font-headline text-xs font-bold text-white uppercase tracking-wider mb-1">
              Council
            </span>
            <a href="#" className="font-body text-xs hover:text-white transition-colors">
              Home
            </a>
            <a href="#council-section" className="font-body text-xs hover:text-white transition-colors">
              About
            </a>
            <a href="#council-section" className="font-body text-xs hover:text-white transition-colors">
              Members
            </a>
          </div>

          {/* Col 2: Event */}
          <div className="flex flex-col gap-2">
            <span className="font-headline text-xs font-bold text-white uppercase tracking-wider mb-1">
              Event
            </span>
            <a href="#events-section" className="font-body text-xs hover:text-[#ff5545] transition-colors">
              Upcoming
            </a>
            <a href="#events-section" className="font-body text-xs hover:text-[#ff5545] transition-colors">
              Past Highlights
            </a>
            <a href="#events-section" className="font-body text-xs hover:text-[#ff5545] transition-colors">
              Archive
            </a>
          </div>

          {/* Col 3: Inventory */}
          <div className="flex flex-col gap-2">
            <span className="font-headline text-xs font-bold text-white uppercase tracking-wider mb-1">
              Inventory
            </span>
            <button
              onClick={onOpenComponentRequest}
              className="font-body text-xs hover:text-[#00eefc] transition-colors text-left"
            >
              Component Request
            </button>
            <button
              onClick={onOpenAddComponent}
              className="font-body text-xs hover:text-[#00eefc] transition-colors text-left"
            >
              Add Components
            </button>
            <button
              onClick={onOpenHistory}
              className="font-body text-xs hover:text-[#00eefc] transition-colors text-left"
            >
              Hardware Status
            </button>
            <a href="#inventory-section" className="font-body text-xs hover:text-[#00eefc] transition-colors">
              Database &amp; UI
            </a>
          </div>

          {/* Col 4: Connect */}
          <div className="flex flex-col gap-2">
            <span className="font-headline text-xs font-bold text-white uppercase tracking-wider mb-1">
              Connect
            </span>
            <a href="#contact-section" className="font-body text-xs hover:text-[#3fdeb7] transition-colors">
              Contact
            </a>
            <a href="#newsletter-section" className="font-body text-xs hover:text-[#3fdeb7] transition-colors">
              Newsletter
            </a>
            <button
              onClick={onOpenPortal}
              className="font-body text-xs hover:text-[#3fdeb7] transition-colors text-left"
            >
              Portal Login
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#2b2c37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-[11px] text-[#9ba0b4]/70">
          <div>
            © 2026 Flux ECS Club. All rights reserved. Open-hardware research initiatives.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSafetyModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Safety Protocols
            </button>
            <span>•</span>
            <a href="#council-section" className="hover:text-white transition-colors">
              Charter
            </a>
            <span>•</span>
            <span className="text-[#3fdeb7]">RTOS FreeRTOS 10.5</span>
          </div>
        </div>
      </div>

      {/* Safety Protocols Modal */}
      {safetyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#12131a] border border-[#ff5545]/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-[#2b2c37]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#ff5545]" />
                <h4 className="font-headline text-base font-bold text-white">
                  Laboratory Safety Protocols
                </h4>
              </div>
              <button
                onClick={() => setSafetyModalOpen(false)}
                className="text-[#9ba0b4] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2.5 text-xs text-[#9ba0b4] font-body leading-relaxed">
              <p>1. <strong>LiPo Battery Care:</strong> Always charge LiPo packs in fireproof charging bags at &le; 1C charge rate.</p>
              <p>2. <strong>High-Voltage Drivers:</strong> Never modify motor driver wiring while the 12V bench power rail is active.</p>
              <p>3. <strong>Autonomous Rovers:</strong> Always engage the mechanical emergency cutoff latch before testing wheel steering vectors.</p>
              <p>4. <strong>ESD Protection:</strong> Ground wrists when handling bare Jetson Orin SOMs or delicate IMU breakout boards.</p>
            </div>
            <div className="mt-5 text-right">
              <button
                onClick={() => setSafetyModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#242533] text-white text-xs font-mono-code font-bold uppercase"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
