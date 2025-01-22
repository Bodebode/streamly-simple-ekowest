-- Enable the required extensions if not already enabled
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Schedule the section count check to run every hour
select cron.schedule(
  'check-sections-hourly',
  '0 * * * *', -- Run at the start of every hour
  $$
  select
    net.http_post(
      url:='https://yuisywwlzorzdrzvjlvm.supabase.co/functions/v1/check-section-counts',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) as request_id;
  $$
);