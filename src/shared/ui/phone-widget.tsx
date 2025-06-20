import { Phone } from 'lucide-react';

export const PhoneWidget = (): React.JSX.Element => {
  return (
    <div className="h-10 flex justify-end items-center text-xl gap-2">
      <Phone className="h-8" />
      <a href="tel:971588284186" className="text-primary-foreground">
        (+971) 58 8284186
      </a>
    </div>
  );
};
