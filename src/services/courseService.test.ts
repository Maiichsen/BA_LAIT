import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../db/connection.ts', () => {
	const state = { response: { data: null, error: null } };

	const chain = {
		select: vi.fn(() => chain),
		eq: vi.fn(() => chain),
		single: vi.fn(async () => state.response),
	};

	return {
		supabase: {
			from: vi.fn(() => chain),
			// eslint-disable-next-line
			__setResponse: (res: any) => (state.response = res),
			__chain: chain,
		},
	};
});

import { getCourseById } from './courseService.ts';
import { supabase } from '../db/connection.ts';

type SupabaseChainMock = {
	select: ReturnType<typeof vi.fn>;
	eq: ReturnType<typeof vi.fn>;
	single: ReturnType<typeof vi.fn>;
};

type SupabaseMock = {
	from: ReturnType<typeof vi.fn>;
	// eslint-disable-next-line
	__setResponse: (res: { data: unknown; error: unknown }) => void;
	__chain: SupabaseChainMock;
};

const sb = supabase as unknown as SupabaseMock;

describe('getCourseById', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sb.__setResponse({ data: null, error: null });
	});

	it('rejects when missing course id', async () => {
		sb.__setResponse({
			data: { course_id: '123', title: 'Thing', short_course_description: 'Short' },
			error: null,
		});

		await expect(getCourseById('123')).resolves.toBeTruthy();
		await expect(getCourseById('')).rejects.toBeTruthy();
	});

	it('calls supabase with the correct query', async () => {
		sb.__setResponse({
			data: { course_id: '123', title: 'Thing', short_course_description: 'Short' },
			error: null,
		});

		await getCourseById('123');

		expect(sb.from).toHaveBeenCalledWith('courses');
		expect(sb.__chain.eq).toHaveBeenCalledWith('course_id', '123');
	});

	it('resolves with data when no error', async () => {
		sb.__setResponse({
			data: { course_id: '123', title: 'Thing', short_course_description: 'Short' },
			error: null,
		});

		await expect(getCourseById('123')).resolves.toMatchObject({ course_id: '123' });
	});

	it('rejects when supabase returns error', async () => {
		sb.__setResponse({
			data: null,
			error: new Error('the error'),
		});

		await expect(getCourseById('123')).rejects.toThrow('the error');
	});

	it('rejects if the call throws (unexpected exception)', async () => {
		// force .single() to throw instead of returning {data,error}
		sb.__chain.single.mockImplementationOnce(() => {
			throw new Error('boom');
		});

		await expect(getCourseById('123')).rejects.toThrow('boom');
	});
});
