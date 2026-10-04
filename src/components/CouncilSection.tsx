import React from 'react';
import { useApp } from '../context/AppContext';
import { CouncilMember } from '../types';
import { Shield, ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  onSelectMember: (member: CouncilMember) => void;
  onViewAllMembers: () => void;
}

export const CouncilSection: React.FC<Props> = ({ onSelectMember, onViewAllMembers }) => {
  const { council } = useApp();

  const president = council.find((m) => m.badgeRole === 'PRESIDENT') || council[0];
  const vp = council.find((m) => m.badgeRole === 'VICE PRESIDENT') || council[1];

  return (
    <section className="relative w-full max-w-[1240px] mx-auto px-6" id="council-section">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1b1c25]/30 border border-[#2b2c37]/60 backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6">
          <div>
            <div className="font-mono-code text-xs text-[#00eefc] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>COUNCIL &amp; LEADERSHIP</span>
            </div>
            <h2 className="font-headline text-2xl text-white font-bold">
              Elected Executive Council
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#9ba0b4] mt-1">
              Student leaders guiding hardware procurement, technical workshops, and national symposium delegations.
            </p>
          </div>
          <button
            onClick={onViewAllMembers}
            className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#00eefc] hover:text-white px-3 py-1.5 rounded-lg bg-[#242533] border border-[#2b2c37] transition-colors cursor-pointer"
          >
            <span>View All Council Members</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Prominent Leader Cards (Exact match to Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* President Card */}
          {president && (
            <div
              onClick={() => onSelectMember(president)}
              className="p-5 rounded-xl bg-[#161822] border border-[#2b2c37]/60 flex flex-col sm:flex-row gap-4 items-center sm:items-start hover:border-[#ff5545]/40 transition-all cursor-pointer group"
            >
              <img
                src={president.photoUrl}
                alt={president.name}
                className="w-24 h-24 rounded-lg object-cover border border-[#434452] shrink-0 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col justify-between h-full w-full text-center sm:text-left">
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="font-headline text-base font-bold text-white group-hover:text-[#ffb4aa] transition-colors">
                      {president.name}
                    </span>
                    <span className="font-mono-code text-[10px] bg-[#ff5545]/20 text-[#ff5545] border border-[#ff5545]/30 px-1.5 py-0.5 rounded font-semibold">
                      {president.badgeRole}
                    </span>
                  </div>
                  <div className="font-mono-code text-xs text-[#00eefc] mt-0.5">
                    {president.department}
                  </div>
                  <p className="font-body text-xs text-[#9ba0b4] mt-2 leading-relaxed line-clamp-3">
                    {president.bio}
                  </p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 pt-2 border-t border-[#2b2c37]/40 font-mono-code text-[11px] text-[#9ba0b4]">
                  <span className="hover:text-[#ff5545] transition-colors">LinkedIn</span>
                  <span>•</span>
                  <span className="hover:text-[#ff5545] transition-colors">GitHub</span>
                  <span>•</span>
                  <span className="text-[#3fdeb7]">{president.tag}</span>
                </div>
              </div>
            </div>
          )}

          {/* Vice President Card */}
          {vp && (
            <div
              onClick={() => onSelectMember(vp)}
              className="p-5 rounded-xl bg-[#161822] border border-[#2b2c37]/60 flex flex-col sm:flex-row gap-4 items-center sm:items-start hover:border-[#00eefc]/40 transition-all cursor-pointer group"
            >
              <img
                src={vp.photoUrl}
                alt={vp.name}
                className="w-24 h-24 rounded-lg object-cover border border-[#434452] shrink-0 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col justify-between h-full w-full text-center sm:text-left">
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="font-headline text-base font-bold text-white group-hover:text-[#00eefc] transition-colors">
                      {vp.name}
                    </span>
                    <span className="font-mono-code text-[10px] bg-[#00eefc]/20 text-[#00eefc] border border-[#00eefc]/30 px-1.5 py-0.5 rounded font-semibold">
                      {vp.badgeRole}
                    </span>
                  </div>
                  <div className="font-mono-code text-xs text-[#3fdeb7] mt-0.5">
                    {vp.department}
                  </div>
                  <p className="font-body text-xs text-[#9ba0b4] mt-2 leading-relaxed line-clamp-3">
                    {vp.bio}
                  </p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 pt-2 border-t border-[#2b2c37]/40 font-mono-code text-[11px] text-[#9ba0b4]">
                  <span className="hover:text-[#00eefc] transition-colors">LinkedIn</span>
                  <span>•</span>
                  <span className="hover:text-[#00eefc] transition-colors">IEEE Author</span>
                  <span>•</span>
                  <span className="text-[#00eefc]">{vp.tag}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
