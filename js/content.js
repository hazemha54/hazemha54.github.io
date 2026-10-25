/**
 * content.js — single source of truth for all portfolio data.
 * Rendered by js/main.js and js/cards.js so the HTML never duplicates it.
 * Only facts already present in the original site / CV / brief. No invented
 * clients, statistics, or testimonials.
 */
window.PORTFOLIO = {
  identity: {
    name: 'Hazem Hadj Ahmed',
    role: 'Odoo & Python Developer',
    summary:
      "I design and build reliable ERP solutions on Odoo — custom modules, integrated data flows, and automated business processes — pairing solid Python backend engineering with a focus on maintainable, integration-first architecture.",
    yearsOdoo: '3+',
    location: 'Mahdia, Tunisia',
    available: true,
  },

  links: {
    email: 'hazemhajahmed@gmail.com',
    github: 'https://github.com/hazemha54',
    linkedin: 'https://www.linkedin.com/in/hazemhadjahmed/',
    cv: 'Hazem_Hadj_Ahmed.pdf',
  },

  principles: [
    {
      title: 'Modular by design',
      text: 'Odoo is a modular ERP, so I treat every engagement as a set of small, decoupled modules: clean model boundaries, XML view layers, OWL/asset JS, and PostgreSQL that can be tested and shipped independently.',
    },
    {
      title: 'Integration-first',
      text: 'Business systems don’t live in one place. I design Odoo endpoints and n8n workflows so ERP, external APIs, and operational tools exchange data automatically — instead of by hand.',
    },
    {
      title: 'Business outcomes',
      text: 'Every module, report, or automation has to earn its place. I start from the process — sales, inventory, maintenance — and optimize for the measurable workflow it improves.',
    },
  ],


  skillGroups: [
    {
      key: 'odoo',
      title: 'Odoo Development',
      depth: 4,
      chips: ['Custom modules', 'ORM & models', 'OWL views', 'Client actions', 'Reports', 'Security & access'],
    },
    {
      key: 'python',
      title: 'Python & Backend',
      depth: 4,
      chips: ['Backend engineering', 'APIs', 'Automation scripts', 'Data processing', 'Async tasks'],
    },
    {
      key: 'data',
      title: 'PostgreSQL & Data',
      depth: 3,
      chips: ['SQL modeling', 'Query tuning', 'Data migrations', 'Reporting'],
    },
    {
      key: 'erp',
      title: 'ERP Workflows',
      depth: 4,
      chips: ['CRM', 'Sales', 'Inventory', 'HR', 'Maintenance', 'Process optimization'],
    },
    {
      key: 'integration',
      title: 'Integrations & Automation',
      depth: 3,
      chips: ['APIs', 'Webhooks', 'n8n workflows', 'System interoperability', 'Docker'],
    },
    {
      key: 'ai',
      title: 'AI-assisted Tooling',
      depth: 2,
      chips: ['AI-assisted dev', 'Odoo MCP', 'Developer productivity'],
    },
  ],

  experience: [
    {
      period: 'Feb 2023 — Present',
      role: 'Odoo / Python Developer',
      company: 'Infotech Consulting Services (ICS)',
      current: true,
      bullets: [
        'Application development on the Odoo framework and its component model — modules, models, views, and business logic.',
        'Bug fixing, performance optimization, and production support for deployed Odoo environments.',
        'Technical reviews of setups and configurations, with corrective action when the production behavior doesn’t match the design.',
        'Functional-spec analysis and technical design writing before implementation.',
      ],
    },
    {
      period: 'Feb — Jun 2022',
      role: 'Internship — IoT Developer',
      company: 'CES Lab · “Computer & Embedded Systems”',
      bullets: [
        'Developed a medical telemonitoring system integrating IoT technology.',
        'Analyzed and interpreted data streamed from IoT devices for the healthcare monitoring use case.',
        'Worked on the device-integration layer of remote patient monitoring.',
      ],
    },
    {
      period: 'Jul — Aug 2019',
      role: 'Internship — Inventory Management',
      company: 'Vitalait',
      bullets: [
        'Explored and analyzed inventory processes and identified improvement opportunities.',
        'Assisted in optimizing inventory management through workflow enhancements.',
        'Collaborated with team members to streamline processes and improve efficiency.',
      ],
    },
  ],

  education: [
    {
      title: 'Bachelor in Computer Engineering',
      school: 'Higher Institute of Computer Science — Mahdia',
      year: '2022',
      icon: 'degree',
    },
    {
      title: 'High School Diploma',
      school: 'Abu Kacem Chebbi',
      year: '2018',
      icon: 'high-school',
    },
  ],

  certifications: [
    {
      title: 'Odoo 19 Functional Certification',
      issuer: 'Odoo S.A.',
      image: 'Certification_page.jpg',
    },
  ],
};
