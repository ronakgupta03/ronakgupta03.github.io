import {
  Heading,
  Text,
  Button,
  Column,
  Row,
  Schema,
  Meta,
  Line,
  Flex,
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes, social } from "@/resources";
import styles from "./page.module.scss";
import {
  QuickNavButtons,
  InteractiveProjectGrid,
  CodeforcesChart,
  GitHubActivity,
  TerminalWindow,
  BusinessCard3D,
  HeroCompanion,
  CodolioCard,
  CodeforcesHeatmap,
} from "@/components/kryoton-features";
export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="l" gap="xl" paddingY="8" horizontal="center" className={styles.pageEntrance}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={"/images/og/home.jpg"}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Column fillWidth horizontal="center" gap="m">
        <Flex fillWidth paddingX="l" gap="48" s={{ direction: "column", gap: "48" }} style={{ marginTop: "16px", position: "relative" }}>
          <HeroCompanion />
          
          <Column flex={7} gap="32" style={{ minWidth: 0 }}>
            <Text variant="heading-default-xs" onBackground="brand-strong" style={{ letterSpacing: "0.1em" }}>
              [ COMPUTER SCIENCE &middot; AI/ML &middot; SYSTEMS ]
            </Text>

            <Heading as="h1" variant="display-strong-xl">
              {person.name}
            </Heading>

            <Column gap="8">
              <Text variant="heading-strong-l" onBackground="neutral-strong">
                Computer Science Student
              </Text>
              <Heading wrap="balance" variant="display-strong-m" onBackground="neutral-strong">
                Building Systems, Exploring AI, <br /> and Solving Problems.
              </Heading>
            </Column>

            <Text wrap="balance" onBackground="neutral-weak" variant="body-default-m" style={{ maxWidth: "64ch" }}>
              I'm a 3rd-year CS engineering student at VIPS-TC. I build technical projects to understand how software works beneath the abstractions, with interests in systems, AI/ML, algorithms, and competitive programming.
            </Text>
            
            <Row gap="16" wrap>
              <Button href="/work" variant="primary" size="m" weight="default" suffixIcon="chevronRight">
                View my work
              </Button>
              <Button href="/about" variant="secondary" size="m" weight="default">
                About me
              </Button>
              <Button href="https://github.com/ronakgupta03" target="_blank" variant="tertiary" size="m" prefixIcon="github">
                GitHub
              </Button>
              <Button href="/Ronak_Resume.pdf" target="_blank" variant="tertiary" size="m" prefixIcon="document">
                Resume
              </Button>
            </Row>
          </Column>

          <Column flex={5} horizontal="center" vertical="center" style={{ minWidth: 0 }}>
            <div 
              className={styles.heroPhoto}
              style={{
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid var(--neutral-alpha-medium)",
              boxShadow: "0 0 0 8px var(--neutral-alpha-weak), 0 0 0 16px var(--neutral-alpha-weak)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <img 
                src="/images/profile_photo.jpeg" 
                alt="Ronak Gupta Profile" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
          </Column>

        </Flex>

        {/* Full-Width Centered Cyber HUD Navigation Bar spanning below text and profile photo */}
        <Row fillWidth horizontal="center" paddingX="l" paddingTop="24" paddingBottom="8">
          <QuickNavButtons />
        </Row>
      </Column>
      
      {/* Interactive Featured Project Showcase */}
      <Column fillWidth paddingX="l">
        <InteractiveProjectGrid />
      </Column>

      {/* Live Competitive Programming & GitHub Dashboard */}
      <Column fillWidth paddingX="l" id="stats" gap="m">
        <Row fillWidth horizontal="center" paddingBottom="8">
          <Text variant="heading-default-xs" onBackground="brand-strong" style={{ letterSpacing: "0.1em" }}>
            [ THE ARENA // LIVE COMPETITIVE PROGRAMMING &amp; CODOLIO ]
          </Text>
        </Row>
        <div className={styles.arenaGridTop}>
          <CodeforcesChart />
          <CodolioCard />
        </div>
        <div className={styles.arenaGridBottom}>
          <GitHubActivity />
          <CodeforcesHeatmap />
        </div>
      </Column>

      {/* Interactive Retro Terminal */}
      <Column fillWidth paddingX="l" id="terminal" gap="s">
        <Row fillWidth horizontal="center" paddingBottom="8">
          <Text variant="heading-default-xs" onBackground="brand-strong" style={{ letterSpacing: "0.1em" }}>
            [ INTERACTIVE DEVELOPER TERMINAL ]
          </Text>
        </Row>
        <TerminalWindow />
      </Column>

      {/* 3D Interactive Business Card */}
      <Column fillWidth paddingX="l" id="business-card" horizontal="center" gap="s">
        <Row fillWidth horizontal="center" paddingBottom="8">
          <Text variant="heading-default-xs" onBackground="brand-strong" style={{ letterSpacing: "0.1em" }}>
            [ CONNECT &amp; CONTACT ]
          </Text>
        </Row>
        <BusinessCard3D />
      </Column>



      <Row fillWidth paddingY="64" horizontal="center">
        <Line maxWidth={48} />
      </Row>
    </Column>
  );
}
