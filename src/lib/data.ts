// ── Types ──────────────────────────────────────────────────────

export type LandType = "Agricultural" | "Residential" | "Commercial" | "Industrial" | "Unclassified";
export type RecordStatus = "Verified" | "Pending" | "Disputed";
export type ApplicationStatus = "Submitted" | "Under Review" | "Under Verification" | "Approved" | "Completed" | "Rejected";
export type ServiceType = "Land Record Verification" | "Boundary Survey" | "Record Correction" | "Mutation" | "Encumbrance Certificate" | "Title Deed";

export interface LandRecord {
  id: string;
  survey: string;
  owner: string;
  area: string;
  type: LandType;
  status: RecordStatus;
  village: string;
  taluk: string;
  district: string;
  registeredDate: string;
  marketValue: string;
  coordinates?: { lat: number; lng: number };
  description?: string;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  survey: string;
  service: ServiceType;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  remarks?: string;
  priority: "Normal" | "Urgent";
}

export interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  timestamp: number;
}

export interface DashboardStats {
  totalRecords: number;
  verifiedRecords: number;
  pendingRecords: number;
  disputedRecords: number;
  totalApplications: number;
  completedApplications: number;
  pendingApplications: number;
  totalArea: number;
}

// ── Initial Data ──────────────────────────────────────────────

export const landRecords: LandRecord[] = [
  { id: "LR001", survey: "125/3", owner: "Ravi Kumar", area: "2.5 Acres", type: "Agricultural", status: "Verified", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2024-03-15", marketValue: "₹12,50,000", description: "Prime agricultural land with irrigation facility" },
  { id: "LR002", survey: "125/1", owner: "Anita Sharma", area: "1.2 Acres", type: "Residential", status: "Pending", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2024-06-22", marketValue: "₹18,00,000", description: "Residential plot near main road" },
  { id: "LR003", survey: "125/2", owner: "Suresh Patil", area: "3.8 Acres", type: "Agricultural", status: "Verified", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2023-11-10", marketValue: "₹19,00,000", description: "Agricultural land with bore well" },
  { id: "LR004", survey: "125/4", owner: "Meera Desai", area: "0.9 Acres", type: "Commercial", status: "Disputed", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2024-01-08", marketValue: "₹45,00,000", description: "Commercial plot under dispute" },
  { id: "LR005", survey: "124/1", owner: "Kiran Reddy", area: "1.8 Acres", type: "Agricultural", status: "Verified", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2023-09-05", marketValue: "₹9,00,000", description: "Agricultural land with seasonal crops" },
  { id: "LR006", survey: "124/2", owner: "Lakshmi Devi", area: "2.1 Acres", type: "Residential", status: "Pending", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2024-04-18", marketValue: "₹25,20,000", description: "Residential layout approved plot" },
  { id: "LR007", survey: "124/3", owner: "Mohan Gowda", area: "1.4 Acres", type: "Agricultural", status: "Verified", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2023-07-22", marketValue: "₹7,00,000", description: "Agricultural land near river" },
  { id: "LR008", survey: "123/1", owner: "Priya Hegde", area: "4.1 Acres", type: "Agricultural", status: "Verified", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2022-12-30", marketValue: "₹20,50,000", description: "Large agricultural tract with canal irrigation" },
  { id: "LR009", survey: "123/2", owner: "Arun Joshi", area: "1.1 Acres", type: "Industrial", status: "Pending", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2024-08-14", marketValue: "₹33,00,000", description: "Industrial zone plot" },
  { id: "LR010", survey: "123/3", owner: "Dev Kulkarni", area: "2.7 Acres", type: "Agricultural", status: "Verified", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2023-05-11", marketValue: "₹13,50,000", description: "Agricultural land with existing crops" },
  { id: "LR011", survey: "122/1", owner: "Savita Naik", area: "3.2 Acres", type: "Agricultural", status: "Verified", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2023-02-28", marketValue: "₹16,00,000", description: "Fertile agricultural land" },
  { id: "LR012", survey: "122/2", owner: "Ramesh Bhat", area: "0.6 Acres", type: "Commercial", status: "Verified", village: "Talikota", taluk: "Muddebihal", district: "Vijayapura", registeredDate: "2024-02-14", marketValue: "₹30,00,000", description: "Commercial property on highway" },
];

export const initialApplications: Application[] = [
  { id: "APP001", name: "Ravi Kumar", email: "ravi@example.com", phone: "9876543210", survey: "125/3", service: "Land Record Verification", status: "Under Verification", appliedDate: "2024-09-01", lastUpdated: "2024-09-15", priority: "Normal" },
  { id: "APP002", name: "Anita Sharma", email: "anita@example.com", phone: "9876543211", survey: "125/1", service: "Boundary Survey", status: "Submitted", appliedDate: "2024-09-05", lastUpdated: "2024-09-05", priority: "Urgent" },
  { id: "APP003", name: "Suresh Patil", email: "suresh@example.com", phone: "9876543212", survey: "125/2", service: "Record Correction", status: "Completed", appliedDate: "2024-08-20", lastUpdated: "2024-09-10", remarks: "Records updated successfully", priority: "Normal" },
  { id: "APP004", name: "Priya Hegde", email: "priya@example.com", phone: "9876543213", survey: "123/1", service: "Encumbrance Certificate", status: "Approved", appliedDate: "2024-09-08", lastUpdated: "2024-09-14", priority: "Normal" },
  { id: "APP005", name: "Kiran Reddy", email: "kiran@example.com", phone: "9876543214", survey: "124/1", service: "Mutation", status: "Under Review", appliedDate: "2024-09-10", lastUpdated: "2024-09-12", priority: "Urgent" },
];

export const serviceDescriptions: Record<ServiceType, string> = {
  "Land Record Verification": "Verify the authenticity and accuracy of land ownership records",
  "Boundary Survey": "Conduct official survey to demarcate land boundaries",
  "Record Correction": "Correct errors or update information in existing land records",
  "Mutation": "Transfer land ownership records after sale or inheritance",
  "Encumbrance Certificate": "Obtain certificate showing property is free from legal dues",
  "Title Deed": "Issue official document proving land ownership",
};

// ── Utility Functions ─────────────────────────────────────────

export function generateAppId(count: number): string {
  return `APP${String(count + 1).padStart(3, "0")}`;
}

export function calculateStats(records: LandRecord[], applications: Application[]): DashboardStats {
  const totalArea = records.reduce((sum, r) => {
    const match = r.area.match(/[\d.]+/);
    return sum + (match ? parseFloat(match[0]) : 0);
  }, 0);

  return {
    totalRecords: records.length,
    verifiedRecords: records.filter(r => r.status === "Verified").length,
    pendingRecords: records.filter(r => r.status === "Pending").length,
    disputedRecords: records.filter(r => r.status === "Disputed").length,
    totalApplications: applications.length,
    completedApplications: applications.filter(a => a.status === "Completed").length,
    pendingApplications: applications.filter(a => a.status !== "Completed" && a.status !== "Rejected").length,
    totalArea: Math.round(totalArea * 10) / 10,
  };
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Verified":
    case "Completed":
    case "Approved":
      return "status-verified";
    case "Disputed":
    case "Rejected":
      return "status-disputed";
    default:
      return "status-pending";
  }
}

export function getProgressPercent(status: ApplicationStatus): number {
  switch (status) {
    case "Submitted": return 20;
    case "Under Review": return 40;
    case "Under Verification": return 60;
    case "Approved": return 80;
    case "Completed": return 100;
    case "Rejected": return 100;
    default: return 0;
  }
}
