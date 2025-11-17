DROP FUNCTION IF EXISTS public.get_all_categories_tree();

CREATE OR REPLACE FUNCTION public.get_all_categories_tree()
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  parent_id uuid,
  depth int,
  root_id uuid,
  root_name text,
  root_slug text,
  order_hint text
)
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  WITH RECURSIVE
  roots AS (
    SELECT
      c.id   AS root_id,
      c.name AS root_name,
      c.slug AS root_slug,
      c.order_hint AS root_order_hint
    FROM public.categories c
    WHERE c.parent_id IS NULL
  ),
  r AS (
    SELECT
      c.id, c.name, c.slug, c.parent_id,
      0::int AS depth,
      rt.root_id, rt.root_name, rt.root_slug,
      c.order_hint,
      rt.root_order_hint
    FROM public.categories c
    JOIN roots rt ON rt.root_id = c.id

    UNION ALL

    SELECT
      ch.id, ch.name, ch.slug, ch.parent_id,
      r.depth + 1,
      r.root_id, r.root_name, r.root_slug,
      ch.order_hint,
      r.root_order_hint
    FROM public.categories ch
    JOIN r ON ch.parent_id = r.id
  )
  SELECT
    id, name, slug, parent_id, depth,
    root_id, root_name, root_slug,
    order_hint
  FROM r
  ORDER BY
    (root_order_hint IS NULL OR root_order_hint = '') ASC,
    root_order_hint ASC NULLS LAST,
    root_name ASC,
    depth ASC,
    (order_hint IS NULL OR order_hint = '') ASC,
    order_hint ASC NULLS LAST,
    name ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_categories_tree() TO anon, authenticated;
