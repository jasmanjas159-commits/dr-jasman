import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eswxyryrnhkaxapezjrj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzd3h5cnlybmhrYXhhcGV6anJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMTUwMTMsImV4cCI6MjEwNTg5MTAxM30.YO_28gXhRMRp8DcqqIW8bWLZd7mEpP9RlLGU9PKWDyg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);