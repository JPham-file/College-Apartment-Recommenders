import { UserPreference } from '@/src/types/preferences';

export interface OAuthUser {
  email: string;
  first_name: string;
  last_name: string;
  profile_icon: string;
}

export interface DatabaseUser {
  id: string;
  campus: string;
  major: string;
  schedule: undefined;
  oauth: OAuthUser;
  preferences: UserPreference;
  has_verified_preferences: boolean;
}