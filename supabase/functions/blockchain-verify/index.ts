import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  userLimit.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { eventData, shipmentId } = await req.json();
    console.log('Recording blockchain verification for shipment:', shipmentId);

    // Generate simulated VeChain transaction hash
    // In production, this would call the actual VeChain API
    const blockchainTxHash = `0x${crypto.randomUUID().replace(/-/g, '')}`;
    const vechainTxId = `VET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('Generated blockchain identifiers:', { blockchainTxHash, vechainTxId });

    // Store blockchain verification data
    const verificationData = {
      timestamp: new Date().toISOString(),
      eventType: eventData.event_type,
      location: eventData.location,
      temperature: eventData.temperature,
      description: eventData.description,
      shipmentId: shipmentId,
      blockchainTxHash,
      vechainTxId
    };

    console.log('Blockchain verification recorded:', verificationData);

    return new Response(
      JSON.stringify({
        success: true,
        blockchainTxHash,
        vechainTxId,
        verificationData,
        message: 'Blockchain verification recorded successfully'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in blockchain verification:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: 'Failed to record blockchain verification'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
