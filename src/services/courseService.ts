import {supabase} from '../db/connection.ts';
import type {
  CourseRow,
  newCourseParams,
  CourseParams,
} from '../types/courseTypes.ts';
import {downloadImageFromSupabaseBucket} from './imageService.ts';

export const createTemplateCourse = async () => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .insert([{
        title: 'Nyt kursus',
        short_course_description: 'Beskrivelse af kursus',
        is_published: false,
      }])
      .select()
      .single();

    if (error) throw error;

    const courseId = data.course_id;

    await createCoursePage(courseId, 1);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createCourse = (newCourseParams: newCourseParams): Promise<CourseRow> => new Promise(async (resolve, reject) => {
  if (!newCourseParams) return reject('missing newCourseParams');

  try {
    const {data, error} = await supabase
      .from('courses')
      .insert([{
        title: newCourseParams.title,
        short_course_description: newCourseParams.short_course_description,
        long_course_description: newCourseParams.long_course_description,
      }])
      .select();

    if (error) return reject(error);
    if (!data || !data[0]) return reject('Encountered an error creating course. Got null');

    resolve(data[0]);
  } catch (err) {
    reject(err);
  }
});

export const updateCourse = async (courseId: string, updateCourseParams: CourseParams) => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .update({
        long_course_description: updateCourseParams.long_course_description,
        short_course_description: updateCourseParams.short_course_description,
        cover_image_url: updateCourseParams.cover_image_url,
        estimated_time_minutes: updateCourseParams.estimated_time_minutes,
        title: updateCourseParams.title,
        author_name: updateCourseParams.author_name,
      })
      .eq('course_id', courseId)
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getCourseById = (courseId: string): Promise<CourseRow> => new Promise(async (resolve, reject) => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .select()
      .eq('course_id', courseId)
      .single();

    if (error) return reject(error);
    resolve(data);
  } catch (err) {
    reject(err);
  }
});

export const getCoverImgFilenameByCourseId = (courseId: string): Promise<string | null> => new Promise(async (resolve, reject) => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .select('cover_image_url')
      .eq('course_id', courseId)
      .single();

    if (error) return reject(error);

    resolve(data.cover_image_url);
  } catch (err) {
    reject(err);
  }
});

export const getCoverImgUrlByCourseId = (courseId: string): Promise<string | null> => new Promise(async (resolve, reject) => {
  getCoverImgFilenameByCourseId(courseId).then(imgFilename => {
    if (!imgFilename) return resolve(null);

    downloadImageFromSupabaseBucket('courseCovers', imgFilename).then(imgUrl => {
      resolve(imgUrl);
    }).catch(() => reject('error fetching image from storage'));
  }).catch(() => reject('error fetching course with that id'));
});

export const getAllPublicCourses = (): Promise<CourseRow[]> => new Promise(async (resolve, reject) => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .is('soft_deleted_at', null);

    if (error) return reject(error);

    resolve(data);
  } catch (err) {
    reject(err);
  }
});

export const getAllCourses = (): Promise<CourseRow[]> => new Promise(async (resolve, reject) => {
  try {
    const {data, error} = await supabase
      .from('courses')
      .select('*');

    if (error) return reject(error);

    resolve(data);
  } catch (err) {
    reject(err);
  }
});

export const deleteCourseById = (courseId: string): Promise<void> => new Promise(async (resolve, reject) => {
  try {
    const {error} = await supabase
      .from('courses')
      .update({soft_deleted_at: new Date().toISOString()})
      .eq('course_id', courseId);

    if (error) return reject(error);

    resolve();
  } catch (err) {
    reject(err);
  }
});

export const permDeleteCourseById = (courseId: string): Promise<void> => new Promise(async (resolve, reject) => {
  try {
    const {error} = await supabase
      .from('courses')
      .delete()
      .eq('course_id', courseId);

    if (error) return reject(error);

    resolve();
  } catch (err) {
    reject(err);
  }
});


///////*COURSE PAGES*////////
export const createCoursePage = async (courseId: string, orderIndex: number) => {
  try {
    const {data, error} = await supabase
      .from('course_pages')
      .insert([{course_id: courseId, order_index: orderIndex}])
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const setCoursePageVisibilityById = async (coursePageId: string, isVisible: boolean) => {
  try {
    const {data, error} = await supabase
      .from('course_pages')
      .update({is_visible: isVisible})
      .eq('course_page_id', coursePageId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

const createNewContent = async (coursePageId: string) => {
  try {
    const {data, error} = await supabase
      .from('contents')
      .insert([
        {
          course_page_id: coursePageId,
          content_json:
            {
              text: 'her skal content værdien være i stedet..',
            },
        },

      ]);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};
