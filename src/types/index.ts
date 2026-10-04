export type InventoryStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Microcontroller' | 'Sensor' | 'Motor Driver' | 'Actuator' | 'Power' | 'Prototyping' | 'Robotics Kit';
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  issuedQuantity: number;
  minimumStock: number;
  status: InventoryStatus;
  location: string;
  description: string;
  partNumber?: string;
  specs?: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ISSUED' | 'RETURNED';

export interface InventoryRequest {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  componentId: string;
  componentName: string;
  quantity: number;
  purpose: string;
  project: string;
  requiredDate: string;
  returnDate: string;
  requestedAt: string;
  status: RequestStatus;
  rejectionReason?: string;
}

export type TransactionAction = 'RESERVATION' | 'ISSUE' | 'RETURN' | 'RESTOCK' | 'ADJUSTMENT';

export interface HardwareTransaction {
  id: string;
  date: string;
  user: string;
  studentId: string;
  componentId: string;
  componentName: string;
  quantity: number;
  action: TransactionAction;
  status: 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export type EventStatus = 'OPEN' | 'LIMITED' | 'FULL';

export interface EventItem {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  prizePool?: string;
  capacity: number;
  currentRegistrations: number;
  remainingSeats: number;
  status: EventStatus;
  description: string;
  imageUrl?: string;
  tags: string[];
  isHighlighted?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventName: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  college: string;
  teamSize: number;
  members: string[];
  registeredAt: string;
}

export interface CouncilMember {
  id: string;
  name: string;
  role: string;
  department: string;
  badgeRole: string;
  bio: string;
  responsibility: string;
  email: string;
  linkedin: string;
  github: string;
  photoUrl: string;
  tag: string;
  specialization: string;
  publications?: string;
  officeHours?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  registeredAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  submittedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}
