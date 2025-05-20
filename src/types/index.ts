export interface WildlifeSpotting {
  id: string;
  latitude: number;
  longitude: number;
  species: string;
  description: string;
  timestamp: number;
  image?: string;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} 