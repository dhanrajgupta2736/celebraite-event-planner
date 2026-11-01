import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PartyPopper,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Executive Dashboard Overview Component
 * Renders high-level KPIs, countdown telemetry, financial summaries,
 * operational checklists, and dynamic milestone progress bars.
 * @param {{ event: object, onNavigateTab: (tab: string) => void, onOpenCopilot: () => void }} props
 * @returns {React.ReactElement | null}
 */
export default function DashboardOverview({ event, onNavigateTab, onOpenCopilot }) {
  if (!event) return null;

  // Calculate days remaining
  const eventDate = event.date ? new Date(event.date) : new Date();
  const now = new Date();
  const diffTime = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate budget stats
  const totalBudget = Number(event.budget) || 10000;
  const totalSpent = (event.budgetItems || []).reduce(
    (acc, item) => acc + (Number(item.actualSpent) || 0),
    0
  );
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const spentPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  // Calculate milestones
  const totalMilestones = (event.macroTimeline || []).length;
  const completedMilestones = (event.macroTimeline || []).filter((m) => m.completed).length;
  const milestonePercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Calculate vendor stats
  const totalVendors = (event.vendors || []).length;
  const confirmedVendors = (event.vendors || []).filter(
    (v) => v.status === 'Contract Signed' || v.status === 'Deposit Paid'
  ).length;

  // Trigger celebratory confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#8B5CF6', '#EC4899', '#10B981'],
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Event Banner */}
      <div
        className="glass-card"
        style={{
          background:
            'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(139, 92, 246, 0.12) 50%, rgba(15, 20, 34, 0.8) 100%)',
          border: '1px solid var(--border-accent)',
          position: 'relative',
          overflow: 'hidden',
          padding: '2rem',
        }}
      >
        {/* Background glow orb */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--gold-glow) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
              <span className="badge badge-gold">
                {event.eventType === 'wedding'
                  ? '💍 Wedding Planning'
                  : event.eventType === 'birthday'
                  ? '🎂 Birthday Milestone'
                  : '🤝 Community Gathering'}
              </span>
              <span className="badge badge-purple">{event.theme?.title || 'Bespoke Theme'}</span>
            </div>

            <h1
              className="serif-title"
              style={{
                fontSize: '2.4rem',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {event.title}
            </h1>

            <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', fontSize: '1.05rem', marginBottom: '1.25rem' }}>
              {event.theme?.tagline || event.notes || 'Autonomous celebration intelligence orchestrating budget, timeline, and vendors.'}
            </p>

            {/* Quick Metadata Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={17} style={{ color: 'var(--gold-primary)' }} />
                <span>{event.date || 'TBD Date'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={17} style={{ color: 'var(--purple-primary)' }} />
                <span>{event.location || 'Selected Venue'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={17} style={{ color: 'var(--rose-primary)' }} />
                <span>{event.guestCount || 100} Guests</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock & Confetti Trigger */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(10, 13, 20, 0.65)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 2rem',
              textAlign: 'center',
              minWidth: '180px',
            }}
          >
            <Clock size={24} style={{ color: 'var(--gold-primary)', marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {diffDays > 0 ? diffDays : 0}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Days Remaining
            </span>

            <button
              onClick={triggerConfetti}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '0.85rem', width: '100%', fontSize: '0.78rem' }}
              title="Celebrate progress"
            >
              <PartyPopper size={14} style={{ color: 'var(--gold-primary)' }} />
              <span>Celebrate</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid-4">
        {/* KPI 1: Budget Health */}
        <div className="glass-card glass-card-interactive" onClick={() => onNavigateTab('budget')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Budget Health
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              <DollarSign size={18} />
            </div>
          </div>

          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            ${totalSpent.toLocaleString()}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {' '}/ ${totalBudget.toLocaleString()}
            </span>
          </div>

          <div className="progress-container" style={{ margin: '0.75rem 0 0.5rem' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${spentPercent}%`,
                background: spentPercent > 90 ? 'var(--danger)' : 'linear-gradient(90deg, var(--gold-primary), var(--purple-primary))',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>{spentPercent}% Committed</span>
            <span style={{ color: 'var(--success)' }}>${remainingBudget.toLocaleString()} Unallocated</span>
          </div>
        </div>

        {/* KPI 2: Timeline Progress */}
        <div className="glass-card glass-card-interactive" onClick={() => onNavigateTab('timeline')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Milestones
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-primary)' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            {completedMilestones}{' '}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              of {totalMilestones} Phases Done
            </span>
          </div>

          <div className="progress-container" style={{ margin: '0.75rem 0 0.5rem' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${milestonePercent}%`,
                background: 'linear-gradient(90deg, var(--purple-primary), var(--rose-primary))',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>{milestonePercent}% Completed</span>
            <span style={{ color: 'var(--purple-light)' }}>View Schedule</span>
          </div>
        </div>

        {/* KPI 3: Vendors Roster */}
        <div className="glass-card glass-card-interactive" onClick={() => onNavigateTab('vendors')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Vendor Roster
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <ShieldCheck size={18} />
            </div>
          </div>

          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            {confirmedVendors}{' '}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              of {totalVendors} Contracted
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.85rem' }}>
            Venue, Catering, Photography, and Music aligned with RFP templates.
          </div>
        </div>

        {/* KPI 4: Per-Guest Economics */}
        <div className="glass-card glass-card-interactive" onClick={() => onNavigateTab('creative')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Guest Experience
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose-primary)' }}>
              <Sparkles size={18} />
            </div>
          </div>

          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
            ${Math.round(totalBudget / Math.max(1, event.guestCount || 100))}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {' '}/ Attendee
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.85rem' }}>
            Custom 4-course menu, personalized games & signature cocktail curated.
          </div>
        </div>
      </div>

      {/* AI Copilot Prompt Bar / Quick Action Card */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(22, 29, 49, 0.9) 0%, rgba(30, 41, 69, 0.95) 100%)',
          border: '1px solid var(--border-highlight)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: '1.25rem 1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--purple-primary), var(--gold-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '0.15rem' }}>
              CelebrAIte 24/7 Intelligent Planning Copilot
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
              Ask Eleanor, Kai, Maya, or Marcus to analyze costs, draft speeches, or adjust hour-by-hour schedules.
            </p>
          </div>
        </div>

        <button onClick={onOpenCopilot} className="btn btn-primary" id="btn-open-copilot-dash">
          <Sparkles size={16} />
          <span>Launch AI Copilot</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Quick Access Horizontal Hub */}
      <div className="grid-3">
        {/* Module 1: Budget Optimizer */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Dynamic Budget Planner</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            AI-driven categorical allocation with real-time variance calculations and automated cost-saving recommendations.
          </p>
          <button
            onClick={() => onNavigateTab('budget')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            Manage Budget & Expenses &rarr;
          </button>
        </div>

        {/* Module 2: Timeline Engine */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Clock size={18} style={{ color: 'var(--purple-primary)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Precision Run-Sheet</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Hour-by-hour operational run-sheet with buffer intervals, owner tags, and macro countdown milestones.
          </p>
          <button
            onClick={() => onNavigateTab('timeline')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            Inspect Timeline & Schedule &rarr;
          </button>
        </div>

        {/* Module 3: Creative Suite */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles size={18} style={{ color: 'var(--rose-primary)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Creative & Menu Studio</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Generate HEX color swatches, culinary menus with dietary accommodations, speech drafts, and party games.
          </p>
          <button
            onClick={() => onNavigateTab('creative')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            Explore Creative Concepts &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
