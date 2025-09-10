-- Create orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  buyer_id uuid references auth.users(id) not null,
  farmer_id uuid references auth.users(id) not null,
  product_id uuid references products(id) not null,
  quantity integer not null check (quantity > 0),
  total_price decimal(10,2) not null check (total_price >= 0),
  status text not null check (status in ('pending', 'accepted', 'rejected', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb not null,
  payment_status text not null check (payment_status in ('pending', 'paid', 'refunded')),
  payment_intent_id text -- For Stripe integration
);

-- Create earnings table to track farmer earnings
create table earnings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  farmer_id uuid references auth.users(id) not null,
  order_id uuid references orders(id) not null,
  amount decimal(10,2) not null check (amount >= 0),
  status text not null check (status in ('pending', 'available', 'withdrawn')),
  payout_id uuid references payout_requests(id)
);

-- Create payout_requests table
create table payout_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  farmer_id uuid references auth.users(id) not null,
  amount decimal(10,2) not null check (amount >= 0),
  status text not null check (status in ('pending', 'approved', 'denied', 'completed')),
  payment_method jsonb not null, -- Store payment method details
  processed_by uuid references auth.users(id), -- Admin who processed the request
  processed_at timestamp with time zone,
  notes text
);

-- Enable RLS
alter table orders enable row level security;
alter table earnings enable row level security;
alter table payout_requests enable row level security;

-- Policies for orders table
create policy "Farmers can view their own orders"
on orders for select
using (farmer_id = auth.uid());

create policy "Buyers can view their own orders"
on orders for select
using (buyer_id = auth.uid());

create policy "Farmers can update their own orders"
on orders for update
using (farmer_id = auth.uid());

-- Policies for earnings table
create policy "Farmers can view their own earnings"
on earnings for select
using (farmer_id = auth.uid());

-- Policies for payout_requests table
create policy "Farmers can view their own payout requests"
on payout_requests for select
using (farmer_id = auth.uid());

create policy "Farmers can create payout requests"
on payout_requests for insert
with check (farmer_id = auth.uid());

create policy "Only admins can update payout requests"
on payout_requests for update
using (
  auth.uid() in (
    select id from auth.users
    where raw_user_meta_data->>'role' = 'admin'
  )
);

-- Create functions to calculate earnings
create or replace function get_farmer_earnings(
  farmer_id uuid,
  start_date timestamp with time zone default '-infinity'::timestamp with time zone,
  end_date timestamp with time zone default 'infinity'::timestamp with time zone
) returns table (
  total_earnings decimal(10,2),
  available_balance decimal(10,2),
  pending_balance decimal(10,2)
) language plpgsql security definer as $$
begin
  return query
  select
    coalesce(sum(amount), 0) as total_earnings,
    coalesce(sum(case when status = 'available' then amount else 0 end), 0) as available_balance,
    coalesce(sum(case when status = 'pending' then amount else 0 end), 0) as pending_balance
  from earnings
  where earnings.farmer_id = $1
    and created_at between $2 and $3;
end;
$$;

-- Create function to get sales analytics
create or replace function get_farmer_sales_analytics(
  p_farmer_id uuid,
  p_start_date timestamp with time zone,
  p_end_date timestamp with time zone
) returns table (
  product_id uuid,
  product_name text,
  total_quantity bigint,
  total_sales decimal(10,2)
) language plpgsql security definer as $$
begin
  return query
  select
    p.id as product_id,
    p.name as product_name,
    sum(o.quantity) as total_quantity,
    sum(o.total_price) as total_sales
  from orders o
  join products p on p.id = o.product_id
  where o.farmer_id = p_farmer_id
    and o.created_at between p_start_date and p_end_date
    and o.status != 'rejected'
    and o.status != 'cancelled'
  group by p.id, p.name
  order by total_sales desc;
end;
$$;

-- Add triggers for updating timestamps
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at();

create trigger payout_requests_updated_at
  before update on payout_requests
  for each row
  execute function update_updated_at();
