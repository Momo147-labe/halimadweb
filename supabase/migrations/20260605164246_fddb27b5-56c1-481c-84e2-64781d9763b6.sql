
-- =========================================================================
-- HaliMad — Schéma de base (Livraison 1)
-- =========================================================================

-- Helper: updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- =========================================================================
-- Enums
-- =========================================================================
do $$ begin
  create type public.app_role as enum ('admin','restaurant','ambassadeur','livreur','client');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.approval_status as enum ('en_attente','approuve','suspendu');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_method as enum ('cash','orange_money');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum ('en_attente','preparation','en_livraison','livree','annulee');
exception when duplicate_object then null; end $$;

-- =========================================================================
-- profiles
-- =========================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  whatsapp text,
  city text default 'Labé',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles self read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- =========================================================================
-- user_roles
-- =========================================================================
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  status public.approval_status not null default 'approuve',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role and status = 'approuve');
$$;

create policy "roles self read" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "roles admin read all" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "roles admin manage" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- =========================================================================
-- settings (singleton)
-- =========================================================================
create table public.settings (
  id boolean primary key default true check (id),
  whatsapp_principal text not null default '224620000000',
  whatsapp_secours text default '',
  message_auto text not null default 'Bonjour HaliMad, je souhaite commander : {plat} x{qty}. Total : {total} GNF. Adresse : {adresse}. Client : {client} ({phone}).',
  frais_livraison_gnf integer not null default 10000,
  commission_halimad_pct numeric(5,2) not null default 10,
  commission_ambassadeur_pct numeric(5,2) not null default 5,
  om_number text not null default '620000000',
  support_whatsapp text not null default '224620000000',
  zones_livraison jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.settings to anon, authenticated;
grant all on public.settings to service_role;
alter table public.settings enable row level security;
create policy "settings public read" on public.settings for select to anon, authenticated using (true);
create policy "settings admin write" on public.settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger trg_settings_updated before update on public.settings
  for each row execute function public.update_updated_at_column();
insert into public.settings (id) values (true);

-- =========================================================================
-- categories
-- =========================================================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order integer not null default 0,
  active boolean not null default false,
  icon text,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read active" on public.categories for select to anon, authenticated using (active = true or public.has_role(auth.uid(),'admin'));
create policy "categories admin write" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Seed: restaurants activé, autres préparées mais inactives
insert into public.categories (slug, name, sort_order, active, icon) values
  ('restaurants','Restaurants',1,true,'utensils'),
  ('electronique','Électronique',2,false,'smartphone'),
  ('mode','Mode & Vêtements',3,false,'shirt'),
  ('cosmetique','Cosmétique',4,false,'sparkles'),
  ('pharmacie','Pharmacie',5,false,'pill'),
  ('services','Services & Formations',6,false,'briefcase');

-- =========================================================================
-- merchants
-- =========================================================================
create table public.merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  category_id uuid not null references public.categories(id),
  name text not null,
  description text default '',
  phone text not null default '',
  city text not null default 'Labé',
  address text default '',
  cover_url text default '',
  hours text default '',
  status public.approval_status not null default 'en_attente',
  commission_pct numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.merchants to anon, authenticated;
grant insert, update on public.merchants to authenticated;
grant all on public.merchants to service_role;
alter table public.merchants enable row level security;
create policy "merchants public read approved" on public.merchants for select to anon, authenticated
  using (status = 'approuve' or owner_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "merchants owner insert" on public.merchants for insert to authenticated with check (owner_id = auth.uid());
create policy "merchants owner update" on public.merchants for update to authenticated using (owner_id = auth.uid());
create policy "merchants admin all" on public.merchants for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger trg_merchants_updated before update on public.merchants
  for each row execute function public.update_updated_at_column();

-- =========================================================================
-- items (plats / produits)
-- =========================================================================
create table public.items (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  name text not null,
  description text default '',
  price_gnf integer not null check (price_gnf >= 0),
  image_url text default '',
  available boolean not null default true,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.items to anon, authenticated;
grant insert, update, delete on public.items to authenticated;
grant all on public.items to service_role;
alter table public.items enable row level security;
create policy "items public read available" on public.items for select to anon, authenticated using (
  available = true
  or exists (select 1 from public.merchants m where m.id = items.merchant_id and m.owner_id = auth.uid())
  or public.has_role(auth.uid(),'admin')
);
create policy "items owner manage" on public.items for all to authenticated
  using (exists (select 1 from public.merchants m where m.id = items.merchant_id and m.owner_id = auth.uid()))
  with check (exists (select 1 from public.merchants m where m.id = items.merchant_id and m.owner_id = auth.uid()));
create policy "items admin all" on public.items for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger trg_items_updated before update on public.items
  for each row execute function public.update_updated_at_column();

-- =========================================================================
-- orders
-- =========================================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  merchant_id uuid not null references public.merchants(id),
  buyer_id uuid references auth.users(id) on delete set null,
  buyer_name text not null,
  buyer_phone text not null,
  address text not null,
  city text not null default 'Labé',
  notes text,
  payment_method public.payment_method not null default 'cash',
  ambassador_id uuid references auth.users(id) on delete set null,
  driver_id uuid references auth.users(id) on delete set null,
  status public.order_status not null default 'en_attente',
  total_gnf integer not null default 0,
  fee_livreur_gnf integer not null default 0,
  commission_halimad_pct numeric(5,2) not null default 10,
  commission_ambassadeur_pct numeric(5,2) not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.orders to anon, authenticated;
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders insert anyone" on public.orders for insert to anon, authenticated with check (true);
create policy "orders buyer read" on public.orders for select to authenticated using (buyer_id = auth.uid());
create policy "orders merchant read" on public.orders for select to authenticated using (
  exists (select 1 from public.merchants m where m.id = orders.merchant_id and m.owner_id = auth.uid())
);
create policy "orders ambassador read" on public.orders for select to authenticated using (ambassador_id = auth.uid());
create policy "orders driver read" on public.orders for select to authenticated using (
  driver_id = auth.uid() or (driver_id is null and public.has_role(auth.uid(),'livreur'))
);
create policy "orders admin all" on public.orders for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "orders merchant update" on public.orders for update to authenticated using (
  exists (select 1 from public.merchants m where m.id = orders.merchant_id and m.owner_id = auth.uid())
);
create policy "orders driver update" on public.orders for update to authenticated using (
  driver_id = auth.uid() or (driver_id is null and public.has_role(auth.uid(),'livreur'))
);
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.update_updated_at_column();

-- =========================================================================
-- order_items
-- =========================================================================
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_id uuid references public.items(id) on delete set null,
  name text not null,
  image_url text default '',
  unit_price_gnf integer not null,
  qty integer not null check (qty > 0)
);
grant insert on public.order_items to anon, authenticated;
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "oi insert anyone" on public.order_items for insert to anon, authenticated with check (true);
create policy "oi visible via order" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_items.order_id and (
    o.buyer_id = auth.uid()
    or o.ambassador_id = auth.uid()
    or o.driver_id = auth.uid()
    or exists (select 1 from public.merchants m where m.id = o.merchant_id and m.owner_id = auth.uid())
    or public.has_role(auth.uid(),'admin')
  ))
);

