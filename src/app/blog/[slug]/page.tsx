import Link from 'next/link';
import { TAGS } from '~/constant';
import { Post } from '~/types';
import store from '~/store';

export async function generateStaticParams() {
  const posts: Post[] = await fetch(
    'https://jsonplaceholder.typicode.com/posts',
  ).then(res => res.json());

  return posts.map(post => ({ slug: `${post.id}` }));
}

const getPost = async (slug: string) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${slug}`,
    {
      next: {
        tags: [TAGS.INDIVIDUAL, TAGS.INDIVIDUAL_WITH_ID.replace('{ID}', slug)],
      },
    },
  );
  const data: Post = await res.json();

  const generatedOn = new Date().toISOString();

  await store.delay();

  return { post: data, generatedOn };
};

interface PageProps {
  params: { slug: string };
}
export default async function Page(props: PageProps) {
  const { slug } = props.params;
  const data = await getPost(slug);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="container">
        <h1 className="font-bold text-gray-500 dark:text-gray-400">
          Generated on: {data.generatedOn}
        </h1>

        <h2 className="text-lg font-semibold">{data.post.title}</h2>

        <p className="text-gray-600 dark:text-gray-400">{data.post.body}</p>

        <Link
          href="/blog"
          className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Back to blog
        </Link>
      </div>
    </div>
  );
}
