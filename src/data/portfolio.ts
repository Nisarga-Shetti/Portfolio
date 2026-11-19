export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface EducationItem {
  degree: string;
  place: string;
  score: string;
  period: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  link: string;
}

export interface Project {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
  featured?: boolean;
}

export interface Link {
  label: string;
  url: string;
  icon: string;
}

export const profile = {
  name: 'Nisarga Shetti',
  role: 'Full Stack Developer',
  intro:
    'A passionate fresher Full Stack Developer focused on building modern, scalable and user-friendly web applications. I turn ideas into clean code and impactful digital experiences using the power of technology.',
  email: 'nisarga.shetti@example.com',
  resumePath: '/Nisarga_Shetti_Resume.pdf',
};

export const about = {
  text: "I'm interested in full-stack development, problem-solving, responsive interfaces, databases, and building useful software. I enjoy turning ideas into reality — crafting clean, working applications from end to end, and continuously learning the tools that make that possible.",
  features: [
    {
      icon: 'Code2',
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code.',
    },
    {
      icon: 'Lightbulb',
      title: 'Problem Solving',
      description: 'Turning complex problems into simple solutions.',
    },
    {
      icon: 'Users',
      title: 'Team Player',
      description: 'Collaborating to build better products.',
    },
  ] as Feature[],
  stats: [
    { value: '4+', label: 'Projects Completed' },
    { value: '2+', label: 'Years of Learning' },
    { value: '100%', label: 'Passion' },
  ] as Stat[],
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'about', label: 'About', icon: 'User' },
  { id: 'skills', label: 'Skills', icon: 'Cpu' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'projects', label: 'Projects', icon: 'Code' },
  { id: 'certifications', label: 'Certifications', icon: 'Award' },
  { id: 'resume', label: 'Resume', icon: 'FileText' },
  { id: 'contact', label: 'Contact', icon: 'Mail' },
];

export const education: EducationItem[] = [
  {
    degree: 'BSc Computer Science and Mathematics',
    place: "Alva's College, Moodbidri",
    score: '85.42%',
    period: '2021 — 2024',
  },
  {
    degree: 'PUC PCMB',
    place: 'Sri Bhuvanendra P.U. College, Karkala',
    score: '74.6%',
    period: '2019 — 2021',
  },
  {
    degree: 'SSLC',
    place: 'K.S.P.M. Government High School, Pervaje, Karkala',
    score: '80.96%',
    period: '2019',
  },
];

export const certifications: Certification[] = [];

export const projects: Project[] = [
  {
    title: 'Construction360',
    tag: 'Project Management System',
    description:
      'Smart construction project management concept connecting building planning, blueprint design, project tracking and construction workflows.',
    tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/nisargashetti/Construction360',
    featured: true,
  },
  {
    title: 'Online Shopping',
    tag: 'E-commerce Application',
    description:
      'Product browsing, authentication, cart workflows and order management.',
    tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/nisargashetti',
    featured: true,
  },
  {
    title: 'Student Management System',
    tag: 'Information Management',
    description:
      'Organizes student records and administrative workflows.',
    tech: ['PHP', 'MySQL'],
    github: 'https://github.com/nisargashetti/Student-Management-System',
  },
  {
    title: 'CarConnect',
    tag: 'Vehicle Web App',
    description: 'Browsing and connecting with vehicle listings.',
    tech: ['PHP', 'MySQL', 'JavaScript'],
    github: 'https://github.com/nisargashetti/CarConnect',
  },
  {
    title: 'Job Portal',
    tag: 'Web Application',
    description: 'Connecting job seekers with opportunities.',
    tech: ['PHP', 'MySQL', 'HTML', 'CSS'],
    github: 'https://github.com/nisargashetti/Job-Portal',
  },
  {
    title: 'Amazon Clone',
    tag: 'E-commerce UI',
    description: 'Product presentation and shopping UI.',
    tech: ['React', 'JavaScript', 'CSS'],
    github: 'https://github.com/nisargashetti/Amazon-Clone',
  },
  {
    title: 'Calculator',
    tag: 'Utility App',
    description: 'Interactive calculations and interface design.',
    tech: ['JavaScript', 'HTML', 'CSS'],
    github: 'https://github.com/nisargashetti/Calculator',
  },
  {
    title: 'Live Clock',
    tag: 'Mini Project',
    description: 'Real-time clock showing JavaScript date and time handling.',
    tech: ['JavaScript', 'HTML', 'CSS'],
    github: 'https://github.com/nisargashetti/Live-Clock',
  },
];

export const links: Link[] = [
  { label: 'Email', url: 'mailto:nisarga.shetti@example.com', icon: 'Mail' },
  { label: 'GitHub', url: 'https://github.com/Nisarga-Shetti', icon: 'Github' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nisarga-shetti',
    icon: 'Linkedin',
  },
];

export const hudLocations: Record<string, string> = {
  home: 'SYS ONLINE · EARTH ORBIT',
  about: 'SOL SYSTEM · OVERVIEW',
  skills: 'SATURN · RING DOCK',
  education: 'MARS · ASTEROID BELT',
  projects: 'JUPITER · GAS GIANT',
  certifications: 'NEPTUNE · OUTER REACH',
  resume: 'DEEP SPACE · SPIRAL GALAXY',
  contact: 'EARTH ORBIT · HOME',
};

export const loaderLines = [
  'Initializing systems\u2026',
  'Aligning orbit\u2026',
  'Docking complete.',
];
