DROP FUNCTION IF EXISTS public.clear_default_address(text);
DROP FUNCTION IF EXISTS public.complete_registration(text, text, text, text, text, date, text, text, text, text, text, text, boolean, boolean, text, text, text, text, text, boolean);
DROP FUNCTION IF EXISTS public.set_default_address(uuid, text);

DROP FUNCTION IF EXISTS public.get_catalog(uuid, text, text, text, int, int);
DROP FUNCTION IF EXISTS public.list_products_by_category(uuid, text, text, int, int);
DROP FUNCTION IF EXISTS public.get_effective_variant_price(uuid);
DROP FUNCTION IF EXISTS public.get_category_subtree(uuid);
DROP FUNCTION IF EXISTS public.get_category_ancestors(uuid);
DROP FUNCTION IF EXISTS public.get_category_breadcrumb_paths(text);


DROP VIEW IF EXISTS public.v_plp_products;
