import { useCallback, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_LAUNCH } from "../graphql/queries";
import type { LaunchData, LaunchVars, Launch } from "../types/api";

interface UseLaunchDetailReturn {
  launch: Launch | null;
  loading: boolean;
  error: Error | undefined;
  fetchLaunch: (id: string) => void;
  clearLaunch: () => void;
}

export function useLaunchDetail(): UseLaunchDetailReturn {
  const [launch, setLaunch] = useState<Launch | null>(null);

  const [executeQuery, { loading, error }] = useLazyQuery<LaunchData, LaunchVars>(
    GET_LAUNCH,
    {
      fetchPolicy: "cache-first",
      onCompleted: (data) => {
        setLaunch(data.launch);
      },
    }
  );

  const fetchLaunch = useCallback(
    (id: string) => {
      executeQuery({ variables: { id } });
    },
    [executeQuery]
  );

  const clearLaunch = useCallback(() => {
    setLaunch(null);
  }, []);

  return {
    launch,
    loading,
    error,
    fetchLaunch,
    clearLaunch,
  };
}

export default useLaunchDetail;
