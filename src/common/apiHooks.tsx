// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { keys } from "./keys";
import apiConfig from "./apiConfig";
import { Task } from "./types"

export function useGetVideos(indexId: string | undefined) {
  return useQuery({
    queryKey: [keys.VIDEOS, indexId],
    queryFn: async () => {
      try {
        if (!indexId) return Error;
        console.log('API URL 1', JSON.stringify(apiConfig.SERVER))
        console.log('Api URL 2', await apiConfig.SERVER.get(
          `${apiConfig.INDEXES_URL}/${indexId}/videos`,
          {
            params: { page_limit: apiConfig.PAGE_LIMIT },
          }
        ))
        const response = await apiConfig.SERVER.get(
          `${apiConfig.INDEXES_URL}/${indexId}/videos`,
          {
            params: { page_limit: apiConfig.PAGE_LIMIT },
          }
        );
        return response.data;
      } catch (error) {
        return error;
      }
    },
  });
}

export function useGetVideo(indexId: string, videoId: string, enabled: boolean) {
  return useQuery({
    queryKey: [keys.VIDEOS, indexId, videoId],
    queryFn: async () => {
      try {
        if (!enabled) {
          return null;
        }
        const response = await apiConfig.SERVER.get(
          `${apiConfig.INDEXES_URL}/${indexId}/videos/${videoId}`
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        return response.data;
      } catch (error) {
        console.error("useGetVideo hook error:", error);
        throw error;
      }
    },
    enabled: enabled,
  });
}

export function useGenerate(prompt: string, videoId: string, enabled: boolean) {
  return useQuery({
    queryKey: [keys.VIDEOS, "generate", videoId, prompt],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const response = await apiConfig.SERVER.post(
        `/videos/${videoId}/generate`,
        {
          data: { prompt: prompt },
        }
      );
      const respData = response.data;
      return respData;
    },
    enabled: enabled,
  });
}

export function useGetTask(taskId: string) {
  return useQuery<Task, Error, Task, [string, string]>({
    queryKey: [keys.TASK, taskId],
    queryFn: async (): Promise<Task> => {
      try {
        const response = await apiConfig.SERVER.get(`${apiConfig.TASKS_URL}/${taskId}`);
        const respData: Task = response.data;
        return respData;
      } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
      }
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      return data && (data.status === "ready" || data.status === "failed")
        ? false
        : 5000;
    },
    refetchIntervalInBackground: true,
  });
}


export function useGenerateTitleTopicHashtag(types: string, videoId:string, enabled:boolean) {
  console.log('here at api hooks', videoId)
  return useQuery({
    queryKey: [keys.VIDEOS, "gist", videoId],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const response = await apiConfig.SERVER.post(`/videos/${videoId}/gist`, {
        data: { types: Array.from(types) },
      });
      console.log('here at api hooks2 ', response)
      const respData = response.data;
      return respData;
    },
    enabled: enabled,
  });
}

export function useGenerateSummary(data, videoId, enabled) {
  return useQuery({
    queryKey: [keys.VIDEOS, "summarize", videoId],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const response = await apiConfig.SERVER.post(
        `/videos/${videoId}/summarize`,
        { data }
      );
      const respData = response.data;
      return respData;
    },
    enabled: enabled,
  });
}

export function useSearchClip(data, videoId, enabled) {
  console.log('useSearchClip hook:', { videoId, data });

  return useQuery({
    queryKey: [keys.VIDEOS, "search", videoId],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const requestData = {
        index_id: "6684d37f7e3a05b242e8b1d8",
        query_text: data.queryText,
        group_by: "clip",
        search_options: "visual",
        threshold: "low",
        page_limit: 12,
      };

      console.log('Sending request payload:', requestData);

      const response = await apiConfig.SERVER.post(
        `/videos/${videoId}/search`,
        requestData
      );

      const respData = response.data;
      console.log('API search response:', respData);
      return respData;
    },
    enabled: enabled,
  });
}



export function useGenerateChapters(data, videoId, enabled) {
  return useQuery({
    queryKey: [keys.VIDEOS, "chapters", videoId],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const response = await apiConfig.SERVER.post(
        `/videos/${videoId}/summarize`,
        { data }
      );
      const respData = response.data;
      return respData;
    },
    enabled: enabled,
  });
}

export function useGenerateHighlights(data, videoId, enabled) {
  return useQuery({
    queryKey: [keys.VIDEOS, "highlights", videoId],
    queryFn: async () => {
      if (!enabled) {
        return null;
      }

      const response = await apiConfig.SERVER.post(
        `/videos/${videoId}/summarize`,
        { data }
      );
      const respData = response.data;
      return respData;
    },
    enabled: enabled,
  });
}