import { Models } from 'react-native-appwrite';

// Extend the base Appwrite Document type with our custom properties for Property
// Note: Depending on your Appwrite relationship settings, these might be IDs or embedded objects
export interface PropertyDocument extends Models.Document {
  name: string;
  type: string;
  description: string;
  address: string;
  geolocation: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  facilities: string[];
  images: string;  // Based on your schema, this is a single URL
  image?: string;  // Keeping this in case it's used elsewhere
  agent: string | AgentDocument;   // Could be Agent ID or embedded Agent object depending on Appwrite settings
  reviews: (string | ReviewDocument)[]; // Could be Review IDs or embedded Review objects
  gallery: (string | GalleryDocument)[]; // Could be Gallery IDs or embedded Gallery objects
}

// Agent document type
export interface AgentDocument extends Models.Document {
  name: string;
  email: string;
  avatar: string;
}

// Review document type
export interface ReviewDocument extends Models.Document {
  name: string;
  avatar: string;
  review: string;
  rating: number;
  property?: string; // Property ID (optional since it might not be stored in all instances)
}

// Gallery document type
export interface GalleryDocument extends Models.Document {
  image: string;
}