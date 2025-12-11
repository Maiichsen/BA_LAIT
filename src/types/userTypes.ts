export interface newUserParams {
	company_id: string | null
	email: string
	first_name: string | null
	is_company_user: boolean
	last_name: string | null
	user_id: string
}


export interface inviteUserParams{
	company_id: string
	email: string
	first_name?: string
	is_company_user: boolean
	last_name?: string
}
