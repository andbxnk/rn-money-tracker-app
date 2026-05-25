import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const SUPABASE_URL = "https://ohgwhekwwykmeynczqaq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZ3doZWt3d3lrbWV5bmN6cWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTEzNzAsImV4cCI6MjA5Mzk4NzM3MH0.5jOuo6PDgWijeorV53hQRgWQyhUH1DX46cWJQI7sMZI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const transactionService = {
  async addTransaction(
    detail: string,
    amount: number,
    type: "income" | "expense",
  ) {
    const { data, error } = await supabase
      .from("transactions")
      .insert([{ detail, amount, type, created_at: new Date().toISOString() }]);
    return { data, error };
  },

  async getTransactions(limit: number = 15, page: number = 1) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("transactions")
      .select("*", { count: "exact" }) // ✨
      .order("created_at", { ascending: false })
      .range(from, to); //

    return { data, error, count }; // ✨
  },

  async getSummary() {
    const { data, error } = await supabase
      .from("transactions")
      .select("amount, type");

    if (error) return { success: false, income: 0, expense: 0, balance: 0 };

    const income =
      data
        ?.filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0) || 0;
    const expense =
      data
        ?.filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0) || 0;

    return { success: true, income, expense, balance: income - expense };
  },
};
