import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { HomeHub } from './components/home/HomeHub';
import { HobbyView } from './components/hobby/HobbyView';
import { QuestSection } from './components/quest/QuestSection';
import { ProfileCard } from './components/profile/ProfileCard';
import { PetitionSection } from './components/petition/PetitionSection';
import { VoteArena } from './components/vote/VoteArena';
import { InteractiveCursor } from './components/effects/InteractiveCursor';

const MainContent: React.FC = () => {
  const { tab } = useApp();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 animate-in fade-in zoom-in-95 duration-300">
      {tab === 'home' && <HomeHub />}
      {tab === 'hobby' && <HobbyView />}
      {tab === 'quest' && <QuestSection />}
      {tab === 'profile' && <ProfileCard />}
      {tab === 'petition' && <PetitionSection />}
      {tab === 'vote' && <VoteArena />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0b0e1b] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
        {/* Interactive Mouse Particle Trail & Glow Impact */}
        <InteractiveCursor />

        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Main Body Content */}
        <MainContent />

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-[#090c17] py-6 px-4 lg:px-8 text-center text-xs text-slate-500 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">School Log X</span>
              <span>·</span>
              <span>Gamified School Community Platform</span>
            </div>
            <div className="text-[11px] text-slate-500">
              학생 자치 & 소모임 인터랙티브 허브 · School Log X 2026
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
