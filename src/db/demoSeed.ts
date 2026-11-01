/*
 * Seed data for the demo build (VITE_DEMO=true). All people and companies are fictional.
 */
type Row = Record<string, unknown>;

const stamp = '2025-11-20T09:00:00.000Z';
const base = { created_at: stamp, updated_at: stamp };

const companies: Row[] = [
	{ company_id: 'co-fyn', company_name: 'Fyns Boligselskab', registration_key: null },
	{ company_id: 'co-havn', company_name: 'Havnens Revision', registration_key: null },
	{ company_id: 'co-nord', company_name: 'Nordlys Media', registration_key: null },
	{ company_id: 'co-gron', company_name: 'Grøn Energi ApS', registration_key: null },
].map(c => ({ ...base, ...c }));

const student = (id: string, first: string, last: string, company: string): Row => ({
	...base,
	user_id: id,
	first_name: first,
	last_name: last,
	email: `${first}.${last}@example.dk`.toLowerCase().replace('ø', 'oe').replace('æ', 'ae').replace('å', 'aa'),
	company_id: company,
	is_admin: false,
	is_company_user: false,
});

const users: Row[] = [
	{
		...base,
		user_id: 'demo-admin',
		first_name: 'Demo',
		last_name: 'Admin',
		email: 'demo@lait.dk',
		company_id: null,
		is_admin: true,
		is_company_user: false,
	},
	{
		...base,
		user_id: 'u-contact-fyn',
		first_name: 'Hanne',
		last_name: 'Kjær',
		email: 'hanne.kjaer@example.dk',
		company_id: 'co-fyn',
		is_admin: false,
		is_company_user: true,
	},
	student('u-1', 'Anders', 'Nielsen', 'co-fyn'),
	student('u-2', 'Emma', 'Christensen', 'co-fyn'),
	student('u-3', 'Maria', 'Petersen', 'co-fyn'),
	student('u-4', 'Michael', 'Rasmussen', 'co-havn'),
	student('u-5', 'Sofie', 'Hansen', 'co-havn'),
	student('u-6', 'Jonas', 'Mortensen', 'co-nord'),
	student('u-7', 'Freja', 'Lund', 'co-nord'),
	student('u-8', 'Mads', 'Sørensen', 'co-nord'),
	student('u-9', 'Ida', 'Jørgensen', 'co-gron'),
	student('u-10', 'Oliver', 'Holm', 'co-gron'),
	student('u-11', 'Clara', 'Vestergaard', 'co-gron'),
];

const invited_users: Row[] = [
	{
		invited_user_id: 'inv-1',
		first_name: 'Lars',
		last_name: 'Jensen',
		user_email: 'lars.jensen@example.dk',
		company_id: 'co-havn',
		is_company_user: false,
	},
	{
		invited_user_id: 'inv-2',
		first_name: 'Peter',
		last_name: 'Andersen',
		user_email: 'peter.andersen@example.dk',
		company_id: 'co-fyn',
		is_company_user: false,
	},
	{
		invited_user_id: 'inv-3',
		first_name: 'Nanna',
		last_name: 'Bak',
		user_email: 'nanna.bak@example.dk',
		company_id: 'co-nord',
		is_company_user: false,
	},
];

const course = (
	id: string,
	title: string,
	short: string,
	long: string,
	cover: string,
	minutes: number,
	published = true,
): Row => ({
	...base,
	course_id: id,
	title,
	short_course_description: short,
	long_course_description: long,
	cover_image_url: cover,
	estimated_time_minutes: minutes,
	author_name: 'LAIT',
	is_published: published,
	soft_deleted_at: null,
});

const courses: Row[] = [
	course(
		'c-wcag',
		'Webtilgængelighed',
		'Lær at skrive og opbygge indhold, der kan bruges af alle.',
		'Kurset gennemgår de vigtigste krav i WCAG 2.1 AA for redaktører: overskriftsstruktur, alt-tekster, linktekster og kontrast. Du får konkrete eksempler fra hverdagen i et CMS.',
		'Webtilgaengelighed.png',
		45,
	),
	course(
		'c-dmaerke',
		'D-mærket i praksis',
		'Hvad kræver D-mærket, og hvordan dokumenterer I det?',
		'En praktisk gennemgang af D-mærkets kriterier for IT-sikkerhed og ansvarlig databrug, og hvad det betyder for jeres arbejdsgange.',
		'd-maerke.png',
		60,
	),
	course(
		'c-chatbot',
		'Chatbots i kundeservice',
		'Kom godt i gang med en chatbot, der rent faktisk hjælper.',
		'Lær at planlægge samtaleflows, skrive svar i den rigtige tone og måle, om chatbotten løser kundernes spørgsmål.',
		'chatbot.jpg',
		35,
	),
	course(
		'c-seo',
		'SEO for redaktører',
		'Skriv indhold, som både mennesker og søgemaskiner forstår.',
		'Kurset dækker søgeord, titler og metabeskrivelser, intern linkning og hvordan du følger op på resultaterne.',
		'seo.jpg',
		50,
	),
	course(
		'c-cms',
		'Kom i gang med Umbraco',
		'Grundlæggende redaktørkursus i Umbraco CMS.',
		'Opret og rediger sider, arbejd med blokke og medier, og udgiv indhold sikkert.',
		'cms.jpg',
		40,
	),
	course(
		'c-strategi',
		'Indholdsstrategi',
		'Fra tilfældigt indhold til en plan, der hænger sammen.',
		'Lær at kortlægge målgrupper, prioritere indhold og opbygge en redaktionel plan.',
		'Indholdsstrategi.jpg',
		55,
		false,
	),
];

