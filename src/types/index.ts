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

export interface Like {
  userId: string;
  timestamp: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface SightingWithEngagement {
  id: string;
  name: string;
  desc: string;
  lat: number;
  lng: number;
  photoUrl: string;
  timestamp: number;
  userId: string;
  likes?: Record<string, Like>;
  comments?: Record<string, Comment>;
}