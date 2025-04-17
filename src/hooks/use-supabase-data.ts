
import { useState, useEffect } from 'react';
import { 
  supabase, 
  getSports, 
  getExercises,
  getWorkoutPlans,
  getWorkoutSessions,
  getNutritionLogs
} from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Hook for fetching sports data
export function useSports() {
  const [sports, setSports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSports() {
      try {
        setLoading(true);
        const data = await getSports();
        setSports(data);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error loading sports",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSports();
  }, []);

  return { sports, loading, error };
}

// Hook for fetching exercises
export function useExercises() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        setLoading(true);
        const data = await getExercises();
        setExercises(data);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error loading exercises",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  return { exercises, loading, error };
}

// Hook for fetching workout plans
export function useWorkoutPlans(userId?: string) {
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const auth = useAuth();

  useEffect(() => {
    async function fetchWorkoutPlans() {
      if (!userId && !auth?.user?.id) return;
      
      try {
        setLoading(true);
        const data = await getWorkoutPlans(userId || auth?.user?.id || '');
        setWorkoutPlans(data);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error loading workout plans",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWorkoutPlans();
  }, [userId, auth?.user?.id]);

  return { workoutPlans, loading, error };
}

// Hook for fetching workout sessions
export function useWorkoutSessions(userId?: string) {
  const [workoutSessions, setWorkoutSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const auth = useAuth();

  useEffect(() => {
    async function fetchWorkoutSessions() {
      if (!userId && !auth?.user?.id) return;
      
      try {
        setLoading(true);
        const data = await getWorkoutSessions(userId || auth?.user?.id || '');
        setWorkoutSessions(data);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error loading workout sessions",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWorkoutSessions();
  }, [userId, auth?.user?.id]);

  return { workoutSessions, loading, error };
}

// Hook for fetching nutrition logs
export function useNutritionLogs(userId?: string) {
  const [nutritionLogs, setNutritionLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const auth = useAuth();

  useEffect(() => {
    async function fetchNutritionLogs() {
      if (!userId && !auth?.user?.id) return;
      
      try {
        setLoading(true);
        const data = await getNutritionLogs(userId || auth?.user?.id || '');
        setNutritionLogs(data);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error loading nutrition logs",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchNutritionLogs();
  }, [userId, auth?.user?.id]);

  return { nutritionLogs, loading, error };
}

// Simple auth hook (temporary)
export function useAuth() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({ id: session.user.id });
      } else {
        setUser(null);
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ id: session.user.id });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading: false };
}
