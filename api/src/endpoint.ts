import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import json from "./data.json";

type Feedback = {
  id: number;
  name: string;
  description: string;
  importance: "High" | "Medium" | "Low";
  type: "Sales" | "Customer" | "Research";
  customer: "Loom" | "Ramp" | "Brex" | "Vanta" | "Notion" | "Linear" | "OpenAI";
  date: string;
};

type DateFilter = {
  timeframe: 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'Custom Date Range'
  startDate?: string; // Only needed for custom date range
  endDate?: string; // Only needed for custom date range
}

type Filters = {
  importance: string[];
  type: string[];
  customer: string[];
  date?: DateFilter;
}

type FeedbackGroup = {
  id: number;
  name: string;
  summary: string;
  highImportanceCount: number;
  totalFeedbackCount: number;
  priority: number;
  feedback: Feedback[]
}

type FeedbackData = Feedback[];

export const router = express.Router();
router.use(bodyParser.json());

router.post("/query", queryHandler);
router.post("/groups", groupHandler);

const feedback: FeedbackData = json as any;

function queryHandler(req: Request, res: Response<{ data: FeedbackData }>) {
  const filters: Filters = req.body.filters || { importance: [], type: [], customer: [], date: undefined };
  
  // apply filters to array of feedback
  let filteredFeedback: FeedbackData = feedback;
  if (filters.importance.length > 0) {
    filteredFeedback = filteredFeedback.filter((f) => filters.importance.includes(f.importance))
  }
  if (filters.type.length > 0) {
    filteredFeedback = filteredFeedback.filter((f) => filters.type.includes(f.type))
  }
  if (filters.customer.length > 0) {
    filteredFeedback = filteredFeedback.filter((f) => filters.customer.includes(f.customer))
  }
  if (filters.date) {
    const now = new Date();
    const { timeframe, startDate, endDate } = filters.date;
    
    switch (timeframe) {
      case 'Today':
        const today = new Date(now.setHours(0, 0, 0, 0));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return feedbackDate.getTime() === today.getTime();
        });
        break;

      case 'Yesterday':
        const yesterday = new Date(now.setDate(now.getDate() - 1));
        yesterday.setHours(0, 0, 0, 0);
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return feedbackDate.getTime() === yesterday.getTime();
        });
        break;

      case 'Last 7 Days':
        const last7Days = new Date(now.setDate(now.getDate() - 7));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return feedbackDate >= last7Days;
        });
        break;

      case 'Last 30 Days':
        const last30Days = new Date(now.setDate(now.getDate() - 30));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return feedbackDate >= last30Days;
        });
        break;

      case 'Last 90 Days':
        const last90Days = new Date(now.setDate(now.getDate() - 90));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return feedbackDate >= last90Days;
        });
        break;

      // custom date range filters feedback within startDate and endDate
      case 'Custom Date Range':
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          filteredFeedback = filteredFeedback.filter((f) => {
            const feedbackDate = new Date(f.date);
            return feedbackDate >= start && feedbackDate <= end;
          });
        }
        break;
    }
  }
  res.status(200).json({ data: filteredFeedback });
}

async function groupHandler(
  req: Request,
  res: Response<{ data: FeedbackGroup[] }>
) {
  const pythonRes = await fetch("http://127.0.0.1:8000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ feedback }),
  });

  const pythonData = (await pythonRes.json()) as { groupings: FeedbackGroup[] };
  res.status(200).json({
    data: pythonData.groupings,
  });
}
