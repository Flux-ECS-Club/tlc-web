import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  InventoryItem,
  InventoryRequest,
  HardwareTransaction,
  EventItem,
  EventRegistration,
  CouncilMember,
  User,
  ContactMessage,
  NewsletterSubscriber,
  ToastNotification,
  ToastType
} from '../types';
import {
  loadData,
  saveData,
  STORAGE_KEYS,
  INITIAL_INVENTORY,
  INITIAL_REQUESTS,
  INITIAL_TRANSACTIONS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_COUNCIL,
  INITIAL_USERS
} from '../utils/storage';
import {
  validateRequired,
  validateEmail,
  validatePositiveInteger,
  validateNonNegativeInteger,
  validateStudentId,
  validateDate,
  validateReturnDate,
  validateInventoryAvailability,
  validateDuplicateActiveComponentRequest,
  validateDuplicateInventoryItem,
  validateReturnQuantity,
  validateEventCapacity,
  validateDuplicateEventRegistration,
  validateInventoryConsistency,
  calculateInventoryStatus,
  calculateEventStatus
} from '../utils/validation';

interface ComponentRequestInput {
  studentName: string;
  studentId: string;
  email: string;
  componentId: string;
  quantity: number;
  purpose: string;
  project: string;
  requiredDate: string;
  returnDate: string;
}

interface AddComponentInput {
  name: string;
  category: InventoryItem['category'];
  quantity: number;
  minimumStock: number;
  location: string;
  description: string;
  partNumber?: string;
  specs?: string;
}

interface EventRegistrationInput {
  eventId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  teamSize: number;
  members: string[];
}

interface AppContextType {
  inventory: InventoryItem[];
  requests: InventoryRequest[];
  transactions: HardwareTransaction[];
  events: EventItem[];
  registrations: EventRegistration[];
  council: CouncilMember[];
  users: User[];
  currentUser: User | null;
  messages: ContactMessage[];
  subscribers: NewsletterSubscriber[];
  toasts: ToastNotification[];
  addToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Actions
  requestComponent: (input: ComponentRequestInput) => { success: boolean; error?: string };
  addComponent: (input: AddComponentInput) => { success: boolean; error?: string };
  issueHardware: (
    componentId: string,
    quantity: number,
    studentName: string,
    studentId: string,
    notes?: string,
    requestId?: string
  ) => { success: boolean; error?: string };
  returnHardware: (
    componentId: string,
    quantity: number,
    studentName: string,
    studentId: string,
    notes?: string,
    requestId?: string
  ) => { success: boolean; error?: string };
  registerForEvent: (input: EventRegistrationInput) => { success: boolean; error?: string };
  registerUser: (input: Omit<User, 'id' | 'registeredAt'>) => { success: boolean; error?: string };
  loginUser: (user: User) => void;
  logoutUser: () => void;
  subscribeNewsletter: (email: string) => { success: boolean; error?: string };
  sendContactMessage: (input: Omit<ContactMessage, 'id' | 'submittedAt'>) => { success: boolean; error?: string };
  
