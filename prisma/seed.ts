import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Initialize Prisma with adapter for Prisma 7
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env.local');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const heroData = {
  fullName: 'John Doe',
  professionalTitle: 'Full-Stack Developer',
  tagline: 'Building elegant solutions to complex problems',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  resumeLink: '/resume.pdf',
  githubLink: 'https://github.com/johndoe',
  linkedinLink: 'https://linkedin.com/in/johndoe',
  email: 'yenesh2022@gmail.com',
};

const aboutData = {
  summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.',
  careerGoals: 'To lead innovative projects that make a positive impact on users lives while continuously learning and growing as a developer.',
  bio: 'When I\'m not coding, you can find me contributing to open-source projects, writing technical blogs, or exploring new technologies. I believe in writing clean, maintainable code and following best practices.',
};

const skillsData = [
  { name: 'React', category: 'Frontend', proficiency: 95 },
  { name: 'Next.js', category: 'Frontend', proficiency: 90 },
  { name: 'TypeScript', category: 'Frontend', proficiency: 88 },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92 },
  { name: 'Node.js', category: 'Backend', proficiency: 90 },
  { name: 'Express', category: 'Backend', proficiency: 85 },
  { name: 'PostgreSQL', category: 'Backend', proficiency: 82 },
  { name: 'Prisma', category: 'Backend', proficiency: 80 },
  { name: 'TensorFlow', category: 'Machine Learning', proficiency: 75 },
  { name: 'Python', category: 'Machine Learning', proficiency: 85 },
  { name: 'Git', category: 'Tools', proficiency: 90 },
  { name: 'Docker', category: 'Tools', proficiency: 78 },
];

const projectsData = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    githubLink: 'https://github.com/johndoe/ecommerce',
    liveLink: 'https://ecommerce-demo.vercel.app',
    featured: true,
    category: 'Web Development',
  },
  {
    title: 'AI Chat Application',
    description: 'Real-time chat application with AI-powered responses using OpenAI API.',
    technologies: ['React', 'Node.js', 'Socket.io', 'OpenAI'],
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
    githubLink: 'https://github.com/johndoe/ai-chat',
    liveLink: 'https://ai-chat-demo.vercel.app',
    featured: true,
    category: 'AI/ML',
  },
  {
    title: 'Task Management System',
    description: 'Collaborative task management tool with real-time updates and team features.',
    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    githubLink: 'https://github.com/johndoe/task-manager',
    liveLink: 'https://tasks-demo.vercel.app',
    featured: false,
    category: 'Web Development',
  },
];

const experienceData = [
  {
    role: 'Senior Full-Stack Developer',
    company: 'Tech Corp',
    duration: 'Jan 2022 - Present',
    description: 'Leading development of enterprise web applications and mentoring junior developers.',
    responsibilities: [
      'Architected and developed scalable microservices using Node.js and Docker',
      'Led a team of 5 developers in agile environment',
      'Improved application performance by 40% through optimization',
      'Implemented CI/CD pipelines reducing deployment time by 60%',
    ],
  },
  {
    role: 'Full-Stack Developer',
    company: 'StartUp Inc',
    duration: 'Jun 2020 - Dec 2021',
    description: 'Developed and maintained multiple client projects using modern web technologies.',
    responsibilities: [
      'Built responsive web applications using React and Next.js',
      'Designed and implemented RESTful APIs',
      'Collaborated with designers to implement pixel-perfect UIs',
      'Reduced bug reports by 50% through comprehensive testing',
    ],
  },
];

const educationData = [
  {
    institution: 'University of Technology',
    degree: 'Bachelor of Science in Computer Science',
    year: '2016 - 2020',
    description: 'Graduated with honors. Focused on software engineering, algorithms, and machine learning.',
  },
  {
    institution: 'Tech Academy',
    degree: 'Full-Stack Web Development Bootcamp',
    year: '2019',
    description: 'Intensive 6-month program covering modern web development technologies and best practices.',
  },
];

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.contact.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.about.deleteMany();
  await prisma.hero.deleteMany();
  console.log('✓ Cleared existing data');

  // Seed Hero
  await prisma.hero.create({ data: heroData });
  console.log('✓ Hero data seeded');

  // Seed About
  await prisma.about.create({ data: aboutData });
  console.log('✓ About data seeded');

  // Seed Skills
  await prisma.skill.createMany({ data: skillsData });
  console.log('✓ Skills data seeded');

  // Seed Projects
  await prisma.project.createMany({ data: projectsData });
  console.log('✓ Projects data seeded');

  // Seed Experience
  await prisma.experience.createMany({ data: experienceData });
  console.log('✓ Experience data seeded');

  // Seed Education
  await prisma.education.createMany({ data: educationData });
  console.log('✓ Education data seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log('\nYou can now:');
  console.log('1. Visit http://localhost:3001 to see your portfolio');
  console.log('2. Login to admin at http://localhost:3001/admin/login');
  console.log('   Email: yeneshdabot2022@gmail.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
