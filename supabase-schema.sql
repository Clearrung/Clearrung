-- Run this in the Supabase SQL editor (your project > SQL Editor > New query)

create table debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  balance numeric not null,
  rate numeric not null,
  min_payment numeric not null,
  created_at timestamp with time zone default now()
);

-- Row-level security: each user can only see and edit their own debts
alter table debts enable row level security;

create policy "Users can view their own debts"
  on debts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own debts"
  on debts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own debts"
  on debts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own debts"
  on debts for delete
  using (auth.uid() = user_id);
