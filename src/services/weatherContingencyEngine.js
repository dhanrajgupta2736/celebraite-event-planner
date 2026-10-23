/**
 * Weather Contingency & Plan B Advisor - CelebrAIte
 * Synthesizes risk matrices and backup protocols for outdoor & hybrid celebrations.
 */

export const WEATHER_CONDITIONS = {
  SUNNY: { label: 'Sunny & Clear', riskLevel: 'Low', icon: '☀️' },
  RAIN: { label: 'Rain & Downpour', riskLevel: 'High', icon: '🌧️' },
  WIND: { label: 'High Winds & Gusts', riskLevel: 'Medium', icon: '💨' },
  HEAT: { label: 'Extreme Heatwave', riskLevel: 'Medium', icon: '🔥' },
  CHILL: { label: 'Cold Front & Frost', riskLevel: 'Medium', icon: '❄️' },
};

/**
 * Generates an actionable contingency checklist and emergency run-sheet shift
 * @param {string} eventType
 * @param {string} weatherType
 * @returns {object}
 */
export function generateContingencyPlan(eventType, weatherType = 'RAIN') {
  if (weatherType === 'RAIN') {
    return {
      weather: 'Rain & Storm Contingency (Plan B)',
      triggerNotice: '2 Hours Prior to Guest Arrival',
      actionItems: [
        { priority: 'Immediate', title: 'Deploy Clear-Span Marquee Tent', note: 'Engage tent vendor by 9:00 AM if rain probability > 60%' },
        { priority: 'Essential', title: 'Relocate Audio-Visual & Power', note: 'Move sound consoles under waterproof pavilions with surge protectors' },
        { priority: 'High', title: 'Courtyard to Indoor Ballroom Shift', note: 'Activate indoor cocktail foyer for receiving line and appetizers' },
        { priority: 'Guest Comfort', title: 'Umbrella Valet & Dry Walkways', note: 'Provide 50 white golf umbrellas at shuttle drop-off points' },
        { priority: 'Media', title: 'Covered Photo Backup Locations', note: 'Pivot couple portraits to arched heritage colonnades or windowed library' },
      ],
      runSheetShiftNotes: 'Shift ceremony 15 minutes later if outdoor storm squall is brief; otherwise hold ceremony entirely in the East Pavilion.',
    };
  }

  if (weatherType === 'HEAT') {
    return {
      weather: 'Extreme Heatwave Contingency',
      triggerNotice: 'Morning of Event',
      actionItems: [
        { priority: 'Essential', title: 'Misting Fans & Evaporative Coolers', note: 'Place 4 high-capacity misting units along guest seating perimeter' },
        { priority: 'High', title: 'Hydration & Welcome Stations', note: 'Double ice deliveries and serve infused cucumber-mint water upon arrival' },
        { priority: 'Catering', title: 'Refrigerate Confectionery & Cakes', note: 'Keep wedding/birthday cake in walk-in cooler until 15 mins before cutting' },
        { priority: 'Comfort', title: 'Provide Handheld Bamboo Fans & Parasols', note: 'Distribute personalized wooden fans at the welcome table' },
      ],
      runSheetShiftNotes: 'Delay outdoor afternoon ceremony start by 30 minutes to let the temperature drop past golden hour.',
    };
  }

  // High Winds
  return {
    weather: 'High Winds & Storm Gusts Contingency',
    triggerNotice: '3 Hours Prior to Event',
    actionItems: [
      { priority: 'Immediate', title: 'Anchor Staging & Truss Rigging', note: 'Add 150kg sandbag counterweights to all speaker tripods and lighting arches' },
      { priority: 'Floral', title: 'Enclose Open Flame Candles in Hurricanes', note: 'Replace all exposed taper candles with tall hurricane glass or LED flameless' },
      { priority: 'Signage', title: 'Secure Foam Boards & Table Cards', note: 'Use heavy acrylic or marble stands rather than lightweight easel cards' },
    ],
    runSheetShiftNotes: 'Switch outdoor drone footage to handheld gimbal cameras inside the venue.',
  };
}
