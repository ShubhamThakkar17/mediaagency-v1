import { brand } from '@/brand/brand.config';
import { OG_SIZE, ogImage } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = `${brand.name}: ${brand.tagline}`;

export default function Image() {
  return ogImage({ label: brand.descriptor, title: brand.tagline });
}
