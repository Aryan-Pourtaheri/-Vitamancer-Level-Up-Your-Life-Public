
import React from 'react';
import { PlayerProfile } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import Button from './PixelButton';
import PricingCard from './PricingCard';

interface AccountPageProps {
  playerProfile: PlayerProfile;
  onUpgrade: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ playerProfile, onUpgrade }) => {

  const proSince = playerProfile.pro_features_unlocked_at 
    ? new Date(playerProfile.pro_features_unlocked_at).toLocaleDateString() 
    : null;

  return (
    <main className="container mx-auto p-4 max-w-4xl">
        <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-3xl font-mono">Your Account</CardTitle>
                <p className="text-muted-foreground">Manage your subscription and adventurer details.</p>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-xl font-mono font-bold mb-3 text-primary">Current Plan</h3>
                    <div className="p-4 rounded-lg bg-secondary/50 border-2 border-border">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg font-bold capitalize flex items-center gap-2">
                                    Vitamancer {playerProfile.subscription_tier}
                                    {playerProfile.subscription_tier === 'pro' && (
                                        <span className="text-xs font-bold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-sm tracking-wider">PRO</span>
                                    )}
                                </p>
                                {playerProfile.subscription_tier === 'pro' && proSince && (
                                    <p className="text-sm text-muted-foreground">Member since {proSince}</p>
                                )}
                            </div>
                             {playerProfile.subscription_tier === 'pro' && (
                                <Button variant="outline" disabled>Manage Subscription</Button>
                             )}
                        </div>
                    </div>
                </div>

                {playerProfile.subscription_tier === 'free' && (
                    <div>
                        <h3 className="text-xl font-mono font-bold mb-3 text-primary">Upgrade Your Adventure</h3>
                        <p className="text-muted-foreground mb-4">Unlock the full potential of Vitamancer to accelerate your journey.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                             <PricingCard
                                planName="Adventurer"
                                price="Free"
                                description="Your current plan."
                                features={[
                                    'Full Character Customization',
                                    'Manual Habit Tracking',
                                    'XP & Leveling System',
                                ]}
                                ctaText="Current Plan"
                                disabled={true}
                            />
                            <PricingCard
                                planName="Vitamancer Pro"
                                price="$5"
                                pricePeriod="/ month"
                                description="The ultimate tools for self-improvement."
                                features={[
                                    'Everything in Adventurer, plus:',
                                    'AI-Powered Quest Forge',
                                    'Advanced Analytics (Coming Soon)',
                                    'Exclusive Avatar Items (Coming Soon)',
                                ]}
                                ctaText="Upgrade to Pro"
                                onCtaClick={onUpgrade}
                                isFeatured
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </main>
  );
};

export default AccountPage;
