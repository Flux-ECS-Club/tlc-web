import React from 'react';
import { InventoryStatus, EventStatus, RequestStatus, TransactionAction } from '../types';

interface StatusBadgeProps {
  status: InventoryStatus | EventStatus | RequestStatus | TransactionAction | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (status) {
    case 'AVAILABLE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#3fdeb7]/15 text-[#3fdeb7] border border-[#3fdeb7]/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3fdeb7] animate-pulse" />
          Available
        </span>
      );

    case 'LOW_STOCK':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#ff9f1c]/15 text-[#ff9f1c] border border-[#ff9f1c]/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f1c]" />
          Low Stock • Restock Req.
        </span>
      );

    case 'OUT_OF_STOCK':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#ff5545]/15 text-[#ff5545] border border-[#ff5545]/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545]" />
          Out of Stock
        </span>
      );

    case 'OPEN':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#3fdeb7]/15 text-[#3fdeb7] border border-[#3fdeb7]/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3fdeb7]" />
          Open
        </span>
      );

    case 'LIMITED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#ff5545]/15 text-[#ff5545] border border-[#ff5545]/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545] animate-ping" />
          Limited Seats
        </span>
      );

    case 'FULL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#434452]/40 text-[#9ba0b4] border border-[#434452] ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9ba0b4]" />
          Registration Closed
        </span>
      );

    case 'APPROVED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#3fdeb7]/15 text-[#3fdeb7] border border-[#3fdeb7]/30 ${sizeClasses}`}
        >
          Approved
        </span>
      );

    case 'PENDING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#00eefc]/15 text-[#00eefc] border border-[#00eefc]/30 ${sizeClasses}`}
        >
          Pending Audit
        </span>
      );

    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#ff5545]/15 text-[#ff5545] border border-[#ff5545]/30 ${sizeClasses}`}
        >
          Rejected
        </span>
      );

    case 'ISSUED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#ff9f1c]/15 text-[#ff9f1c] border border-[#ff9f1c]/30 ${sizeClasses}`}
        >
          Active Checkout
        </span>
      );

    case 'RETURNED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#3fdeb7]/15 text-[#3fdeb7] border border-[#3fdeb7]/30 ${sizeClasses}`}
        >
          Returned
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono-code font-semibold uppercase rounded-md bg-[#242533] text-[#e3e1ec] border border-[#434452] ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
};
