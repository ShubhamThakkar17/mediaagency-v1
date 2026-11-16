/**
 * Icon names allowed in channel frontmatter (`formats[].icon`). Each maps to a
 * lucide-react icon in components/ui/FormatIcon.tsx. Unknown names fall back
 * to a neutral dot, so content edits can never crash a page.
 */
export const FORMAT_ICON_NAMES = [
  'Newspaper', 'Tv', 'Radio', 'Film', 'Clapperboard', 'Projector', 'RectangleHorizontal', 'RectangleVertical',
  'Monitor', 'MonitorPlay', 'Smartphone', 'Bus', 'Car', 'TrainFront', 'TramFront', 'TrainTrack', 'Plane',
  'PlaneTakeoff', 'Ticket', 'Luggage', 'Trophy', 'Star', 'Users', 'User', 'Mic', 'Megaphone', 'Camera', 'Video',
  'Heart', 'MessageCircle', 'Share2', 'Search', 'MousePointerClick', 'ChartBar', 'ChartLine', 'Target', 'FileText',
  'BookOpen', 'Globe', 'MapPin', 'Building2', 'Store', 'ShoppingBag', 'Landmark', 'Signpost', 'Lightbulb',
  'PanelTop', 'LayoutGrid', 'Layers', 'Image', 'Play', 'Podcast', 'AudioLines', 'Mail', 'Link', 'Tag', 'QrCode',
  'Sparkles', 'Zap', 'Flag', 'Shirt', 'Armchair', 'DoorOpen', 'Footprints', 'CircleDot', 'Milestone', 'Route',
  'Sun', 'Clock', 'Calendar', 'Award', 'BadgeCheck', 'Handshake', 'PenLine', 'Quote', 'Rss', 'Hash', 'ThumbsUp',
  'Scan', 'Wifi', 'Headphones', 'Speaker', 'Tablet', 'ShoppingCart', 'IndianRupee', 'Percent', 'Columns3',
  'Square', 'PanelsTopLeft', 'Fence', 'Bike', 'Tent', 'Presentation', 'Grid3x3', 'GalleryHorizontal', 'Scroll',
  'Map', 'Warehouse', 'Factory', 'GraduationCap', 'HeartPulse', 'Banknote', 'Leaf', 'Gem', 'Home', 'Building',
] as const;
export type FormatIconName = (typeof FORMAT_ICON_NAMES)[number];
