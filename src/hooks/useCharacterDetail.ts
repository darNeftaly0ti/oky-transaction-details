import { useCallback, useState } from "react";
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

  const [executeQuery, { loading, error }] = useLazyQuery<
    CharacterData,
    CharacterVars
  >(GET_CHARACTER, {
    fetchPolicy: "cache-first",
    onCompleted: (data) => {
      setCharacter(data.character);
    },
  });

  const fetchCharacter = useCallback(
    (id: string) => {
      executeQuery({ variables: { id } });
    },
    [executeQuery]
  );

  const clearCharacter = useCallback(() => {
    setCharacter(null);
  }, []);

  return {
    character,
    loading,
    error,
    fetchCharacter,
    clearCharacter,
  };
}

export default useCharacterDetail;
