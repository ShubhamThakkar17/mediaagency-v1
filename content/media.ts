/**
 * Media registry (BRIEF §8). Every photo and video the site can show is listed
 * here with its source page, photographer and licence. /credits renders this
 * file and scripts/check-media.mjs verifies every URL.
 *
 * A slot with an empty `src` has no asset yet: <SmartMedia> shows the branded
 * animated fallback for it, and IMAGE_PROMPTS.md carries a prompt to fill it.
 *
 * RULES: Unsplash and Pexels only. Use only URLs obtained from a fetched page
 * or API response. No real brands, logos, celebrities or identifiable staff.
 */
import type { Licence, MediaRef } from '@/lib/types';

export type MediaAsset = MediaRef & {
  id: string;
  kind: 'image' | 'video';
  /** What this slot should show. Used for prompts and for finding stock. */
  brief: string;
  /** The photo or video page the URL was obtained from. */
  sourcePage: string;
  /** Poster image id for videos. */
  poster?: string;
};

const empty = (id: string, brief: string, kind: 'image' | 'video' = 'image'): MediaAsset => ({
  id,
  kind,
  brief,
  src: '',
  alt: brief,
  credit: '',
  creditUrl: '',
  sourcePage: '',
  licence: 'Generated' as Licence,
});

export const MEDIA: MediaAsset[] = [
  // Channels (hero and card share one asset unless a "-card" slot is added)
  empty('ch-print', 'Stack of Indian newspapers at a street news stand, morning light'),
  empty('ch-television', 'Family living room lit by a television in the evening, India'),
  empty('ch-radio', 'Radio studio microphone and mixing desk, warm light'),
  empty('ch-cinema', 'Empty multiplex cinema hall with rows of red seats and a glowing screen'),
  empty('ch-hoardings', 'Large blank billboards above a busy Indian city road at dusk'),
  empty('ch-digital-ooh', 'Bright digital screens on a city building facade at night'),
  empty('ch-bus-brts-auto', 'Auto-rickshaws and a city bus on a busy Indian street'),
  empty('ch-metro-wraps', 'Metro train arriving on an elevated track in an Indian city'),
  empty('ch-inside-metro', 'Commuters on a metro station platform with lit panels'),
  empty('ch-railways', 'Crowded Indian railway station platform with a train'),
  empty('ch-airport', 'Modern Indian airport terminal interior with travellers'),
  empty('ch-airline', 'Aircraft cabin interior with seat-back screens, or a plane wing above clouds'),
  empty('ch-stadiums-sports', 'Cricket stadium under floodlights with a full crowd'),
  empty('ch-brand-ambassadors', 'Stage with spotlights and camera flashes, no identifiable person'),
  empty('ch-influencers', 'Creator filming with a phone on a ring light, face not identifiable'),
  empty('ch-social-media', 'Hands scrolling a social feed on a phone'),
  empty('ch-search-performance', 'Laptop showing analytics charts on a desk'),
  empty('ch-digital-pr', 'Person reading a news article on a tablet with coffee'),
  // Optional looping videos for the channel-universe panels and channel heroes
  empty('vid-city-traffic', 'Indian city traffic at dusk, time lapse', 'video'),
  empty('vid-metro', 'Metro train passing, India', 'video'),
  empty('vid-airport', 'Airport terminal or plane take-off', 'video'),
  empty('vid-stadium', 'Stadium crowd under floodlights', 'video'),
  empty('vid-phone-scroll', 'Phone scrolling a social feed, close-up', 'video'),
  empty('vid-printing-press', 'Newspaper printing press running', 'video'),
  // Home and about
  empty('about-portrait', 'Portrait-orientation shot of a hoarding or media surface on an Indian street'),
  empty('about-team', 'Agency team around a table in a planning meeting, faces not the focus'),
  empty('feature-data', 'Analyst desk with charts and a media plan on screen'),
  empty('feature-pan-india', 'Aerial view of an Indian highway or city grid at blue hour'),
  empty('feature-proof', 'Printed report and laptop dashboard on a desk'),
  // Industries
  empty('ind-real-estate', 'New residential towers under a clear sky, India'),
  empty('ind-healthcare', 'Modern hospital corridor or building exterior'),
  empty('ind-education', 'University campus or students in a lecture hall, India'),
  empty('ind-fmcg-d2c', 'Shelves of packaged goods in an Indian store, no legible brands'),
  empty('ind-bfsi', 'Glass bank or office towers in a financial district'),
  empty('ind-auto-ev', 'Electric car charging, or a car showroom floor'),
  empty('ind-renewable-energy', 'Solar panels in a field, India'),
  empty('ind-retail', 'Jewellery or fashion store display window'),
  // Work (concept campaigns)
  empty('work-1', 'City skyline with residential towers at dusk'),
  empty('work-2', 'Street food or packaged snack being shared'),
  empty('work-3', 'Electric scooter on a city street'),
  empty('work-4', 'Hospital building at night with lit windows'),
  empty('work-5', 'Students on a campus lawn'),
  empty('work-6', 'Rooftop solar panels on a home'),
  // Insights
  empty('insight-1', 'Billboards along an Indian highway'),
  empty('insight-2', 'Phone and newspaper side by side on a table'),
  empty('insight-3', 'Metro station concourse at rush hour'),
];

const byId = new Map(MEDIA.map((m) => [m.id, m]));

/** Resolve a registry id. Unknown ids resolve to an empty slot so pages still render. */
export function getMedia(id: string, fallbackAlt = ''): MediaAsset {
  return byId.get(id) ?? empty(id, fallbackAlt || id);
}

export const mediaWithSource = () => MEDIA.filter((m) => m.src);
export const mediaWithoutSource = () => MEDIA.filter((m) => !m.src);
