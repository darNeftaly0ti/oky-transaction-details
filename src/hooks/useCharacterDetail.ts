import { useCallback, useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_CHARACTER } from "../graphql/queries";
import type { CharacterData, CharacterVars, Character } from "../types/api";

interface UseCharacterDetailReturn {
  character: Character | null;
  loading: boolean;
  error: Error | undefined;
  fetchCharacter: (id: string) => void;
  clearCharacter: () => void;
}

export function useCharacterDetail(): UseCharacterDetailReturn {
  const [character, setCharacter] = useState<Character | null>(null);
  const [clearedId, setClearedId] = useState<string | null>(null);

  // Apollo 3.14 deprecates onCompleted for setting local state inside
  // useLazyQuery. Use the returned data + useEffect instead.
  const [executeQuery, { loading, error, data }] = useLazyQuery<
    CharacterData,
    CharacterVars
  >(GET_CHARACTER, {
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (data?.character) {
      setCharacter(data.character);
    }
  }, [data]);

  const fetchCharacter = useCallback(
    (id: string) => {
      setClearedId(null);
      executeQuery({ variables: { id } });
    },
    [executeQuery]
  );

  const clearCharacter = useCallback(() => {
    setCharacter(null);
    setClearedId("cleared");
  }, []);

  // When cleared, ignore stale data that might still be in the query cache
  const resolvedCharacter = clearedId ? null : character;

  return {
    character: resolvedCharacter,
    loading,
    error,
    fetchCharacter,
    clearCharacter,
  };
}

export default useCharacterDetail;
