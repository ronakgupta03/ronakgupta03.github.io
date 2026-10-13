"use client";

import {
  AvatarGroup,
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from "@once-ui-system/core";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  subtitle?: string;
  tags?: string;
  metric?: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  linkText?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  subtitle,
  tags,
  metric,
  content,
  description,
  avatars,
  link,
  linkText,
}) => {
  return (
    <Column fillWidth gap="8">
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        items={images.map((image) => ({
          slide: image,
          alt: title,
        }))}
      />
      <Flex
        s={{ direction: "column" }}
        fillWidth
        paddingX="s"
        paddingTop="8"
        paddingBottom="16"
        gap="12"
      >
        {title && (
          <Column flex={5} gap="8">
            <Heading as="h2" wrap="balance" variant="heading-strong-xl">
              {title}
            </Heading>
            {subtitle && (
              <Text variant="heading-default-m" onBackground="neutral-weak">
                {subtitle}
              </Text>
            )}
          </Column>
        )}
        {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
          <Column flex={7} gap="8">
            {avatars?.length > 0 && <AvatarGroup avatars={avatars} size="m" reverse />}
            {description?.trim() && (
              <Text wrap="balance" variant="body-default-m" onBackground="neutral-weak">
                {description}
              </Text>
            )}
            {(tags || metric) && (
              <Flex gap="8" wrap vertical="center">
                {tags && (
                  <Text variant="body-default-s" onBackground="brand-weak">
                    {tags}
                  </Text>
                )}
                {tags && metric && <Text variant="body-default-s" onBackground="neutral-alpha-medium">&middot;</Text>}
                {metric && (
                  <Text variant="body-default-s" onBackground="neutral-strong">
                    {metric}
                  </Text>
                )}
              </Flex>
            )}
            <Flex gap="16" wrap paddingTop="8">
              {content?.trim() && (
                <SmartLink
                  suffixIcon="arrowRight"
                  style={{ margin: "0", width: "fit-content" }}
                  href={href}
                >
                  <Text variant="body-default-s">View case study</Text>
                </SmartLink>
              )}
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: "0", width: "fit-content" }}
                  href={link}
                >
                  <Text variant="body-default-s">{linkText || "View project"}</Text>
                </SmartLink>
              )}
            </Flex>
          </Column>
        )}
      </Flex>
    </Column>
  );
};
