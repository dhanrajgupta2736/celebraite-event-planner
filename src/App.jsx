import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  DollarSign,
  Clock,
  ShieldCheck,
  Sparkles,
  Bot,
  Users,
  CloudRain,
} from 'lucide-react';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import BudgetPlanner from './components/BudgetPlanner';
import TimelineGenerator from './components/TimelineGenerator';
import VendorHub from './components/VendorHub';
import CreativeStudio from './components/CreativeStudio';
import GuestManager from './components/GuestManager';
import WeatherContingency from './components/WeatherContingency';
import CopilotChat from './components/CopilotChat';
import EventWizard from './components/EventWizard';
import SettingsModal from './components/SettingsModal';
import ExportModal from './components/ExportModal';
import CommandPalette from './components/CommandPalette';
import {
  getStoredEvents,
  getActiveEvent,
  setActiveEventId,
  updateEvent,
} from './services/storageService';

export default function App() {
  const [events, setEvents] = useState(getStoredEvents());
  const [activeEvent, setActiveEvent] = useState(getActiveEvent());
  const [activeTab, setActiveTab] = useState('overview'); // overview, budget, timeline, guests, weather, vendors, creative
  const [theme, setTheme] = useState(localStorage.getItem('celebraite_theme') || 'dark');
  const [currency, setCurrency] = useState(localStorage.getItem('celebraite_currency') || 'USD');

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('celebraite_theme', theme);
  }, [theme]);

  // Sync currency
  useEffect(() => {
    localStorage.setItem('celebraite_currency', currency);
  }, [currency]);

  // Handle Event selection
  const handleSelectEvent = (id) => {
    setActiveEventId(id);
    const found = events.find((e) => e.id === id);
    if (found) setActiveEvent(found);
  };

  // Handle Event update
  const handleUpdateEvent = (updated) => {
    const saved = updateEvent(updated);
    setActiveEvent(saved);
    setEvents(getStoredEvents());
  };

  // Handle new event creation
  const handleEventCreated = (newEvent) => {
    setEvents(getStoredEvents());
    setActiveEvent(newEvent);
    setActiveTab('overview');
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      {/* Sticky App Header */}
      <Header
        events={events}
        activeEvent={activeEvent}
        onSelectEvent={handleSelectEvent}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currency={currency}
        onSelectCurrency={setCurrency}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Workspace */}
      <main className="main-content" id="main-content" role="main">
        {/* Navigation Tabs Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <nav className="tab-navigation" aria-label="Celebration Modules">
            <button
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <LayoutDashboard size={16} />
              <span>Overview</span>
            </button>

            <button
              id="tab-budget"
              onClick={() => setActiveTab('budget')}
              className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            >
              <DollarSign size={16} />
              <span>Budget Planner</span>
            </button>

            <button
              id="tab-timeline"
              onClick={() => setActiveTab('timeline')}
              className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            >
              <Clock size={16} />
              <span>Timeline & Run-Sheet</span>
            </button>

            <button
              id="tab-guests"
              onClick={() => setActiveTab('guests')}
              className={`tab-btn ${activeTab === 'guests' ? 'active' : ''}`}
            >
              <Users size={16} />
              <span>Guest Roster & RSVPs</span>
            </button>

            <button
              id="tab-weather"
              onClick={() => setActiveTab('weather')}
              className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
            >
              <CloudRain size={16} />
              <span>Weather Plan B</span>
            </button>

            <button
              id="tab-vendors"
              onClick={() => setActiveTab('vendors')}
              className={`tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
            >
              <ShieldCheck size={16} />
              <span>Vendor Hub & RFPs</span>
            </button>

            <button
              id="tab-creative"
              onClick={() => setActiveTab('creative')}
              className={`tab-btn ${activeTab === 'creative' ? 'active' : ''}`}
            >
              <Sparkles size={16} />
              <span>Creative Studio</span>
            </button>
          </nav>

          {/* Copilot Launcher CTA */}
          {!isCopilotOpen && (
            <button
              id="btn-trigger-copilot-nav"
              onClick={() => setIsCopilotOpen(true)}
              className="btn btn-accent btn-sm"
              title="Open AI Event Copilot"
            >
              <Bot size={15} />
              <span>AI Copilot (24/7)</span>
            </button>
          )}
        </div>

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <DashboardOverview
            event={activeEvent}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlanner
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            currency={currency}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineGenerator
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'guests' && (
          <GuestManager
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherContingency
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorHub
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'creative' && (
          <CreativeStudio
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}
      </main>

      {/* Floating Copilot Trigger Button (When closed) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="btn btn-primary pulse-glow"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            borderRadius: 'var(--radius-full)',
            padding: '0.85rem 1.4rem',
            zIndex: 90,
            boxShadow: 'var(--shadow-lg), var(--shadow-gold)',
          }}
          title="Open AI Event Planner Copilot"
          id="fab-copilot"
        >
          <Sparkles size={18} />
          <span>Ask AI Copilot</span>
        </button>
      )}

      {/* Interactive Copilot Chat Drawer */}
      <CopilotChat
        event={activeEvent}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Modals */}
      <EventWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onEventCreated={handleEventCreated}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetEvents={(reset) => {
          setEvents(reset);
          setActiveEvent(reset[0]);
        }}
      />

      <ExportModal
        event={activeEvent}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onImportEvent={(imported) => {
          handleEventCreated(imported);
        }}
      />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={handleToggleTheme}
        theme={theme}
      />

      {/* Accessible Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          background: 'rgba(10, 13, 20, 0.4)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>CelebrAIte PRO</strong> — PromptWars Virtual Challenge 5 (Celebration & Event Planner Track)
          </div>
          <div>
            Built with React 19, Google Gemini 3.8 Flash, Multi-Currency & WCAG 2.1 AA Accessibility
          </div>
        </div>
      </footer>
    </div>
  );
}
