
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import Button from './PixelButton';
import { cn } from '../lib/utils';

interface PricingCardProps {
  planName: string;
  price: string;
  pricePeriod?: string;
  description: string;
  features: string[];
  ctaText: string;
  onCtaClick?: () => void;
  isFeatured?: boolean;
  disabled?: boolean;
}

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const PricingCard: React.FC<PricingCardProps> = ({
  planName,
  price,
  pricePeriod,
  description,
  features,
  ctaText,
  onCtaClick,
  isFeatured = false,
  disabled = false,
}) => {
  return (
    <Card className={cn("flex flex-col h-full", isFeatured && "border-primary/50 border-4 bg-primary/5")}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-mono font-bold text-primary">{planName}</CardTitle>
        <p className="text-4xl font-mono font-bold mt-2">
            {price} 
            {pricePeriod && <span className="text-base font-normal text-muted-foreground">{pricePeriod}</span>}
        </p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckIcon className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
            onClick={onCtaClick} 
            size="lg" 
            className="w-full mt-auto"
            variant={isFeatured ? 'default' : 'outline'}
            disabled={disabled}
        >
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
