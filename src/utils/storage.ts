import {
  InventoryItem,
  InventoryRequest,
  HardwareTransaction,
  EventItem,
  EventRegistration,
  CouncilMember,
  User,
  ContactMessage,
  NewsletterSubscriber
} from '../types';
import { calculateInventoryStatus, calculateEventStatus } from './validation';

const STORAGE_KEYS = {
  INVENTORY: 'flux_ecs_inventory_v2',
  REQUESTS: 'flux_ecs_requests_v2',
  TRANSACTIONS: 'flux_ecs_transactions_v2',
  EVENTS: 'flux_ecs_events_v2',
  REGISTRATIONS: 'flux_ecs_registrations_v2',
  COUNCIL: 'flux_ecs_council_v2',
  USERS: 'flux_ecs_users_v2',
  CURRENT_USER: 'flux_ecs_current_user_v2',
  MESSAGES: 'flux_ecs_messages_v2',
  SUBSCRIBERS: 'flux_ecs_subscribers_v2'
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'esp32-001',
    name: 'ESP32 Dev Board',
    category: 'Microcontroller',
    totalQuantity: 10,
    reservedQuantity: 2,
    issuedQuantity: 3,
    availableQuantity: 5,
    minimumStock: 3,
    status: 'AVAILABLE',
    location: 'Cabinet A-01, Tray 3',
    description: 'Dual-core Xtensa 32-bit LX6 @ 240MHz with integrated 2.4GHz Wi-Fi and Bluetooth BLE.',
    partNumber: 'ESP32-WROOM-32D',
    specs: '38 GPIOs, ADC, DAC, SPI, I2C, UART, PWM'
  },
  {
    id: 'jetson-orin-002',
    name: 'NVIDIA Jetson Orin Nano',
    category: 'Microcontroller',
    totalQuantity: 6,
    reservedQuantity: 2,
    issuedQuantity: 3,
    availableQuantity: 1,
    minimumStock: 2,
    status: 'LOW_STOCK',
    location: 'Lab 304, Secure Safe #2',
    description: '40 TOPS AI inference platform for autonomous robots, SLAM, and real-time vision.',
    partNumber: 'JETSON-ORIN-NANO-8GB',
    specs: 'Ampere GPU, 6-core ARM CPU, 8GB LPDDR5'
  },
  {
    id: 'rplidar-003',
    name: 'RPLiDAR A2M8 360° LiDAR',
    category: 'Sensor',
    totalQuantity: 4,
    reservedQuantity: 1,
    issuedQuantity: 3,
    availableQuantity: 0,
    minimumStock: 1,
    status: 'OUT_OF_STOCK',
    location: 'Shelf B-02, Bench 4',
    description: '12-meter radius 360-degree laser range scanner for 2D SLAM and navigation mapping.',
    partNumber: 'SLAMTEC-A2M8',
    specs: '8000 samples/sec, 10Hz scan rate, UART interface'
  },
  {
    id: 'stm32-004',
    name: 'STM32 Nucleo-F446RE',
    category: 'Microcontroller',
    totalQuantity: 15,
    reservedQuantity: 3,
    issuedQuantity: 4,
    availableQuantity: 8,
    minimumStock: 4,
    status: 'AVAILABLE',
    location: 'Cabinet A-02, Box 1',
    description: 'ARM Cortex-M4 @ 180MHz with FPU, DSP instructions, and Arduino Uno R3 header support.',
    partNumber: 'NUCLEO-F446RE',
    specs: '512KB Flash, 128KB SRAM, CAN 2.0B, USB OTG'
  },
  {
    id: 'mpu-005',
    name: 'MPU6050 6-DoF Accelerometer & Gyro',
    category: 'Sensor',
    totalQuantity: 25,
    reservedQuantity: 5,
    issuedQuantity: 8,
    availableQuantity: 12,
    minimumStock: 5,
    status: 'AVAILABLE',
    location: 'Cabinet B-01, Component Drawer 7',
    description: '6-axis MotionTracking device combining a 3-axis gyroscope and a 3-axis accelerometer with DMP.',
    partNumber: 'MPU-6050-MOD',
    specs: 'I2C Interface, 16-bit ADCs, Programmable range'
  },
  {
    id: 'l298n-006',
    name: 'L298N Dual H-Bridge Motor Driver',
    category: 'Motor Driver',
    totalQuantity: 18,
    reservedQuantity: 4,
    issuedQuantity: 6,
    availableQuantity: 8,
    minimumStock: 4,
    status: 'AVAILABLE',
    location: 'Cabinet C-01, Shelf 2',
    description: 'High voltage, high current dual full-bridge driver designed to drive inductive loads like relays and motors.',
    partNumber: 'L298N-MOD',
    specs: 'Up to 46V, 2A peak per bridge, onboard 5V regulator'
  },
  {
    id: 'tb6612-007',
    name: 'TB6612FNG High-Efficiency Driver',
    category: 'Motor Driver',
    totalQuantity: 12,
    reservedQuantity: 2,
    issuedQuantity: 2,
    availableQuantity: 8,
    minimumStock: 3,
    status: 'AVAILABLE',
    location: 'Cabinet C-01, Shelf 3',
    description: 'MOSFET based dual motor driver with higher efficiency and significantly lower heat dissipation than L298N.',
    partNumber: 'TB6612FNG-SSOP',
    specs: '1.2A continuous / 3.2A peak per channel, CW/CCW/brake'
  },
  {
    id: 'n20-008',
    name: 'N20 Micro Metal Gear Motor (6V 300RPM)',
    category: 'Actuator',
    totalQuantity: 30,
    reservedQuantity: 6,
    issuedQuantity: 10,
    availableQuantity: 14,
    minimumStock: 8,
    status: 'AVAILABLE',
    location: 'Bin D-04',
    description: 'Precision geared DC motor suitable for mini rovers, robot claws, and micro autonomous chassis.',
    partNumber: 'N20-GA12-6V-300',
    specs: 'Torque 0.4 kg.cm, D-shaft 3mm diameter'
  },
  {
    id: 'hcsr04-009',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensor',
    totalQuantity: 22,
    reservedQuantity: 4,
    issuedQuantity: 7,
    availableQuantity: 11,
    minimumStock: 5,
    status: 'AVAILABLE',
    location: 'Cabinet B-02, Drawer 2',
    description: 'Non-contact distance measurement module with 2cm to 400cm ranging accuracy.',
    partNumber: 'HC-SR04',
    specs: '5V DC, 40kHz acoustic frequency, 15 degree angle'
  },
  {
    id: 'tcrt-010',
    name: 'TCRT5000 5-Way Infrared Line Tracker',
    category: 'Sensor',
    totalQuantity: 16,
    reservedQuantity: 3,
    issuedQuantity: 5,
    availableQuantity: 8,
    minimumStock: 4,
    status: 'AVAILABLE',
    location: 'Cabinet B-03, Drawer 1',
    description: 'Phototransistor reflective sensor array optimized for autonomous line following and arena boundary detection.',
    partNumber: 'TCRT5000-5CH',
    specs: 'Digital TTL outputs, sensitivity trimmer'
  },
  {
    id: 'mg996r-011',
    name: 'MG996R High-Torque Metal Gear Servo',
    category: 'Actuator',
    totalQuantity: 14,
    reservedQuantity: 2,
    issuedQuantity: 5,
    availableQuantity: 7,
    minimumStock: 3,
    status: 'AVAILABLE',
    location: 'Cabinet C-02, Drawer 1',
    description: 'Heavy-duty 180° rotation servo with metal gear train for robotic manipulator arms and steering linkages.',
    partNumber: 'MG996R',
    specs: 'Torque 11 kg.cm at 6V, 0.16s/60deg speed'
  },
  {
    id: 'lipo-012',
    name: '3S 11.1V 2200mAh 35C LiPo Battery',
    category: 'Power',
    totalQuantity: 8,
    reservedQuantity: 2,
    issuedQuantity: 4,
    availableQuantity: 2,
    minimumStock: 3,
    status: 'LOW_STOCK',
    location: 'Fireproof Battery Vault #1',
    description: 'High discharge lithium-polymer battery pack for mobile autonomous rovers and motor controllers.',
    partNumber: 'LIPO-3S-2200-35C',
    specs: 'XT60 connector, JST-XH balance plug, 11.1V nominal'
  }
];

