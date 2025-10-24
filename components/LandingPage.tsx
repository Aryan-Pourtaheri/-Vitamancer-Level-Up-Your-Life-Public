
import React, { useState } from 'react';
import Button from './PixelButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { CHARACTER_CLASSES } from '../constants';
import { ThemeToggleButton } from './ThemeToggleButton';
import PlayerAvatar from './PlayerAvatar';


interface LandingPageProps {
  onGetStarted: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    },
  },
};

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`w-16 h-16 mb-6 inline-flex items-center justify-center rounded-lg bg-primary/10 text-primary p-2 ${className}`}>
        {children}
    </div>
);

const SwordsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="pixelated w-12 h-12">
        <path d="M6 3h3v1h1v1h1v1h1v1h1v1h1v1h1v1h1v3h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1V9h-1V8h-1V7h-1V6h-1V3z"/>
        <path d="M15 3h3v1h-1v1h-1v1h-1v1h-1v1h-1v1h1v1h1v1h1v1h1v3h-3v-1h1v-1h1v-1h1v-1h1v-1h1V9h-1V8h-1V7h-1V6h-1V3z"/>
        <path d="M9 12v9h1v-1h1v-1h1v-1h1v-1h-1v1h-1v1h-1v1H9v-5h1v1h1v1h1v1h1v1h1v1h1v-1h-1v-1h-1v-1h-1v-1h-1V12H9z"/>
    </svg>
);

const BrainCircuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="pixelated w-12 h-12">
        <path d="M8 4h8v1h1v1h1v2h-1v1h-1v1h-2v-1H9v1H7v-1H6V7H5V6h1V5h2V4z m1 2h6v1h1v1h-1v1H8V8h1V7H8V6z M7 11h1v1h1v1h-1v1h2v1h1v1h2v-1h1v-1h2v-1h-1v-1h1v-1h1v2h-1v1h-1v1h1v1h-1v1h-2v1h-1v1H9v-1H8v-1H6v-1h1v-1h-1v-1h1v-1h-1v-1h1v-2z"/>
    </svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} className="pixelated w-12 h-12">
        <path d="M5 3h14v1h1v1h1v7h-1v1h-1v1h-1v1h-1v2h-2v1h-1v1h-2v-1h-1v-1h-2v-1h-1V5h1V4h1V3z m1 2v7h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1V5H6z m4 6h1v1h2v-1h1v1h1v1h-1v1h-1v-1h-2v1h-1v-1h-1v-1h1v-1z"/>
    </svg>
);


