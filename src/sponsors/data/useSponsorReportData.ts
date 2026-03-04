import { useEffect, useState } from 'react';
import type { SponsorReportData } from '../types';

type SponsorReportState = {
  data: SponsorReportData | null;
  loading: boolean;
  error: string | null;
};

export function useSponsorReportData(volumeSlug: string) {
  const [state, setState] = useState<SponsorReportState>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((previous) => ({ ...previous, loading: true, error: null }));

      try {
        const response = await fetch(`/sponsors/${volumeSlug}/report-data.json`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error(`Failed to load report data (${response.status})`);
        }

        const data = (await response.json()) as SponsorReportData;
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load report data'
          });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [volumeSlug]);

  return state;
}