  // Demo helper
  resetToInitialDemoData: () => void;
  runDemoScenarioStep: (stepNumber: 1 | 2 | 3) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from local storage or fallback to defaults
  const [inventory, setInventory] = useState<InventoryItem[]>(() =>
    loadData(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY)
  );
  const [requests, setRequests] = useState<InventoryRequest[]>(() =>
    loadData(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS)
  );
  const [transactions, setTransactions] = useState<HardwareTransaction[]>(() =>
    loadData(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
  );
  const [events, setEvents] = useState<EventItem[]>(() =>
    loadData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS)
  );
  const [registrations, setRegistrations] = useState<EventRegistration[]>(() =>
    loadData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS)
  );
  const [council] = useState<CouncilMember[]>(() =>
    loadData(STORAGE_KEYS.COUNCIL, INITIAL_COUNCIL)
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadData(STORAGE_KEYS.USERS, INITIAL_USERS)
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadData(STORAGE_KEYS.CURRENT_USER, null)
  );
  const [messages, setMessages] = useState<ContactMessage[]>(() =>
    loadData(STORAGE_KEYS.MESSAGES, [])
  );
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() =>
    loadData(STORAGE_KEYS.SUBSCRIBERS, [])
  );
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Toast dispatch
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastNotification = { id, type, title, message };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  // Sync to local storage
  useEffect(() => {
    saveData(STORAGE_KEYS.INVENTORY, inventory);
  }, [inventory]);

  useEffect(() => {
    saveData(STORAGE_KEYS.REQUESTS, requests);
  }, [requests]);

  useEffect(() => {
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);

  useEffect(() => {
    saveData(STORAGE_KEYS.EVENTS, events);
  }, [events]);

  useEffect(() => {
    saveData(STORAGE_KEYS.REGISTRATIONS, registrations);
  }, [registrations]);

  useEffect(() => {
    saveData(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    saveData(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveData(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    saveData(STORAGE_KEYS.SUBSCRIBERS, subscribers);
  }, [subscribers]);

  // Request Component Workflow (Section 14 & 15)
  const requestComponent = useCallback(
    (input: ComponentRequestInput): { success: boolean; error?: string } => {
      // 1. Validation
      const vName = validateRequired(input.studentName, 'Student name');
      if (!vName.valid) return { success: false, error: vName.error };

      const vStudentId = validateStudentId(input.studentId);
      if (!vStudentId.valid) return { success: false, error: vStudentId.error };

      const vEmail = validateEmail(input.email);
      if (!vEmail.valid) return { success: false, error: vEmail.error };

      const vQty = validatePositiveInteger(input.quantity, 'Requested quantity');
      if (!vQty.valid) return { success: false, error: vQty.error };

      const vPurpose = validateRequired(input.purpose, 'Requisition purpose');
      if (!vPurpose.valid) return { success: false, error: vPurpose.error };

      const vReqDate = validateDate(input.requiredDate, 'Required date');
      if (!vReqDate.valid) return { success: false, error: vReqDate.error };

      const vRetDate = validateDate(input.returnDate, 'Return date');
      if (!vRetDate.valid) return { success: false, error: vRetDate.error };

      const vDates = validateReturnDate(input.requiredDate, input.returnDate);
      if (!vDates.valid) return { success: false, error: vDates.error };

      // 2. Find Item
      const targetItem = inventory.find((i) => i.id === input.componentId);
      if (!targetItem) {
        return { success: false, error: 'Selected component could not be found in laboratory inventory.' };
      }

      // 3. Duplicate check for active request
      const vDuplicate = validateDuplicateActiveComponentRequest(input.email, input.componentId, requests);
      if (!vDuplicate.valid) {
        addToast('warning', 'Active Requisition Exists', vDuplicate.error || 'Duplicate requisition.');
        return { success: false, error: vDuplicate.error };
      }

      // 4. Availability Check (CRITICAL: Do NOT allow negative inventory)
      const vAvail = validateInventoryAvailability(input.quantity, targetItem);
      if (!vAvail.valid) {
        addToast('error', 'Request Unavailable', vAvail.error || 'Insufficient stock.');
        return { success: false, error: vAvail.error };
      }

      // 5. Business Logic: Update item reservation & calculate remaining stock
      const newReserved = targetItem.reservedQuantity + input.quantity;
      const newAvailable = targetItem.totalQuantity - newReserved - targetItem.issuedQuantity;
      const newStatus = calculateInventoryStatus(newAvailable, targetItem.minimumStock);

      const updatedItem: InventoryItem = {
        ...targetItem,
        reservedQuantity: newReserved,
        availableQuantity: newAvailable,
        status: newStatus
      };

      // 6. Consistency check
      const consistency = validateInventoryConsistency(updatedItem);
      if (!consistency.valid) {
        addToast('error', 'Inventory Synchronization Error', consistency.errors.join('; '));
        return { success: false, error: 'Inventory synchronization error.' };
      }

      // 7. Create Request Record
      const newRequest: InventoryRequest = {
        id: `REQ-${Date.now().toString().slice(-6)}`,
        studentName: input.studentName.trim(),
        studentId: input.studentId.trim(),
        email: input.email.trim(),
        componentId: targetItem.id,
        componentName: targetItem.name,
        quantity: input.quantity,
        purpose: input.purpose.trim(),
        project: input.project.trim() || 'General Lab Work',
        requiredDate: input.requiredDate,
        returnDate: input.returnDate,
        requestedAt: new Date().toISOString(),
        status: 'APPROVED'
      };

      // 8. Create Transaction Log
      const newTxn: HardwareTransaction = {
        id: `TXN-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString(),
        user: input.studentName.trim(),
        studentId: input.studentId.trim(),
        componentId: targetItem.id,
        componentName: targetItem.name,
        quantity: input.quantity,
        action: 'RESERVATION',
        status: 'COMPLETED',
        notes: `Requisition approved for project: ${input.project || 'Lab Study'}`
      };

      // 9. Update state & storage
      setInventory((prev) => prev.map((item) => (item.id === targetItem.id ? updatedItem : item)));
      setRequests((prev) => [newRequest, ...prev]);
      setTransactions((prev) => [newTxn, ...prev]);

      addToast(
        'success',
        'Requisition Approved',
        `Reserved ${input.quantity}x ${targetItem.name}. Available balance is now ${newAvailable} unit(s).`
      );

      return { success: true };
    },
    [inventory, requests, addToast]
  );

  // Add Component / Admin Ingestion Flow (Section 17)
  const addComponent = useCallback(
    (input: AddComponentInput): { success: boolean; error?: string } => {
      const vName = validateRequired(input.name, 'Component name');
      if (!vName.valid) return { success: false, error: vName.error };

      const vQty = validatePositiveInteger(input.quantity, 'Quantity');
      if (!vQty.valid) return { success: false, error: vQty.error };

      const vMin = validateNonNegativeInteger(input.minimumStock, 'Minimum stock');
      if (!vMin.valid) return { success: false, error: vMin.error };

      const existingIndex = inventory.findIndex(
        (i) => i.name.trim().toLowerCase() === input.name.trim().toLowerCase()
      );

      if (existingIndex >= 0) {
        // Increment existing stock
        const existing = inventory[existingIndex];
        const newTotal = existing.totalQuantity + input.quantity;
        const newAvailable = newTotal - existing.reservedQuantity - existing.issuedQuantity;
        const newStatus = calculateInventoryStatus(newAvailable, input.minimumStock ?? existing.minimumStock);

        const updated: InventoryItem = {
          ...existing,
          totalQuantity: newTotal,
          availableQuantity: newAvailable,
          minimumStock: input.minimumStock,
          location: input.location.trim() || existing.location,
          description: input.description.trim() || existing.description,
          status: newStatus
        };

        const consistency = validateInventoryConsistency(updated);
        if (!consistency.valid) {
          addToast('error', 'Inventory Synchronization Error', consistency.errors.join('; '));
          return { success: false, error: 'Inventory synchronization error.' };
        }

        const newTxn: HardwareTransaction = {
          id: `TXN-${Date.now().toString().slice(-5)}`,
          date: new Date().toISOString(),
          user: currentUser?.name || 'Lab Administrator',
          studentId: currentUser?.studentId || 'ADMIN-01',
          componentId: existing.id,
          componentName: existing.name,
          quantity: input.quantity,
          action: 'RESTOCK',
          status: 'COMPLETED',
          notes: `Ingested ${input.quantity} units to bin location.`
        };

        setInventory((prev) => prev.map((item, idx) => (idx === existingIndex ? updated : item)));
        setTransactions((prev) => [newTxn, ...prev]);

        addToast(
          'success',
          'Inventory Restocked',
          `Added ${input.quantity} units to ${existing.name}. Total stock is now ${newTotal} (Available: ${newAvailable}).`
        );
        return { success: true };
      }

      // Add fresh component
      const available = input.quantity;
      const status = calculateInventoryStatus(available, input.minimumStock);

      const newItem: InventoryItem = {
        id: `item-${Date.now().toString().slice(-6)}`,
        name: input.name.trim(),
        category: input.category,
        totalQuantity: input.quantity,
        reservedQuantity: 0,
        issuedQuantity: 0,
        availableQuantity: available,
        minimumStock: input.minimumStock,
        status,
        location: input.location.trim() || 'General Intake Bin',
        description: input.description.trim() || 'Lab component asset',
        partNumber: input.partNumber?.trim(),
        specs: input.specs?.trim()
      };

      const consistency = validateInventoryConsistency(newItem);
      if (!consistency.valid) {
        addToast('error', 'Inventory Synchronization Error', consistency.errors.join('; '));
        return { success: false, error: 'Inventory synchronization error.' };
      }

      const newTxn: HardwareTransaction = {
        id: `TXN-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString(),
        user: currentUser?.name || 'Lab Administrator',
        studentId: currentUser?.studentId || 'ADMIN-01',
        componentId: newItem.id,
        componentName: newItem.name,
        quantity: input.quantity,
        action: 'RESTOCK',
        status: 'COMPLETED',
        notes: 'Initial catalog registration.'
      };

      setInventory((prev) => [newItem, ...prev]);
      setTransactions((prev) => [newTxn, ...prev]);

      addToast('success', 'Component Cataloged', `Successfully added ${newItem.name} (${newItem.totalQuantity} units).`);
      return { success: true };
    },
    [inventory, currentUser, addToast]
  );

  // Issue Hardware (Section 19)
  const issueHardware = useCallback(
    (
      componentId: string,
      quantity: number,
      studentName: string,
      studentId: string,
      notes?: string,
      requestId?: string
    ): { success: boolean; error?: string } => {
      const targetItem = inventory.find((i) => i.id === componentId);
      if (!targetItem) {
        return { success: false, error: 'Component not found.' };
      }

      const vQty = validatePositiveInteger(quantity, 'Issue quantity');
      if (!vQty.valid) return { success: false, error: vQty.error };

      let updatedItem: InventoryItem;

      if (requestId) {
        const req = requests.find((r) => r.id === requestId);
        if (!req) return { success: false, error: 'Associated requisition not found.' };

        // Convert reserved to issued
        const deductReserved = Math.min(targetItem.reservedQuantity, quantity);
        const newReserved = targetItem.reservedQuantity - deductReserved;
        const newIssued = targetItem.issuedQuantity + quantity;
        const newAvailable = targetItem.totalQuantity - newReserved - newIssued;
        const newStatus = calculateInventoryStatus(newAvailable, targetItem.minimumStock);

        updatedItem = {
          ...targetItem,
          reservedQuantity: newReserved,
          issuedQuantity: newIssued,
          availableQuantity: newAvailable,
          status: newStatus
        };

        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: 'ISSUED' } : r))
        );
      } else {
        // Direct checkout from available
        if (quantity > targetItem.availableQuantity) {
          return {
            success: false,
            error: `Cannot issue ${quantity} units. Only ${targetItem.availableQuantity} available.`
          };
        }

        const newIssued = targetItem.issuedQuantity + quantity;
        const newAvailable = targetItem.totalQuantity - targetItem.reservedQuantity - newIssued;
        const newStatus = calculateInventoryStatus(newAvailable, targetItem.minimumStock);

        updatedItem = {
          ...targetItem,
          issuedQuantity: newIssued,
          availableQuantity: newAvailable,
          status: newStatus
        };
      }

      const consistency = validateInventoryConsistency(updatedItem);
      if (!consistency.valid) {
        addToast('error', 'Inventory Inconsistency', consistency.errors.join('; '));
        return { success: false, error: 'Inventory consistency violation.' };
      }

      const newTxn: HardwareTransaction = {
        id: `TXN-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString(),
        user: studentName,
        studentId: studentId,
        componentId: targetItem.id,
        componentName: targetItem.name,
        quantity,
        action: 'ISSUE',
        status: 'COMPLETED',
        notes: notes || 'Hardware signed out for lab session.'
      };

      setInventory((prev) => prev.map((item) => (item.id === targetItem.id ? updatedItem : item)));
      setTransactions((prev) => [newTxn, ...prev]);

      addToast(
        'success',
        'Hardware Signed Out',
        `Dispatched ${quantity}x ${targetItem.name} to ${studentName}.`
      );

      return { success: true };
    },
    [inventory, requests, addToast]
  );

  // Return Hardware (Section 19)
  const returnHardware = useCallback(
    (
      componentId: string,
      quantity: number,
      studentName: string,
      studentId: string,
      notes?: string,
      requestId?: string
    ): { success: boolean; error?: string } => {
      const targetItem = inventory.find((i) => i.id === componentId);
      if (!targetItem) {
        return { success: false, error: 'Component record not found.' };
      }

      const vReturn = validateReturnQuantity(quantity, targetItem.issuedQuantity);
      if (!vReturn.valid) {
        addToast('error', 'Return Verification Failed', vReturn.error || 'Invalid return quantity.');
        return { success: false, error: vReturn.error };
      }

      const newIssued = targetItem.issuedQuantity - quantity;
      const newAvailable = targetItem.totalQuantity - targetItem.reservedQuantity - newIssued;
      const newStatus = calculateInventoryStatus(newAvailable, targetItem.minimumStock);

      const updatedItem: InventoryItem = {
        ...targetItem,
        issuedQuantity: newIssued,
        availableQuantity: newAvailable,
        status: newStatus
      };

      const consistency = validateInventoryConsistency(updatedItem);
      if (!consistency.valid) {
        addToast('error', 'Inventory Inconsistency', consistency.errors.join('; '));
        return { success: false, error: 'Inventory consistency violation.' };
      }

      if (requestId) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: 'RETURNED' } : r))
        );
      }

      const newTxn: HardwareTransaction = {
        id: `TXN-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString(),
        user: studentName,
        studentId: studentId,
        componentId: targetItem.id,
        componentName: targetItem.name,
        quantity,
        action: 'RETURN',
        status: 'COMPLETED',
        notes: notes || 'Hardware checked in, diagnostic inspection passed.'
      };

      setInventory((prev) => prev.map((item) => (item.id === targetItem.id ? updatedItem : item)));
      setTransactions((prev) => [newTxn, ...prev]);

      addToast(
        'success',
        'Hardware Returned',
        `Returned ${quantity}x ${targetItem.name}. Stock restored to ${newAvailable} available.`
      );

      return { success: true };
    },
    [inventory, addToast]
  );

  // Event Registration (Section 10 & 28)
  const registerForEvent = useCallback(
    (input: EventRegistrationInput): { success: boolean; error?: string } => {
      const targetEvent = events.find((e) => e.id === input.eventId);
      if (!targetEvent) {
        return { success: false, error: 'Event record not found.' };
      }

      const vTeam = validateRequired(input.teamName, 'Team name');
      if (!vTeam.valid) return { success: false, error: vTeam.error };

      const vLeader = validateRequired(input.leaderName, 'Team leader name');
      if (!vLeader.valid) return { success: false, error: vLeader.error };

      const vEmail = validateEmail(input.leaderEmail);
      if (!vEmail.valid) return { success: false, error: vEmail.error };

      const vCollege = validateRequired(input.college, 'College / Department');
      if (!vCollege.valid) return { success: false, error: vCollege.error };

      const vSize = validatePositiveInteger(input.teamSize, 'Team size');
      if (!vSize.valid) return { success: false, error: vSize.error };

      if (input.teamSize > 6) {
        return { success: false, error: 'Maximum allowed team size is 6 members.' };
      }

      // 1. Capacity validation
      const vCapacity = validateEventCapacity(input.teamSize, targetEvent);
      if (!vCapacity.valid) {
        addToast('error', 'Registration Unavailable', vCapacity.error || 'Capacity exceeded.');
        return { success: false, error: vCapacity.error };
      }

      // 2. Duplicate registration check
      const vDuplicate = validateDuplicateEventRegistration(
        input.leaderEmail,
        input.teamName,
        input.eventId,
        registrations
      );
      if (!vDuplicate.valid) {
        addToast('warning', 'Duplicate Registration', vDuplicate.error || 'Already registered.');
        return { success: false, error: vDuplicate.error };
      }

      // 3. State update
      const newRegistrationsCount = targetEvent.currentRegistrations + input.teamSize;
      const newRemainingSeats = targetEvent.capacity - newRegistrationsCount;
      const newStatus = calculateEventStatus(targetEvent.capacity, newRegistrationsCount);

      const updatedEvent: EventItem = {
        ...targetEvent,
        currentRegistrations: newRegistrationsCount,
        remainingSeats: newRemainingSeats,
        status: newStatus
      };

      const newRegistration: EventRegistration = {
        id: `REG-${Date.now().toString().slice(-5)}`,
        eventId: targetEvent.id,
        eventName: targetEvent.name,
        teamName: input.teamName.trim(),
        leaderName: input.leaderName.trim(),
        leaderEmail: input.leaderEmail.trim(),
        college: input.college.trim(),
        teamSize: input.teamSize,
        members: input.members.filter((m) => m && m.trim().length > 0),
        registeredAt: new Date().toISOString()
      };

      setEvents((prev) => prev.map((e) => (e.id === targetEvent.id ? updatedEvent : e)));
      setRegistrations((prev) => [newRegistration, ...prev]);

      addToast(
        'success',
        'Team Registered Successfully',
        `Team "${input.teamName}" registered with ${input.teamSize} member(s). Remaining seats: ${newRemainingSeats}.`
      );

      return { success: true };
    },
    [events, registrations, addToast]
  );

  // User Join Portal
  const registerUser = useCallback(
    (input: Omit<User, 'id' | 'registeredAt'>): { success: boolean; error?: string } => {
      const vName = validateRequired(input.name, 'Full name');
      if (!vName.valid) return { success: false, error: vName.error };

      const vEmail = validateEmail(input.email);
      if (!vEmail.valid) return { success: false, error: vEmail.error };

      const vStudentId = validateStudentId(input.studentId);
      if (!vStudentId.valid) return { success: false, error: vStudentId.error };

      const vDept = validateRequired(input.department, 'Department');
      if (!vDept.valid) return { success: false, error: vDept.error };

      const vYear = validateRequired(input.year, 'Year of study');
      if (!vYear.valid) return { success: false, error: vYear.error };

      const duplicate = users.find(
        (u) =>
          u.email.toLowerCase() === input.email.toLowerCase() ||
          u.studentId.toLowerCase() === input.studentId.toLowerCase()
      );

      if (duplicate) {
        // Log in the existing user
        setCurrentUser(duplicate);
        addToast('info', 'Cadet Portal Reconnected', `Welcome back, ${duplicate.name}. Session authenticated.`);
        return { success: true };
      }

      const newUser: User = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: input.name.trim(),
        email: input.email.trim(),
        studentId: input.studentId.trim().toUpperCase(),
        department: input.department.trim(),
        year: input.year.trim(),
        registeredAt: new Date().toISOString()
      };

      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);

      addToast('success', 'Portal Access Initialized', `Welcome to the Guild, Cadet ${newUser.name}. Hardware requisition clearance granted.`);
      return { success: true };
    },
    [users, addToast]
  );

  const loginUser = useCallback((user: User) => {
    setCurrentUser(user);
    addToast('info', 'Session Authenticated', `Signed in as ${user.name} (${user.studentId}).`);
  }, [addToast]);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    addToast('info', 'Session Ended', 'Logged out of Cadet Portal.');
  }, [addToast]);

  // Newsletter
  const subscribeNewsletter = useCallback(
    (email: string): { success: boolean; error?: string } => {
      const vEmail = validateEmail(email);
      if (!vEmail.valid) return { success: false, error: vEmail.error };

      const exists = subscribers.some(
        (s) => s.email.trim().toLowerCase() === email.trim().toLowerCase()
      );
      if (exists) {
        addToast('info', 'Already Synchronized', "You're already connected to the telemetry loop.");
        return { success: true };
      }

      const newSub: NewsletterSubscriber = {
        id: `SUB-${Date.now().toString().slice(-4)}`,
        email: email.trim(),
        subscribedAt: new Date().toISOString()
      };

      setSubscribers((prev) => [newSub, ...prev]);
      addToast('success', 'Telemetry Loop Connected', "You're connected to the telemetry loop. Firmware & event dispatches will stream to your inbox.");
      return { success: true };
    },
    [subscribers, addToast]
  );

  // Contact
  const sendContactMessage = useCallback(
    (input: Omit<ContactMessage, 'id' | 'submittedAt'>): { success: boolean; error?: string } => {
      const vName = validateRequired(input.name, 'Name');
      if (!vName.valid) return { success: false, error: vName.error };

      const vEmail = validateEmail(input.email);
      if (!vEmail.valid) return { success: false, error: vEmail.error };

      const vCategory = validateRequired(input.category, 'Assistance category');
      if (!vCategory.valid) return { success: false, error: vCategory.error };

      const vMsg = validateRequired(input.message, 'Message');
      if (!vMsg.valid) return { success: false, error: vMsg.error };

      const newMsg: ContactMessage = {
        id: `MSG-${Date.now().toString().slice(-4)}`,
        name: input.name.trim(),
        email: input.email.trim(),
        category: input.category.trim(),
        message: input.message.trim(),
        submittedAt: new Date().toISOString()
      };

      setMessages((prev) => [newMsg, ...prev]);
      addToast('success', 'Dispatch Transmitted', 'Your query has been logged to Lab Hub. A council officer will reply within 24 hours.');
      return { success: true };
    },
    [addToast]
  );

  // Reset to initial demo data
  const resetToInitialDemoData = useCallback(() => {
    setInventory(INITIAL_INVENTORY);
    setRequests(INITIAL_REQUESTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setEvents(INITIAL_EVENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setMessages([]);
    setSubscribers([]);

    saveData(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    saveData(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    saveData(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    saveData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    saveData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    saveData(STORAGE_KEYS.USERS, INITIAL_USERS);
    saveData(STORAGE_KEYS.CURRENT_USER, null);
    saveData(STORAGE_KEYS.MESSAGES, []);
    saveData(STORAGE_KEYS.SUBSCRIBERS, []);

    addToast('info', 'Demo State Restored', 'All laboratory inventory, events, and registers reset to default initial state.');
  }, [addToast]);

  // Demo scenario runner from Section 35 of prompt
  const runDemoScenarioStep = useCallback(
    (stepNumber: 1 | 2 | 3): { success: boolean; message: string } => {
      if (stepNumber === 1) {
        // Step 1: User requests ESP32 x 4
        // Initial inventory has ESP32: Total=10, Reserved=2, Issued=3, Available=5.
        // Requesting 4: 4 <= 5 -> Approved!
        // New: Reserved=6, Issued=3, Available=1. Status=LOW_STOCK (minStock is 3)
        const res = requestComponent({
          studentName: 'Rohan Sharma',
          studentId: 'ECS-2025-014',
          email: 'rohan.s@university.edu',
          componentId: 'esp32-001',
          quantity: 4,
          purpose: 'Quad-wheel kinematics telemetry benchmark',
          project: 'Autonomous Rover v2',
          requiredDate: '2026-10-10',
          returnDate: '2026-11-10'
        });
        if (res.success) {
          return {
            success: true,
            message: 'Scenario Step 1 complete: Requested 4 ESP32 boards. Available stock is now 1 (LOW STOCK).'
          };
        }
        return { success: false, message: res.error || 'Failed Step 1' };
      } else if (stepNumber === 2) {
        // Step 2: Another user requests ESP32 x 2
        // System checks 2 > 1 -> Rejection!
        const res = requestComponent({
          studentName: 'Aarav Gupta',
          studentId: 'ECS-2025-099',
          email: 'aarav.g@university.edu',
          componentId: 'esp32-001',
          quantity: 2,
          purpose: 'Swarm drone optical sensor node',
          project: 'Micro-Swarm Flight',
          requiredDate: '2026-10-12',
          returnDate: '2026-11-12'
        });
        if (!res.success) {
          return {
            success: true,
            message: `Scenario Step 2 verified: Request rejected as expected (${res.error}). Inventory remained safe and unchanged.`
          };
        }
        return { success: false, message: 'Step 2 failed: request should have been rejected!' };
      } else {
        // Step 3: Admin adds 10 ESP32 boards
        // System updates: Total = 20, Reserved = 6, Issued = 3, Available = 11. Status = AVAILABLE.
        const res = addComponent({
          name: 'ESP32 Dev Board',
          category: 'Microcontroller',
          quantity: 10,
          minimumStock: 3,
          location: 'Cabinet A-01, Tray 3',
          description: 'Dual-core Xtensa 32-bit LX6 @ 240MHz'
        });
        if (res.success) {
          return {
            success: true,
            message: 'Scenario Step 3 complete: Added 10 ESP32 boards. Total = 20, Available = 11, Status = AVAILABLE.'
          };
        }
        return { success: false, message: res.error || 'Failed Step 3' };
      }
    },
    [requestComponent, addComponent]
  );

  return (
    <AppContext.Provider
      value={{
        inventory,
        requests,
        transactions,
        events,
        registrations,
        council,
        users,
        currentUser,
        messages,
        subscribers,
        toasts,
        addToast,
        removeToast,
        requestComponent,
        addComponent,
        issueHardware,
        returnHardware,
        registerForEvent,
        registerUser,
        loginUser,
        logoutUser,
        subscribeNewsletter,
        sendContactMessage,
        resetToInitialDemoData,
        runDemoScenarioStep
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
