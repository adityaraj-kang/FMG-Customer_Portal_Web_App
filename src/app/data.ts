// ─── Shared service catalogue ────────────────────────────────────────────────
// Single source of truth used by HomeScreen, ServicesScreen, ServiceDetailScreen

export interface Service {
  id: string;
  label: string;
  color: string;
  description: string;
  avgPrice: string;
  avgEta: string;
  includes: string[];
}

export const SERVICES: Service[] = [
  {
    id: "towing",
    label: "Towing",
    color: "#FF6A2B",
    description: "24/7 roadside towing for any vehicle. Genie calls around to find you the best price and fastest arrival near you.",
    avgPrice: "$75–$150",
    avgEta: "18 min",
    includes: ["Flatbed or wheel-lift tow", "Up to 10 miles included", "Vehicle drop-off of your choice", "Real-time GPS tracking"],
  },
  {
    id: "plumber",
    label: "Plumber",
    color: "#2E93FA",
    description: "From leaky faucets to burst pipes, Genie negotiates same-day plumbing service from licensed pros in your area.",
    avgPrice: "$90–$200",
    avgEta: "35 min",
    includes: ["Full diagnostic inspection", "Drain & pipe repair", "Water heater service", "Emergency shut-off assistance"],
  },
  {
    id: "hvac",
    label: "HVAC",
    color: "#00E096",
    description: "Heating and cooling repair, tune-ups, and installations. Certified HVAC technicians available year-round.",
    avgPrice: "$120–$300",
    avgEta: "45 min",
    includes: ["System diagnostic", "Filter replacement", "Refrigerant check", "Thermostat calibration"],
  },
  {
    id: "electrician",
    label: "Electrician",
    color: "#FFC043",
    description: "Licensed electricians for outlets, panels, lighting, and emergency electrical issues.",
    avgPrice: "$100–$250",
    avgEta: "40 min",
    includes: ["Circuit breaker service", "Outlet & switch repair", "Safety inspection", "Panel upgrades"],
  },
  {
    id: "lawn",
    label: "Lawn Care",
    color: "#34C759",
    description: "Weekly or one-time lawn mowing, edging, and yard clean-up from vetted local crews.",
    avgPrice: "$40–$120",
    avgEta: "Next day",
    includes: ["Mowing & edging", "Leaf & debris removal", "Weed trimming", "Blowing & clean-up"],
  },
  {
    id: "handyman",
    label: "Handyman",
    color: "#FF8C00",
    description: "General repairs, furniture assembly, painting touch-ups, and small fixes around the house.",
    avgPrice: "$60–$180",
    avgEta: "2–4 hrs",
    includes: ["Furniture assembly", "Drywall patching", "Door & window repair", "Shelf & fixture mounting"],
  },
  {
    id: "roofing",
    label: "Roofing",
    color: "#A1A1A1",
    description: "Roof inspections, leak repairs, and shingle replacement from certified roofing contractors.",
    avgPrice: "$150–$500",
    avgEta: "Next day",
    includes: ["Leak detection & repair", "Shingle replacement", "Gutter inspection", "Storm damage assessment"],
  },
  {
    id: "pest",
    label: "Pest Control",
    color: "#FF2D55",
    description: "Ant, roach, rodent, and termite treatments by licensed exterminators with eco-friendly options.",
    avgPrice: "$80–$220",
    avgEta: "Same day",
    includes: ["Full home inspection", "Interior & exterior treatment", "Follow-up visit included", "90-day warranty"],
  },
];

// ─── Shared activity/job feed ─────────────────────────────────────────────────
export interface Job {
  id: string;
  serviceId: string;
  serviceLabel: string;
  vendor: string;
  price: string;
  date: string;
  status: "active" | "completed" | "cancelled";
  statusLabel: string;
  detail: string;
}

export const JOBS: Job[] = [
  {
    id: "j1",
    serviceId: "plumber",
    serviceLabel: "Plumber",
    vendor: "QuickFix Plumbing",
    price: "$110",
    date: "2 min ago",
    status: "active",
    statusLabel: "In Progress",
    detail: "Genie negotiating with 12 vendors",
  },
  {
    id: "j2",
    serviceId: "towing",
    serviceLabel: "Towing",
    vendor: "Mike's Towing",
    price: "$85",
    date: "2h ago",
    status: "completed",
    statusLabel: "Completed",
    detail: "Best price found — 15 min arrival",
  },
  {
    id: "j3",
    serviceId: "hvac",
    serviceLabel: "HVAC",
    vendor: "CoolAir Pro",
    price: "$175",
    date: "Yesterday",
    status: "completed",
    statusLabel: "Completed",
    detail: "AC tune-up & filter replacement",
  },
  {
    id: "j4",
    serviceId: "electrician",
    serviceLabel: "Electrician",
    vendor: "Watts Up Electric",
    price: "$140",
    date: "3 days ago",
    status: "completed",
    statusLabel: "Completed",
    detail: "Outlet repair — living room",
  },
  {
    id: "j5",
    serviceId: "lawn",
    serviceLabel: "Lawn Care",
    vendor: "GreenScape Crew",
    price: "$65",
    date: "1 week ago",
    status: "cancelled",
    statusLabel: "Cancelled",
    detail: "Rescheduled for next week",
  },
];
