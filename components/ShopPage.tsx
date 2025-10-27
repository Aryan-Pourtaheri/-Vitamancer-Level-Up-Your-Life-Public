
import React from 'react';
import { PlayerProfile, Item } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { SHOP_ITEMS } from '../constants';
import ShopItemCard from './shop/ShopItemCard';

interface ShopPageProps {
  playerProfile: PlayerProfile;
  onBuyItem: (item: Item) => void;
}

const GoldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="w-5 h-5 text-yellow-400 pixelated">
        <path d="M9 4h6v1h1v1h1v10h-1v1h-1v1H9v-1H8v-1H7V6h1V5h1V4z m1 2v10h4V6h-4z m1 2h2v1h-2V8z m0 3h2v1h-2v-1z" />
    </svg>
);

const ShopPage: React.FC<ShopPageProps> = ({ playerProfile, onBuyItem }) => {

  const availableItems = SHOP_ITEMS.filter(item => item.allowedClasses.includes(playerProfile.characterClass));

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-mono">Adventurer's Emporium</CardTitle>
              <p className="text-muted-foreground">Spend your hard-earned gold on powerful new gear.</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary border-2 border-border flex items-center gap-2">
                <GoldIcon />
                <p className="text-2xl font-mono font-bold text-yellow-300">{playerProfile.gold}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableItems.length > 0 ? (
              availableItems.map(item => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  playerProfile={playerProfile}
                  onBuy={onBuyItem}
                />
              ))
            ) : (
              <div className="text-center py-12 md:col-span-2">
                <p className="text-muted-foreground">The shop has no items for your class at the moment. Check back later!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ShopPage;