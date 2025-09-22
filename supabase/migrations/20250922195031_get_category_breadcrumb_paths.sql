DROP FUNCTION IF EXISTS public.get_category_breadcrumb_paths(text);

CREATE OR REPLACE FUNCTION public.get_category_breadcrumb_paths(cat_slug text)
RETURNS TABLE(
  path text,
  name text,
  is_current boolean
)
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  WITH ancestors AS (
    SELECT id, name, slug, depth
    FROM public.get_category_ancestors((
      SELECT id FROM public.categories WHERE slug = cat_slug LIMIT 1
    ))
    ORDER BY depth DESC
  ),
  numbered AS (
    SELECT
      id, name, slug, depth,
      row_number() OVER (ORDER BY depth DESC) AS rn,
      max(depth)    OVER ()                   AS max_depth
    FROM ancestors
  )
  SELECT
    array_to_string(
      array_agg(slug) OVER (ORDER BY rn ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
      '/'
    ) AS path,
    name,
    (rn = max(rn) OVER ()) AS is_current
  FROM numbered
  ORDER BY rn ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_category_breadcrumb_paths(text) TO anon, authenticated;
