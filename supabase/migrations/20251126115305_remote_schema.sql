drop extension if exists "pg_net";

drop policy "product_types_block_write" on "public"."product_types";


  create policy "coupons_select_active_for_authenticated"
  on "public"."coupons"
  as permissive
  for select
  to authenticated
using (((is_active = true) AND ((valid_from IS NULL) OR (now() >= valid_from)) AND ((valid_to IS NULL) OR (now() <= valid_to))));



