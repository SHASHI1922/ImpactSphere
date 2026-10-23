import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

import { HomePage } from './pages/HomePage';
import { CausesPage } from './pages/CausesPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ImpactPage } from './pages/ImpactPage';
import { AssistantPage } from './pages/AssistantPage';
import { NgoPage } from './pages/NgoPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export const App: React.FC = () => {
  const { activePath } = useApp();

  const renderCurrentPage = () => {
    switch (activePath) {
      case '/':
        return <HomePage />;
      case '/causes':
        return <CausesPage />;
      case '/opportunities':
        return <OpportunitiesPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/impact':
        return <ImpactPage />;
      case '/assistant':
        return <AssistantPage />;
      case '/ngo':
        return <NgoPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-warmIvory text-stone-900 font-sans selection:bg-limeAccent selection:text-forest-900">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
