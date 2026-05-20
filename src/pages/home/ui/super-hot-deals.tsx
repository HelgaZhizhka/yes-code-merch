import { AddToCart } from '@features/add-to-cart';

import { CatalogCard, useTopDiscountedCategory } from '@entities/catalog';

const SECTION_TITLE = 'Super hot deals this month';
const SECTION_SUBTITLE =
  "Unveiling this month's hottest discounts and promotions! Dive into exceptional savings tailored for every shopper's delight.";

export const SuperHotDeals = (): React.JSX.Element | null => {
  const result = useTopDiscountedCategory();

  if (!result) return null;

  return (
    <section
      aria-label={SECTION_TITLE}
      className="mx-auto max-w-[1020px] px-4 py-6"
    >
      <h2 className="mb-2 text-2xl text-center">{SECTION_TITLE}</h2>
      <p className="mb-6 text-center text-muted-foreground">
        {SECTION_SUBTITLE}
      </p>

      <div
        role="list"
        aria-label="Discounted products"
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0"
      >
        {result.products.map((product) => (
          <div
            key={product.productId}
            role="listitem"
            className="w-[260px] shrink-0 snap-start"
          >
            <CatalogCard
              product={product}
              actions={<AddToCart variant="catalog" />}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
