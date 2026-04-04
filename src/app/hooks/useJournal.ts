import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  collection, doc, getDocs, getDoc,
  setDoc, query, orderBy, deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

export interface JournalEntry {
  id: string;
  content: string;
  mood: 'good' | 'okay' | 'rough';
  createdAt: string;
}

export function useJournal(user: User | null) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState<'good' | 'okay' | 'rough'>('good');
  const [journalMap, setJournalMap] = useState<Record<string, boolean>>({});

  const today = new Date().toLocaleDateString('en-CA');

  const fetchJournalEntries = async () => {
    if (!user || !user.uid) return;
    try {
      const journalRef = collection(db, 'users', user.uid, 'journal');
      const q = query(journalRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<JournalEntry, 'id'>),
      }));
      setJournalEntries(entries);

      const map: Record<string, boolean> = {};
      snapshot.docs.forEach((d) => { map[d.id] = true; });
      setJournalMap(map);
    } catch (error) {
      console.error('Error fetching journal:', error);
    }
  };

  const fetchTodayEntry = async () => {
    if (!user || !user.uid) return;
    try {
      const entryRef = doc(db, 'users', user.uid, 'journal', today);
      const snap = await getDoc(entryRef);
      if (snap.exists()) {
        const data = snap.data() as JournalEntry;
        setJournalText(data.content || '');
        setSelectedMood(data.mood || 'good');
      } else {
        setJournalText('');
        setSelectedMood('good');
      }
    } catch (error) {
      console.error('Error fetching today entry:', error);
    }
  };

const deleteJournalEntry = async (entryId: string) => {
  if (!user || !user.uid) return;
  try {
    const entryRef = doc(db, 'users', user.uid, 'journal', entryId);
    await deleteDoc(entryRef);
    await fetchJournalEntries();
  } catch (error) {
    console.error('Error deleting journal entry:', error);
  }
};

  const saveJournalEntry = async () => {
    if (!user || !user.uid || !journalText.trim()) return;
    try {
      const entryRef = doc(db, 'users', user.uid, 'journal', today);
      await setDoc(entryRef, {
        content: journalText,
        mood: selectedMood,
        createdAt: today,
      }, { merge: true });
      await fetchJournalEntries();
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  useEffect(() => {
    fetchJournalEntries();
    fetchTodayEntry();
  }, [user?.uid]);

 return {
  journalEntries,
  journalText,
  setJournalText,
  selectedMood,
  setSelectedMood,
  journalMap,
  saveJournalEntry,
  deleteJournalEntry,
};
}
