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
  name: 'Nisarga Nagaraj Shetti',
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
    description: 'A construction project management application.',
    tech: ['PHP'],
    github: 'https://github.com/Nisarga-Shetti/Construction360',
    featured: true,
  },
  {
    title: 'Collab-AI',
    tag: 'Collaboration Application',
    description: 'A collaborative application built with TypeScript.',
    tech: ['TypeScript'],
    github: 'https://github.com/Nisarga-Shetti/Collab-AI',
    featured: true,
  },
  {
    title: 'Online Shopping',
    tag: 'E-commerce Application',
    description: 'An online shopping web application.',
    tech: ['PHP'],
    github: 'https://github.com/Nisarga-Shetti/Online-Shopping',
    featured: true,
  },
  {
    title: 'QR Code Generator',
    tag: 'Utility Application',
    description: 'A tool for generating QR codes.',
    tech: ['CSS'],
    github: 'https://github.com/Nisarga-Shetti/QR-Code-Generator',
  },
  {
    title: 'Movie Searcher',
    tag: 'Search Application',
    description: 'A movie search web application.',
    tech: ['JavaScript'],
    github: 'https://github.com/Nisarga-Shetti/Movie-Searcher',
  },
  {
    title: 'Weather Application',
    tag: 'Weather Application',
    description: 'A web application for weather information.',
    tech: ['JavaScript'],
    github: 'https://github.com/Nisarga-Shetti/Weather-Application',
  },
  {
    title: 'Quiz Application',
    tag: 'Quiz Application',
    description: 'An interactive quiz application.',
    tech: ['JavaScript'],
    github: 'https://github.com/Nisarga-Shetti/Quiz-Application',
  },
  {
    title: 'Expense Tracker',
    tag: 'Finance Utility',
    description: 'An application for tracking expenses.',
    tech: ['JavaScript'],
    github: 'https://github.com/Nisarga-Shetti/Expense-Tracker',
  },
  {
    title: 'Password Generator',
    tag: 'Utility Application',
    description: 'A tool for generating passwords.',
    tech: ['JavaScript'],
    github: 'https://github.com/Nisarga-Shetti/Password-Generator',
  },
  {
    title: 'Responsive Login Signup',
    tag: 'Authentication UI',
    description: 'A responsive login and signup interface.',
    tech: ['CSS'],
    github: 'https://github.com/Nisarga-Shetti/Responsive-login-signup-',
  },
  {
    title: 'Job Portal',
    tag: 'Job Application',
    description: 'A job portal web application.',
    tech: [],
    github: 'https://github.com/Nisarga-Shetti/Job-Portal',
  },
  {
    title: 'Form',
    tag: 'Web Application',
    description: 'A form-based web application.',
    tech: ['PHP'],
    github: 'https://github.com/Nisarga-Shetti/Form',
  },
  {
    title: 'Time Table',
    tag: 'Mini Project',
    description: 'A timetable web project.',
    tech: ['HTML'],
    github: 'https://github.com/Nisarga-Shetti/Time-table',
  },
  {
    title: 'Simple Calculator',
    tag: 'Utility Application',
    description: 'A simple calculator application.',
    tech: ['HTML'],
    github: 'https://github.com/Nisarga-Shetti/Simple-calculator',
  },
  {
    title: 'Live Clock',
    tag: 'Mini Project',
    description: 'A live clock application.',
    tech: ['HTML'],
    github: 'https://github.com/Nisarga-Shetti/Live-Clock',
  },
  {
    title: 'Calculator',
    tag: 'Utility Application',
    description: 'A calculator web project.',
    tech: ['HTML'],
    github: 'https://github.com/Nisarga-Shetti/Calculator',
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

export const socialLinks: Link[] = [
  { label: 'GitHub', url: 'https://github.com/Nisarga-Shetti', icon: 'Github' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nisarga-nagaraj-shetti933',
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
