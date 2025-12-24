import { CartButton } from '@shared/ui/cart-button';

interface AddToCartProps {
  variant?: 'catalog' | 'product';
}

export const AddToCart = ({ variant }: AddToCartProps): React.JSX.Element => {
  return <CartButton variant={variant} />;
};
