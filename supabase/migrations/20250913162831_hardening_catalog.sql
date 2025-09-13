-- ===========================================
-- Harden catalog view + enable RLS on product_types
-- Safe to run multiple times
-- ===========================================
do $$
begin
  execute 'alter view public.v_plp_products set (security_invoker = true)';
  execute 'alter view public.v_plp_products set (security_barrier = true)';
exception
  when undefined_object or feature_not_supported then
    begin
      execute $v$
      create or replace view public.v_plp_products
      with (security_invoker = true, security_barrier = true) as
      select
        p.id as product_id,
        p.name,
        p.slug,
        p.is_published,
        mv.id   as master_variant_id,
        mv.sku  as master_sku,
        mv.price as master_price,
        mv.currency,
        coalesce(pi.url, null) as primary_image_url
      from products p
      join lateral (
        select v.* from product_variants v
        where v.product_id = p.id and v.is_master = true
        limit 1
      ) mv on true
      left join lateral (
        select i.url from product_images i
        where i.variant_id = mv.id and i.is_primary = true
        order by i.sort_order asc, i.created_at asc
        limit 1
      ) pi on true
      where p.is_published = true;
      $v$;
    exception when others then
      null;
    end;
end$$;

alter table if exists public.product_types enable row level security;

drop policy if exists product_types_public_read on public.product_types;
create policy product_types_public_read
  on public.product_types
  for select
  to anon, authenticated
  using (true);

drop policy if exists product_types_block_write on public.product_types;
create policy product_types_block_write
  on public.product_types
  for all
  to public
  using (false)
  with check (false);