export const INITIAL_REQUESTS: InventoryRequest[] = [
  {
    id: 'REQ-2026-081',
    studentName: 'Tanya Verma',
    studentId: 'ECS-2024-419',
    email: 'tanya.v@university.edu',
    componentId: 'esp32-001',
    componentName: 'ESP32 Dev Board',
    quantity: 2,
    purpose: 'Telemetry relay node for senior Capstone IoT weather station.',
    project: 'Campus Microclimate Sensor Network',
    requiredDate: '2026-10-05',
    returnDate: '2026-11-20',
    requestedAt: '2026-10-02T14:30:00Z',
    status: 'APPROVED'
  },
  {
    id: 'REQ-2026-079',
    studentName: 'Devansh Kulkarni',
    studentId: 'ECS-2023-112',
    email: 'devansh.k@university.edu',
    componentId: 'jetson-orin-002',
    componentName: 'NVIDIA Jetson Orin Nano',
    quantity: 1,
    purpose: 'Real-time YOLOv8 neural network inference test for warehouse AGV.',
    project: 'RoboStorm 2026 AGV Prototype',
    requiredDate: '2026-09-28',
    returnDate: '2026-10-28',
    requestedAt: '2026-09-26T09:15:00Z',
    status: 'ISSUED'
  },
  {
    id: 'REQ-2026-075',
    studentName: 'Sara Chen',
    studentId: 'ECS-2025-088',
    email: 'sara.c@university.edu',
    componentId: 'rplidar-003',
    componentName: 'RPLiDAR A2M8 360° LiDAR',
    quantity: 1,
    purpose: 'Hector SLAM point-cloud generation test in subterranean maze.',
    project: 'Autonomous Sub-T Exploration',
    requiredDate: '2026-09-22',
    returnDate: '2026-10-15',
    requestedAt: '2026-09-20T11:40:00Z',
    status: 'ISSUED'
  }
];

