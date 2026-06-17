
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare has_admin boolean;
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

  select exists (select 1 from public.user_roles where role = 'admin') into has_admin;
  if not has_admin then
    insert into public.user_roles (user_id, role, status)
    values (new.id, 'admin', 'approuve')
    on conflict do nothing;
  end if;

  return new;
end; $$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
