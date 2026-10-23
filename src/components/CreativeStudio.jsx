import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Utensils,
  PartyPopper,
  Mic,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { generateCreativeSuite } from '../services/fallbackEngine';

export default function CreativeStudio({ event, onUpdateEvent }) {
  const creative = event.theme
    ? {
        theme: event.theme,
        menu: event.menu || [],
        activities: event.activities || [],
      }
    : generateCreativeSuite(event.eventType, event.vibes);

  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedSpeech, setCopiedSpeech] = useState(false);
  const [speechRole, setSpeechRole] = useState(
    event.eventType === 'wedding'
      ? 'Maid of Honor'
      : event.eventType === 'birthday'
      ? 'Best Friend'
      : 'Community Leader'
  );
  const [speechTone, setSpeechTone] = useState('Heartfelt & Witty');
  const [speechDraft, setSpeechDraft] = useState(
    event.eventType === 'wedding'
      ? `Good evening everyone! For those of you who don't know me, I am the Maid of Honor. Seeing ${event.title} come to life today has been nothing short of breathtaking. May your love grow deeper with every sunrise. Please raise your glasses to a lifetime of joy and devotion!`
      : event.eventType === 'birthday'
      ? `Hey everyone! Thank you all for gathering here tonight to celebrate ${event.title}! Looking around this room, it's clear just how deeply loved you are. May this next year bring even more wild adventures, laughter, and high scores. Cheers!`
      : `Welcome neighbors, partners, and friends! When we first set out to organize ${event.title}, our dream was to create a space where everyone in our community felt seen and celebrated. Thank you to every volunteer and sponsor who made this milestone possible!`
  );

  // Copy color hex
  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  // Copy speech text
  const handleCopySpeech = () => {
    navigator.clipboard.writeText(speechDraft);
    setCopiedSpeech(true);
    setTimeout(() => setCopiedSpeech(false), 2000);
  };

  // Regenerate speech with tone adjustments
  const handleRegenerateSpeech = () => {
    if (speechTone.includes('Witty') || speechTone.includes('Funny')) {
      setSpeechDraft(
        `Hello everyone! It is an absolute privilege to speak on behalf of ${event.title}. They say that with age comes wisdom, although after knowing everyone here for years, I can confirm that mostly with age comes better taste in snacks, worse knees, and an undeniable ability to make any room louder just by walking in. Let us raise our glasses to good friends, unforgettable nights, and tomorrow's aspirin!`
      );
    } else if (speechTone.includes('Inspiring')) {
      setSpeechDraft(
        `Good evening friends and family. Gatherings like ${event.title} remind us that what matters most isn't the scale of the venue or the perfection of the schedule—it's the enduring human bonds we forge together. May this celebration serve as a beacon of community, kindness, and renewed purpose for everyone in attendance tonight. Cheers to our collective future!`
      );
    } else {
      setSpeechDraft(
        `Dear friends and honored guests. Standing before you tonight for ${event.title} is a moment of pure gratitude. Every detail you see around you was designed with deep love and reverence for the memories we are creating right now. May your hearts be full, your steps light, and your memories everlasting. To love, unity, and celebration!`
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={20} style={{ color: 'var(--rose-primary)' }} />
            <h2 style={{ fontSize: '1.45rem' }}>Personalized Creative & Experience Studio</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Curate bespoke color palettes, four-course menus, guest icebreakers, and custom speeches.
          </p>
        </div>

        <span className="badge badge-rose" style={{ padding: '0.4rem 0.85rem' }}>
          {creative.theme?.title || 'Bespoke Concept'}
        </span>
      </div>

      {/* SECTION 1: THEME & COLOR PALETTE */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Palette size={19} style={{ color: 'var(--gold-primary)' }} />
          <h3 style={{ fontSize: '1.2rem' }}>Color Palette & Aesthetic Styling Guide</h3>
        </div>

        {/* Color Swatches Grid */}
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {(creative.theme?.palette || []).map((color, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyHex(color.hex)}
              className="glass-card-interactive"
              style={{
                background: 'rgba(10, 13, 20, 0.65)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              title="Click to copy HEX code"
            >
              <div
                style={{
                  width: '100%',
                  height: '64px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: color.hex,
                  marginBottom: '0.65rem',
                  boxShadow: `0 4px 14px ${color.hex}44`,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              />
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {color.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0' }}>
                {color.role}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--gold-light)' }}>
                {copiedHex === color.hex ? '✓ Copied!' : color.hex}
              </div>
            </div>
          ))}
        </div>

        {/* Decor & Styling Notes */}
        {creative.theme?.decorNotes && (
          <div
            style={{
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: 'var(--gold-light)' }}>Decor & Staging Vision: </strong>
            {creative.theme.decorNotes}
          </div>
        )}
      </div>

      {/* SECTION 2: CULINARY MENU & EXPERIENTIAL ACTIVITIES */}
      <div className="grid-2">
        {/* Curated Menu */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Utensils size={18} style={{ color: 'var(--purple-primary)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Curated Culinary & Bar Menu</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(creative.menu || []).map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 20, 34, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gold-light)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {item.course}
                  </span>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    {item.dish}
                  </div>
                </div>

                <span className="badge badge-purple" style={{ fontSize: '0.7rem', flexShrink: 0 }}>
                  {item.dietary}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Activities & Entertainment */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PartyPopper size={18} style={{ color: 'var(--rose-primary)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Interactive Entertainment & Games</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(creative.activities || []).map((act, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 20, 34, 0.65)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {act.title}
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {act.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: AI SPEECH & TOAST DRAFTER */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mic size={18} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Personalized Toast & Speech Drafter</h3>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
              value={speechRole}
              onChange={(e) => setSpeechRole(e.target.value)}
            >
              <option value="Maid of Honor">Maid of Honor</option>
              <option value="Best Man">Best Man</option>
              <option value="Host / VIP">Host / VIP</option>
              <option value="Keynote Speaker">Keynote Speaker</option>
              <option value="Parents of Couple">Parents of Couple</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
              value={speechTone}
              onChange={(e) => setSpeechTone(e.target.value)}
            >
              <option value="Heartfelt & Witty">Heartfelt & Witty</option>
              <option value="Funny / Roast & Toast">Funny & Playful</option>
              <option value="Inspiring & Civic">Inspiring & Civic</option>
              <option value="Romantic & Tearjerker">Romantic & Poetic</option>
            </select>

            <button onClick={handleRegenerateSpeech} className="btn btn-secondary btn-sm" title="Regenerate speech draft">
              <RefreshCw size={13} />
              <span>Regenerate</span>
            </button>

            <button onClick={handleCopySpeech} className="btn btn-primary btn-sm">
              {copiedSpeech ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedSpeech ? 'Copied!' : 'Copy Speech'}</span>
            </button>
          </div>
        </div>

        <textarea
          className="form-textarea"
          rows={6}
          value={speechDraft}
          onChange={(e) => setSpeechDraft(e.target.value)}
          style={{ lineHeight: 1.7, fontSize: '0.94rem' }}
        />
      </div>
    </div>
  );
}
