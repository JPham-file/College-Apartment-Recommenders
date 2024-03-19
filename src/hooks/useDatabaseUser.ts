import type { DatabaseUser, ErrorResponse } from '@/src/types';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { db } from '@/src/lib/supabase';

interface DatabaseUserHookInterface {
  user: DatabaseUser | null | undefined;
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  error: ErrorResponse | null | undefined;
}

export const useDatabaseUser = (): DatabaseUserHookInterface => {
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();
  const [user, setUser] = useState<DatabaseUser | null | undefined>(null);
  const [error, setError] = useState<ErrorResponse | null | undefined>(null);

  useEffect( () => {
    const fetchUser = async () => {
      if (!isSignedIn) {
        throw { status: 403, message: 'User not authenticated in request. Unable to fetch null user.', code: 'OC.SEC.UNAUTHENTICATED' };
      }

      const token = await getToken({ template: "supabase-jwt-token" });
      const client = await db(token!);
      const { data, error, status, statusText } = await client
        .from('User')
        .select()
        .eq('id', userId);

      if (error) {
        throw { status, message: statusText, code: 'OC.PGSQL.DATABASE_ERROR' }
      }

      const dbUser = data[0] as DatabaseUser;
      setUser(dbUser);
    }

    if (!!userId) {
      fetchUser().catch((err: ErrorResponse) => {
        console.error(err);
        setError(err);
      });
    }
  }, [userId]);

  return { user, isLoaded, isSignedIn, error};
}

