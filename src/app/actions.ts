'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

type RevalidateType = 'layout' | 'page';

interface RevalidatePathOpts {
  type?: string;
}

export async function revalidateAppPath(opts: RevalidatePathOpts) {
  revalidatePath('/', opts.type as RevalidateType);
}

export async function revalidateBlogPath(opts: RevalidatePathOpts) {
  revalidatePath('/blog', opts.type as RevalidateType);
}

export async function revalidateBlogDynamicPath(opts: RevalidatePathOpts) {
  revalidatePath('/blog/[slug]', opts.type as RevalidateType);
}

export async function revalidateBlogSlugIndividualPath(
  opts: RevalidatePathOpts & { slug: string },
) {
  revalidatePath(`/blog/${opts.slug}`, opts.type as RevalidateType);
}

interface RevalidateTagOpts {
  tags: string[];
}

export async function revalidateTagList(opts: RevalidateTagOpts) {
  opts.tags.forEach(tag => revalidateTag(tag));
}
