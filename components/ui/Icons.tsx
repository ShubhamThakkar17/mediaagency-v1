import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export const ArrowUpRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const ArrowRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const WhatsAppIcon = ({ size = 20, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 0 1 12 3.800Zm-3.500 4c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.300s1 2.700 1.200 2.900c.1.200 2 3.100 4.900 4.300 2.400 1 2.900.8 3.400.7.500 0 1.700-.7 1.900-1.300.200-.700.200-1.200.200-1.300-.100-.100-.300-.200-.600-.400l-1.900-.900c-.300-.100-.500-.100-.700.200l-.900 1.100c-.200.200-.300.200-.600.100-.300-.200-1.200-.500-2.300-1.400-.800-.800-1.400-1.700-1.600-2-.200-.300 0-.500.100-.600l.500-.500.300-.500c.100-.200 0-.400 0-.600l-.900-2.100c-.200-.500-.400-.400-.600-.400h-.700Z" />
  </svg>
);

const socialPaths: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v6M8 7.5v.01M12 17v-3.500a2.200 2.200 0 0 1 4.400 0V17M12 11v6" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.500" y="5" width="19" height="14" rx="4" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4 4 20" />,
};
export const SocialIcon = ({ id, size, ...p }: P & { id: string }) => (
  <svg {...base(size)} {...p}>
    {socialPaths[id] ?? <circle cx="12" cy="12" r="8" />}
  </svg>
);
