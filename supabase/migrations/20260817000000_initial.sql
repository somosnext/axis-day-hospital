create extension if not exists pgcrypto;

create type public.app_role as enum ('admin','editor');
create type public.lead_status as enum ('new','contacted','qualified','converted','lost');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  crm text,
  crm_state char(2),
  specialty text,
  phone text,
  email text,
  message text not null,
  source text,
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  status public.lead_status not null default 'new',
  notes text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_contact_check check (phone is not null or email is not null),
  constraint leads_message_length check (char_length(message) between 10 and 2000)
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  slogan text,
  phone text,
  whatsapp text,
  whatsapp_message text,
  email text,
  address text not null,
  opening_hours text not null,
  instagram_url text,
  maps_url text,
  maps_embed text,
  seo_title text,
  seo_description text,
  canonical_url text,
  privacy_policy text,
  terms_of_use text,
  updated_at timestamptz not null default now()
);

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  eyebrow text,
  title text,
  description text,
  content jsonb not null default '{}'::jsonb,
  cta_label text,
  cta_url text,
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.differentials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  image_url text,
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt_text text not null,
  image_url text not null,
  category text not null default 'Institucional',
  sort_order integer not null default 0,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads(created_at desc);
create index leads_status_idx on public.leads(status);
create index leads_source_idx on public.leads(source);
create index leads_utm_source_idx on public.leads(utm_source);
create index leads_ip_hash_created_at_idx on public.leads(ip_hash,created_at desc);
create index page_sections_public_idx on public.page_sections(active,sort_order);
create index differentials_public_idx on public.differentials(active,sort_order);
create index gallery_public_idx on public.gallery(active,category,sort_order);
create index faqs_public_idx on public.faqs(active,sort_order);
create index audit_logs_entity_idx on public.audit_logs(entity,entity_id,created_at desc);
create index audit_logs_user_idx on public.audit_logs(user_id,created_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at=now();return new;end;$$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create trigger sections_updated_at before update on public.page_sections for each row execute function public.set_updated_at();
create trigger differentials_updated_at before update on public.differentials for each row execute function public.set_updated_at();
create trigger faqs_updated_at before update on public.faqs for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name') on conflict(id) do nothing;return new;end;$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','editor'));
$$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;

create or replace function public.enforce_lead_rate_limit() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.ip_hash is not null and (select count(*) from public.leads where ip_hash=new.ip_hash and created_at>now()-interval '1 minute')>=5 then
    raise exception 'lead_rate_limit' using errcode='P0001';
  end if;
  return new;
end;$$;
create trigger lead_rate_limit before insert on public.leads for each row execute function public.enforce_lead_rate_limit();

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_sections enable row level security;
alter table public.differentials enable row level security;
alter table public.gallery enable row level security;
alter table public.faqs enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles self or admin read" on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
create policy "profiles admin update" on public.profiles for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "public creates safe leads" on public.leads for insert to anon,authenticated with check(status='new' and notes is null);
create policy "staff reads leads" on public.leads for select to authenticated using(public.is_staff());
create policy "staff updates leads" on public.leads for update to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "admins delete leads" on public.leads for delete to authenticated using(public.is_admin());
create policy "public reads settings" on public.site_settings for select to anon,authenticated using(true);
create policy "staff manages settings" on public.site_settings for all to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "public reads active sections" on public.page_sections for select to anon,authenticated using(active or public.is_staff());
create policy "staff manages sections" on public.page_sections for all to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "public reads active differentials" on public.differentials for select to anon,authenticated using(active or public.is_staff());
create policy "staff manages differentials" on public.differentials for all to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "public reads active gallery" on public.gallery for select to anon,authenticated using(active or public.is_staff());
create policy "staff manages gallery" on public.gallery for all to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "public reads active faqs" on public.faqs for select to anon,authenticated using(active or public.is_staff());
create policy "staff manages faqs" on public.faqs for all to authenticated using(public.is_staff()) with check(public.is_staff());
create policy "staff reads audit" on public.audit_logs for select to authenticated using(public.is_staff());
create policy "staff creates audit" on public.audit_logs for insert to authenticated with check(public.is_staff() and user_id=auth.uid());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('site-assets','site-assets',true,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "public reads site assets" on storage.objects for select to public using(bucket_id='site-assets');
create policy "staff uploads site assets" on storage.objects for insert to authenticated with check(bucket_id='site-assets' and public.is_staff());
create policy "staff updates site assets" on storage.objects for update to authenticated using(bucket_id='site-assets' and public.is_staff()) with check(bucket_id='site-assets' and public.is_staff());
create policy "staff deletes site assets" on storage.objects for delete to authenticated using(bucket_id='site-assets' and public.is_staff());
