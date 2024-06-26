import Link from 'next/link';
import { TAGS } from '~/constant';
import store from '~/store';
import { User } from '~/types';

const serverInfo = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1', {
    next: {
      tags: [TAGS.ROOT],
    },
  });
  const data: User = await res.json();

  const generatedOn = new Date().toISOString();

  await store.delay();

  return { user: data, generatedOn };
};

export default async function Page() {
  const data = await serverInfo();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="font-bold text-gray-500 dark:text-gray-400">
        Generated on: {data.generatedOn}
      </h1>

      <h2 className="text-lg font-semibold">{data.user.name}</h2>

      <p className="text-gray-600 dark:text-gray-400">{data.user.id}</p>

      <Link
        href="/blog"
        className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
      >
        Blog List
      </Link>
    </div>
  );
}
