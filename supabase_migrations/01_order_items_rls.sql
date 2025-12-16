-- Enable RLS for order_items (already done, but good to be sure)
alter table public.order_items enable row level security;

-- Allow authenticated users (admin) to view all order items
create policy "Authenticated users can view all order items"
  on public.order_items for select
  using ( auth.role() = 'authenticated' );

-- Allow authenticated users (admin) to insert/update/delete order items (if needed)
create policy "Authenticated users can manage order items"
  on public.order_items for all
  using ( auth.role() = 'authenticated' );
