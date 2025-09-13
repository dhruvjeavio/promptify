import { useState, useEffect, useCallback } from "react";
import { useGetPromptHistoryQuery } from "../services/apiSlice";
import type { PromptAnalysisHistory, PromptRefinement } from "../types/index";

const STORAGE_KEY = "promptify-analysis-history";
const MAX_HISTORY_ITEMS = 50; // Limit to prevent localStorage from getting too large

export const useAnalysisHistory = (promptId: string) => {
  const [localHistory, setLocalHistory] = useState<PromptAnalysisHistory[]>([]);

  // Use the API query to get history from the server
  const {
    data: apiHistory = [],
    isLoading,
    error,
    refetch,
  } = useGetPromptHistoryQuery(promptId);

  // Load local history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allHistory: PromptAnalysisHistory[] = JSON.parse(stored);
        // Filter history for this specific prompt
        const promptHistory = allHistory
          .filter((item) => item.prompt_id === parseInt(promptId))
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        setLocalHistory(promptHistory);
      }
    } catch (error) {
      console.error("Error loading analysis history:", error);
    }
  }, [promptId]);

  // Combine API history and local history, prioritizing API data
  const history = [...apiHistory, ...localHistory].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Save analysis to history
  const saveAnalysis = useCallback(
    (refinement: PromptRefinement) => {
      try {
        const newAnalysis: PromptAnalysisHistory = {
          id: Date.now(), // Use timestamp as ID for local storage
          prompt_id: parseInt(promptId),
          generated_text: refinement.refinedPrompt,
          created_at: new Date().toISOString(),
          analysis: {
            additional_suggestions: refinement.score.suggestions,
            clarity: refinement.score.clarity,
            effectiveness: refinement.score.effectiveness,
            improvements_made: refinement.improvements,
            overall_score: refinement.score.overallScore,
            refined_prompt: refinement.refinedPrompt,
            specificity: refinement.score.specificity,
          },
          usage_metadata: {
            candidates_token_count: 0, // Default values for local storage
            prompt_token_count: 0,
          },
        };

        // Get existing history
        const stored = localStorage.getItem(STORAGE_KEY);
        let allHistory: PromptAnalysisHistory[] = stored
          ? JSON.parse(stored)
          : [];

        // Add new analysis
        allHistory.unshift(newAnalysis);

        // Keep only the most recent items
        if (allHistory.length > MAX_HISTORY_ITEMS) {
          allHistory = allHistory.slice(0, MAX_HISTORY_ITEMS);
        }

        // Save back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));

        // Update local state
        const promptHistory = allHistory
          .filter((item) => item.prompt_id === parseInt(promptId))
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        setLocalHistory(promptHistory);
      } catch (error) {
        console.error("Error saving analysis history:", error);
      }
    },
    [promptId]
  );

  // Clear history for this prompt
  const clearHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allHistory: PromptAnalysisHistory[] = JSON.parse(stored);
        const filteredHistory = allHistory.filter(
          (item) => item.prompt_id !== parseInt(promptId)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
        setLocalHistory([]);
      }
    } catch (error) {
      console.error("Error clearing analysis history:", error);
    }
  }, [promptId]);

  // Clear all history
  const clearAllHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLocalHistory([]);
    } catch (error) {
      console.error("Error clearing all analysis history:", error);
    }
  }, []);

  return {
    history,
    saveAnalysis,
    clearHistory,
    clearAllHistory,
    isLoading,
    error,
    refetch,
  };
};

export default useAnalysisHistory;
