import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventItem } from '../types';
import { Calendar, MapPin, DollarSign, Users, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Props {
  onRegisterTeam: (event: EventItem) => void;
  onOpenArchive: (event: EventItem) => void;
}

export const EventsSection: React.FC<Props> = ({ onRegisterTeam, onOpenArchive }) => {
  const { events } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'OPEN'>('ALL');

  const mainRobostorm = events.find((e) => e.id === 'event-robostorm-2026') || events[0];
  const aresSampler = events.find((e) => e.id === 'event-ares-sampler') || events[1];

  const otherEvents = events.filter(
    (e) => e.id !== 'event-robostorm-2026' && e.id !== 'event-ares-sampler'
  );

  const filteredOthers = otherEvents.filter((e) => {
    if (filter === 'UPCOMING') return e.type.includes('UPCOMING') || e.type.includes('WORKSHOP');
    if (filter === 'COMPLETED') return e.type.includes('PAST');
    if (filter === 'OPEN') return e.status === 'OPEN';
    return true;
  });

  return (
    <section className="relative w-full max-w-[1240px] mx-auto px-6" id="events-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
        <div>
          <div className="font-mono-code text-xs text-[#ff5545] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>EVENT HUB</span>
          </div>
          <h2 className="font-headline text-2xl text-white font-bold">
            Upcoming Track &amp; Past Triumphs
          </h2>
        </div>
        <span className="font-mono-code text-xs text-[#9ba0b4]">Season 2026 Roadmap</span>
      </div>

      {/* Main Grid: Upcoming Hackathon & Past Highlight (Exact match to Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Upcoming Hackathon (RoboStorm) */}
        {mainRobostorm && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1b1c25] via-[#161822] to-[#0d0e15] border border-[#ff5545]/30 shadow-[0_0_25px_rgba(255,85,69,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono-code text-[11px] bg-[#ff5545]/20 text-[#ff5545] border border-[#ff5545]/30 px-2.5 py-0.5 rounded uppercase font-semibold">
                  {mainRobostorm.type}
                </span>
                <span className="font-mono-code text-xs text-[#3fdeb7] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3fdeb7] animate-pulse" />
                  Starts in 14 Days
                </span>
              </div>

              <h3 className="font-headline text-xl text-white font-bold mb-2">
                {mainRobostorm.name}
              </h3>

              <p className="font-body text-xs sm:text-sm text-[#9ba0b4] leading-relaxed mb-4">
                {mainRobostorm.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-[#9ba0b4] mb-6">
                <div className="flex items-center gap-1 text-[#00eefc]">
                  <MapPin className="w-4 h-4" />
                  <span>{mainRobostorm.location}</span>
                </div>
                {mainRobostorm.prizePool && (
                  <div className="flex items-center gap-1 text-[#ff5545]">
                    <DollarSign className="w-4 h-4" />
                    <span>{mainRobostorm.prizePool}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-[#3fdeb7]">
                  <Users className="w-4 h-4" />
                  <span>
                    {mainRobostorm.remainingSeats} Seats Available ({mainRobostorm.currentRegistrations}/{mainRobostorm.capacity})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#2b2c37]/40">
              <span className="font-mono-code text-xs text-[#9ba0b4]">
                {mainRobostorm.remainingSeats > 0
                  ? `Registration closes in 10 days • ${mainRobostorm.remainingSeats} slots left`
                  : 'Event at capacity'}
              </span>
              <button
                onClick={() => onRegisterTeam(mainRobostorm)}
                disabled={mainRobostorm.status === 'FULL'}
                className={`px-4 py-2 rounded-lg font-headline text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                  mainRobostorm.status === 'FULL'
                    ? 'bg-[#242533] text-[#9ba0b4] cursor-not-allowed'
                    : 'bg-[#ff5545] hover:bg-[#ff3b30] text-white shadow-[0_0_15px_rgba(255,85,69,0.35)] cursor-pointer'
                }`}
              >
                {mainRobostorm.status === 'FULL' ? 'Registration Closed' : 'Register Team'}
              </button>
            </div>
          </div>
        )}

        {/* Card 2: Past Highlight (Ares-IV) */}
        {aresSampler && (
          <div className="p-6 rounded-2xl bg-[#1b1c25]/60 border border-[#2b2c37]/60 backdrop-blur-md flex flex-col justify-between hover:border-[#00eefc]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono-code text-[11px] bg-[#00eefc]/15 text-[#00eefc] border border-[#00eefc]/30 px-2.5 py-0.5 rounded uppercase font-semibold">
                  {aresSampler.type}
                </span>
                <span className="font-mono-code text-xs text-[#00eefc] font-medium">
                  1st Place • Mars Challenge
                </span>
              </div>

              <h3 className="font-headline text-xl text-white font-bold mb-2">
                {aresSampler.name}
              </h3>

              <p className="font-body text-xs sm:text-sm text-[#9ba0b4] leading-relaxed mb-4">
                {aresSampler.description}
              </p>

              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#2b2c37] mb-4 group">
                <img
                  src={aresSampler.imageUrl}
                  alt={aresSampler.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15]/95 via-transparent to-transparent flex items-end p-2.5">
                  <span className="font-mono-code text-[11px] text-white font-medium">
                    National University Mars Symposium 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#2b2c37]/40">
              <span className="font-mono-code text-xs text-[#9ba0b4]">
                Full technical telemetry open-sourced
              </span>
              <button
                onClick={() => onOpenArchive(aresSampler)}
                className="px-3.5 py-1.5 rounded-lg bg-[#242533] hover:bg-[#343647] text-[#00eefc] hover:text-white border border-[#2b2c37] font-mono-code text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Past Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Additional Technical Workshops Row */}
      {otherEvents.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#2b2c37]/40">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-code text-xs uppercase text-[#9ba0b4]">
              Additional Council Seminars &amp; Technical Masterclasses
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl bg-[#161822] border border-[#2b2c37] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono-code text-[#00eefc] uppercase font-bold">
                      {evt.type}
                    </span>
                    <StatusBadge status={evt.status} size="sm" />
                  </div>
                  <h4 className="font-headline text-sm font-bold text-white mb-1">
                    {evt.name}
                  </h4>
                  <p className="font-body text-xs text-[#9ba0b4] line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#2b2c37] flex items-center justify-between text-xs font-mono-code">
                  <span className="text-[#9ba0b4]">
                    {evt.date} • {evt.remainingSeats} seats left
                  </span>
                  <button
                    onClick={() => onRegisterTeam(evt)}
                    disabled={evt.status === 'FULL'}
                    className={`px-3 py-1 rounded text-xs font-headline font-bold uppercase ${
                      evt.status === 'FULL'
                        ? 'bg-[#242533] text-[#9ba0b4] cursor-not-allowed'
                        : 'bg-[#ff5545]/20 hover:bg-[#ff5545] text-[#ff5545] hover:text-white border border-[#ff5545]/30'
                    }`}
                  >
                    {evt.status === 'FULL' ? 'Closed' : 'Register'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
