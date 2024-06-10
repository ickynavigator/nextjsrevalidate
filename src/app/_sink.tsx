'use client';
import { useDebounce, useSessionStorage } from '@uidotdev/usehooks';

import { useEffect, useRef, useState } from 'react';
import { TAGS } from '~/constant';
import store from '~/store';
import {
  revalidateAppPath,
  revalidateBlogDynamicPath,
  revalidateBlogPath,
  revalidateBlogSlugIndividualPath,
  revalidateTagList,
} from './actions';

const tagList = Object.keys(TAGS);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?:
    | ((e: React.MouseEvent<HTMLButtonElement>) => Promise<void>)
    | ((e: React.MouseEvent<HTMLButtonElement>) => void);
}
function Button({ children, ...props }: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    await props.onClick?.(e);
    setLoading(false);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      data-loading={loading}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:text-white data-[loading=true]:bg-gray-400 data-[loading=true]:cursor-wait data-[loading=true]:hover:bg-gray-400 inline-flex items-center"
    >
      {loading && (
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 me-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default function Sink() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openSink = () => {
    dialogRef.current?.showModal();
  };

  const closeSink = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <div className="static">
        <div className="absolute bottom-10 right-10">
          <Button onClick={openSink}>Play</Button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="w-[60%] h-[70%] rounded-lg shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <div className="relative w-full h-full">
          <div className="flex items-center justify-between p-4 md:p-5 border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold">Play</h3>

            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeSink}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 md:p-5">
            <Tools />
          </div>
        </div>
      </dialog>
    </>
  );
}

function Tools() {
  const [pathType, setPathType] = useState<string | undefined>(undefined);
  const [slug, setSlug] = useState('1');

  const [selectedTags, setSelectedTags] = useState(
    tagList.map(tl => ({ tag: tl, checked: false })),
  );

  const handleRevalidateTag = async () => {
    const tags = selectedTags.filter(t => t.checked).map(t => t.tag);
    revalidateTagList({ tags });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="border rounded w-full p-4 flex flex-col gap-4">
        <p>Revalidate Paths</p>

        <div>
          <label
            htmlFor="revalidatePathType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Type
          </label>
          <select
            id="revalidatePathType"
            value={pathType}
            onChange={e => {
              if (e.target.value === 'default') {
                setPathType(undefined);
                return;
              }
              setPathType(e.target.value);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={'default'}>Select a type</option>
            <option value="page">Page</option>
            <option value="layout">Layout</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="revalidatePathSlug"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Slug
          </label>
          <input
            type="number"
            id="revalidatePathSlug"
            min={1}
            max={100}
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 [&>*]:grow [&>*]:basis-0 [&>*]:shrink">
          <Button onClick={() => revalidateAppPath({ type: pathType })}>
            /
          </Button>
          <Button onClick={() => revalidateBlogPath({ type: pathType })}>
            /blog
          </Button>
          <Button onClick={() => revalidateBlogDynamicPath({ type: pathType })}>
            /blog/[slug]
          </Button>
          <Button
            onClick={() =>
              revalidateBlogSlugIndividualPath({ type: pathType, slug })
            }
            disabled={slug === ''}
          >
            /blog/{slug}
          </Button>
        </div>
      </div>

      <div className="border rounded w-full p-4 flex flex-col gap-4">
        <p>Revalidate Tags</p>

        {tagList.map(tag => (
          <div className="flex items-center" key={tag}>
            <input
              checked={selectedTags.find(t => t.tag === tag)?.checked}
              id={`tag-${tag}`}
              type="checkbox"
              onChange={e => {
                const checked = e.target.checked;

                setSelectedTags(prev =>
                  prev.map(t => (t.tag === tag ? { ...t, checked } : t)),
                );
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />

            <label
              htmlFor={`tag-${tag}`}
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {tag}
            </label>
          </div>
        ))}

        <div className="flex flex-wrap gap-2 [&>*]:grow [&>*]:basis-0 [&>*]:shrink">
          <Button
            onClick={handleRevalidateTag}
            disabled={selectedTags.every(t => !t.checked)}
          >
            Revalidate Selected
          </Button>
        </div>
      </div>

      <Delay />
    </div>
  );
}

function Delay() {
  const [fetchDelay, setCount] = useSessionStorage(
    store.sink.KEYS.fetchDelay,
    0,
  );
  const [fakeFetchDelay, setFakeFetchDelay] = useState(fetchDelay);
  const debouncedFetchDelay = useDebounce(fakeFetchDelay, 300);

  useEffect(() => {
    setCount(debouncedFetchDelay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFetchDelay]);
  return (
    <>
      <div className="border rounded w-full p-4 flex flex-col gap-4">
        <div>
          <label
            htmlFor="fetchDelay"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Current Simulated Delay: {fakeFetchDelay}ms
          </label>
          <input
            type="range"
            id="fetchDelay"
            name="fetchDelay"
            className="w-full h-2 bg-white-200 rounded-lg appearance-none cursor-pointer dark:bg-white-700"
            min={0}
            max={5000}
            value={fakeFetchDelay}
            onChange={e => setFakeFetchDelay(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-wrap gap-2 [&>*]:grow [&>*]:basis-0 [&>*]:shrink">
          <Button onClick={() => setFakeFetchDelay(0)}>No Delay</Button>
          <Button onClick={() => setFakeFetchDelay(2_500)}>2500</Button>
          <Button onClick={() => setFakeFetchDelay(5_000)}>5000</Button>
        </div>
      </div>
    </>
  );
}
