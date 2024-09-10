import { Schema } from "mongoose";

interface validationResult {
  isValid: boolean;
  errors: string[];
}
export const validateTranscation = (data: any): validationResult => {
  const errors: string[] = [];
  // check required fields
  const requiredFields = ["amount", "category", "date"];
  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });
  // validate amount
  if (typeof data.amount !== "number" || data.amount < 0) {
    errors.push("amount must be number and greater than 0");
  }
  if (typeof data.category !== "string" || data.category.trim().length === 0) {
    errors.push("category must be non empty string");
  }
  // Validate date
  if (!(data.date instanceof Date) && isNaN(Date.parse(data.date))) {
    errors.push("Invalid date format");
  }

  // Validate optional fields
  if (data.description && typeof data.description !== "string") {
    errors.push("Description must be a string");
  }

  if (data.isRecurring !== undefined && typeof data.isRecurring !== "boolean") {
    errors.push("isRecurring must be a boolean");
  }

  if (data.recurrenceInterval) {
    const validIntervals = ["daily", "weekly", "monthly", "yearly"];
    if (!validIntervals.includes(data.recurrenceInterval)) {
      errors.push("Invalid recurrence interval");
    }
  }

  if (data.recurrenceStartDate && isNaN(Date.parse(data.recurrenceStartDate))) {
    errors.push("Invalid recurrence start date format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