export const INITIAL_TRANSACTIONS: HardwareTransaction[] = [
  {
    id: 'TXN-9021',
    date: '2026-09-28T10:00:00Z',
    user: 'Devansh Kulkarni',
    studentId: 'ECS-2023-112',
    componentId: 'jetson-orin-002',
    componentName: 'NVIDIA Jetson Orin Nano',
    quantity: 1,
    action: 'ISSUE',
    status: 'COMPLETED',
    notes: 'Signed out for RoboStorm AGV navigation bench test.'
  },
  {
    id: 'TXN-9018',
    date: '2026-09-25T16:20:00Z',
    user: 'Sara Chen',
    studentId: 'ECS-2025-088',
    componentId: 'rplidar-003',
    componentName: 'RPLiDAR A2M8 360° LiDAR',
    quantity: 1,
    action: 'ISSUE',
    status: 'COMPLETED',
    notes: 'Checked out with USB-UART cable adapter.'
  },
  {
    id: 'TXN-9014',
    date: '2026-09-20T14:10:00Z',
    user: 'Arjun Mehta (Council)',
    studentId: 'ECS-2023-001',
    componentId: 'esp32-001',
    componentName: 'ESP32 Dev Board',
    quantity: 10,
    action: 'RESTOCK',
    status: 'COMPLETED',
    notes: 'Restocked from Espressif educational grant lot.'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-robostorm-2026',
    name: 'RoboStorm 2026: 48-Hour Autonomous Rover Challenge',
    type: 'UPCOMING HACKATHON',
    date: 'Oct 24-26, 2026',
    time: '09:00 AM - 48h Nonstop',
    location: 'Arena Lab 304 & Tech Quad Testbed',
    prizePool: '$15,000 Pool',
    capacity: 50,
    currentRegistrations: 44,
    remainingSeats: 6,
    status: 'LIMITED',
    description: 'Construct obstacle-avoiding chassis algorithms, compile Jetson TensorRT models, and pilot uncalibrated sensor stacks in our subterranean obstacle arena.',
    imageUrl: '/src/assets/images/robostorm_hackathon_arena_1791089878903.jpg',
    tags: ['48-Hour Hackathon', 'Autonomous Navigation', 'NVIDIA Jetson', 'Arena Testing'],
    isHighlighted: true
  },
  {
    id: 'event-ares-sampler',
    name: 'Ares-IV Planetary Rock Sampler',
    type: 'PAST HIGHLIGHT',
    date: 'Completed August 2026',
    time: 'Final Deployment 14:00',
    location: 'National Mars Arena, Denver CO',
    prizePool: '1st Place Trophy',
    capacity: 35,
    currentRegistrations: 35,
    remainingSeats: 0,
    status: 'FULL',
    description: 'Designed with a 6-wheel rocker-bogie differential and custom spectrometer probe navigating uneven sandy slopes autonomously under simulated comms blackouts.',
    imageUrl: '/src/assets/images/ares_rover_mars_1791089866648.jpg',
    tags: ['1st Place', 'Mars Challenge', 'Rocker-Bogie', 'Open Telemetry'],
    isHighlighted: false
  },
  {
    id: 'event-tensorrt-bootcamp',
    name: 'Jetson TensorRT Edge AI Vision Intensive',
    type: 'TECHNICAL WORKSHOP',
    date: 'Nov 07, 2026',
    time: '10:00 AM - 04:00 PM',
    location: 'Cybernetics Wing, Lab 308',
    prizePool: 'Certified Hardware Badges',
    capacity: 40,
    currentRegistrations: 40,
    remainingSeats: 0,
    status: 'FULL',
    description: 'Hands-on quantization, INT8 calibration, CUDA kernel acceleration, and CSI dual-camera stereo depth calculation directly on Jetson platforms.',
    tags: ['Edge AI', 'CUDA', 'TensorRT', 'Embedded Vision']
  },
  {
    id: 'event-ros2-swarm',
    name: 'ROS 2 Humble Swarm Mesh Coordination Workshop',
    type: 'RESEARCH BOOTCAMP',
    date: 'Nov 14, 2026',
    time: '01:00 PM - 06:00 PM',
    location: 'Robotics Prototyping Hall B',
    prizePool: 'Dev Kits Sponsored',
    capacity: 30,
    currentRegistrations: 18,
    remainingSeats: 12,
    status: 'OPEN',
    description: 'Multi-agent decentralized robot fleet orchestration using Cyclone DDS, ROS 2 micro-controllers, and behavior trees for distributed pathing.',
    tags: ['ROS 2', 'Swarm Robotics', 'Cyclone DDS', 'Behavior Trees']
  }
];

