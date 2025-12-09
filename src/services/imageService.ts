import { supabase } from '../db/connection.ts';

export const uploadImageToSupabaseBucket = async (fileName: string, coverImage: File) => {
  try {
    const { data, error } = await supabase.storage.from('courseCovers').upload(`public/${fileName}`, coverImage);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const downloadImageFromSupabaseBucket = (storageName: string, fileName: string): Promise<string | null> =>
  new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await supabase.storage.from(storageName).download(`public/${fileName}`);

      if (error) return reject(error);

      resolve(URL.createObjectURL(data));
    } catch (err) {
      reject(err);
    }
  });
