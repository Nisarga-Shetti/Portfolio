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
    title: 'Frontend',
    icon: Code2,
    color: '#22E4FF',
    skills: [
      { name: 'HTML5', icon: Codepen, description: 'Semantic markup and modern HTML5 features.' },
      { name: 'CSS3', icon: Boxes, description: 'Responsive layouts, flexbox, grid, and animations.' },
      { name: 'JavaScript', icon: FileCode2, description: 'ES6+, DOM manipulation, and async patterns.' },
      { name: 'React', icon: Code2, description: 'Component-driven UI with hooks and state management.' },
    ],
  },
  {
    title: 'Backend',
    icon: Code2,
    color: '#A855F7',
    skills: [
      { name: 'PHP', icon: FileCode2, description: 'Server-side scripting and RESTful API development.' },
      { name: 'Python', icon: Code2, description: 'Scripting, automation, and backend logic.' },
      { name: 'Flask', icon: Cloud, description: 'Lightweight Python web framework for APIs.' },
    ],
  },
  {
    title: 'Database',
    icon: Database,
    color: '#C084FC',
    skills: [
      { name: 'MySQL', icon: Database, description: 'Relational database design and querying.' },
      { name: 'Schema Design', icon: GitBranch, description: 'Normalized data modeling and optimization.' },
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
