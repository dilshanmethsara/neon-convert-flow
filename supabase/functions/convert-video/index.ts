
import { serve } from 'https://deno.fresh.dev/std@1.0.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl, conversionId } = await req.json();
    
    // Create Supabase client
    const supabaseAdmin = createClient(
      'https://kmkpxyhuskdneirsjsaz.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Update conversion status to processing
    await supabaseAdmin
      .from('conversions')
      .update({ status: 'processing' })
      .eq('id', conversionId);

    // Download the video file
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error('Failed to fetch video');
    const videoData = await response.arrayBuffer();

    // Convert video using FFmpeg.wasm
    const ffmpeg = await FFmpeg.create({
      log: true,
      logger: ({ message }) => console.log(message),
    });

    await ffmpeg.writeFile('input.h265x', new Uint8Array(videoData));
    await ffmpeg.exec(['-i', 'input.h265x', '-c:v', 'libx264', '-preset', 'medium', 'output.mp4']);
    const outputData = await ffmpeg.readFile('output.mp4');

    // Upload the converted file
    const { error: uploadError } = await supabaseAdmin.storage
      .from('videos')
      .upload(`converted/${conversionId}.mp4`, outputData);

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('videos')
      .getPublicUrl(`converted/${conversionId}.mp4`);

    // Update conversion status to completed
    await supabaseAdmin
      .from('conversions')
      .update({ 
        status: 'completed',
        converted_filename: publicUrl
      })
      .eq('id', conversionId);

    return new Response(
      JSON.stringify({ success: true, url: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Conversion error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
