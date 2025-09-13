import { useGetPromptsQuery } from "../services/apiSlice";
import type { Prompt } from "../types/index";

export const usePrompts = () => {
  const {
    data: allPrompts = [],
    error: allError,
    isLoading: allLoading,
    refetch: refetchAll,
  } = useGetPromptsQuery();

  const publicPrompts: Prompt[] = allPrompts.filter(
    (prompt) => prompt.isPublic
  );

  const userPrompts: Prompt[] = allPrompts.filter((prompt) => !prompt.isPublic);

  const isLoading = allLoading;
  const hasError = !!allError;

  const refetchPublic = () => {
    refetchAll();
  };

  const refetchUser = () => {
    refetchAll();
  };

  return {
    publicPrompts,
    userPrompts,
    allPrompts,
    isLoading,
    hasError,
    refetchAll,
    refetchPublic,
    refetchUser,
  };
};

export default usePrompts;