export const INITIAL_REGISTRATIONS: EventRegistration[] = [
  {
    id: 'REG-101',
    eventId: 'event-robostorm-2026',
    eventName: 'RoboStorm 2026: 48-Hour Autonomous Rover Challenge',
    teamName: 'Titan Vector Dynamics',
    leaderName: 'Arjun Mehta',
    leaderEmail: 'arjun.m@university.edu',
    college: 'School of Electronics & Computer Science',
    teamSize: 4,
    members: ['Arjun Mehta', 'Vikram Joshi', 'Neha Rao', 'Suraj Nair'],
    registeredAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'REG-102',
    eventId: 'event-robostorm-2026',
    eventName: 'RoboStorm 2026: 48-Hour Autonomous Rover Challenge',
    teamName: 'Apex Swarm Robotics',
    leaderName: 'Kavita Patel',
    leaderEmail: 'kavita.p@university.edu',
    college: 'Faculty of Autonomous Systems',
    teamSize: 4,
    members: ['Kavita Patel', 'Ravi Shankar', 'Anil Deshmukh', 'Pooja Iyer'],
    registeredAt: '2026-10-01T14:30:00Z'
  }
];

export const INITIAL_COUNCIL: CouncilMember[] = [
  {
    id: 'council-arjun',
    name: 'Arjun Mehta',
    role: 'Council President',
    department: 'Mechatronics & Swarm Systems',
    badgeRole: 'PRESIDENT',
    tag: 'Final Year Lead',
    bio: 'Steering institutional partnerships and multi-rover autonomy testbeds. Oversees annual lab allocations, firmware architecture standards, and national challenges.',
    responsibility: 'Directs council strategic initiatives, budget dispersal, lab equipment procurement, and university robotics delegations.',
    email: 'arjun.m@fluxecs.org',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    photoUrl: '/src/assets/images/council_arjun_lead_1791089842052.jpg',
    specialization: 'Multi-agent kinematics, Rocker-bogie dynamics, FreeRTOS control loops',
    officeHours: 'Tuesdays & Thursdays, 16:00 - 18:00 (Lab 304)',
    publications: 'Autonomous Rocker-Bogie Traversal on Granular Media (IEEE ICRA 2025)'
  },
  {
    id: 'council-priya',
    name: 'Dr. Priya Sundaram',
    role: 'Vice President & Tech Lead',
    department: 'Embedded AI & SLAM Architecture',
    badgeRole: 'VICE PRESIDENT',
    tag: 'Research Chair',
    bio: 'Directing edge machine vision models on NVIDIA Jetson modules and sensor telemetry bridges for cyber-physical field testing.',
    responsibility: 'Supervises hardware testing protocols, sensor fusion pipelines, IEEE student author delegations, and academic research papers.',
    email: 'priya.s@fluxecs.org',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    photoUrl: '/src/assets/images/council_priya_lead_1791089855236.jpg',
    specialization: 'Visual-Inertial Odometry, Jetson TensorRT optimizations, EKF sensor fusion',
    officeHours: 'Mondays & Wednesdays, 14:00 - 16:30 (Cybernetics Wing 308)',
    publications: 'Deterministic Edge Inference for Subterranean Traversal (IEEE Sensors 2026)'
  },
  {
    id: 'council-kabir',
    name: 'Kabir Sen',
    role: 'Director of Hardware & Prototyping',
    department: 'Embedded Electronics & PCB Design',
    badgeRole: 'HARDWARE LEAD',
    tag: 'Junior Lead',
    bio: 'Designs custom 4-layer flight computer PCBs in KiCad, dual-rail power supplies, and automotive CAN 2.0B differential bus harnesses.',
    responsibility: 'Manages physical lab inventory, PCB manufacturing grants, soldering stations, and oscilloscope calibration.',
    email: 'kabir.s@fluxecs.org',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    photoUrl: '/src/assets/images/council_arjun_lead_1791089842052.jpg',
    specialization: 'High-speed digital layout, STM32 Bare-Metal, BMS circuits',
    officeHours: 'Fridays, 11:00 - 15:00 (Hardware Lab B)'
  },
  {
    id: 'council-ananya',
    name: 'Ananya Ray',
    role: 'Head of Technical Events & Outreach',
    department: 'Robotics Software & Community',
    badgeRole: 'EVENTS CHAIR',
    tag: 'Operations Lead',
    bio: 'Coordinates collegiate technical hackathons, RoboStorm obstacle arena rules, corporate hardware sponsorships, and weekly cadencing.',
    responsibility: 'Organizes campus hackathons, technical workshop calendars, participant logistics, and venue engineering.',
    email: 'ananya.r@fluxecs.org',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    photoUrl: '/src/assets/images/council_priya_lead_1791089855236.jpg',
    specialization: 'ROS 2 Swarms, Hackathon Infrastructure, Technical Workshops',
    officeHours: 'Thursdays, 13:00 - 15:00 (Student Hub)'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Alex Vance',
    email: 'alex.vance@university.edu',
    studentId: 'ECS-2024-880',
    department: 'Electronics & Computer Science',
    year: '3rd Year Undergraduate',
    registeredAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'USR-002',
    name: 'Devansh Kulkarni',
    email: 'devansh.k@university.edu',
    studentId: 'ECS-2023-112',
    department: 'Autonomous Systems & Robotics',
    year: 'Final Year Undergraduate',
    registeredAt: '2026-09-18T10:15:00Z'
  }
];

export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading localStorage key: ${key}`, err);
    return defaultValue;
  }
}

export function saveData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving localStorage key: ${key}`, err);
  }
}

export { STORAGE_KEYS };
