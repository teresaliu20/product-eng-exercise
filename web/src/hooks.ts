import { useQuery } from "@tanstack/react-query";

type Feedback = {
  id: number;
  name: string;
  description: string;
  importance: "High" | "Medium" | "Low";
  type: "Sales" | "Customer" | "Research";
  customer: "Loom" | "Ramp" | "Brex" | "Vanta" | "Notion" | "Linear" | "OpenAI";
  date: string;
};

type Cluster = {
  id: number;
  name: string;
  summary: string;
  highImportanceCount: number;
  totalFeedbackCount: number;
  priority: number;
  originalRows: Feedback[]
}

export type FeedbackData = Feedback[];

export type FeedbackGroup = {
  name: string;
  feedback: Feedback[];
  groupings: Cluster[];
};

export function useFeedbackQuery(filters: Record<string, string[]>) {
  return useQuery<{ data: FeedbackData }>({
    queryKey: ["feedback", filters],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/query", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filters }),
        method: "POST",
      });
      return res.json();
    },
    // These options ensure fresh data while maintaining proper caching
    refetchOnWindowFocus: false,
    staleTime: 3000  // Consider data stale immediately
  });
}

export function useGroupsQuery(query: unknown) {
  return useQuery<{ data: FeedbackGroup[] }>({
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/groups", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        method: "POST",
      });

      return res.json();
    },
    // The query key is used to cache responses and should represent
    // the parameters of the query.
    queryKey: ["groups-data"],
  });
}
