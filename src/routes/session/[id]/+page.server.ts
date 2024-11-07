import { adminDb } from '$lib/server/firebase';
import type { FirestoreSession } from '$lib/types/session';
import { convertFirestoreSession } from '$lib/types/session';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const sessionRef = adminDb.collection('sessions').doc(params.id);
	const sessionDoc = await sessionRef.get();

	if (!sessionDoc.exists) {
		throw error(404, 'Session not found');
	}

	const sessionData = sessionDoc.data() as FirestoreSession;
	const session = convertFirestoreSession(sessionData);
	const isHost = session.hostId === locals.user.uid;

	return {
		session,
		isHost,
		user: locals.user
	};
};