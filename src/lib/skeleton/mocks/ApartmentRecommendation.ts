import { ApartmentUnitRecommendation } from '@/src/types';

const dummy = [1, 1, 1].map(_ => ({
  address: "401 1st St College Station TX 77840",
  availableDate: null,
  details: ["6 Beds", "6 Baths"],
  features: null,
  hasKnownAvailabilities: false,
  isNew: false,
  isSaved: false,
  key: "5gntx4p",
  modelImage: null,
  modelName: "6BR/6BA",
  name: "Otto",
  photos: [],
  price: "$1,449",
  propertyId: "82043961-8862-42bb-ac2d-09c144f04346",
  rating: 5,
  rent: '889',
  score: 921255.5,
  squareFeet: '2305',
  image: '',
  match: '95',
} as ApartmentUnitRecommendation));

export default dummy;