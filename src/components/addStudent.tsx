import {supabase} from "@/src/components/supabaseClient";

export interface UpdateStudentParameters {
  userId: string | null | undefined;
  newStudentData: {
    campus: string;
    major: string;
    schedule: any;
    preferences: {
      [key: string]: any;
    }
  }
}

export async function addStudent({ userId, newStudentData }: UpdateStudentParameters ) {
  if (!userId) {
    return { status: 403, statusText: 'User not provided' }
  }

  const { error, status, statusText } = await supabase
    .from('User')
    .update({ ...newStudentData })
    .eq('id', userId);

  if (error || (status !== 200 && status !== 204)) {
    console.error('Error inserting data: ', error);
    return { error, status, statusText };
  }

  return { status, statusText };
}