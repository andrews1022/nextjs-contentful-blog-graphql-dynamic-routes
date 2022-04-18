// next
import type { GetStaticProps, NextPage } from 'next';

// components
import BlogPosts from '../components/BlogPosts/BlogPosts';

// utils
import { gql } from '../utils/gql';

// graphql fragments
import { FRAGMENT_CONTENTFUL_IMAGE } from '../graphql/fragments';

// custom types
import type { ContentfulBlogPost } from '../types/contentful';
import { MainHeading } from '../components/UI/MainHeading';

type GraphQLResponse = {
  data: {
    blogPostCollection: {
      items: ContentfulBlogPost[];
    };
  };
};

export const getStaticProps: GetStaticProps = async () => {
  // get contentful data
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        query: gql`
          query HomepageQuery {
            blogPostCollection(order: [datePublished_DESC]) {
              items {
                categoriesCollection {
                  items {
                    sys {
                      id
                    }
                    name
                    slug
                  }
                }
                content
                image {
                  ...ImageFields
                }
                previewText
                slug
                sys {
                  id
                }
                title
              }
            }
          }

          ${FRAGMENT_CONTENTFUL_IMAGE}
        `
      })
    }
  );

  const { data }: GraphQLResponse = await response.json();

  return {
    props: {
      data
    }
  };
};

type HomeProps = GraphQLResponse;

const Home: NextPage<HomeProps> = ({ data }) => (
  <main>
    <MainHeading>Blog Posts</MainHeading>

    <BlogPosts posts={data.blogPostCollection.items} />
  </main>
);

export default Home;
