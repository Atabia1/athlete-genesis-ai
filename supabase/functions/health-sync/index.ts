// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

/**
 * Health Sync API
 * 
 * This function handles the synchronization of health data between the mobile app and the web app.
 * It stores health data in the database and provides endpoints for retrieving health data.
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

// Sync health data
async function syncHealthData(userId: string, deviceId: string, healthData: any) {
  try {
    // Validate the device ID
    const { data: device, error: deviceError } = await supabase
      .from("health_connected_devices")
      .select("*")
      .eq("device_id", deviceId)
      .eq("user_id", userId)
      .single();

    if (deviceError || !device) {
      return { success: false, error: "Invalid device ID" };
    }

    // Add metadata to the health data
    const healthDataWithMetadata = {
      ...healthData,
      user_id: userId,
      device_id: deviceId,
      synced_at: new Date().toISOString(),
    };

    // Store the health data
    const { error: healthDataError } = await supabase
      .from("health_data")
      .upsert({
        user_id: userId,
        data: healthDataWithMetadata,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (healthDataError) {
      return { success: false, error: "Failed to store health data" };
    }

    // Update the device's last sync time
    await supabase
      .from("health_connected_devices")
      .update({ last_sync: new Date().toISOString() })
      .eq("device_id", deviceId);

    return { success: true };
  } catch (error) {
    console.error("Error syncing health data:", error);
    return { success: false, error: "Failed to sync health data" };
  }
}

// Get health data
async function getHealthData(userId: string) {
  try {
    // Get the health data
    const { data, error } = await supabase
      .from("health_data")
      .select("data")
      .eq("user_id", userId)
      .single();

    if (error) {
      return null;
    }

    return data?.data || null;
  } catch (error) {
    console.error("Error getting health data:", error);
    return null;
  }
}

// Get connected devices
async function getConnectedDevices(userId: string) {
  try {
    // Get the connected devices
    const { data, error } = await supabase
      .from("health_connected_devices")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error getting connected devices:", error);
    return [];
  }
}

// Sync a workout to health apps
async function syncWorkout(userId: string, workout: any) {
  try {
    // Get the connected devices
    const { data: devices, error: devicesError } = await supabase
      .from("health_connected_devices")
      .select("device_id")
      .eq("user_id", userId);

    if (devicesError || !devices || devices.length === 0) {
      return { success: false, error: "No connected devices" };
    }

    // Add the workout to the sync queue for each device
    for (const device of devices) {
      await supabase.from("health_sync_queue").insert({
        user_id: userId,
        device_id: device.device_id,
        type: "workout",
        data: workout,
        created_at: new Date().toISOString(),
        status: "pending",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error syncing workout:", error);
    return { success: false, error: "Failed to sync workout" };
  }
}

// Get sync status
async function getSyncStatus(userId: string) {
  try {
    // Get the connected devices
    const { data: devices, error: devicesError } = await supabase
      .from("health_connected_devices")
      .select("*")
      .eq("user_id", userId);

    if (devicesError) {
      return {
        lastSync: null,
        syncInProgress: false,
        connectedDevices: 0,
      };
    }

    // Get the health data
    const { data: healthData, error: healthDataError } = await supabase
      .from("health_data")
      .select("last_updated")
      .eq("user_id", userId)
      .single();

    // Return the sync status
    return {
      lastSync: healthData?.last_updated || null,
      syncInProgress: false, // We don't track sync progress yet
      connectedDevices: devices?.length || 0,
    };
  } catch (error) {
    console.error("Error getting sync status:", error);
    return {
      lastSync: null,
      syncInProgress: false,
      connectedDevices: 0,
    };
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
    if (path === "sync" && method === "POST") {
      // Parse the request body
      const { deviceId, healthData } = await req.json();

      // Sync the health data
      const result = await syncHealthData(user.id, deviceId, healthData);

      // Return the result
      return new Response(
        JSON.stringify(result),
        { status: result.success ? 200 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (path === "data" && method === "GET") {
      // Get the health data
      const healthData = await getHealthData(user.id);

      // Return the health data
      return new Response(
        JSON.stringify(healthData),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (path === "devices" && method === "GET") {
      // Get the connected devices
      const devices = await getConnectedDevices(user.id);

      // Return the connected devices
      return new Response(
        JSON.stringify(devices),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (path === "workout/sync" && method === "POST") {
      // Parse the request body
      const { workout } = await req.json();

      // Sync the workout
      const result = await syncWorkout(user.id, workout);

      // Return the result
      return new Response(
        JSON.stringify(result),
        { status: result.success ? 200 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (path === "status" && method === "GET") {
      // Get the sync status
      const status = await getSyncStatus(user.id);

      // Return the sync status
      return new Response(
        JSON.stringify(status),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
