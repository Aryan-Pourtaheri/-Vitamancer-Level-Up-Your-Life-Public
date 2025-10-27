
import React from 'react';
import { PlayerProfile, Item } from '../../types';
import { cn } from '../../lib/utils';
import Button from '../PixelButton';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';

interface ShopItemCardProps {
  item: Item;
  playerProfile: PlayerProfile;
  onBuy: (item: Item) => void;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ item, playerProfile, onBuy }) => {
  const isOwned = playerProfile.inventory.some(i => i.id === item.id);
  const canAfford = playerProfile.gold >= item.cost;
  const canBuy = !isOwned && canAfford;

  const getButtonState = () => {
    if (isOwned) return { text: "Owned", disabled: true, variant: "secondary" as const };
    if (!canAfford) return { text: `Cost: ${item.cost}G`, disabled: true, variant: "destructive" as const };
    return { text: `Buy (${item.cost}G)`, disabled: false, variant: "default" as const };
  }
  
  const buttonState = getButtonState();

  return (
    <Card className="bg-secondary/50">
        <CardHeader>
            <CardTitle className="text-xl font-mono text-primary">{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm h-10">{item.description}</p>

            <div className="flex items-center gap-2 flex-wrap bg-background/50 p-2 rounded-md border border-border">
                {item.statBonus && Object.entries(item.statBonus).map(([stat, val]) => (
                    <div key={stat} className="font-mono text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                        +{val} {stat.toUpperCase()}
                    </div>
                ))}
            </div>

            <Button
                onClick={() => onBuy(item)}
                disabled={buttonState.disabled}
                variant={buttonState.variant}
                className="w-full"
            >
                {buttonState.text}
            </Button>
        </CardContent>
    </Card>
  );
};

export default ShopItemCard;