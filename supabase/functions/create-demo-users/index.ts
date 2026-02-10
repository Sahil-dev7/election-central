import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const demoUsers = [
      { email: "voter@electvote.demo", password: "voter123", fullName: "Demo Voter", role: "voter" },
      { email: "admin@electvote.demo", password: "admin123", fullName: "Demo Admin", role: "admin" },
      { email: "superadmin@electvote.demo", password: "super123", fullName: "Demo Super Admin", role: "super_admin" },
    ];

    const results = [];

    for (const demoUser of demoUsers) {
      // Check if user exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u) => u.email === demoUser.email);

      if (existing) {
        // Update role if needed
        await supabaseAdmin.from("user_roles").upsert(
          { user_id: existing.id, role: demoUser.role },
          { onConflict: "user_id" }
        );
        results.push({ email: demoUser.email, status: "already exists, role updated" });
        continue;
      }

      // Create user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: demoUser.email,
        password: demoUser.password,
        email_confirm: true,
        user_metadata: { full_name: demoUser.fullName },
      });

      if (error) {
        results.push({ email: demoUser.email, status: "error", error: error.message });
        continue;
      }

      if (data.user) {
        // Update role (trigger creates voter by default, so update for admin/super_admin)
        if (demoUser.role !== "voter") {
          await supabaseAdmin.from("user_roles").update({ role: demoUser.role }).eq("user_id", data.user.id);
        }
        results.push({ email: demoUser.email, status: "created" });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
