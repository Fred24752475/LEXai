export interface WizardOption {
  value: string;
  label: string;
  description: string;
}

export interface WizardQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: WizardOption[];
}

export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: "structure",
    title: "What business structure are you registering?",
    subtitle: "This determines which forms and registrations apply.",
    options: [
      {
        value: "Sole Proprietorship",
        label: "Sole Proprietorship",
        description: "A business owned and run by one person.",
      },
      {
        value: "Partnership",
        label: "Partnership",
        description: "Two or more people sharing ownership.",
      },
      {
        value: "Company Limited by Shares",
        label: "Company Limited by Shares",
        description: "A private limited liability company (Ltd).",
      },
      {
        value: "Company Limited by Guarantee",
        label: "Company Limited by Guarantee",
        description: "Typically NGOs and non-profits.",
      },
      {
        value: "External Company",
        label: "External Company",
        description: "A branch of a foreign-registered company.",
      },
    ],
  },
  {
    id: "industry",
    title: "Which sector best describes your business?",
    subtitle: "Some sectors need extra permits or regulator approvals.",
    options: [
      {
        value: "Retail & Trading",
        label: "Retail & Trading",
        description: "Shops, wholesale, general goods.",
      },
      {
        value: "Food & Beverage",
        label: "Food & Beverage",
        description: "Restaurants, catering, food production.",
      },
      {
        value: "Technology & Digital",
        label: "Technology & Digital",
        description: "Software, fintech, online services.",
      },
      {
        value: "Manufacturing",
        label: "Manufacturing",
        description: "Production and processing of goods.",
      },
      {
        value: "Professional Services",
        label: "Professional Services",
        description: "Consulting, legal, accounting, design.",
      },
      {
        value: "Agriculture",
        label: "Agriculture",
        description: "Farming, agro-processing, livestock.",
      },
    ],
  },
  {
    id: "teamSize",
    title: "How many people will work in the business?",
    subtitle: "Employee count affects SSNIT and labour obligations.",
    options: [
      {
        value: "Just me",
        label: "Just me",
        description: "Single-person operation for now.",
      },
      {
        value: "1-5 employees",
        label: "1–5 employees",
        description: "A small starting team.",
      },
      {
        value: "6-30 employees",
        label: "6–30 employees",
        description: "A growing SME.",
      },
      {
        value: "Over 30 employees",
        label: "Over 30 employees",
        description: "A larger workforce.",
      },
    ],
  },
  {
    id: "region",
    title: "Where will you primarily operate?",
    subtitle: "Local assembly permits vary by district.",
    options: [
      {
        value: "Greater Accra",
        label: "Greater Accra",
        description: "Accra and surrounding districts.",
      },
      {
        value: "Ashanti Region",
        label: "Ashanti Region",
        description: "Kumasi and surrounding districts.",
      },
      {
        value: "Western Region",
        label: "Western Region",
        description: "Takoradi and surrounding districts.",
      },
      {
        value: "Northern Region",
        label: "Northern Region",
        description: "Tamale and surrounding districts.",
      },
      {
        value: "Operating nationwide",
        label: "Operating nationwide",
        description: "Across multiple regions of Ghana.",
      },
    ],
  },
  {
    id: "regulated",
    title: "Will you carry out any regulated activity?",
    subtitle: "These may require special licences before you trade.",
    options: [
      {
        value: "Import / Export",
        label: "Import / Export",
        description: "Customs, GRA and shipping requirements.",
      },
      {
        value: "Food handling",
        label: "Food handling",
        description: "FDA and environmental health permits.",
      },
      {
        value: "Financial services",
        label: "Financial services",
        description: "Bank of Ghana / SEC oversight.",
      },
      {
        value: "Health / Pharma",
        label: "Health / Pharma",
        description: "FDA, HEFRA and related approvals.",
      },
      {
        value: "None of these",
        label: "None of these",
        description: "Standard business activity only.",
      },
    ],
  },
];

export type WizardAnswers = Record<string, string>;
