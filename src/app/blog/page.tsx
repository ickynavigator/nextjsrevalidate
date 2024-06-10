import Link from 'next/link';
import { TAGS } from '~/constant';
import { Post } from '~/types';
import store from '~/store';

const getPostList = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: {
      tags: [TAGS.BLOG_LIST],
    },
  });
  const data: Post[] = await res.json();

  const generatedOn = new Date().toISOString();

  await store.delay();

  return { posts: data, generatedOn };
};

export default async function Page() {
  const data = await getPostList();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="font-bold text-gray-500 dark:text-gray-400">
        Generated on: {data.generatedOn}
      </h1>

      <h2 className="text-lg font-semibold">Blog Posts</h2>

      <ul className="list-disc">
        {data.posts.map(item => (
          <li key={item.id} className="group">
            <Link
              href={`/blog/${item.id}`}
              className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              {item.title}

              <ArrowIcon />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 ms-2 rtl:rotate-180 transform transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:rtl:rotate-0 group-hover:rotate-180"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 10"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 5h12m0 0L9 1m4 4L9 9"
      />
    </svg>
  );
}
