export type ReportType = "checklist" | "healthcheck";

export type Business = {
  id: string;
  user_id: string;
  name: string;
  type: "new" | "existing";
  created_at: string;
};

export type ComplianceReport = {
  id: string;
  business_id: string;
  report_type: ReportType;
  score: number | null;
  data: ChecklistData | HealthCheckData;
  created_at: string;
  businesses?: Pick<Business, "name" | "type"> | null;
};

export type ChecklistData = {
  title: string;
  summary: string;
  assumptions: string[];
  checklist: Array<{
    category: string;
    priority: "High" | "Medium" | "Low";
    action: string;
    agency: string;
    timeline: string;
    estimatedCostGHS: string;
    sourceHint: string;
  }>;
  documents: string[];
  nextSteps: string[];
};

export type HealthCheckData = {
  title: string;
  summary: string;
  score: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  audit: Array<{
    area: string;
    status: "Compliant" | "Needs attention" | "At risk" | "Unknown";
    finding: string;
    priorityAction: string;
    agency: string;
  }>;
  priorityActions: string[];
  sourcesToVerify: string[];
};
