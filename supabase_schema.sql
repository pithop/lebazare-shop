-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price numeric not null,
  images text[] default array[]::text[],
  stock integer default 0,
  slug text unique not null,
  etsy_id text unique, -- Important for sync
  category text,
  is_active boolean default true
);

-- Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'pending', -- pending, paid, shipped, cancelled
  total numeric not null,
  customer_details jsonb -- Store name, email, address, etc.
);

-- Order Items Table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer default 1,
  price numeric not null -- Price at the time of purchase
);

-- RLS Policies (Row Level Security)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read access for products
create policy "Public products are viewable by everyone"
  on public.products for select
  using ( true );

-- Admin full access
create policy "Authenticated users can manage products"
  on public.products for all
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can view all orders"
  on public.orders for select
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can manage orders"
  on public.orders for all
  using ( auth.role() = 'authenticated' );

-- Storage Setup (Run this if you haven't created the bucket in the dashboard)
insert into storage.buckets (id, name, public) 
values ('products', 'products', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access" 
  on storage.objects for select 
  using ( bucket_id = 'products' );

create policy "Auth Upload" 
  on storage.objects for insert 
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

create policy "Auth Delete" 
  on storage.objects for delete 
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );
