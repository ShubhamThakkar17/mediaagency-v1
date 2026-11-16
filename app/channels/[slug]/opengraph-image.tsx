import { getAllChannels, getChannel } from '@/lib/channels';
import { categoryTitle } from '@/data/categories';
import { OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Channel overview';

export function generateStaticParams() {
  return getAllChannels().map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = getChannel((await params).slug);
  return ogImage({ label: c ? categoryTitle(c.category) : 'Channel', title: c?.name ?? 'Channel', sub: c?.tagline });
}
