import { Startup, Mentor, Programme } from '../types';

// Helper to generate random startups with more unique names
const generateStartups = (count: number): Startup[] => {
  const industries = ['FinTech', 'HealthTech', 'EdTech', 'AgriTech', 'Logistics', 'ClimateTech', 'SaaS', 'E-commerce', 'AI / Machine Learning'];
  const stages = ['Idea', 'Pre-Seed', 'Seed', 'Series A', 'Growth stage'];
  
  const goals = [
    'Expand into the Southeast Asian market and acquire 10,000 new users.',
    'Secure Series A funding to scale operations and hire key talent.',
    'Develop a working MVP and conduct initial beta testing.',
    'Establish strategic partnerships with local hospitals and clinics.',
    'Achieve profitability within the next 18 months through B2B sales.'
  ];
  
  const challenges = [
    'Inefficient supply chain management in rural areas causing delays.',
    'Lack of accessible financial services for gig workers leading to high churn.',
    'High cost of early childhood education limiting market penetration.',
    'Poor patient data interoperability between hospitals slowing down adoption.',
    'Excessive food waste in the hospitality sector requiring complex logistics.'
  ];

  const prefixes = ['Aero', 'Bio', 'Cyber', 'Data', 'Eco', 'Fin', 'Geo', 'Health', 'Info', 'Lumi', 'Mega', 'Nano', 'Omni', 'Poly', 'Quantum', 'Robo', 'Smart', 'Tech', 'Ultra', 'Velo'];
  const suffixes = ['Analytics', 'Base', 'Core', 'Dynamics', 'Edge', 'Flow', 'Grid', 'Hub', 'IQ', 'Link', 'Matrix', 'Net', 'Ops', 'Pulse', 'Quest', 'Sync', 'Track', 'Vision', 'Wave', 'Zone'];

  const startups: Startup[] = [];
  for (let i = 1; i <= count; i++) {
    // Generate a more unique name
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${prefix}${suffix}`;

    startups.push({
      id: `s${i}`,
      name: name,
      industry: industries[i % industries.length],
      stage: stages[i % stages.length],
      funding: `$${(i * 15000) % 2000000}`,
      primaryGoals: goals[i % goals.length],
      currentChallenges: challenges[i % challenges.length]
    });
  }
  return startups;
};

// Generate 100 startups, overriding the first few with specific names for the UI demo
const generatedStartups = generateStartups(100);
generatedStartups[0].name = 'Robin Ventures';
generatedStartups[1].name = 'Go to School';
generatedStartups[2].name = 'Alpha Horizon Logistics';
generatedStartups[3].name = 'Nexus Health Solutions';
generatedStartups[4].name = 'GreenGrid';

export const STARTUPS: Startup[] = generatedStartups;

export const MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Aminah Yusuf',
    expertiseTags: ['Agriculture', 'IoT', 'Hardware'],
    yearsExperience: 15,
    availability: '5 hours/week'
  },
  {
    id: 'm2',
    name: 'James Lee',
    expertiseTags: ['FinTech', 'Fundraising', 'B2B Sales'],
    yearsExperience: 10,
    availability: '2 hours/week'
  },
  {
    id: 'm3',
    name: 'Sarah Tan',
    expertiseTags: ['EdTech', 'Product Management', 'UX Design'],
    yearsExperience: 8,
    availability: '10 hours/week'
  },
  {
    id: 'm4',
    name: 'Dr. Rajesh Kumar',
    expertiseTags: ['HealthTech', 'Blockchain', 'Compliance'],
    yearsExperience: 20,
    availability: '3 hours/week'
  },
  {
    id: 'm5',
    name: 'Ahmad Faizal',
    expertiseTags: ['Logistics', 'Operations', 'AI'],
    yearsExperience: 12,
    availability: '4 hours/week'
  },
  {
    id: 'm6',
    name: 'Elena Rodriguez',
    expertiseTags: ['Marketing', 'Growth Hacking', 'B2C'],
    yearsExperience: 7,
    availability: '6 hours/week'
  },
  {
    id: 'm7',
    name: 'David Chen',
    expertiseTags: ['SaaS', 'Software Engineering', 'Scaling'],
    yearsExperience: 14,
    availability: '2 hours/week'
  },
  {
    id: 'm8',
    name: 'Fatima Zahra',
    expertiseTags: ['Social Impact', 'Non-profit', 'Grants'],
    yearsExperience: 9,
    availability: '5 hours/week'
  }
];

export const PROGRAMMES: Programme[] = [
  {
    id: 'p1',
    name: 'CIP Spark',
    focusArea: 'Early-stage tech startups',
    eligibilityCriteria: 'Pre-seed stage, tech-based product, Malaysian incorporated.'
  },
  {
    id: 'p2',
    name: 'CIP Sprint',
    focusArea: 'Commercialization and growth',
    eligibilityCriteria: 'Seed to Series A, proven traction, minimum $50k revenue.'
  },
  {
    id: 'p3',
    name: 'GreenTech Accelerator',
    focusArea: 'Sustainability and environmental impact',
    eligibilityCriteria: 'Solutions addressing climate change, waste management, or renewable energy.'
  },
  {
    id: 'p4',
    name: 'MYHackathon Grant',
    focusArea: 'Digital government solutions',
    eligibilityCriteria: 'Solutions that improve public service delivery, citizen engagement.'
  },
  {
    id: 'p5',
    name: 'Cradle Investment Programme (CIP) Ignite',
    focusArea: 'Deep tech and deep science',
    eligibilityCriteria: 'IP-driven, long gestation period, high barrier to entry.'
  }
];