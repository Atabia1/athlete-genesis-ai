// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

/**
 * Health Connect API
 * 
 * This function handles the connection between the mobile app and the web app.
 * It verifies connection codes and establishes a secure connection.
 */

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Handle OPTIONS requests for CORS
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
}

// Verify a connection code
async function verifyConnectionCode(code: string, userId: string, deviceInfo: any) {
  try {
    // Check if the connection code exists and is valid
    const { data: connectionCode, error: connectionError } = await supabase
      .from("health_connection_codes")
      .select("*")
      .eq("code", code)
      .eq("used", false)
      .single();

    if (connectionError || !connectionCode) {
      return { success: false, error: "Invalid connection code" };
    }

    // Check if the code has expired
    const expiresAt = new Date(connectionCode.expires_at);
    if (expiresAt < new Date()) {
      return { success: false, error: "Connection code has expired" };
    }

    // Generate a unique device ID
    const deviceId = crypto.randomUUID();

    // Mark the connection code as used
    await supabase
      .from("health_connection_codes")
      .update({ used: true, used_at: new Date().toISOString() })
      .eq("id", connectionCode.id);

    // Create a new connected device record
    await supabase.from("health_connected_devices").insert({
      user_id: userId,
      device_id: deviceId,
      device_info: deviceInfo,
      connected_at: new Date().toISOString(),
    });

    return {
      success: true,
      userId,
      deviceId,
    };
  } catch (error) {
    console.error("Error verifying connection code:", error);
    return { success: false, error: "Failed to verify connection code" };
  }
}

// Disconnect a device
async function disconnectDevice(deviceId: string, userId: string) {
  try {
    // Delete the connected device record
    const { error } = await supabase
      .from("health_connected_devices")
      .delete()
      .eq("device_id", deviceId)
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: "Failed to disconnect device" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error disconnecting device:", error);
    return { success: false, error: "Failed to disconnect device" };
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get the path and method
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();
  const method = req.method;

  // Get the authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid authorization header" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  // Verify the token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Handle the request based on the path
  try {
    if (path === "connect" && method === "POST") {
      // Parse the request body
      const { code, deviceInfo } = await req.json();

      // Verify the connection code
      const result = await verifyConnectionCode(code, user.id, deviceInfo);

      // Return the result
      return new Response(
        JSON.stringify(result),
        { status: result.success ? 200 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (path === "disconnect" && method === "POST") {
      // Parse the request body
      const { deviceId } = await req.json();

      // Disconnect the device
      const result = await disconnectDevice(deviceId, user.id);

      // Return the result
      return new Response(
        JSON.stringify(result),
        { status: result.success ? 200 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Unknown path or method
      return new Response(
        JSON.stringify({ error: "Not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    // Handle errors
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