-- =========================================================================
-- order_history
-- =========================================================================
create table public.order_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  at timestamptz not null default now(),
  by_user_id uuid references auth.users(id) on delete set null
);
grant insert on public.order_history to anon, authenticated;
grant select on public.order_history to authenticated;
grant all on public.order_history to service_role;
alter table public.order_history enable row level security;
create policy "oh insert anyone" on public.order_history for insert to anon, authenticated with check (true);
create policy "oh visible via order" on public.order_history for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_history.order_id and (
    o.buyer_id = auth.uid()
    or o.ambassador_id = auth.uid()
    or o.driver_id = auth.uid()
    or exists (select 1 from public.merchants m where m.id = o.merchant_id and m.owner_id = auth.uid())
    or public.has_role(auth.uid(),'admin')
  ))
);

-- =========================================================================
-- ambassador_links
-- =========================================================================
create table public.ambassador_links (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now()
);
grant select on public.ambassador_links to anon, authenticated;
grant insert, update on public.ambassador_links to authenticated;
grant all on public.ambassador_links to service_role;
alter table public.ambassador_links enable row level security;
create policy "amb_links public read" on public.ambassador_links for select to anon, authenticated using (true);
create policy "amb_links self manage" on public.ambassador_links for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- =========================================================================
-- Trigger : création auto profil + rôle client à l'inscription
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, whatsapp, city)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'whatsapp',
    coalesce(new.raw_user_meta_data->>'city','Labé')
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role, status)
  values (new.id, 'client', 'approuve')
  on conflict do nothing;

  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
