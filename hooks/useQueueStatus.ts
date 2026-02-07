"use client";

import { queueApi } from "@/lib/api";
import { QueueStatus } from "@/lib/types";
import { useEffect, useState } from "react";

interface UseQueueStatusResult {
  status: QueueStatus | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useQueueStatus(
  pollingMs = 3000,
  enabled = true
): UseQueueStatusResult {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStatus(null);
      setError(null);
      setLastUpdated(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchQueueStatus = async () => {
      try {
        const data = await queueApi.getStatus();
        if (!isMounted) return;
        setStatus(data);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "대기열 상태를 불러오지 못했습니다."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchQueueStatus();
    const intervalId = setInterval(fetchQueueStatus, pollingMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [pollingMs, enabled]);

  return {
    status,
    isLoading,
    error,
    lastUpdated,
  };
}
