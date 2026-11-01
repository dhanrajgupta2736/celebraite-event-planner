import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Copy,
  Check,
  PlusCircle,
  Sparkles,
  AlertOctagon,
  Trash2,
} from 'lucide-react';
import { generateVendorRfp } from '../services/geminiService';

export default function VendorHub({ event, onUpdateEvent }) {
  const [vendors, setVendors] = useState(event.vendors || []);
  const [selectedRfpVendor, setSelectedRfpVendor] = useState(null);
  const [rfpText, setRfpText] = useState('');
  const [isGeneratingRfp, setIsGeneratingRfp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    category: 'Catering',
    name: '',
    status: 'In Review',
    contact: '',
    budgetAllocated: 2000,
    actualCost: 0,
    notes: '',
  });

  // Handle RFP generation
  const handleOpenRfpModal = async (vendor) => {
    setSelectedRfpVendor(vendor);
    setIsGeneratingRfp(true);
    setCopied(false);

    try {
      const generated = await generateVendorRfp({
        vendorCategory: vendor.category,
        vendorName: vendor.name,
        eventState: event,
      });
      setRfpText(generated);
    } catch {
      setRfpText(
        `Subject: Inquiry: Availability & Quote for ${event.title}\n\nDear ${vendor.name} Team,\n\nWe are planning our ${event.eventType} on ${event.date || 'our selected date'} with ${event.guestCount || 100} guests. We admire your work in ${vendor.category} and would love to review your packages and pricing.\n\nWarm regards,\nEvent Planning Team`
      );
    } finally {
      setIsGeneratingRfp(false);
    }
  };

  // Copy RFP to clipboard
  const handleCopyRfp = () => {
    navigator.clipboard.writeText(rfpText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update vendor status
  const handleStatusChange = (id, newStatus) => {
    const updated = vendors.map((v) => (v.id === id ? { ...v, status: newStatus } : v));
    setVendors(updated);
    onUpdateEvent({ ...event, vendors: updated });
  };

  // Delete vendor
  const handleDeleteVendor = (id) => {
    const updated = vendors.filter((v) => v.id !== id);
    setVendors(updated);
    onUpdateEvent({ ...event, vendors: updated });
  };

  // Add new vendor
  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!newVendor.name.trim()) return;

    const created = {
      id: `v-${Date.now()}`,
      ...newVendor,
      budgetAllocated: Number(newVendor.budgetAllocated) || 1000,
      actualCost: Number(newVendor.actualCost) || 0,
    };

    const updated = [...vendors, created];
    setVendors(updated);
    onUpdateEvent({ ...event, vendors: updated });
    setShowAddModal(false);
    setNewVendor({
      category: 'Catering',
      name: '',
      status: 'In Review',
      contact: '',
      budgetAllocated: 2000,
      actualCost: 0,
      notes: '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
            <h2 style={{ fontSize: '1.45rem' }}>Smart Vendor Directory & RFP Negotiation Engine</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Curate partner agreements, track contract statuses, and generate bespoke AI outreach RFPs.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" id="btn-add-vendor">
          <PlusCircle size={15} />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Contract Red Flags Guide Callout */}
      <div
        className="glass-card"
        style={{
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AlertOctagon size={18} style={{ color: 'var(--warning)' }} />
          <h3 style={{ fontSize: '1.05rem', color: '#ffd866' }}>Vendor Contract Checklist & Red Flags Guide</h3>
        </div>
        <div className="grid-3" style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', gap: '1rem' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>1. Overtime & Curfew Rates:</strong> Ensure the hourly rate for unexpected load-out delays is explicitly capped.
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>2. Force Majeure & Postponement:</strong> Verify that retainers roll over if the date shifts due to weather or emergencies.
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>3. General Liability Insurance:</strong> Venues usually mandate $1M-$2M COI policies from DJ and Catering vendors.
          </div>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid-2">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span className="badge badge-purple" style={{ fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                    {vendor.category}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>{vendor.name}</h3>
                </div>

                {/* Status Dropdown */}
                <select
                  className="form-select"
                  style={{
                    width: 'auto',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-full)',
                  }}
                  value={vendor.status}
                  onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                >
                  <option value="In Review">In Review</option>
                  <option value="Drafting RFP">Drafting RFP</option>
                  <option value="Deposit Paid">Deposit Paid</option>
                  <option value="Contract Signed">Contract Signed</option>
                </select>
              </div>

              {/* Contact & Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {vendor.contact && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Mail size={14} style={{ color: 'var(--gold-primary)' }} />
                    <span>{vendor.contact}</span>
                  </div>
                )}
                {vendor.notes && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {vendor.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions & Financials */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target: </span>
                <strong style={{ color: 'var(--text-primary)' }}>${vendor.budgetAllocated.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleOpenRfpModal(vendor)}
                  className="btn btn-secondary btn-sm"
                  title="Generate tailored AI inquiry email"
                >
                  <Sparkles size={13} style={{ color: 'var(--gold-primary)' }} />
                  <span>Draft AI RFP</span>
                </button>

                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="btn btn-secondary btn-icon"
                  style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                  title="Remove vendor"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI RFP Inquiry Generator Modal */}
      {selectedRfpVendor && (
        <div className="modal-overlay" onClick={() => setSelectedRfpVendor(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--gold-primary)' }} />
                <h3 style={{ fontSize: '1.25rem' }}>
                  AI Generated RFP Outreach: {selectedRfpVendor.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRfpVendor(null)}
                className="btn btn-secondary btn-icon"
                style={{ width: '30px', height: '30px' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {isGeneratingRfp ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Sparkles size={32} className="pulse-glow" style={{ color: 'var(--gold-primary)', margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Gemini 3.8 Flash is drafting a bespoke Request for Proposal tailored to your budget and guest count...
                  </p>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Inquiry Letter & Scope Document</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Ready to copy & email</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={12}
                    value={rfpText}
                    onChange={(e) => setRfpText(e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.6 }}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedRfpVendor(null)} className="btn btn-secondary">
                Close
              </button>
              <button onClick={handleCopyRfp} className="btn btn-primary" disabled={isGeneratingRfp}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Inquiry Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Vendor Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Add Vendor Partner</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary btn-icon"
                style={{ width: '30px', height: '30px' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddVendor}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Vendor Category *</label>
                    <select
                      className="form-select"
                      value={newVendor.category}
                      onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                    >
                      <option value="Venue & Facilities">Venue & Facilities</option>
                      <option value="Catering & Bar">Catering & Bar</option>
                      <option value="Photography & Media">Photography & Media</option>
                      <option value="Music & DJ">Music & DJ</option>
                      <option value="Floral & Decor">Floral & Decor</option>
                      <option value="Cake & Confectionery">Cake & Confectionery</option>
                      <option value="Attire & Styling">Attire & Styling</option>
                      <option value="Permits & Security">Permits & Security</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company / Vendor Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Lumina Media Co."
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Contact Email / Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="contact@company.com"
                      value={newVendor.contact}
                      onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Budget ($)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={newVendor.budgetAllocated}
                      onChange={(e) => setNewVendor({ ...newVendor, budgetAllocated: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Scope & Contract Inclusions</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="e.g. 8 hours of coverage, 2 shooters, drone aerials included"
                    value={newVendor.notes}
                    onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
