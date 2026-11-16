import { MDXRemote } from 'next-mdx-remote/rsc';

/** Renders plain-Markdown MDX bodies with brand prose styles. */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose-brand">
      <MDXRemote source={source} />
    </div>
  );
}
