export type DistributionDatum = {
  name: string;
  value: number;
};

export type AudienceAttendee = {
  id: string;
  name: string;
  approvalStatus: string;
  checkedIn: boolean;
  role: string;
  roles: string[];
  interests: string[];
  tools: string[];
  hotTake: string;
  workingOn: string;
};

export type FinancialLineItem = {
  id: string;
  category: string;
  description: string;
  amount: number;
};

export type FinancialRevenueItem = {
  label: string;
  amount: number;
};

export type SponsorCrmHighlight = {
  name: string;
  role: string;
  tags: string[];
  whyRelevant: string;
  note: string;
  linkUrl: string | null;
  linkLabel: string | null;
};

export type SponsorReportData = {
  generatedAt: string;
  volume: number;
  downloads: {
    guestsCsv: string;
    budgetXlsx: string;
    agendaPdf: string;
  };
  audience: {
    totalRecords: number;
    approvedCount: number;
    checkedInCount: number;
    showRate: number;
    roleDistribution: DistributionDatum[];
    interestDistribution: DistributionDatum[];
    toolsDistribution: DistributionDatum[];
    attendees: AudienceAttendee[];
  };
  financials: {
    kpis: {
      totalRevenue: number;
      totalExpenses: number;
      netPnL: number;
    };
    expensesByCategory: DistributionDatum[];
    lineItems: FinancialLineItem[];
    revenueLineItems: FinancialRevenueItem[];
  };
  crmHighlights: SponsorCrmHighlight[];
};
