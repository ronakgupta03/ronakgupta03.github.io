import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text, Column, Tag } from "@once-ui-system/core";

const person: Person = {
  firstName: "Ronak",
  lastName: "Gupta",
  name: `Ronak Gupta`,
  role: "Computer Science Student",
  avatar: "/images/profile_photo.jpeg",
  email: "ronakgupta3305@gmail.com", // Replace with your email address
  location: "Asia/Kolkata", 
  languages: ["English"],
  locale: "en",
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about computer science and engineering</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/ronakgupta03", // Replace with your GitHub URL
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/ronak-gupta-760563215/", // Replace with your LinkedIn URL
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: "Ronak Gupta \u2014 Computer Science Student",
  description: "Portfolio of Ronak Gupta, showcasing systems, algorithms, and AI/ML projects.",
  headline: <>Computer science student building systems, exploring AI, and solving problems.</>,
  featured: {
    display: false,
    title: <></>,
    href: "",
  },
  subline: (
    <>
      I'm a 3rd-year computer science engineering student at VIPS-TC. I build technical projects to understand how software works beneath the abstractions, with interests spanning systems, AI/ML, algorithms, and competitive programming.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: "About \u2014 Ronak Gupta",
  description: `About ${person.name}, a Computer Science student at VIPS-TC`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I'm a 3rd-year computer science engineering student at VIPS-TC interested in AI/ML, systems, and algorithms. I like building technical projects that force me to understand what is happening beneath the abstractions.
      </>
    ),
  },
  work: {
    display: true, 
    title: "Activities & Leadership",
    experiences: [
      {
        company: "ADVAIT VSET",
        timeframe: "Present",
        role: "Technical Lead",
        achievements: [],
        images: [],
      },
      {
        company: "Srijan",
        timeframe: "Present",
        role: "Corporate Affairs & Public Relations",
        achievements: [],
        images: [],
      },
      {
        company: "Freedom Employability Academy",
        timeframe: "Past",
        role: "Assistant to Facilitator and Mentor",
        achievements: [
          <>
            Supported a cohort of 20 students during training sessions by facilitating discussions and learning activities.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education & Certifications",
    institutions: [
      {
        name: "Vivekananda Institute of Professional Studies (VIPS-TC)",
        description: (
          <Column gap="4">
            <Text>B.Tech in Computer Science and Engineering &middot; 2024&ndash;2028</Text>
            <Text onBackground="neutral-alpha-medium">CGPA: 8.804</Text>
          </Column>
        ),
      },
      {
        name: "NPTEL",
        description: (
          <Column gap="4">
            <Text>Mathematical Foundations for ML &middot; IISc Bangalore &middot; Monsoon 2025</Text>
            <Text onBackground="neutral-alpha-medium">Elite Certificate</Text>
          </Column>
        ),
      },
      {
        name: "NPTEL",
        description: (
          <Text>Getting Started with Competitive Programming &middot; IIT Gandhinagar &middot; Spring 2025</Text>
        ),
      },
      {
        name: "IIT Roorkee",
        description: (
          <Text>Summer Training in Cyber Security and AI/ML &middot; June&ndash;July 2025</Text>
        ),
      },
      {
        name: "IOQM",
        description: (
          <Text>Indian Olympiad Qualifier in Mathematics &middot; 2023</Text>
        ),
      }
    ],
  },
  technical: {
    display: true, 
    title: "Technical skills",
    skills: [
      {
        title: "Programming",
        description: (
          <Row gap="16" wrap>
            {['C', 'C++', 'Python', 'Java', 'PHP', 'JavaScript', 'Assembly', 'Bash'].map(skill => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </Row>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Data & Databases",
        description: (
          <Row gap="16" wrap>
            {['MySQL', 'PostgreSQL'].map(skill => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </Row>
        ),
        tags: [],
        images: [],
      },
      {
        title: "AI / ML / Data",
        description: (
          <Row gap="16" wrap>
            {['NumPy', 'pandas', 'matplotlib', 'scikit-learn', 'OpenCV', 'YOLO'].map(skill => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </Row>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Tools & Environments",
        description: (
          <Row gap="16" wrap>
            {['Git', 'Jupyter Notebook', 'VS Code', 'Vim', 'Arduino', 'LaTeX', 'Arch Linux'].map(skill => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </Row>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Other",
        description: (
          <Row gap="16" wrap>
            <Tag>PyWhatKit</Tag>
          </Row>
        ),
        tags: [],
        images: [],
      },

      {
        title: "Competitive Programming",
        description: (
          <Column gap="8">
            <Row gap="24" wrap padding="24" border="neutral-medium" radius="l" background="surface">
              <Column gap="4">
                <Text variant="heading-strong-l" onBackground="neutral-strong">1193</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">Current Rating</Text>
              </Column>
              <Column gap="4">
                <Text variant="heading-strong-l" onBackground="neutral-strong">1193</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">Max Rating</Text>
              </Column>
              <Column gap="4">
                <Text variant="heading-strong-l" onBackground="neutral-strong">248+</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">Problems Solved</Text>
              </Column>
              <Column gap="4">
                <Text variant="heading-strong-l" onBackground="neutral-strong">Newbie</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">Rank (7 to Pupil)</Text>
              </Column>
            </Row>
            <Text onBackground="brand-strong">
              <a href="https://codeforces.com/profile/the.ronak.gupta" target="_blank" rel="noopener noreferrer">Codeforces Profile &rarr;</a>
            </Text>
          </Column>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Currently Learning",
        description: (
          <Row gap="16" wrap>
            <Tag>Deep Learning</Tag>
            <Tag>Algorithms</Tag>
            <Tag>Competitive Programming</Tag>
            <Tag>LLM Agents</Tag>
            <Tag>Systems</Tag>
          </Row>
        ),
        tags: [],
        images: [],
      }
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing \u2014 Ronak Gupta",
  description: `Articles and research by ${person.name}`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: "Selected Work \u2014 Ronak Gupta",
  description: `Systems and software projects by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [], 
};

export { person, social, newsletter, home, about, blog, work, gallery };
