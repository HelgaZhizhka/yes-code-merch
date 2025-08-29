set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sync_address_from_customer()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  SELECT c.email,
         c.phone,
         c.title,
         c.first_name,
         c.last_name
    INTO NEW.email,
         NEW.phone,
         NEW.title,
         NEW.first_name,
         NEW.last_name
    FROM public.customers AS c
   WHERE c.user_id = NEW.user_id;

  RETURN NEW;
END;
$function$
;

CREATE TRIGGER sync_address_before_insert BEFORE INSERT ON public.addresses FOR EACH ROW EXECUTE FUNCTION sync_address_from_customer();


