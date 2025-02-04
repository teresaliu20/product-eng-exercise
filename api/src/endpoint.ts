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
  timeframe: '1day' | '3days' | '1week' | '1month' | '3months' | 'custom';
  comparison: 'before' | 'after';
  date?: string; // Only needed for custom timeframe
}

type FeedbackData = Feedback[];

export const router = express.Router();
router.use(bodyParser.json());

router.post("/query", queryHandler);
router.post("/groups", groupHandler);

const feedback: FeedbackData = json as any;


function queryHandler(req: Request, res: Response<{ data: FeedbackData }>) {
  const body = req.body;
  const filters = body.filters
  /**
   * TODO(part-1): Implement query handling
   */
  let filteredFeedback = feedback;
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
    console.log("filtering by date", filters.date)
    const now = new Date();
    const { timeframe, comparison, date } = filters.date;
    
    switch (timeframe) {
      case '1day':
        const oneDayFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return comparison === 'before' 
            ? feedbackDate <= oneDayFromNow
            : feedbackDate >= oneDayFromNow;
        });
        break;
    
      case '3days':
        const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return comparison === 'before'
            ? feedbackDate <= threeDaysFromNow
            : feedbackDate >= threeDaysFromNow;
        });
        break;
    
      case '1week':
        const oneWeekFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return comparison === 'before'
            ? feedbackDate <= oneWeekFromNow
            : feedbackDate >= oneWeekFromNow;
        });
        break;
    
      case '1month':
        const oneMonthFromNow = new Date(now.setMonth(now.getMonth() + 1));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return comparison === 'before'
            ? feedbackDate <= oneMonthFromNow
            : feedbackDate >= oneMonthFromNow;
        });
        break;
    
      case '3months':
        const threeMonthsFromNow = new Date(now.setMonth(now.getMonth() + 3));
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return comparison === 'before'
            ? feedbackDate <= threeMonthsFromNow
            : feedbackDate >= threeMonthsFromNow;
        });
        break;
    
      case 'custom':
        const customDate = new Date(date);
        filteredFeedback = filteredFeedback.filter((f) => {
          const feedbackDate = new Date(f.date);
          return comparison === 'before'
            ? feedbackDate <= customDate
            : feedbackDate >= customDate;
        });
        break;
    }
  }
  // Add date logic
  res.status(200).json({ data: filteredFeedback });
}

type FeedbackGroup = {
  name: string;
  feedback: Feedback[];
};

async function groupHandler(
  req: Request,
  res: Response<{ data: FeedbackGroup[] }>
) {
  const body = req;

  /**
   * TODO(part-2): Implement filtering + grouping
   */

  const pythonRes = await fetch("http://127.0.0.1:8000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ feedback }),
  });

  const pythonData = (await pythonRes.json()) as { feedback: Feedback[] };

  res.status(200).json({
    data: [
      {
        name: "All feedback",
        feedback: pythonData.feedback,
      },
    ],
  });
}
