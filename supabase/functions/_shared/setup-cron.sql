-- Enable the required extensions if not already enabled
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Schedule the video availability check to run every hour
select cron.schedule(
  'check-videos-hourly',
  '0 * * * *', -- Run at the start of every hour
  $$
  select
    net.http_post(
      url:='https://yuisywwlzorzdrzvjlvm.supabase.co/functions/v1/check-video-availability',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) as request_id;
  $$
);