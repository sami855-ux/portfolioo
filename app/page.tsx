import About from '@/components/About';
import Contact from '@/components/Contact';
import Education from '@/components/Education';
import Experience from '@/components/Experience';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import { headers } from 'next/headers';

async function getData() {
  const headersList = await headers();
  const host = headersList.get('host');

  const protocol =
    process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const baseUrl = `${protocol}://${host}`;
  console.log(baseUrl, host, protocol);

  try {
    const [hero, about, skills, projects, experience, education] =
      await Promise.all([
        fetch(`${baseUrl}/api/hero`, { cache: 'no-store' }).then((r) =>
          r.json()
        ),
        fetch(`${baseUrl}/api/about`, { cache: 'no-store' }).then((r) =>
          r.json()
        ),
        fetch(`${baseUrl}/api/skills`, { cache: 'no-store' }).then((r) =>
          r.json()
        ),
        fetch(`${baseUrl}/api/projects`, { cache: 'no-store' }).then((r) =>
          r.json()
        ),
        fetch(`${baseUrl}/api/experience`, { cache: 'no-store' }).then((r) =>
          r.json()
        ),
        fetch(`${baseUrl}/api/education`, { cache: 'no-store' }).then((r) =>
          r.json()
        ),
      ]);

    return {
      hero,
      about,
      skills,
      projects,
      experience,
      education,
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      hero: {},
      about: {},
      skills: [],
      projects: [],
      experience: [],
      education: [],
    };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <>
      {data.hero?.fullName && <Hero data={data.hero} />}
      {data.about?.summary && <About data={data.about} />}
      {data.skills?.length > 0 && <Skills data={data.skills} />}
      {data.projects?.length > 0 && <Projects data={data.projects} />}
      {data.experience?.length > 0 && (
        <Experience data={data.experience} />
      )}
      {data.education?.length > 0 && (
        <Education data={data.education} />
      )}

      <Contact />
      <Navbar />
    </>
  );
}