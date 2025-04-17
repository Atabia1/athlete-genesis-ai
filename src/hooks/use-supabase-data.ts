
import { useState, useEffect } from 'react';
import { supabase, getSports, getExercises } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
