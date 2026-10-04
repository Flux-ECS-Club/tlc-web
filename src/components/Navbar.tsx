import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Shield,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Users,
  PlusCircle,
  Database,
  Cpu,
  FileSpreadsheet,
  Play
} from 'lucide-react';

interface Props {
  onOpenPortal: () => void;
  onOpenComponentRequest: () => void;
  onOpenAddComponent: () => void;
  onOpenHistory: () => void;
  onOpenDemoScenario: () => void;
}

export const Navbar: React.FC<Props> = ({
  onOpenPortal,
  onOpenComponentRequest,
  onOpenAddComponent,
  onOpenHistory,
  onOpenDemoScenario
}) => {
  const { currentUser, inventory } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate live skus
  const availableCount = inventory.filter((i) => i.availableQuantity > 0).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0e15]/90 backdrop-blur-xl border-b border-[#2b2c37]/60 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl p-0.5 bg-gradient-to-br from-[#ff5545]/40 via-[#2b2c37] to-[#00eefc]/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,85,69,0.3)] transition-transform duration-300 group-hover:scale-105 overflow-hidden">
            <img
              src="/src/assets/images/club_insignia_logo_1791089828251.jpg"
              alt="Flux ECS Club Insignia"
              className="w-full h-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-bold tracking-tight text-white group-hover:text-[#ffb4aa] transition-colors">
                Flux ECS Club
              </span>
              <span className="text-[10px] font-mono-code font-bold bg-[#ff5545]/15 text-[#ff5545] border border-[#ff5545]/25 px-1.5 py-0.5 rounded tracking-wide uppercase">
                GUILD
              </span>
            </div>
            <span className="text-[11px] font-mono-code text-[#9ba0b4]">
              Autonomous Edge Systems
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Home Active */}
          <a
            href="#"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-[#23242e]/70 border border-[#434452]/50 flex items-center gap-1 shadow-sm"
          >
            <span>Home</span>
          </a>

          {/* Council Dropdown */}
          <div className="relative group">
            <button className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25]/70 transition-colors flex items-center gap-1">
              <span>Council</span>
              <ChevronDown className="w-4 h-4 text-[#9ba0b4] group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 pt-2 w-48 hidden group-hover:block transition-all duration-200 z-50">
              <div className="bg-[#1b1c25] border border-[#2b2c37] rounded-xl p-1.5 shadow-2xl backdrop-blur-xl">
                <a
                  href="#council-section"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#23242e] transition-colors"
                >
                  <Info className="w-4 h-4 text-[#ff5545]" />
                  <span>About Council</span>
                </a>
                <a
                  href="#council-section"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#23242e] transition-colors"
                >
                  <Users className="w-4 h-4 text-[#00eefc]" />
                  <span>Members</span>
                </a>
              </div>
            </div>
          </div>

          {/* Event Dropdown */}
          <div className="relative group">
            <button className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25]/70 transition-colors flex items-center gap-1">
              <span>Event</span>
              <ChevronDown className="w-4 h-4 text-[#9ba0b4] group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 pt-2 w-48 hidden group-hover:block transition-all duration-200 z-50">
              <div className="bg-[#1b1c25] border border-[#2b2c37] rounded-xl p-1.5 shadow-2xl backdrop-blur-xl">
                <a
                  href="#events-section"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#23242e] transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#ff5545]" />
                  <span>Upcoming Hackathons</span>
                </a>
                <a
                  href="#events-section"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#23242e] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#3fdeb7]" />
                  <span>Past Highlights</span>
                </a>
              </div>
            </div>
          </div>

          {/* Inventory Dropdown */}
          <div className="relative group">
            <button className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25]/70 transition-colors flex items-center gap-1">
              <span>Inventory</span>
              <ChevronDown className="w-4 h-4 text-[#9ba0b4] group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-0 pt-2 w-56 hidden group-hover:block transition-all duration-200 z-50">
              <div className="bg-[#1b1c25] border border-[#2b2c37] rounded-xl p-1.5 shadow-2xl backdrop-blur-xl">
                <button
                  onClick={onOpenComponentRequest}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#23242e] transition-colors text-left"
                >
                  <Cpu className="w-4 h-4 text-[#00eefc]" />
                  <span>Component Request</span>
                </button>
                <button
                  onClick={onOpenAddComponent}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#23242e] transition-colors text-left"
                >
                  <PlusCircle className="w-4 h-4 text-[#ff5545]" />
                  <span>Add Components</span>
                </button>
                <button
                  onClick={onOpenHistory}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#23242e] transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#3fdeb7]" />
                  <span>Requisition Ledger</span>
                </button>
                <a
                  href="#inventory-section"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#23242e] transition-colors"
                >
                  <Database className="w-4 h-4 text-[#ff9f1c]" />
                  <span>Hardware Database & UI</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <a
            href="#contact-section"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25]/70 transition-colors"
          >
            Contact
          </a>
          <a
            href="#newsletter-section"
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25]/70 transition-colors"
          >
            Newsletter
          </a>
        </nav>

        {/* Right Action CTA */}
        <div className="flex items-center gap-3">
          {/* Quick Scenario Benchmark Button */}
          <button
            onClick={onOpenDemoScenario}
            title="Run interactive verification of Section 35 Scenario"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#23242e] hover:bg-[#2e3040] text-[#ff9f1c] hover:text-white border border-[#434452]/60 font-mono-code text-xs font-semibold transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-[#ff9f1c]" />
            <span>Scenario Demo</span>
          </button>

          {/* Join Portal CTA */}
          <button
            onClick={onOpenPortal}
            className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff5545] to-[#ff6f5f] text-white font-headline text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(255,85,69,0.35)] hover:shadow-[0_0_28px_rgba(255,85,69,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'Join Portal'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0e15] border-b border-[#2b2c37] px-6 py-4 space-y-3">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-white hover:text-[#ff5545]"
          >
            Home
          </a>
          <a
            href="#council-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#9ba0b4] hover:text-white"
          >
            Council & Leadership
          </a>
          <a
            href="#events-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#9ba0b4] hover:text-white"
          >
            Event Hub & Hackathons
          </a>
          <a
            href="#inventory-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#9ba0b4] hover:text-white"
          >
            Hardware Repository & UI
          </a>
          <div className="pt-2 border-t border-[#2b2c37] flex flex-wrap gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenComponentRequest();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161822] text-xs font-mono-code text-[#00eefc] border border-[#2b2c37]"
            >
              Request Hardware
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddComponent();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161822] text-xs font-mono-code text-[#ff5545] border border-[#2b2c37]"
            >
              Add Components
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoScenario();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161822] text-xs font-mono-code text-[#ff9f1c] border border-[#2b2c37]"
            >
              Run Demo Scenario
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
