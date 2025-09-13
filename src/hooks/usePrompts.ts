import {
  useGetPublicPromptsQuery,
  useGetUserPromptsQuery,
} from "../services/apiSlice";
import type { Prompt } from "../types/index";

export const usePrompts = () => {
  const {
    data: publicPrompts = [],
    error: publicError,
    isLoading: publicLoading,
    refetch: refetchPublic,
  } = useGetPublicPromptsQuery();

  const {
    data: userPrompts = [],
    error: userError,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useGetUserPromptsQuery();

  const allPrompts: Prompt[] = [...publicPrompts, ...userPrompts];

  const isLoading = publicLoading || userLoading;
  const hasError = !!publicError || !!userError;

  const refetchAll = () => {
    refetchPublic();
    refetchUser();
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
