import { describe, it, expect } from 'vitest';

describe('Guest Manager & Dietary Rollup Logic', () => {
  const sampleGuests = [
    { id: '1', name: 'Alice & Bob', status: 'Attending', partySize: 2, dietary: 'Vegetarian' },
    { id: '2', name: 'Charlie', status: 'Attending', partySize: 1, dietary: 'Vegan, GF' },
    { id: '3', name: 'Dave', status: 'Pending', partySize: 1, dietary: 'None' },
    { id: '4', name: 'Eve & Frank', status: 'Declined', partySize: 2, dietary: 'None' },
  ];

  it('accurately aggregates confirmed attendee party sizes', () => {
    const attendingTotal = sampleGuests
      .filter((g) => g.status === 'Attending')
      .reduce((sum, g) => sum + g.partySize, 0);

    expect(attendingTotal).toBe(3); // 2 + 1
  });

  it('accurately aggregates pending and declined headcounts', () => {
    const pendingTotal = sampleGuests
      .filter((g) => g.status === 'Pending')
      .reduce((sum, g) => sum + g.partySize, 0);
    const declinedTotal = sampleGuests
      .filter((g) => g.status === 'Declined')
      .reduce((sum, g) => sum + g.partySize, 0);

    expect(pendingTotal).toBe(1);
    expect(declinedTotal).toBe(2);
  });

  it('correctly tabulates dietary restrictions for confirmed attendees only', () => {
    const dietarySummary = sampleGuests
      .filter((g) => g.status === 'Attending')
      .reduce((acc, g) => {
        const diet = g.dietary || 'None';
        acc[diet] = (acc[diet] || 0) + g.partySize;
        return acc;
      }, {});

    expect(dietarySummary['Vegetarian']).toBe(2);
    expect(dietarySummary['Vegan, GF']).toBe(1);
    expect(dietarySummary['None']).toBeUndefined(); // Dave is pending, Eve is declined
  });
});
