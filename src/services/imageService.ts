import {supabase} from '@/db/connection.ts';

export const uploadImageToSupabaseBucket = async (fileName: string, coverImage: File) => {
  try {
    const {data, error} = await supabase.storage
      .from('courseCovers')
      .upload(`public/${fileName}`, coverImage);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const downloadImageFromSupabaseBucket = async (fileName: string) => {
  try {
    const {data, error} = await supabase.storage
      .from('courseCovers')
      .download(`public/${fileName}`);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};
