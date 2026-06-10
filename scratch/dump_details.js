import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://egvevrlmsreugkvsdtpj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndmV2cmxtc3JldWdrdnNkdHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjExNTksImV4cCI6MjA5NjEzNzE1OX0.Zk72baXtGcQ0jqPt3bDBN7FlWCzlU7D1CBc7C2hfJSw";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== FAQS ===");
  const { data: faqs } = await supabase.from("faqs").select("*");
  console.log(JSON.stringify(faqs, null, 2));

  console.log("\n=== INGREDIENTS ===");
  const { data: ingredients } = await supabase.from("ingredients").select("*");
  console.log(JSON.stringify(ingredients, null, 2));

  console.log("\n=== BENEFITS ===");
  const { data: benefits } = await supabase.from("benefits").select("*");
  console.log(JSON.stringify(benefits, null, 2));
}

run();
