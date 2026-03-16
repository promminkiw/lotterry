import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Purchase, CreatePurchaseInput } from '@/types';

const PURCHASES_COLLECTION = 'purchases';

export const purchaseService = {
  // Create a new purchase
  async createPurchase(
    drawId: string,
    input: CreatePurchaseInput
  ): Promise<Purchase> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, PURCHASES_COLLECTION), {
        drawId,
        customerName: input.customerName,
        numberType: input.numberType,
        numberValue: input.numberValue,
        amount: input.amount,
        createdAt: now,
      });

      return {
        id: docRef.id,
        drawId,
        customerName: input.customerName,
        numberType: input.numberType,
        numberValue: input.numberValue,
        amount: input.amount,
        createdAt: now,
      };
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }
  },

  // Get all purchases for a draw
  async getPurchasesByDrawId(drawId: string): Promise<Purchase[]> {
    try {
      // Removed orderBy to avoid index requirement - sorting in JS instead
      const q = query(
        collection(db, PURCHASES_COLLECTION),
        where('drawId', '==', drawId)
      );
      const snapshot = await getDocs(q);
      const purchases = snapshot.docs.map((docSnap: QueryDocumentSnapshot) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Purchase[];
      
      // Sort by createdAt in descending order
      return purchases.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
  },

  // Get a single purchase by ID
  async getPurchaseById(purchaseId: string): Promise<Purchase | null> {
    try {
      const docRef = doc(db, PURCHASES_COLLECTION, purchaseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Purchase;
      }
      return null;
    } catch (error) {
      console.error('Error fetching purchase:', error);
      throw error;
    }
  },

  // Update a purchase
  async updatePurchase(
    purchaseId: string,
    input: CreatePurchaseInput
  ): Promise<void> {
    try {
      const docRef = doc(db, PURCHASES_COLLECTION, purchaseId);
      await updateDoc(docRef, {
        customerName: input.customerName,
        numberType: input.numberType,
        numberValue: input.numberValue,
        amount: input.amount,
      });
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  },

  // Delete a purchase
  async deletePurchase(purchaseId: string): Promise<void> {
    try {
      const docRef = doc(db, PURCHASES_COLLECTION, purchaseId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      throw error;
    }
  },

  // Delete all purchases for a draw
  async deleteAllPurchasesForDraw(drawId: string): Promise<void> {
    try {
      const q = query(
        collection(db, PURCHASES_COLLECTION),
        where('drawId', '==', drawId)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((docSnap: QueryDocumentSnapshot) =>
        deleteDoc(doc(db, PURCHASES_COLLECTION, docSnap.id))
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting purchases for draw:', error);
      throw error;
    }
  },
};
