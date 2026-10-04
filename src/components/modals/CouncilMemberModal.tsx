import React from 'react';
import { CouncilMember } from '../../types';
import { X, Mail, Linkedin, Github, BookOpen, Clock, ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  member: CouncilMember | null;
}

export const CouncilMemberModal: React.FC<Props> = ({ isOpen, onClose, member }) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#12131a] border border-[#00eefc]/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00eefc]/15 border border-[#00eefc]/30 flex items-center justify-center text-[#00eefc]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#00eefc]">
                COUNCIL CADRE DOSSIER
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Executive Leadership Profile
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

        {/* Member Profile Hero */}
        <div className="mt-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start p-5 rounded-xl bg-[#161822] border border-[#2b2c37]">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-24 h-24 rounded-xl object-cover border border-[#434452] shadow-md shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h4 className="font-headline text-lg font-bold text-white">{member.name}</h4>
              <span className="text-[10px] font-mono-code font-semibold bg-[#ff5545]/20 text-[#ff5545] border border-[#ff5545]/30 px-2 py-0.5 rounded">
                {member.badgeRole}
              </span>
            </div>
            <div className="font-mono-code text-xs text-[#00eefc] mt-0.5">
              {member.department}
            </div>
            <p className="font-body text-xs text-[#9ba0b4] mt-2.5 leading-relaxed">
              {member.bio}
            </p>
          </div>
        </div>

        {/* Deep Details */}
        <div className="mt-5 space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0d0e15] border border-[#2b2c37]">
            <div className="font-mono-code text-[10px] uppercase text-[#ff5545] flex items-center gap-1.5 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Core Specialization & Systems</span>
            </div>
            <div className="text-white font-medium">{member.specialization}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0d0e15] border border-[#2b2c37]">
            <div className="font-mono-code text-[10px] uppercase text-[#3fdeb7] flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Council Portfolio & Responsibility</span>
            </div>
            <div className="text-[#9ba0b4] leading-relaxed">{member.responsibility}</div>
          </div>

          {member.publications && (
            <div className="p-3.5 rounded-xl bg-[#0d0e15] border border-[#2b2c37]">
              <div className="font-mono-code text-[10px] uppercase text-[#00eefc] flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Selected Research & Papers</span>
              </div>
              <div className="text-[#e3e1ec] font-mono-code text-[11px]">
                {member.publications}
              </div>
            </div>
          )}

          {member.officeHours && (
            <div className="p-3.5 rounded-xl bg-[#0d0e15] border border-[#2b2c37] flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#ff9f1c] shrink-0" />
              <div>
                <span className="font-mono-code text-[10px] uppercase text-[#9ba0b4] block">
                  Lab Office Hours
                </span>
                <span className="text-white font-mono-code">{member.officeHours}</span>
              </div>
            </div>
          )}
        </div>

        {/* Contact Links */}
        <div className="mt-6 pt-4 border-t border-[#2b2c37] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161822] hover:bg-[#242533] text-xs font-mono-code text-[#00eefc] border border-[#2b2c37] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161822] hover:bg-[#242533] text-xs font-mono-code text-[#9ba0b4] hover:text-white border border-[#2b2c37] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={member.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161822] hover:bg-[#242533] text-xs font-mono-code text-[#9ba0b4] hover:text-white border border-[#2b2c37] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#242533] hover:bg-[#343647] text-white text-xs font-headline uppercase font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