const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border py-6">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-foreground hover:text-primary transition-colors">
                <h4 className="font-semibold text-lg">{q}</h4>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-2xl">+</motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <p className="text-muted-foreground pr-8">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggleButton />
      </div>
      <motion.div 
        className="container mx-auto max-w-6xl px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HERO SECTION */}
        <header className="text-center py-28 sm:py-40">
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl font-display tracking-widest leading-loose">
            VITAMANCER
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-xl sm:text-2xl mt-4 text-muted-foreground font-mono">
            Level Up Your Life, One Habit at a Time.
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-8 max-w-2xl mx-auto text-lg text-foreground/80">
            Stop grinding, start playing. Vitamancer is a life RPG that turns your daily goals into epic quests. Build habits, earn XP, and become the hero of your own story.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-12">
            <Button onClick={onGetStarted} size="lg" className="transform hover:scale-105 transition-transform">
              Start Your Adventure
            </Button>
          </motion.div>
        </header>

        {/* FEATURES OVERVIEW */}
        <motion.section variants={itemVariants} className="py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl font-mono font-bold">Your Life, Gamified.</h3>
            <p className="text-muted-foreground mt-4 text-lg">Vitamancer transforms self-improvement into a captivating RPG experience. Here’s how you’ll conquer your goals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="bg-secondary/30">
              <CardHeader>
                  <IconWrapper><SwordsIcon/></IconWrapper>
                  <CardTitle className="text-2xl font-mono">Forge Your Hero</CardTitle>
              </CardHeader>
              <CardContent><p className="text-muted-foreground">Design a unique pixel-art avatar that grows stronger as you do.</p></CardContent>
            </Card>
            <Card className="bg-secondary/30">
              <CardHeader>
                  <IconWrapper><ShieldCheckIcon/></IconWrapper>
                  <CardTitle className="text-2xl font-mono">Conquer Quests</CardTitle>
              </CardHeader>
              <CardContent><p className="text-muted-foreground">Turn habits into daily quests. Earn XP for every task you complete.</p></CardContent>
            </Card>
            <Card className="bg-secondary/30">
               <CardHeader>
                   <IconWrapper><BrainCircuitIcon/></IconWrapper>
                   <CardTitle className="text-2xl font-mono">Unlock Potential</CardTitle>
              </CardHeader>
              <CardContent><p className="text-muted-foreground">Level up, boost your stats, and become the master of your own life.</p></CardContent>
            </Card>
          </div>
        </motion.section>
        
        {/* CHARACTER CUSTOMIZATION */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants} className="py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div variants={itemVariants} className="md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl font-mono font-bold tracking-tight mb-4">Forge Your Digital Self</h2>
                <p className="text-lg text-muted-foreground">Your journey begins with a hero. Create a unique pixel-art avatar that truly represents you. Choose a class, customize your look, and watch your character evolve from a Level 1 novice to a legendary champion as you conquer your real-life goals.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="md:w-1/2">
                <div className="grid grid-cols-3 gap-4">
                    {CHARACTER_CLASSES.slice(0, 6).map((charClass, i) => (
                        <div key={i} className="p-2 bg-secondary rounded-lg border-2 border-border aspect-square flex flex-col items-center justify-center">
                             <div className="w-20 h-20 bg-background/50 rounded-md flex items-center justify-center overflow-hidden">
                                <PlayerAvatar options={charClass.avatar} characterClass={charClass.name} />
                            </div>
                            <p className="text-sm font-mono mt-2">{charClass.name}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* GAMIFIED HABITS */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants} className="py-24">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <motion.div variants={itemVariants} className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl font-mono font-bold tracking-tight mb-4">Turn Chores into Epic Quests</h2>
                    <p className="text-lg text-muted-foreground">"Go to the gym" is boring. "Train at the Iron Temple to boost your STR" is an adventure. Vitamancer reframes your to-do list into a quest log. Earn Experience Points (XP), collect gold, and discover powerful items for every habit you build and every task you complete.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="md:w-1/2">
                    <Card className="bg-card/80 backdrop-blur-sm p-4">
                        <CardHeader className="p-2"><CardTitle className="text-xl font-mono">Daily Quests</CardTitle></CardHeader>
                        <CardContent className="p-2 space-y-3">
                            <div className="flex items-center p-3 bg-secondary rounded-lg border-l-4 border-l-green-500">
                                <input type="checkbox" className="w-5 h-5 mr-4 accent-green-500" readOnly />
                                <span>Meditate for 10 minutes</span>
                                <span className="ml-auto font-bold text-green-400 text-sm font-mono">+10 XP</span>
                            </div>
                            <div className="flex items-center p-3 bg-secondary rounded-lg border-l-4 border-l-yellow-500">
                                <input type="checkbox" className="w-5 h-5 mr-4 accent-green-500" readOnly />
                                <span>Read one chapter of a book</span>
                                <span className="ml-auto font-bold text-yellow-400 text-sm font-mono">+25 XP</span>
                            </div>
                            <div className="flex items-center p-3 bg-secondary rounded-lg border-l-4 border-l-red-500 opacity-50">
                                <input type="checkbox" checked className="w-5 h-5 mr-4 accent-green-500" readOnly />
                                <span className="line-through text-muted-foreground">Complete a difficult work project</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.section>

        {/* AI QUEST GENERATION */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants} className="py-24 text-center">
            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-mono font-bold tracking-tight mb-4">Your Personal Quest Master</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Feeling lost on your journey? The Vitamancer AI, powered by the Gemini API, is your personal guide. Tell it your grand ambition—like "get fit" or "learn to code"—and it will forge a custom set of actionable quests, tailored to your goal and broken down by difficulty.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-12 max-w-2xl mx-auto">
                 <Card className="bg-card/80 backdrop-blur-sm p-6 text-left">
                    <p className="text-sm text-muted-foreground mb-4">Tell the Vitamancer AI your goal...</p>
                    <div className="flex gap-2">
                        <input type="text" value="Learn a new skill" readOnly className="flex-grow h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                        <Button>Generate</Button>
                    </div>
                </Card>
            </motion.div>
        </motion.section>
        
        {/* TESTIMONIALS */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants} className="py-24">
            <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-16">
                <h3 className="text-3xl font-mono font-bold">Hear From Fellow Adventurers</h3>
                <p className="text-muted-foreground mt-4 text-lg">Thousands have started their epic journey of self-improvement. See what they have to say.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
                <motion.div variants={itemVariants}>
                    <Card className="h-full bg-secondary/30 flex flex-col">
                      <CardContent className="p-6 flex-grow">
                          <blockquote className="italic text-foreground/90">"I've tried every productivity app out there, but nothing stuck. Thinking of my tasks as 'quests' was a game-changer for my motivation. I'm finally consistent!"</blockquote>
                      </CardContent>
                      <CardHeader className="pt-0">
                          <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-background/50 rounded-md flex items-center justify-center overflow-hidden"><PlayerAvatar characterClass="Mage" options={{skinColor: "#e8b3a5", hairColor: "#b0632b", hairStyle: "long", outfitColor: "#4682B4", accentColor: "#FFF8DC", eyeStyle: "happy", hat: false, weapon: 'none', cloak: true}} /></div>
                              <div>
                                  <p className="font-semibold font-mono">Alex M.</p>
                                  <p className="text-sm text-muted-foreground">Level 12 Mage</p>
                              </div>
                          </div>
                      </CardHeader>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="h-full bg-secondary/30 flex flex-col">
                      <CardContent className="p-6 flex-grow">
                          <blockquote className="italic text-foreground/90">"As a student, it's easy to feel overwhelmed. Vitamancer helps me break down huge study goals into manageable daily quests. The AI suggestions are surprisingly helpful."</blockquote>
                      </CardContent>
                      <CardHeader className="pt-0">
                          <div className="flex items-center gap-3">
                               <div className="w-16 h-16 bg-background/50 rounded-md flex items-center justify-center overflow-hidden"><PlayerAvatar characterClass="Rogue" options={{skinColor: "#c09f8e", hairColor: "#2c222b", hairStyle: "short", outfitColor: "#2E8B57", accentColor: "#F0E68C", eyeStyle: "normal", hat: true, weapon: 'bow', cloak: false}} /></div>
                              <div>
                                  <p className="font-semibold font-mono">Sara K.</p>
                                  <p className="text-sm text-muted-foreground">Level 9 Rogue</p>
                              </div>
                          </div>
                      </CardHeader>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="h-full bg-secondary/30 flex flex-col">
                      <CardContent className="p-6 flex-grow">
                          <blockquote className="italic text-foreground/90">"It's just... fun! Seeing my character level up alongside my real-life progress is incredibly rewarding. I hit a new deadlift PR and my STR stat increased. How cool is that?"</blockquote>
                      </CardContent>
                       <CardHeader className="pt-0">
                          <div className="flex items-center gap-3">
                               <div className="w-16 h-16 bg-background/50 rounded-md flex items-center justify-center overflow-hidden"><PlayerAvatar characterClass="Warrior" options={{skinColor: "#d5a38a", hairColor: "#8c6f60", hairStyle: "spiky", outfitColor: "#A52A2A", accentColor: "#D2B48C", eyeStyle: "angry", hat: false, weapon: 'sword', cloak: false}} /></div>
                              <div>
                                  <p className="font-semibold font-mono">Dave R.</p>
                                  <p className="text-sm text-muted-foreground">Level 15 Warrior</p>
                              </div>
                          </div>
                      </CardHeader>
                    </Card>
                </motion.div>
            </div>
        </motion.section>

        {/* FAQ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants} className="py-24">
            <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-12">
                <h3 className="text-3xl font-mono font-bold">Your Questions, Answered</h3>
            </motion.div>
            <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
                <FaqItem q="Is Vitamancer free to use?" a="Yes! The core features of Vitamancer—creating your character, tracking habits as quests, and leveling up—are completely free. We may introduce optional cosmetic items or advanced features in the future." />
                <FaqItem q="How does the AI quest generation work?" a="We use Google's powerful Gemini API. When you provide a goal, the AI analyzes it and breaks it down into smaller, actionable steps, which we then present to you as 'quests' categorized by difficulty." />
                <FaqItem q="Is my data safe?" a="Absolutely. We take your privacy seriously. All your data is securely stored and we will never share your personal information with third parties. For more details, please see our privacy policy." />
                <FaqItem q="Can I use this on my phone?" a="Vitamancer is a fully responsive web application, which means it works beautifully on desktops, tablets, and mobile phones through your web browser. A dedicated mobile app is on our roadmap!" />
            </motion.div>
        </motion.section>

        {/* FINAL CTA */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={itemVariants} className="text-center py-28">
          <h2 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight">Ready to Begin Your Epic Journey?</h2>
          <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground">
            Your adventure awaits. Sign up for free, create your hero, and start turning your ambitions into achievements.
          </p>
          <div className="mt-10">
            <Button onClick={onGetStarted} size="lg" className="transform hover:scale-105 transition-transform">
              Start Leveling Up
            </Button>
          </div>
        </motion.section>

        <motion.footer variants={itemVariants} className="text-center py-8 border-t border-border mt-12">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Vitamancer. Forge your destiny.</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default LandingPage;