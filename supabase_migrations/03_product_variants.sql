-- Create product_variants table
create table if not exists public.product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  name text not null, -- e.g. "Red / L"
  price numeric, -- Optional override
  stock integer default 0,
  attributes jsonb, -- e.g. {"Color": "Red", "Size": "L"}
  images text[], -- Optional specific images for this variant
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for product_variants
alter table public.product_variants enable row level security;

create policy "Public variants are viewable by everyone"
  on public.product_variants for select
  using ( true );

create policy "Authenticated users can manage variants"
  on public.product_variants for all
  using ( auth.role() = 'authenticated' );
