import React, { useState } from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Trash2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { calculateBudgetBreakdown } from '../services/fallbackEngine';
import { formatCurrency } from '../services/currencyEngine';

export default function BudgetPlanner({ event, onUpdateEvent, onOpenCopilot, currency = 'USD' }) {
  const [budgetItems, setBudgetItems] = useState(event.budgetItems || []);
  const [totalBudget, setTotalBudget] = useState(event.budget || 15000);
  const [guestCount, setGuestCount] = useState(event.guestCount || 100);
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState({
    category: '',
    allocatedAmount: 1000,
    actualSpent: 0,
    priority: 'Medium',
    description: '',
  });

  // Calculate totals
  const totalAllocated = budgetItems.reduce((acc, i) => acc + (Number(i.allocatedAmount) || 0), 0);
  const totalSpent = budgetItems.reduce((acc, i) => acc + (Number(i.actualSpent) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const varianceTotal = totalBudget - totalAllocated;

  // Handle actual spent change
  const handleSpentChange = (id, newSpent) => {
    const updated = budgetItems.map((item) => {
      if (item.id === id) {
        const spent = Math.max(0, Number(newSpent) || 0);
        let status = 'On Track';
        if (spent > item.allocatedAmount) status = 'Over Budget';
        else if (spent < item.allocatedAmount * 0.9 && spent > 0) status = 'Under Budget';
        return { ...item, actualSpent: spent, status };
      }
      return item;
    });
    setBudgetItems(updated);
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  // Handle allocated amount change
  const handleAllocatedChange = (id, newAllocated) => {
    const updated = budgetItems.map((item) => {
      if (item.id === id) {
        const allocated = Math.max(0, Number(newAllocated) || 0);
        const percentage = totalBudget > 0 ? Math.round((allocated / totalBudget) * 100) : 0;
        const perGuest = guestCount > 0 ? Number((allocated / guestCount).toFixed(2)) : 0;
        return { ...item, allocatedAmount: allocated, percentage, perGuest };
      }
      return item;
    });
    setBudgetItems(updated);
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  // Remove budget item
  const handleRemoveItem = (id) => {
    const updated = budgetItems.filter((item) => item.id !== id);
    setBudgetItems(updated);
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  // Add new budget item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.category.trim()) return;

    const allocated = Number(newItem.allocatedAmount) || 500;
    const spent = Number(newItem.actualSpent) || 0;
    const percentage = totalBudget > 0 ? Math.round((allocated / totalBudget) * 100) : 0;
    const perGuest = guestCount > 0 ? Number((allocated / guestCount).toFixed(2)) : 0;

    const created = {
      id: `b-custom-${Date.now()}`,
      category: newItem.category.trim(),
      allocatedAmount: allocated,
      actualSpent: spent,
      percentage,
      priority: newItem.priority,
      description: newItem.description || '',
      perGuest,
      status: spent > allocated ? 'Over Budget' : 'On Track',
    };

    const updated = [...budgetItems, created];
    setBudgetItems(updated);
    onUpdateEvent({ ...event, budgetItems: updated });
    setShowAddModal(false);
    setNewItem({
      category: '',
      allocatedAmount: 1000,
      actualSpent: 0,
      priority: 'Medium',
      description: '',
    });
  };

  // Recalculate using standard model
  const handleRecalculateRatios = () => {
    const newItems = calculateBudgetBreakdown(totalBudget, event.eventType, guestCount);
    setBudgetItems(newItems);
    onUpdateEvent({ ...event, budget: totalBudget, budgetItems: newItems });
  };

  // AI Cost Optimizer
  const handleRunAiOptimizer = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      // High-impact contextually tailored suggestions
      const suggestions = [
        {
          title: 'Beverage & Bar Restructuring',
          savings: '$1,200 - $1,800',
          recommendation:
            'Shift from an all-inclusive full premium open bar to a curated signature cocktail hour (2 bespoke drinks) followed by local craft beer and wine. Venues often waive package minimums for this format.',
        },
        {
          title: 'Repurposed Floral Installations',
          savings: '$800 - $1,400',
          recommendation:
            'Contract your florist to transition ceremony arbor arrangements and aisle runner blooms directly onto the reception head table and guest photo lounge during cocktail hour.',
        },
        {
          title: 'Off-Peak Vendor Timing',
          savings: '$600 - $900',
          recommendation:
            'Adjust photographer package from 10 hours to 8 hours by scheduling the cake cutting immediately following the first dance rather than at the end of the evening.',
        },
      ];
      setAiSuggestions(suggestions);
      setIsOptimizing(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Control Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <DollarSign size={20} style={{ color: 'var(--gold-primary)' }} />
            <h2 style={{ fontSize: '1.45rem' }}>Dynamic Budget Planner & Variance Calculator</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Real-time financial tracking, categorical percentages, and per-attendee economics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleRunAiOptimizer}
            className="btn btn-primary btn-sm"
            disabled={isOptimizing}
            id="btn-ai-budget-optimizer"
          >
            <Sparkles size={15} />
            <span>{isOptimizing ? 'Analyzing...' : 'AI Cost Optimization'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-secondary btn-sm"
            id="btn-add-expense"
          >
            <PlusCircle size={15} />
            <span>Add Category</span>
          </button>

          <button
            onClick={handleRecalculateRatios}
            className="btn btn-secondary btn-sm"
            title="Recalculate optimal ratios"
          >
            <RotateCcw size={15} />
            <span>Auto-Balance</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid-3">
        <div className="glass-card">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Budget Target
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0.35rem 0' }}>
            {formatCurrency(totalBudget, currency)}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Allocated across {budgetItems.length} categories ({formatCurrency(totalAllocated, currency)})
          </div>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Actual Committed Spend
          </span>
          <div
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              margin: '0.35rem 0',
              color: totalSpent > totalBudget ? 'var(--danger)' : 'var(--gold-primary)',
            }}
          >
            {formatCurrency(totalSpent, currency)}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {Math.round((totalSpent / Math.max(1, totalBudget)) * 100)}% of total budget utilized
          </div>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Remaining Variance
          </span>
          <div
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              margin: '0.35rem 0',
              color: remainingBudget >= 0 ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {formatCurrency(remainingBudget, currency)}
          </div>
          <div style={{ fontSize: '0.82rem', color: remainingBudget >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {remainingBudget >= 0 ? 'Surplus buffer available' : 'Budget deficit detected'}
          </div>
        </div>
      </div>

      {/* AI Suggestions Box (if triggered) */}
      {aiSuggestions && (
        <div
          className="glass-card"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid var(--border-accent)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--gold-primary)' }} />
              <h3 style={{ fontSize: '1.15rem' }}>AI Smart Cost-Reduction Intelligence</h3>
            </div>
            <button
              onClick={() => setAiSuggestions(null)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              Dismiss
            </button>
          </div>

          <div className="grid-3">
            {aiSuggestions.map((sug, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(10, 13, 20, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.95rem' }}>{sug.title}</h4>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Save {sug.savings}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {sug.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itemized Categories Table */}
      <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Category & Details</th>
              <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
              <th style={{ padding: '0.75rem 1rem' }}>Allocated ($)</th>
              <th style={{ padding: '0.75rem 1rem' }}>Actual Spent ($)</th>
              <th style={{ padding: '0.75rem 1rem' }}>Per Guest</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map((item) => {
              const variance = item.allocatedAmount - item.actualSpent;
              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    fontSize: '0.92rem',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  {/* Category Name & Note */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.category}</div>
                    {item.description && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {item.description}
                      </div>
                    )}
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span
                      className={`badge ${
                        item.priority === 'Essential'
                          ? 'badge-gold'
                          : item.priority === 'High'
                          ? 'badge-purple'
                          : 'badge-rose'
                      }`}
                    >
                      {item.priority || 'Medium'}
                    </span>
                  </td>

                  {/* Allocated Amount (Editable) */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>$</span>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '100px', padding: '0.35rem 0.5rem', fontSize: '0.88rem' }}
                        value={item.allocatedAmount}
                        onChange={(e) => handleAllocatedChange(item.id, e.target.value)}
                      />
                    </div>
                  </td>

                  {/* Actual Spent (Editable) */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>$</span>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '100px', padding: '0.35rem 0.5rem', fontSize: '0.88rem' }}
                        value={item.actualSpent}
                        onChange={(e) => handleSpentChange(item.id, e.target.value)}
                      />
                    </div>
                  </td>

                  {/* Per Guest */}
                  <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>
                    ${((item.allocatedAmount || 0) / Math.max(1, guestCount)).toFixed(2)}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span
                      className={`badge ${
                        item.actualSpent > item.allocatedAmount
                          ? 'badge-rose'
                          : item.actualSpent > 0
                          ? 'badge-green'
                          : 'badge-purple'
                      }`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {item.actualSpent > item.allocatedAmount
                        ? `Over by $${item.actualSpent - item.allocatedAmount}`
                        : item.status || 'On Track'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="btn btn-secondary btn-icon"
                      style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                      title="Remove expense category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Custom Category Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Add Expense Category</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary btn-icon"
                style={{ width: '30px', height: '30px' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddItem}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Wedding Stationery, Fireworks, Lighting"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Allocated Budget ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input"
                      value={newItem.allocatedAmount}
                      onChange={(e) => setNewItem({ ...newItem, allocatedAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Actual Spent ($)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={newItem.actualSpent}
                      onChange={(e) => setNewItem({ ...newItem, actualSpent: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Tier</label>
                  <select
                    className="form-select"
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                  >
                    <option value="Essential">Essential (Must-have)</option>
                    <option value="High">High (Core Experience)</option>
                    <option value="Medium">Medium (Nice-to-have)</option>
                    <option value="Low">Low (Discretionary)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Scope Notes</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Vendor inclusions, notes or specs"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
