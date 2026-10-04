import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { X, Calendar, AlertCircle, Users, Mail, Building, Plus, Trash2 } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
}

export const EventRegistrationModal: React.FC<Props> = ({ isOpen, onClose, event }) => {
  const { registerForEvent, currentUser } = useApp();

  const [teamName, setTeamName] = useState<string>('');
  const [leaderName, setLeaderName] = useState<string>('');
  const [leaderEmail, setLeaderEmail] = useState<string>('');
  const [college, setCollege] = useState<string>('School of Electronics & Computer Science');
  const [teamSize, setTeamSize] = useState<number>(4);
  const [members, setMembers] = useState<string[]>(['', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setLeaderName(currentUser.name);
        setLeaderEmail(currentUser.email);
        setCollege(currentUser.department);
      }
      setTeamSize(4);
      setMembers(['Member 2', 'Member 3', 'Member 4']);
      setErrorMsg(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !event) return null;

  const handleTeamSizeChange = (newSize: number) => {
    const size = Math.max(1, Math.min(6, newSize));
    setTeamSize(size);
    // Adjust members array length (teamSize - 1 additional members)
    const needed = size - 1;
    const current = [...members];
    if (current.length < needed) {
      while (current.length < needed) {
        current.push(`Member ${current.length + 2}`);
      }
    } else {
      current.splice(needed);
    }
    setMembers(current);
  };

  const handleMemberChange = (index: number, val: string) => {
    const copy = [...members];
    copy[index] = val;
    setMembers(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fullMembersList = [leaderName, ...members].filter((m) => m && m.trim().length > 0);

    const res = registerForEvent({
      eventId: event.id,
      teamName,
      leaderName,
      leaderEmail,
      college,
      teamSize: Number(teamSize),
      members: fullMembersList
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to complete registration.');
    }
  };

  const isFull = event.remainingSeats <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#12131a] border border-[#ff5545]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2b2c37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/30 flex items-center justify-center text-[#ff5545]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code font-semibold tracking-widest uppercase text-[#ff5545]">
                OFFICIAL HACKATHON PROTOCOL
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                Team Registration Desk
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

        {/* Event Snapshot */}
        <div className="mt-5 p-4 rounded-xl bg-[#161822] border border-[#2b2c37] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-headline text-sm font-bold text-white">{event.name}</div>
            <div className="text-xs text-[#9ba0b4] mt-0.5 font-mono-code">
              {event.date} • {event.location}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono-code text-[#9ba0b4]">Remaining Seats</div>
              <div className="text-base font-bold font-mono-code text-[#3fdeb7]">
                {event.remainingSeats}{' '}
                <span className="text-xs text-[#9ba0b4]">/ {event.capacity} total</span>
              </div>
            </div>
            <StatusBadge status={event.status} size="sm" />
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/40 text-[#ffb4ab] text-xs flex items-start gap-2.5 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ff5545] mt-0.5" />
            <div>
              <span className="font-bold">Capacity / Validation Error:</span> {errorMsg}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Team Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Cybernetic Vanguard"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                  required
                  disabled={isFull}
                />
                <Users className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Team Size (Max 6)
              </label>
              <select
                value={teamSize}
                onChange={(e) => handleTeamSizeChange(parseInt(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm font-mono-code focus:outline-none focus:border-[#ff5545]"
                disabled={isFull}
              >
                {[1, 2, 3, 4, 5, 6].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz} Cadet{sz > 1 ? 's' : ''} {sz > event.remainingSeats ? '⚠️ (Exceeds remaining)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Lead Cadet Name
              </label>
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="Team Leader Full Name"
                className="w-full px-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                required
                disabled={isFull}
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
                Leader Institutional Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={leaderEmail}
                  onChange={(e) => setLeaderEmail(e.target.value)}
                  placeholder="leader@university.edu"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                  required
                  disabled={isFull}
                />
                <Mail className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase text-[#9ba0b4] mb-1">
              College / Department
            </label>
            <div className="relative">
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Dept of Electronics & Computer Science"
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-sm focus:outline-none focus:border-[#ff5545]"
                required
                disabled={isFull}
              />
              <Building className="w-4 h-4 text-[#9ba0b4] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Additional Team Members */}
          {members.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono-code uppercase text-[#9ba0b4]">
                Cadet Roster Members
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {members.map((member, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={member}
                    onChange={(e) => handleMemberChange(idx, e.target.value)}
                    placeholder={`Cadet Member #${idx + 2} Name`}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0d0e15] border border-[#2b2c37] text-white text-xs focus:outline-none focus:border-[#ff5545]"
                    required
                    disabled={isFull}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2b2c37]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-[#9ba0b4] hover:text-white hover:bg-[#1b1c25] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFull || teamSize > event.remainingSeats}
              className={`px-5 py-2.5 rounded-lg font-headline text-xs font-bold uppercase tracking-wider transition-all ${
                isFull || teamSize > event.remainingSeats
                  ? 'bg-[#242533] text-[#9ba0b4] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#ff5545] to-[#ff6f5f] text-white shadow-[0_0_20px_rgba(255,85,69,0.35)] hover:shadow-[0_0_28px_rgba(255,85,69,0.55)]'
              }`}
            >
              {isFull
                ? 'Registration Closed'
                : teamSize > event.remainingSeats
                ? `Exceeds Capacity (${event.remainingSeats} left)`
                : 'Confirm Team Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
