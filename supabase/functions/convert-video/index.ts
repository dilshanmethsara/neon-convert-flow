
// Import the correct Deno standard library modules
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { FFmpeg } from "https://esm.sh/@ffmpeg/ffmpeg@0.12.7";
import { fetchFile, toBlobURL } from "https://esm.sh/@ffmpeg/util@0.12.1";

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

    console.log('Downloading video from:', videoUrl);
    
    // Download the video file
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error('Failed to fetch video');
    const videoData = await response.arrayBuffer();
    
    console.log('Video downloaded, size:', videoData.byteLength);

    // Initialize FFmpeg
    const ffmpeg = new FFmpeg();
    console.log('Loading FFmpeg...');
    
    // Load ffmpeg core
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    console.log('FFmpeg loaded successfully');

    // Write input file to memory
    await ffmpeg.writeFile('input.mp4', new Uint8Array(videoData));
    console.log('Input file written');
    
    // Run conversion command
    await ffmpeg.exec(['-i', 'input.mp4', '-c:v', 'libx264', '-preset', 'ultrafast', 'output.mp4']);
    console.log('Conversion completed');
    
    // Read the converted file
    const outputData = await ffmpeg.readFile('output.mp4');
    console.log('Output file read, size:', outputData.byteLength);

    // Upload the converted file
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('videos')
      .upload(`converted/${conversionId}.mp4`, outputData);

    if (uploadError) throw uploadError;
    console.log('Converted file uploaded:', uploadData?.path);

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
    
    console.log('Conversion record updated, URL:', publicUrl);

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
