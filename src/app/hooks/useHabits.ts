import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
  getDoc,
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { calculateStreak, calculateWeeklyRate } from '../utils/streaks';

interface Habit {
  id: string;
  title: string;
  checked: boolean;
  lastChecked: string;
  streak: number;
  weeklyRate: number;
}

export function useHabits(user: User | null) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [totalHabits, setTotalHabits] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [weeklyRate, setWeeklyRate] = useState(0);
  const [completionMap, setCompletionMap] = useState<Record<string, number>>({});

  const fetchHabits = async () => {
    if (!user || !user.uid) return;

    try {
      const habitsRef = collection(db, 'users', user.uid, 'habits');
      const habitQuery = query(habitsRef, orderBy('createdAt', 'desc'));
      const habitSnapshot = await getDocs(habitQuery);

      const habitList = await Promise.all(
        habitSnapshot.docs.map(async (habitDoc) => {
          const data = habitDoc.data() as Habit;
          const completionsRef = collection(
            db,
            'users',
            user.uid,
            'habits',
            habitDoc.id,
            'completions',
          );
          const completionsSnap = await getDocs(completionsRef);
          const completions = completionsSnap.docs.map((d) => d.id);
          
          return {
            ...data,
            id: habitDoc.id,
            streak: calculateStreak(completions),
            weeklyRate: calculateWeeklyRate(completions),
          };
        }),
      );

      const currentDate = new Date().toLocaleDateString('en-CA');
      const updatedHabits = habitList.map((habit) =>
        habit.lastChecked !== currentDate ? { ...habit, checked: false } : habit,
      );

      const sortedHabits = [...updatedHabits].sort((a, b) => b.streak - a.streak);
      setHabits(sortedHabits);

      const best = Math.max(...updatedHabits.map((h) => h.streak), 0);
      setBestStreak(best);

      const avgWeekly =
        updatedHabits.length > 0
          ? Math.round(
              updatedHabits.reduce((sum, h) => sum + h.weeklyRate, 0) /
                updatedHabits.length,
            )
          : 0;
      setWeeklyRate(avgWeekly);

      const batch = writeBatch(db);
      updatedHabits.forEach((habit) => {
        const habitRef = doc(db, 'users', user.uid, 'habits', habit.id);
        batch.update(habitRef, { checked: habit.checked, lastChecked: habit.lastChecked });
      });
      await batch.commit();

      const checkedHabits = updatedHabits.filter((h) => h.checked).length;
      const total = updatedHabits.length;
      setProgress(total > 0 ? Math.round((checkedHabits / total) * 100) : 0);
      setTotalHabits(total);
      setCompletedToday(checkedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCompletions = async () => {
    if (!user || !user.uid) return;
    try {
      const habitsRef = collection(db, 'users', user.uid, 'habits');
      const habitSnapshot = await getDocs(habitsRef);
      const map: Record<string, number> = {};
      await Promise.all(
        habitSnapshot.docs.map(async (habitDoc) => {
          const completionsRef = collection(
            db,
            'users',
            user.uid,
            'habits',
            habitDoc.id,
            'completions',
          );
          const completionsSnap = await getDocs(completionsRef);
          completionsSnap.docs.forEach((d) => {
            map[d.id] = (map[d.id] || 0) + 1;
          });
        }),
      );
      setCompletionMap(map);
    } catch (error) {
      console.error('Error fetching completions:', error);
    }
  };

  const increaseProgress = async (habitId: string) => {
    if (!user || !user.uid) return;
    try {
      const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
      const habitSnap = await getDoc(habitRef);
      if (habitSnap.exists()) {
        const habitData = habitSnap.data();
        const currentDate = new Date().toLocaleDateString('en-CA');
        if (!habitData?.checked) {
          await updateDoc(habitRef, { checked: true, lastChecked: currentDate });
          const updatedHabits = habits.map((h) =>
            h.id === habitId ? { ...h, checked: true, lastChecked: currentDate } : h,
          );
          setHabits(updatedHabits);
          const checkedCount = updatedHabits.filter((h) => h.checked).length;
          const total = updatedHabits.length;
          setProgress(total > 0 ? Math.round((checkedCount / total) * 100) : 0);
          setTotalHabits(total);
          setCompletedToday(checkedCount);
          const completionRef = doc(
            db,
            'users',
            user.uid,
            'habits',
            habitId,
            'completions',
            currentDate,
          );
          await setDoc(completionRef, { completedAt: currentDate });
          await fetchHabits();
          await fetchAllCompletions();
        }
      }
    } catch (error) {
      console.error('Error increasing progress:', error);
    }
  };

  const removeProgress = async (selectedHabit: string, onClose: () => void) => {
    if (!user || !user.uid) return;
    try {
      const habitRef = doc(db, 'users', user.uid, 'habits', selectedHabit);
      const habitSnap = await getDoc(habitRef);
      if (habitSnap.exists()) {
        await updateDoc(habitRef, { checked: false });
        const updatedHabits = habits.map((h) =>
          h.id === selectedHabit ? { ...h, checked: false } : h,
        );
        setHabits(updatedHabits);
        const checkedCount = updatedHabits.filter((h) => h.checked).length;
        const total = updatedHabits.length;
        setProgress(total > 0 ? Math.round((checkedCount / total) * 100) : 0);
        setTotalHabits(total);
        setCompletedToday(checkedCount);
        const currentDate = new Date().toLocaleDateString('en-CA');
        const completionRef = doc(
          db,
          'users',
          user.uid,
          'habits',
          selectedHabit,
          'completions',
          currentDate,
        );
        await deleteDoc(completionRef);
        await fetchHabits();
        await fetchAllCompletions();
      }
    } catch (error) {
      console.error('Error removing progress:', error);
    } finally {
      onClose();
    }
  };

  const deleteHabit = async (selectedHabit: string, onClose: () => void) => {
    if (!user || !user.uid) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'habits', selectedHabit));
      onClose();
      await fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const addHabit = async (title: string) => {
    if (!title.trim() || !user || !user.uid) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'habits'), {
        title,
        createdAt: new Date(),
        userId: user.uid,
        checked: false,
        lastChecked: '',
      });
      await fetchHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
    fetchAllCompletions();
  }, [user?.uid]);

  return {
    habits,
    loading,
    progress,
    totalHabits,
    completedToday,
    bestStreak,
    weeklyRate,
    completionMap,
    increaseProgress,
    removeProgress,
    deleteHabit,
    addHabit,
    fetchHabits,
  };
}
