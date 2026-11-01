/*
 * In-memory stand-in for the Supabase client, used when VITE_DEMO=true.
 * The real Supabase project has been shut down, so the demo build runs on
 * seed data instead. Changes live in memory and reset on reload.
 */
import { seedTables } from './demoSeed.ts';

type Row = Record<string, unknown>;
type Filter = (row: Row) => boolean;

const primaryKeys: Record<string, string> = {
	companies: 'company_id',
	contents: 'content_id',
	course_pages: 'course_page_id',
	course_progress: 'course_progress_id',
	course_seats: 'course_seat_id',
	courses: 'course_id',
	invited_users: 'invited_user_id',
	question_types: 'question_type_id',
	quiz_answers: 'quiz_answer_id',
	quiz_questions: 'quiz_question_id',
	quizzes: 'quiz_id',
	users: 'user_id',
};

const db: Record<string, Row[]> = structuredClone(seedTables);

export const demoUserId = 'demo-admin';

// Split "a, b(c, d), e" on top-level commas only
const splitColumns = (columns: string): string[] => {
	const parts: string[] = [];
	let depth = 0;
	let current = '';
	for (const char of columns) {
		if (char === '(') depth++;
		if (char === ')') depth--;
		if (char === ',' && depth === 0) {
			parts.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}
	if (current.trim()) parts.push(current.trim());
	return parts;
};

// Apply a select string like "*, companies(company_name)" to a row from `table`
const project = (table: string, row: Row, columns: string): Row | null => {
	const result: Row = {};
	for (const part of splitColumns(columns || '*')) {
		const embed = part.match(/^(\w+)(!inner)?\((.*)\)$/);
		if (!embed) {
			if (part === '*') Object.assign(result, row);
			else result[part] = row[part];
			continue;
		}

		const relation = embed[1]!;
		const inner = embed[2];
		const innerColumns = embed[3]!;
		const relationKey = primaryKeys[relation]!;
		let value: unknown;

		if (relationKey in row) {
			// Many-to-one: this row holds the foreign key
			const target = db[relation]!.find(r => r[relationKey] === row[relationKey]);
			value = target ? project(relation, target, innerColumns) : null;
		} else {
			// One-to-many: the related rows point back at this row
			const ownKey = primaryKeys[table]!;
			value = db[relation]!.filter(r => r[ownKey] === row[ownKey]).map(r => project(relation, r, innerColumns));
		}

		if (inner && (value === null || (Array.isArray(value) && value.length === 0))) return null;
		result[relation] = value;
	}
	return result;
};

const readPath = (row: Row, column: string): unknown[] => {
	const [relation, field] = column.split('.');
	if (!field) return [row[column]];
	const related = row[relation!];
	if (Array.isArray(related)) return related.map(r => (r as Row)[field]);
	return related ? [(related as Row)[field]] : [];
};

const newId = () => crypto.randomUUID();

class QueryBuilder implements PromiseLike<{ data: unknown; error: unknown }> {
	private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
	private columns = '*';
	private returning = false;
	private payload: Row[] | Row = [];
	private filters: Filter[] = [];
	private embedFilters: Filter[] = [];
	private sort: { column: string; ascending: boolean } | null = null;
	private maxRows: number | null = null;
	private singleRow: 'single' | 'maybe' | null = null;

	constructor(private table: string) {
		db[table] ??= [];
	}

	select(columns = '*') {
		if (this.action === 'select') this.columns = columns;
		else {
			this.returning = true;
			this.columns = columns;
		}
		return this;
	}

	insert(values: Row | Row[]) {
		this.action = 'insert';
		this.payload = values;
		return this;
	}

	update(values: Row) {
		this.action = 'update';
		this.payload = values;
		return this;
	}

	delete() {
		this.action = 'delete';
		return this;
	}

	private addFilter(column: string, test: (value: unknown) => boolean) {
		if (column.includes('.')) this.embedFilters.push(row => readPath(row, column).some(test));
		else this.filters.push(row => test(row[column]));
		return this;
	}

	eq(column: string, value: unknown) {
		return this.addFilter(column, v => v === value);
	}

	neq(column: string, value: unknown) {
		return this.addFilter(column, v => v !== value);
	}

	is(column: string, value: unknown) {
		return this.addFilter(column, v => (value === null ? v === null || v === undefined : v === value));
	}

	in(column: string, values: unknown[]) {
		return this.addFilter(column, v => values.includes(v));
	}

	order(column: string, options: { ascending?: boolean } = {}) {
		this.sort = { column, ascending: options.ascending ?? true };
		return this;
	}

	limit(count: number) {
		this.maxRows = count;
		return this;
	}

	single() {
		this.singleRow = 'single';
		return this;
	}

	maybeSingle() {
		this.singleRow = 'maybe';
		return this;
	}

	private run(): { data: unknown; error: unknown } {
		const rows = db[this.table]!;
		const now = new Date().toISOString();
		const key = primaryKeys[this.table];
		let affected: Row[];

		if (this.action === 'insert') {
			const values = Array.isArray(this.payload) ? this.payload : [this.payload];
			affected = values.map(value => ({
				...(key ? { [key]: newId() } : {}),
				created_at: now,
				updated_at: now,
				...value,
			}));
			rows.push(...affected);
			if (!this.returning) return { data: null, error: null };
		} else {
			affected = rows.filter(row => this.filters.every(f => f(row)));

			if (this.action === 'update') {
				affected.forEach(row => Object.assign(row, this.payload, { updated_at: now }));
				if (!this.returning) return { data: null, error: null };
			}

			if (this.action === 'delete') {
				db[this.table] = rows.filter(row => !affected.includes(row));
				if (!this.returning) return { data: null, error: null };
			}
		}

		let data = affected
			.map(row => project(this.table, row, this.columns))
			.filter((row): row is Row => row !== null)
			.filter(row => this.embedFilters.every(f => f(row)));

		if (this.sort) {
			const { column, ascending } = this.sort;
			data.sort((a, b) => ((a[column] as number) > (b[column] as number) ? 1 : -1) * (ascending ? 1 : -1));
		}
		if (this.maxRows !== null) data = data.slice(0, this.maxRows);

		if (this.singleRow) {
			if (data.length === 1) return { data: data[0], error: null };
			if (this.singleRow === 'maybe' && data.length === 0) return { data: null, error: null };
			return { data: null, error: { message: `Expected one row, got ${data.length}` } };
		}
		return { data, error: null };
	}

	then<T1 = { data: unknown; error: unknown }, T2 = never>(
		onfulfilled?: ((value: { data: unknown; error: unknown }) => T1 | PromiseLike<T1>) | null,
		onrejected?: ((reason: unknown) => T2 | PromiseLike<T2>) | null,
	): PromiseLike<T1 | T2> {
		// Small delay so loading states are visible, like a real network call
		return new Promise<{ data: unknown; error: unknown }>(resolve => setTimeout(() => resolve(this.run()), 150)).then(
			onfulfilled,
			onrejected,
		);
	}
}

const demoAuthUser = { id: demoUserId, email: 'demo@lait.dk' };

export const mockSupabase = {
	from: (table: string) => new QueryBuilder(table),
	auth: {
		getUser: async () => ({ data: { user: demoAuthUser }, error: null }),
		signInWithPassword: async () => ({ data: { user: demoAuthUser, session: {} }, error: null }),
		signInWithOtp: async () => ({ data: {}, error: null }),
		signUp: async () => ({ data: { user: demoAuthUser, session: {} }, error: null }),
		updateUser: async () => ({ data: { user: demoAuthUser }, error: null }),
		signOut: async () => ({ error: null }),
	},
	storage: {
		from: () => ({
			upload: async (path: string) => ({ data: { path }, error: null }),
			download: async (path: string) => {
				const fileName = path.replace(/^public\//, '');
				const response = await fetch(`${import.meta.env.BASE_URL}demo/covers/${fileName}`);
				if (!response.ok) return { data: null, error: { message: 'Image not found' } };
				return { data: await response.blob(), error: null };
			},
		}),
	},
};
