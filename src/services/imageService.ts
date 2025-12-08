import {supabase} from '@/db/connection.ts';
import {getCoverImgByCourseId} from '@/services/courseService.ts';

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

export const downloadImageFromSupabaseBucketByCourseId = async (courseId: string) => {
  try {
    const fileName = await getCoverImgByCourseId(courseId);
    if (!fileName) {
      return;
    }
    const {data, error} = await supabase.storage
      .from('courseCovers')
      .download(`public/${fileName[0].cover_image_url}`);

    if (error) throw error;

    return URL.createObjectURL(data);
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
