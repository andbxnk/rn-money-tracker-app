import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const SUPABASE_URL = "https://ohgwhekwwykmeynczqaq.supabase.co";
// ✨ ใส่ Key ตัวจริงกลับคืนมาให้เรียบร้อยครับ
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZ3doZWt3d3lrbWV5bmN6cWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MTEzNzAsImV4cCI6MjA5Mzk4NzM3MH0.5jOuo6PDgWijeorV53hQRgWQyhUH1DX46cWJQI7sMZI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const transactionService = {
  // 1. เพิ่มรายการ
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

  // 2. ดึงประวัติรายการ (ปรับเพิ่มการรับค่า limit และ page และส่งค่า count กลับไปเพื่อทำ Pagination)
  async getTransactions(limit: number = 15, page: number = 1) {
    // คำนวณหาจุดเริ่มต้น (from) และจุดสิ้นสุด (to) ของข้อมูลในหน้านั้นๆ
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("transactions")
      .select("*", { count: "exact" }) // ✨ เพิ่มตรงนี้เพื่อให้ Supabase ส่งจำนวนรายการทั้งหมดที่มีกลับมาด้วย
      .order("created_at", { ascending: false })
      .range(from, to); // ใช้ range ดึงเฉพาะช่วงข้อมูลที่คำนวณได้

    return { data, error, count }; // ✨ ส่ง count เพิ่มกลับไปให้หน้าจอเช็กเงื่อนไขปุ่มกดถัดไป
  },

  // 3. คำนวณสรุปยอดเงิน
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
