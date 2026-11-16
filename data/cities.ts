import type { TierId, ZoneId } from './regions';

/** Cities shown on the India reach map and offered in the planner. */
export type City = { id: string; name: string; state: string; zone: ZoneId; tier: Exclude<TierId, 'tier3Rural'>; lat: number; lng: number };

export const CITIES: City[] = [
  // Metros
  { id: 'delhi', name: 'Delhi NCR', state: 'dl', zone: 'north', tier: 'metro', lat: 28.61, lng: 77.21 },
  { id: 'mumbai', name: 'Mumbai', state: 'mh', zone: 'west', tier: 'metro', lat: 19.08, lng: 72.88 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'ka', zone: 'south', tier: 'metro', lat: 12.97, lng: 77.59 },
  { id: 'chennai', name: 'Chennai', state: 'tn', zone: 'south', tier: 'metro', lat: 13.08, lng: 80.27 },
  { id: 'kolkata', name: 'Kolkata', state: 'wb', zone: 'east', tier: 'metro', lat: 22.57, lng: 88.36 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'tg', zone: 'south', tier: 'metro', lat: 17.39, lng: 78.49 },
  { id: 'pune', name: 'Pune', state: 'mh', zone: 'west', tier: 'metro', lat: 18.52, lng: 73.86 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'gj', zone: 'west', tier: 'metro', lat: 23.02, lng: 72.57 },
  // Tier 1
  { id: 'jaipur', name: 'Jaipur', state: 'rj', zone: 'north', tier: 'tier1', lat: 26.91, lng: 75.79 },
  { id: 'lucknow', name: 'Lucknow', state: 'up', zone: 'north', tier: 'tier1', lat: 26.85, lng: 80.95 },
  { id: 'surat', name: 'Surat', state: 'gj', zone: 'west', tier: 'tier1', lat: 21.17, lng: 72.83 },
  { id: 'kochi', name: 'Kochi', state: 'kl', zone: 'south', tier: 'tier1', lat: 9.97, lng: 76.28 },
  { id: 'chandigarh', name: 'Chandigarh', state: 'ch', zone: 'north', tier: 'tier1', lat: 30.73, lng: 76.78 },
  { id: 'indore', name: 'Indore', state: 'mp', zone: 'central', tier: 'tier1', lat: 22.72, lng: 75.86 },
  { id: 'nagpur', name: 'Nagpur', state: 'mh', zone: 'west', tier: 'tier1', lat: 21.15, lng: 79.09 },
  { id: 'coimbatore', name: 'Coimbatore', state: 'tn', zone: 'south', tier: 'tier1', lat: 11.02, lng: 76.96 },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'ap', zone: 'south', tier: 'tier1', lat: 17.69, lng: 83.22 },
  { id: 'bhopal', name: 'Bhopal', state: 'mp', zone: 'central', tier: 'tier1', lat: 23.26, lng: 77.41 },
  { id: 'patna', name: 'Patna', state: 'br', zone: 'east', tier: 'tier1', lat: 25.59, lng: 85.14 },
  { id: 'vadodara', name: 'Vadodara', state: 'gj', zone: 'west', tier: 'tier1', lat: 22.31, lng: 73.18 },
  { id: 'guwahati', name: 'Guwahati', state: 'as', zone: 'north-east', tier: 'tier1', lat: 26.14, lng: 91.74 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'or', zone: 'east', tier: 'tier1', lat: 20.3, lng: 85.82 },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'kl', zone: 'south', tier: 'tier1', lat: 8.52, lng: 76.94 },
  { id: 'ludhiana', name: 'Ludhiana', state: 'pb', zone: 'north', tier: 'tier1', lat: 30.9, lng: 75.85 },
  // Tier 2 & 3 hubs
  { id: 'rajkot', name: 'Rajkot', state: 'gj', zone: 'west', tier: 'tier2', lat: 22.3, lng: 70.8 },
  { id: 'nashik', name: 'Nashik', state: 'mh', zone: 'west', tier: 'tier2', lat: 20.0, lng: 73.79 },
  { id: 'kanpur', name: 'Kanpur', state: 'up', zone: 'north', tier: 'tier2', lat: 26.45, lng: 80.33 },
  { id: 'varanasi', name: 'Varanasi', state: 'up', zone: 'north', tier: 'tier2', lat: 25.32, lng: 82.97 },
  { id: 'agra', name: 'Agra', state: 'up', zone: 'north', tier: 'tier2', lat: 27.18, lng: 78.01 },
  { id: 'amritsar', name: 'Amritsar', state: 'pb', zone: 'north', tier: 'tier2', lat: 31.63, lng: 74.87 },
  { id: 'dehradun', name: 'Dehradun', state: 'ut', zone: 'north', tier: 'tier2', lat: 30.32, lng: 78.03 },
  { id: 'ranchi', name: 'Ranchi', state: 'jh', zone: 'east', tier: 'tier2', lat: 23.34, lng: 85.31 },
  { id: 'raipur', name: 'Raipur', state: 'ct', zone: 'central', tier: 'tier2', lat: 21.25, lng: 81.63 },
  { id: 'jodhpur', name: 'Jodhpur', state: 'rj', zone: 'north', tier: 'tier2', lat: 26.24, lng: 73.02 },
  { id: 'udaipur', name: 'Udaipur', state: 'rj', zone: 'north', tier: 'tier2', lat: 24.59, lng: 73.71 },
  { id: 'madurai', name: 'Madurai', state: 'tn', zone: 'south', tier: 'tier2', lat: 9.93, lng: 78.12 },
  { id: 'mysuru', name: 'Mysuru', state: 'ka', zone: 'south', tier: 'tier2', lat: 12.3, lng: 76.64 },
  { id: 'mangaluru', name: 'Mangaluru', state: 'ka', zone: 'south', tier: 'tier2', lat: 12.91, lng: 74.86 },
  { id: 'vijayawada', name: 'Vijayawada', state: 'ap', zone: 'south', tier: 'tier2', lat: 16.51, lng: 80.65 },
  { id: 'hubballi', name: 'Hubballi', state: 'ka', zone: 'south', tier: 'tier2', lat: 15.36, lng: 75.12 },
  { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar', state: 'mh', zone: 'west', tier: 'tier2', lat: 19.88, lng: 75.34 },
  { id: 'panaji', name: 'Panaji', state: 'ga', zone: 'west', tier: 'tier2', lat: 15.49, lng: 73.83 },
  { id: 'siliguri', name: 'Siliguri', state: 'wb', zone: 'east', tier: 'tier2', lat: 26.73, lng: 88.4 },
  { id: 'jammu', name: 'Jammu', state: 'jk', zone: 'north', tier: 'tier2', lat: 32.73, lng: 74.86 },
  { id: 'srinagar', name: 'Srinagar', state: 'jk', zone: 'north', tier: 'tier2', lat: 34.08, lng: 74.8 },
  { id: 'shillong', name: 'Shillong', state: 'ml', zone: 'north-east', tier: 'tier2', lat: 25.58, lng: 91.89 },
  { id: 'imphal', name: 'Imphal', state: 'mn', zone: 'north-east', tier: 'tier2', lat: 24.82, lng: 93.94 },
  { id: 'gwalior', name: 'Gwalior', state: 'mp', zone: 'central', tier: 'tier2', lat: 26.22, lng: 78.18 },
  { id: 'jabalpur', name: 'Jabalpur', state: 'mp', zone: 'central', tier: 'tier2', lat: 23.18, lng: 79.99 },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', state: 'tn', zone: 'south', tier: 'tier2', lat: 10.79, lng: 78.7 },
  { id: 'bhavnagar', name: 'Bhavnagar', state: 'gj', zone: 'west', tier: 'tier2', lat: 21.76, lng: 72.15 },
  { id: 'jamshedpur', name: 'Jamshedpur', state: 'jh', zone: 'east', tier: 'tier2', lat: 22.8, lng: 86.2 },
];

export const cityById = (id: string) => CITIES.find((c) => c.id === id);
