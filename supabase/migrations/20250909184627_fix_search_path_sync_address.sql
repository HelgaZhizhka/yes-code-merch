set check_function_bodies = off;

create or replace function public.sync_address_from_customer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  select c.email,
         c.phone,
         c.title,
         c.first_name,
         c.last_name
    into NEW.email,
         NEW.phone,
         NEW.title,
         NEW.first_name,
         NEW.last_name
    from public.customers as c
   where c.user_id = NEW.user_id;

  return NEW;
end;
$function$;

alter function public.sync_address_from_customer() owner to postgres;

revoke execute on function public.sync_address_from_customer() from public, anon, authenticated;


drop trigger if exists sync_address_before_insert on public.addresses;
create trigger sync_address_before_insert
before insert on public.addresses
for each row
execute function public.sync_address_from_customer();