const pageTitles: Record<string, string[]> = {
	'c-wcag': ['Hvad er WCAG?', 'Overskrifter og struktur', 'Alt-tekster til billeder', 'Linktekster'],
	'c-dmaerke': ['Introduktion til D-mærket', 'Kriterierne', 'Dokumentation'],
	'c-chatbot': ['Hvornår giver en chatbot mening?', 'Samtaleflows', 'Tone og sprog'],
	'c-seo': ['Søgeord', 'Titler og metabeskrivelser', 'Intern linkning', 'Opfølgning'],
	'c-cms': ['Oversigt over Umbraco', 'Sider og blokke', 'Medier', 'Udgivelse'],
	'c-strategi': ['Målgrupper', 'Prioritering', 'Redaktionel plan'],
};

const course_pages: Row[] = [];
const contents: Row[] = [];
for (const [courseId, titles] of Object.entries(pageTitles)) {
	titles.forEach((title, index) => {
		const pageId = `${courseId}-p${index + 1}`;
		course_pages.push({
			course_page_id: pageId,
			course_id: courseId,
			course_page_title: title,
			order_index: (index + 1) * 64,
			is_required: true,
			is_visible: true,
			updated_at: stamp,
		});
		contents.push({
			content_id: `${pageId}-content`,
			course_page_id: pageId,
			content_json: { temp_raw_text: `${title}\n\nIndhold til siden "${title}".` },
		});
	});
}

let seatCounter = 0;
const seat = (companyId: string, courseId: string, userId: string | null): Row => ({
	course_seat_id: `seat-${++seatCounter}`,
	company_id: companyId,
	course_id: courseId,
	user_id: userId,
	reserved_for_email: null,
	activation_at: userId ? stamp : null,
	completed_at: null,
	created_at: stamp,
});

const assignments: [string, string, string[]][] = [
	// company, course, users who hold a seat
	['co-fyn', 'c-wcag', ['u-1', 'u-2', 'u-3']],
	['co-fyn', 'c-cms', ['u-1', 'u-2']],
	['co-fyn', 'c-seo', ['u-1', 'u-3']],
	['co-havn', 'c-dmaerke', ['u-4', 'u-5']],
	['co-havn', 'c-wcag', ['u-4']],
	['co-nord', 'c-seo', ['u-6', 'u-7', 'u-8']],
	['co-nord', 'c-chatbot', ['u-6', 'u-7']],
	['co-nord', 'c-wcag', ['u-6']],
	['co-gron', 'c-chatbot', ['u-9', 'u-10', 'u-11']],
	['co-gron', 'c-dmaerke', ['u-9']],
	['co-gron', 'c-cms', ['u-9', 'u-10']],
];

const course_seats: Row[] = [];
for (const [companyId, courseId, holders] of assignments) {
	holders.forEach(userId => course_seats.push(seat(companyId, courseId, userId)));
	// Two open seats per course so "Tildel kursus" has something to assign
	course_seats.push(seat(companyId, courseId, null), seat(companyId, courseId, null));
}

const course_progress: Row[] = [
	['u-1', 'c-wcag-p1'],
	['u-1', 'c-wcag-p2'],
	['u-1', 'c-wcag-p3'],
	['u-1', 'c-wcag-p4'],
	['u-2', 'c-wcag-p1'],
	['u-6', 'c-seo-p1'],
	['u-6', 'c-seo-p2'],
	['u-9', 'c-chatbot-p1'],
].map(([userId, pageId], i) => ({ course_progress_id: `prog-${i + 1}`, user_id: userId, course_page_id: pageId }));

export const seedTables: Record<string, Row[]> = {
	companies,
	users,
	invited_users,
	courses,
	course_pages,
	contents,
	course_seats,
	course_progress,
	quizzes: [],
	quiz_questions: [],
	quiz_answers: [],
	question_types: [],
};
