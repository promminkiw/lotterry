import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Draw, CreateDrawInput } from '@/types';

const DRAWS_COLLECTION = 'draws';

export const drawService = {
    // Create a new draw
    async createDraw(input: CreateDrawInput): Promise<Draw> {
        try {
            const now = new Date().toISOString();
            const docRef = await addDoc(collection(db, DRAWS_COLLECTION), {
                name: input.name,
                drawDate: input.drawDate,
                status: 'open',
                createdAt: now,
            });

            return {
                id: docRef.id,
                name: input.name,
                drawDate: input.drawDate,
                status: 'open',
                createdAt: now,
            };
        } catch (error) {
            console.error('Error creating draw:', error);
            throw error;
        }
    },

    // Get all draws
    async getAllDraws(): Promise<Draw[]> {
        try {
            const q = query(
                collection(db, DRAWS_COLLECTION),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnap: QueryDocumentSnapshot) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as Draw[];
        } catch (error) {
            console.error('Error fetching draws:', error);
            throw error;
        }
    },

    // Get a single draw by ID
    async getDrawById(drawId: string): Promise<Draw | null> {
        try {
            const docRef = doc(db, DRAWS_COLLECTION, drawId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                } as Draw;
            }
            return null;
        } catch (error) {
            console.error('Error fetching draw:', error);
            throw error;
        }
    },

    // Update draw status
    async updateDrawStatus(drawId: string, status: 'open' | 'closed'): Promise<void> {
        try {
            const docRef = doc(db, DRAWS_COLLECTION, drawId);
            await updateDoc(docRef, { status });
        } catch (error) {
            console.error('Error updating draw status:', error);
            throw error;
        }
    },

    // Delete a draw
    async deleteDraw(drawId: string): Promise<void> {
        try {
            const docRef = doc(db, DRAWS_COLLECTION, drawId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting draw:', error);
            throw error;
        }
    },
};
