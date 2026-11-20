import type { LucideIcon } from 'lucide-react';
import {
  Code2,
  FileCode2,
  Database,
  GitBranch,
  Monitor,
  Codepen,
  Boxes,
  Cloud,
  BarChart3,
  Server,
} from 'lucide-react';

export interface SkillCategory {
  title: string;
  icon: LucideIcon;
  color: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  icon: LucideIcon;
  description: string;
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    icon: Code2,
    color: '#22E4FF',
    skills: [
      { name: 'JavaScript', icon: FileCode2, description: 'ES6+, DOM manipulation, and asynchronous programming.' },
      { name: 'TypeScript', icon: Code2, description: 'Strongly typed JavaScript for scalable applications.' },
      { name: 'Python', icon: Code2, description: 'Programming, scripting, and automation.' },
      { name: 'SQL', icon: Database, description: 'Database queries and data management.' },
      { name: 'PHP', icon: FileCode2, description: 'Server-side scripting and web development.' },
      { name: 'C', icon: Code2, description: 'Programming fundamentals and problem solving.' },
      { name: 'R', icon: BarChart3, description: 'Statistical computing and data analysis.' },
    ],
  },
  {
    title: 'Frontend',
    icon: Code2,
    color: '#22E4FF',
    skills: [
      { name: 'HTML5', icon: Codepen, description: 'Semantic markup and modern HTML5 features.' },
      { name: 'CSS3', icon: Boxes, description: 'Responsive layouts, flexbox, grid, and animations.' },
      { name: 'React', icon: Code2, description: 'Component-driven UI with hooks and state management.' },
      { name: 'JSX', icon: FileCode2, description: 'JavaScript XML syntax for React components.' },
    ],
  },
  {
    title: 'Backend',
    icon: Code2,
    color: '#A855F7',
    skills: [
      { name: 'Node.js', icon: Server, description: 'JavaScript runtime for server-side development.' },
      { name: 'Express.js', icon: Code2, description: 'Backend framework for building web applications and APIs.' },
      { name: 'REST APIs', icon: Cloud, description: 'Building and integrating RESTful services.' },
    ],
  },
  {
    title: 'Database',
    icon: Database,
    color: '#C084FC',
    skills: [
      { name: 'MySQL', icon: Database, description: 'Relational database design and querying.' },
      { name: 'DBMS', icon: Database, description: 'Database management systems and data organization.' },
    ],
  },
  {
    title: 'Data Science & Machine Learning',
    icon: Brain,
    color: '#22E4FF',
    skills: [
      { name: 'NumPy', icon: Brain, description: 'Numerical computing and array operations.' },
      { name: 'Pandas', icon: Database, description: 'Data manipulation and analysis.' },
      { name: 'scikit-learn', icon: Brain, description: 'Machine learning models and data preprocessing.' },
      { name: 'Matplotlib', icon: BarChart3, description: 'Data visualization and plotting.' },
      { name: 'Seaborn', icon: BarChart3, description: 'Statistical data visualization.' },
    ],
  },
  {
    title: 'Tools',
    icon: Monitor,
    color: '#F0ABFC',
    skills: [
      { name: 'Git', icon: GitBranch, description: 'Version control and collaborative workflows.' },
      { name: 'GitHub', icon: GitBranch, description: 'Repository hosting, PRs, and CI/CD.' },
      { name: 'VS Code', icon: Monitor, description: 'Primary IDE with extensions and debugging.' },
    ],
  },
];


