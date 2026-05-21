import { Link } from '@tanstack/react-router';

import Raccoon from '@shared/assets/Raccoon.svg';
import { ROUTES } from '@shared/config/routes';
import { Button } from '@shared/ui/button';

type UspCard = {
  id: string;
  title: string;
  description: string;
  cta: { label: string; href: string; isExternal: boolean; ariaLabel: string };
  bg: string;
};

const USP_CARDS: UspCard[] = [
  {
    id: 'delivery',
    title: 'Free and Fast delivery',
    description:
      'Receipt of goods within 1-2 weeks. We will pack your package securely and ship it carefully. Want more information?',
    cta: {
      label: 'More',
      href: '/',
      isExternal: false,
      ariaLabel: 'More about free and fast delivery',
    },
    bg: 'bg-blue-600',
  },
  {
    id: 'range',
    title: 'Wide range',
    description:
      'A large selection of quality goods. Funny gifts for you and your loved ones. Go to catalog to see more.',
    cta: {
      label: 'More',
      href: '/',
      isExternal: false,
      ariaLabel: 'More about our wide range',
    },
    bg: 'bg-green-700',
  },
  {
    id: 'order',
    title: 'Quick order placement',
    description:
      'Our team will be happy to process your order quickly. If you have any questions - write or call us!',
    cta: {
      label: 'Contact us',
      href: 'tel:971588284186',
      isExternal: true,
      ariaLabel: 'Contact us for quick order placement',
    },
    bg: 'bg-purple-600',
  },
];

const SECTION_TITLE = 'Shopping easy with YES CODE!';

export const USPSection = (): React.JSX.Element => {
  return (
    <section
      aria-labelledby="usp-section-heading"
      className="mx-auto max-w-[1020px] px-4 py-10"
    >
      <h2
        id="usp-section-heading"
        className="text-2xl font-bold text-center text-foreground"
      >
        {SECTION_TITLE}
      </h2>
      <div className="w-10 h-1 bg-pink-500 mx-auto mt-2 mb-8" />

      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-label="Benefits"
      >
        {USP_CARDS.map((card) => (
          <li
            key={card.id}
            className={`relative overflow-hidden rounded-xl min-h-[280px] p-6 flex flex-col ${card.bg}`}
          >
            <img
              src={Raccoon}
              alt=""
              className="absolute top-0 right-0 w-40 h-40 object-contain"
              loading="lazy"
            />
            <div className="mt-auto flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
              <p className="text-sm text-white/90">{card.description}</p>
              <div className="mt-2">
                {card.cta.isExternal ? (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-white"
                    aria-label={card.cta.ariaLabel}
                  >
                    <a href={card.cta.href}>{card.cta.label}</a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-white"
                    aria-label={card.cta.ariaLabel}
                  >
                    <Link to={ROUTES.HOME}>{card.cta.label}</Link>
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
