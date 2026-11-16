import * as L from 'lucide-react';
import { FORMAT_ICON_NAMES } from '@/lib/format-icons';

const allowed = new Set<string>(FORMAT_ICON_NAMES);
type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

export function FormatIcon({ name, size = 28, className }: { name: string; size?: number; className?: string }) {
  const Icon = (allowed.has(name) ? (L as unknown as Record<string, IconComponent>)[name] : undefined) ?? L.CircleDot;
  return <Icon size={size} strokeWidth={1.75} className={className} aria-hidden />;
}
