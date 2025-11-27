import {supabase} from '../db/connection.ts';

export const createCompany = async (companyName: string) => {
  try {
    const {data, error} = await supabase
      .from('companies')
      .insert([
        {company_name: companyName},
      ])
      // To get the created company returned, if needed
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getCompanyById = async (companyId: string) => {
  try {
    const {data, error} = await supabase
      .from('companies')
      .select()
      .eq('company_id', companyId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllCompanies = async () => {
  try {
    const {data, error} = await supabase
      .from('companies')
      .select('*');

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const updateCompanyNameById = async (companyId: string, companyName: string) => {
  try {
    const {data, error} = await supabase
      .from('companies')
      .update({company_name: companyName})
      .eq('company_id', companyId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCompanyById = async (companyId: string) => {
  try {
    const {data, error} = await supabase
      .from('companies')
      .delete()
      .eq('company_id', companyId);

    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
  }
};
