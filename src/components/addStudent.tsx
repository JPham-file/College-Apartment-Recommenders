import {supabase} from "@/src/components/supabaseClient";

export async function addStudent(newStudentData) {
  const {data, error} = await supabase
    .from('User')
    .insert([newStudentData]);

  if (error) {
    console.error('Error inserting data: ', error);
    return null;
  }

  return data;
}