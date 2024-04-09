export type Amenity = string;

export interface ApartmentUnit {
  key: string;
  image: string;
  name: string;
  address: string;
  photos: string[];
  modelName: string;
  modelImage?: string | null;
  rent: string;
  propertyId: string;
  details: string[];
  rating: number;
  squareFeet: string;
  features?: Amenity[] | null;
  isNew?: boolean;
  hasKnownAvailabilities?: boolean;
  availableDate?: Date | string | null;
  leaseOption?: string | null;
  phoneNumber: string | null;
  description: string | null;
}

export interface ApartmentUnitRecommendation extends ApartmentUnit {
  score: number;
  match: string;
  isSaved?: boolean;
}