import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import { baseURL, blog, person } from "@/resources";
import { Posts } from "@/components/blog/Posts";
import { TuxPagesLiveFeed } from "@/components/blog/TuxPagesLiveFeed";
import { getPosts } from "@/utils/utils";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: "/images/og/home.jpg",
    path: blog.path,
  });
}

export default function Blog() {
  const allBlogs = getPosts(["src", "app", "blog", "posts"]);
  const hasPosts = allBlogs.length > 0;

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={"/images/og/home.jpg"}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24" wrap="balance">
        Writing about systems, algorithms, AI, and things I'm learning along the way.
      </Heading>
      <Column fillWidth flex={1} gap="40" paddingLeft="24">
        <TuxPagesLiveFeed />
        {hasPosts ? (
          <>
            <Posts range={[1, 1]} thumbnail />
            <Posts range={[2, 3]} columns="2" thumbnail direction="column" />
            <Heading as="h2" variant="heading-strong-xl">
              Earlier posts
            </Heading>
            <Posts range={[4]} columns="2" />
          </>
        ) : (
          <Text variant="body-default-m" onBackground="neutral-weak">
            Articles, notes, and research will appear here as I publish them.
          </Text>
        )}
      </Column>
    </Column>
  );
}
