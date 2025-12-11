import { cva } from 'class-variance-authority';
import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  variant?: 'catalog' | 'product';
}

const cartButtonVariants = cva(
  'flex items-center justify-center rounded-sm transition-all active:scale-95',
  {
    variants: {
      variant: {
        catalog:
          'absolute bottom-0 right-2 w-11 h-11 text-secondary-foreground bg-primary hover:bg-primary-light',
        product: 'w-9 h-9',
      },
    },
    defaultVariants: { variant: 'catalog' },
  }
);

export const CartButton = ({ variant }: CartButtonProps) => {
  return (
    <button
      type="button"
      className={cartButtonVariants({ variant })}
      aria-label="Add to cart"
    >
      <ShoppingCart className="w-8 h-8" />
    </button>
  );
};
