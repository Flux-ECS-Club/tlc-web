import { InventoryItem, InventoryRequest, EventItem, EventRegistration, InventoryStatus, EventStatus } from '../types';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateRequired = (value: string | undefined | null, fieldName: string): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required.` };
  }
  return { valid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email address is required.' };
  }
  // Standard university / domain email check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Enter a valid institutional email address (e.g., student@university.edu).' };
  }
  return { valid: true };
};

export const validatePositiveInteger = (value: number | string, fieldName: string): ValidationResult => {
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num) || !Number.isInteger(num)) {
    return { valid: false, error: `${fieldName} must be an integer.` };
  }
  if (num <= 0) {
    return { valid: false, error: `${fieldName} must be greater than 0.` };
  }
  return { valid: true };
};

export const validateNonNegativeInteger = (value: number | string, fieldName: string): ValidationResult => {
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num) || !Number.isInteger(num)) {
    return { valid: false, error: `${fieldName} must be an integer.` };
  }
  if (num < 0) {
    return { valid: false, error: `${fieldName} cannot be negative.` };
  }
  return { valid: true };
};

export const validateStudentId = (studentId: string): ValidationResult => {
  if (!studentId || !studentId.trim()) {
    return { valid: false, error: 'Student ID is required.' };
  }
  const clean = studentId.trim();
  if (clean.length < 4) {
    return { valid: false, error: 'Student ID must be at least 4 characters long.' };
  }
  return { valid: true };
};

export const validateDate = (dateStr: string, fieldName: string): ValidationResult => {
  if (!dateStr || !dateStr.trim()) {
    return { valid: false, error: `${fieldName} is required.` };
  }
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: `${fieldName} is not a valid date format.` };
  }
  return { valid: true };
};

export const validateReturnDate = (requiredDate: string, returnDate: string): ValidationResult => {
  const req = new Date(requiredDate);
  const ret = new Date(returnDate);
  if (isNaN(req.getTime()) || isNaN(ret.getTime())) {
    return { valid: false, error: 'Both required date and return date must be valid dates.' };
  }
  if (ret <= req) {
    return { valid: false, error: 'Return date must be strictly after the required issue date.' };
  }
  return { valid: true };
};

export const calculateInventoryStatus = (availableQuantity: number, minimumStock: number): InventoryStatus => {
  if (availableQuantity <= 0) {
    return 'OUT_OF_STOCK';
  }
  if (availableQuantity <= minimumStock) {
    return 'LOW_STOCK';
  }
  return 'AVAILABLE';
};

export const calculateEventStatus = (capacity: number, currentRegistrations: number): EventStatus => {
  const remaining = capacity - currentRegistrations;
  if (remaining <= 0) {
    return 'FULL';
  }
  if (remaining <= 5) {
    return 'LIMITED';
  }
  return 'OPEN';
};

export const validateInventoryAvailability = (
  requestedQty: number,
  item: InventoryItem
): ValidationResult => {
  if (!item) {
    return { valid: false, error: 'Component does not exist in inventory records.' };
  }

  // Calculate actual current available stock: total - reserved - issued
  const calculatedAvailable = item.totalQuantity - item.reservedQuantity - item.issuedQuantity;

  if (calculatedAvailable <= 0) {
    return {
      valid: false,
      error: `Request unavailable. ${item.name} is currently out of stock.`
    };
  }

  if (requestedQty > calculatedAvailable) {
    return {
      valid: false,
      error: `Request unavailable. Only ${calculatedAvailable} ${item.name}${calculatedAvailable === 1 ? '' : 's'} ${calculatedAvailable === 1 ? 'is' : 'are'} currently available.`
    };
  }

  return { valid: true };
};

export const validateDuplicateActiveComponentRequest = (
  email: string,
  componentId: string,
  existingRequests: InventoryRequest[]
): ValidationResult => {
  const duplicate = existingRequests.find(
    req =>
      req.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      req.componentId === componentId &&
      (req.status === 'PENDING' || req.status === 'APPROVED' || req.status === 'ISSUED')
  );

  if (duplicate) {
    return {
      valid: false,
      error: `You already have an active requisition (${duplicate.status}) for this component.`
    };
  }

  return { valid: true };
};

export const validateDuplicateInventoryItem = (
  name: string,
  items: InventoryItem[],
  excludeId?: string
): ValidationResult => {
  const normalized = name.trim().toLowerCase();
  const exists = items.some(
    i => i.name.trim().toLowerCase() === normalized && i.id !== excludeId
  );
  if (exists) {
    return {
      valid: false,
      error: `A component with the name "${name.trim()}" already exists in the catalog.`
    };
  }
  return { valid: true };
};

export const validateReturnQuantity = (
  returnQty: number,
  issuedQty: number
): ValidationResult => {
  if (returnQty <= 0) {
    return { valid: false, error: 'Return quantity must be greater than 0.' };
  }
  if (returnQty > issuedQty) {
    return {
      valid: false,
      error: `Returned quantity (${returnQty}) cannot exceed currently issued quantity (${issuedQty}).`
    };
  }
  return { valid: true };
};

export const validateEventCapacity = (
  requestedTeamSize: number,
  event: EventItem
): ValidationResult => {
  if (!event) {
    return { valid: false, error: 'Event record not found.' };
  }

  const remaining = event.capacity - event.currentRegistrations;

  if (remaining <= 0) {
    return {
      valid: false,
      error: 'This event has reached maximum capacity. Registration is closed.'
    };
  }

  if (requestedTeamSize > remaining) {
    return {
      valid: false,
      error: `Registration unavailable — only ${remaining} seat${remaining === 1 ? '' : 's'} remain.`
    };
  }

  return { valid: true };
};

export const validateDuplicateEventRegistration = (
  email: string,
  teamName: string,
  eventId: string,
  existing: EventRegistration[]
): ValidationResult => {
  const emailDuplicate = existing.some(
    r => r.eventId === eventId && r.leaderEmail.trim().toLowerCase() === email.trim().toLowerCase()
  );
  if (emailDuplicate) {
    return {
      valid: false,
      error: 'A team has already been registered for this event with this email address.'
    };
  }

  const teamDuplicate = existing.some(
    r => r.eventId === eventId && r.teamName.trim().toLowerCase() === teamName.trim().toLowerCase()
  );
  if (teamDuplicate) {
    return {
      valid: false,
      error: `Team name "${teamName}" is already registered for this event. Please choose a unique name.`
    };
  }

  return { valid: true };
};

export const validateInventoryConsistency = (item: InventoryItem): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (item.totalQuantity < 0) errors.push('Total quantity cannot be negative.');
  if (item.reservedQuantity < 0) errors.push('Reserved quantity cannot be negative.');
  if (item.issuedQuantity < 0) errors.push('Issued quantity cannot be negative.');
  if (item.availableQuantity < 0) errors.push('Available quantity cannot be negative.');

  if (item.reservedQuantity + item.issuedQuantity > item.totalQuantity) {
    errors.push('Sum of reserved and issued quantities cannot exceed total quantity.');
  }

  const expectedAvailable = item.totalQuantity - item.reservedQuantity - item.issuedQuantity;
  if (item.availableQuantity !== expectedAvailable) {
    errors.push(
      `Available quantity mismatch: stored ${item.availableQuantity}, expected ${expectedAvailable}.`
    );
  }

  const expectedStatus = calculateInventoryStatus(item.availableQuantity, item.minimumStock);
  if (item.status !== expectedStatus) {
    errors.push(`Status mismatch: stored ${item.status}, expected ${expectedStatus}.`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
