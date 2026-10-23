/**
 * Fallback & Deterministic Engine - CelebrAIte
 * Provides offline-capable, high-fidelity generative event plans,
 * dynamic budgeting models, timeline synthesis, and creative suites.
 */

export const EVENT_TYPES = {
  WEDDING: 'wedding',
  BIRTHDAY: 'birthday',
  COMMUNITY: 'community',
  CUSTOM: 'custom',
};

// Standard budget allocation percentages based on empirical event planning ratios
export const BUDGET_RATIOS = {
  wedding: [
    { category: 'Venue & Rentals', percentage: 38, priority: 'High', description: 'Ceremony & reception spaces, tables, chairs, staging' },
    { category: 'Catering & Bar', percentage: 26, priority: 'High', description: 'Plated dinner, cocktail hour, open bar, cake' },
    { category: 'Photography & Video', percentage: 12, priority: 'High', description: 'Full day documentary, drone footage, raw edit' },
    { category: 'Floral & Decor', percentage: 10, priority: 'Medium', description: 'Arbor florals, centerpieces, ambient lighting' },
    { category: 'Music & Entertainment', percentage: 7, priority: 'Medium', description: 'Live band / DJ, sound engineering, MC' },
    { category: 'Attire & Beauty', percentage: 4, priority: 'Medium', description: 'Bridal wear, grooming, hair & makeup' },
    { category: 'Contingency Fund', percentage: 3, priority: 'Essential', description: 'Emergency buffer & unexpected overtime fees' },
  ],
  birthday: [
    { category: 'Venue & Experience', percentage: 35, priority: 'High', description: 'Lounge, private dining room, or activity venue rental' },
    { category: 'Food & Beverage', percentage: 30, priority: 'High', description: 'Custom appetizers, specialty cake, signature drinks' },
    { category: 'Entertainment & DJ', percentage: 15, priority: 'High', description: 'DJ, arcade rentals, performers, or photo booth' },
    { category: 'Themed Decor & Favors', percentage: 10, priority: 'Medium', description: 'Custom backdrop, balloon installations, gift bags' },
    { category: 'Photography & Content', percentage: 6, priority: 'Low', description: 'Event photographer & social reel creator' },
    { category: 'Emergency Buffer', percentage: 4, priority: 'Essential', description: 'Last-minute additions & guest overages' },
  ],
  community: [
    { category: 'Permits, Venue & Safety', percentage: 30, priority: 'Essential', description: 'Public park/hall permits, security, EMT, insurance' },
    { category: 'Audio-Visual & Staging', percentage: 22, priority: 'High', description: 'Stage setup, PA sound system, mics, projection' },
    { category: 'Catering & Food Trucks', percentage: 20, priority: 'High', description: 'Community meal subsidies, water stations, snacks' },
    { category: 'Marketing & Signage', percentage: 12, priority: 'Medium', description: 'Banners, flyers, directional signs, badge lanyards' },
    { category: 'Activities & Talent', percentage: 10, priority: 'Medium', description: 'Guest speakers, workshop leads, kids zone games' },
    { category: 'Contingency & Sanitation', percentage: 6, priority: 'Essential', description: 'Waste recycling bins, cleanup crew, emergency fund' },
  ],
};

/**
 * Calculates a tailored budget breakdown
 */
export function calculateBudgetBreakdown(totalBudget, eventType, guestCount = 100) {
  const budget = Math.max(500, Number(totalBudget) || 10000);
  const type = BUDGET_RATIOS[eventType] ? eventType : 'wedding';
  const ratios = BUDGET_RATIOS[type];

  return ratios.map((item, index) => {
    const allocated = Math.round((budget * item.percentage) / 100);
    const perGuest = guestCount > 0 ? (allocated / guestCount).toFixed(2) : 0;
    return {
      id: `cat-${index + 1}`,
      category: item.category,
      percentage: item.percentage,
      allocatedAmount: allocated,
      actualSpent: 0,
      priority: item.priority,
      description: item.description,
      perGuest: Number(perGuest),
      status: 'On Track',
    };
  });
}

/**
 * Generates macro milestones leading up to the celebration
 */
export function generateMacroTimeline(eventType, eventDate) {
  const targetDate = eventDate ? new Date(eventDate) : new Date(Date.now() + 180 * 86400000);
  
  if (eventType === 'wedding') {
    return [
      { id: 'm1', phase: '6-9 Months Out', title: 'Venue Booking & Vision Lock', completed: true, tasks: ['Secure ceremony & reception venue', 'Establish primary budget ceiling', 'Hire lead photographer & videographer'] },
      { id: 'm2', phase: '4-6 Months Out', title: 'Catering, Music & Save-the-Dates', completed: true, tasks: ['Book catering & menu tasting', 'Audition and contract DJ / Live Band', 'Send digital & printed Save-the-Dates'] },
      { id: 'm3', phase: '2-3 Months Out', title: 'Decor, Attire & Formal Invitations', completed: false, tasks: ['Finalize floral arrangements & color swatches', 'Bridal fittings & groom tuxedo styling', 'Mail formal RSVPs with dietary selections'] },
      { id: 'm4', phase: '3-4 Weeks Out', title: 'Headcount & Seating Chart', completed: false, tasks: ['Lock final headcount with caterer', 'Design seating chart & table name cards', 'Finalize playlist & "do not play" list'] },
      { id: 'm5', phase: '1 Week Out', title: 'Final Confirmations & Rehearsal', completed: false, tasks: ['Confirm load-in times with all vendors', 'Distribute run-sheet to bridal party', 'Conduct ceremony rehearsal & rehearsal dinner'] },
      { id: 'm6', phase: 'Day of Wedding', title: 'Celebration Day Execution', completed: false, tasks: ['Bridal party glam & grooming at 8:00 AM', 'First look & portrait session', 'Ceremony, cocktail hour, reception send-off'] },
    ];
  }

  if (eventType === 'birthday') {
    return [
      { id: 'b1', phase: '6 Weeks Out', title: 'Theme & Guest List Draft', completed: true, tasks: ['Choose party theme & mood board', 'Finalize VIP guest list', 'Scout & book private venue / lounge'] },
      { id: 'b2', phase: '3 Weeks Out', title: 'Invitations & Entertainment', completed: false, tasks: ['Send digital interactive invitations', 'Book DJ / live entertainment / arcade games', 'Order custom centerpiece cake'] },
      { id: 'b3', phase: '1 Week Out', title: 'Menu & Decor Prep', completed: false, tasks: ['Confirm drink menu & cocktail specials', 'Purchase balloon garlands & photobooth props', 'Create playlist of favorite hits through the years'] },
      { id: 'b4', phase: 'Day of Event', title: 'Party Time & Celebration', completed: false, tasks: ['Venue decor setup & sound check 2 hours prior', 'Guest welcome drinks & appetizer station', 'Cake cutting, toast, and dance floor open'] },
    ];
  }

  // Community / Gala / Festival
  return [
    { id: 'c1', phase: '3 Months Out', title: 'Permits, Scope & Committee', completed: true, tasks: ['Submit municipal & park permits', 'Form volunteer sub-committees', 'Establish event sponsorship tier packages'] },
    { id: 'c2', phase: '6 Weeks Out', title: 'Sponsors & Logistics', completed: false, tasks: ['Confirm food truck vendors & sanitation contracts', 'Book mainstage audio/visual tech team', 'Launch community ticket & RSVP registration'] },
    { id: 'c3', phase: '2 Weeks Out', title: 'Volunteer Orientation & Safety', completed: false, tasks: ['Brief volunteers on crowd safety & check-in', 'Print directional signage and program pamphlets', 'Confirm EMS / first aid presence'] },
    { id: 'c4', phase: 'Event Day', title: 'Community Gates Open', completed: false, tasks: ['Volunteer check-in at 7:00 AM', 'Sound check & booth setup at 8:30 AM', 'Opening remarks, keynote, activities & post-event cleanup'] },
  ];
}

/**
 * Generates hour-by-hour day-of run-sheet
 */
export function generateDayOfRunSheet(eventType) {
  if (eventType === 'wedding') {
    return [
      { time: '08:00 AM', title: 'Hair, Makeup & Grooming Suite Opens', owner: 'Bridal Party / Stylists', note: 'Breakfast & mimosa station provided' },
      { time: '11:00 AM', title: 'Photographer & Videographer Arrive', owner: 'Media Team', note: 'Capture dress, rings, vows, and detail shots' },
      { time: '01:00 PM', title: 'First Look & Couple Portraits', owner: 'Photographer + Couple', note: 'Private courtyard location' },
      { time: '02:30 PM', title: 'Family & Bridal Party Group Portraits', owner: 'Coordinator', note: 'Keep bridal party hydrated and on cue' },
      { time: '03:30 PM', title: 'Guest Arrival & Welcome Music', owner: 'Acoustic Musician', note: 'Champagne & sparkling water served' },
      { time: '04:00 PM', title: 'Ceremony Commences', owner: 'Officiant', note: 'Processional, vows exchange, ring ceremony' },
      { time: '04:45 PM', title: 'Cocktail Hour & Hors d’oeuvres', owner: 'Catering Team', note: 'Couple takes sunset golden-hour photos' },
      { time: '06:00 PM', title: 'Grand Reception Entrance & First Dance', owner: 'DJ / MC', note: 'Lighting dims to warm romantic wash' },
      { time: '06:30 PM', title: 'Plated Dinner & Welcome Speeches', owner: 'Maid of Honor, Best Man', note: 'Max 4 minutes per toast' },
      { time: '08:00 PM', title: 'Cake Cutting & Dance Floor Opens', owner: 'DJ', note: 'Party tracks & dessert bar live' },
      { time: '10:45 PM', title: 'Grand Sparkler Send-off & Farewell', owner: 'Coordinator', note: 'Shuttle buses transport guests to hotel' },
    ];
  }

  if (eventType === 'birthday') {
    return [
      { time: '05:00 PM', title: 'Decor & AV Setup', owner: 'Host & Decor Team', note: 'Inflate balloons, test sound, prep photo booth' },
      { time: '06:30 PM', title: 'Guests Arrive & Welcome Drinks', owner: 'Bartender', note: 'Signature mocktails & charcuterie board' },
      { time: '07:30 PM', title: 'Interactive Party Game / Trivia', owner: 'MC / Friend', note: 'Personalized trivia about the guest of honor' },
      { time: '08:30 PM', title: 'Birthday Dinner Buffet / Bites', owner: 'Catering', note: 'Gourmet sliders, tacos, or artisanal flatbreads' },
      { time: '09:30 PM', title: 'Cake Cutting, Candle Wish & Champagne Toast', owner: 'All Guests', note: 'Sing celebratory anthem' },
      { time: '10:00 PM', title: 'DJ Set & Dance Party', owner: 'DJ', note: 'Party until venue curfew' },
    ];
  }

  // Community
  return [
    { time: '07:00 AM', title: 'Logistics Team & Staging Load-In', owner: 'Lead Coordinator', note: 'Stage, generator, and AV delivery' },
    { time: '08:30 AM', title: 'Vendor & Food Truck Check-In', owner: 'Vendor Lead', note: 'Verify health permits & electrical hookups' },
    { time: '09:30 AM', title: 'Volunteer Morning Huddle & Badging', owner: 'Volunteer Manager', note: 'Assign radio channels and stations' },
    { time: '10:00 AM', title: 'Gates Open to the Public', owner: 'Welcome Tent', note: 'Free maps, event schedules & tote bags' },
    { time: '11:00 AM', title: 'Opening Remarks & Community Address', owner: 'Keynote Speaker', note: 'Stage 1 PA system' },
    { time: '01:00 PM', title: 'Live Cultural Performances & Contests', owner: 'Performers', note: 'Youth dance group & raffle draw' },
    { time: '04:00 PM', title: 'Closing Ceremony & Thank You Remarks', owner: 'Organizer', note: 'Announce total funds raised / attendees' },
    { time: '05:00 PM', title: 'Site Teardown & Green Cleanup', owner: 'Cleanup Crew', note: 'Ensure zero litter left behind' },
  ];
}

/**
 * Generates tailored vendor checklist with RFP generator templates
 */
export function generateVendorChecklist(eventType) {
  return [
    {
      id: 'v1',
      category: 'Venue & Facilities',
      name: 'Grand Pavilion / Estate',
      status: 'Contract Signed',
      contact: 'events@grandpavilion.com',
      budgetAllocated: 6000,
      actualCost: 5800,
      notes: 'Tables & chairs included. 2am curfew with 1-hour load-out buffer.',
      checklist: ['Sign contract', 'Pay 50% deposit', 'Review insurance requirements', 'Confirm venue floor plan'],
      rfpTemplate: `Hi Venue Team,\n\nWe are organizing our upcoming celebration on [Date] for approximately [Guest Count] attendees. We loved your space and would like to confirm availability and receive an official quotation including standard rental inclusions, overtime rates, and setup access times.\n\nLooking forward to working together!\nWarm regards,\n[Planner Name]`,
    },
    {
      id: 'v2',
      category: 'Catering & Beverages',
      name: 'Artisan Culinary Group',
      status: 'In Review',
      contact: 'tastings@artisanculinary.com',
      budgetAllocated: 4500,
      actualCost: 4400,
      notes: 'Vegetarian, vegan, and gluten-free dietary options required.',
      checklist: ['Schedule menu tasting', 'Select hors d’oeuvres', 'Finalize beverage package', 'Confirm staff-to-guest ratio'],
      rfpTemplate: `Hello Catering Team,\n\nWe are planning our [Event Type] on [Date] for [Guest Count] guests. We require a curated menu with options for vegetarian and gluten-free guests. Please provide sample menus, per-person rates for 3 courses, and bartender staffing details.\n\nThank you,\n[Planner Name]`,
    },
    {
      id: 'v3',
      category: 'Photography & Media',
      name: 'Lumina Storytellers',
      status: 'Shortlisted',
      contact: 'hello@luminastories.com',
      budgetAllocated: 2200,
      actualCost: 0,
      notes: 'Need 8 hours of coverage, 2 shooters, drone aerials, and sneak peeks within 48h.',
      checklist: ['Review portfolio', 'Verify turnaround time for edits', 'Provide shot-list / family groupings', 'Pay reservation retainer'],
      rfpTemplate: `Dear Lumina Storytellers,\n\nWe adore your visual style and would be honored to discuss documenting our [Event Type] on [Date]. We are seeking 8 hours of coverage with 2 shooters and drone coverage. Please share your availability and package options.\n\nWarmly,\n[Planner Name]`,
    },
    {
      id: 'v4',
      category: 'Music & Audio Entertainment',
      name: 'Pulse Sound & DJ Co.',
      status: 'Drafting RFP',
      contact: 'bookings@pulseaudio.com',
      budgetAllocated: 1400,
      actualCost: 0,
      notes: 'Requires wireless lapel mic for speakers and custom lighting package.',
      checklist: ['Submit song playlist and blacklisted songs', 'Confirm sound equipment specs', 'Review cancellation terms'],
      rfpTemplate: `Hi Pulse Sound,\n\nWe are looking for a high-energy, versatile DJ / Sound Engineer for our [Event Type] on [Date] from 4pm to 11pm. We require sound reinforcement, wireless microphones, and dancefloor wash lighting. Please provide your quote and mix samples.\n\nBest,\n[Planner Name]`,
    },
  ];
}

/**
 * Generates creative concepts: Themes, Menus, Activities, Speeches
 */
export function generateCreativeSuite(eventType, themeHint = 'Modern Elegance') {
  if (eventType === 'wedding') {
    return {
      theme: {
        title: 'Golden Hour Tuscan Romance',
        tagline: 'Sun-drenched terracotta warmth meets timeless ivory and eucalyptus greenery',
        palette: [
          { name: 'Champagne Gold', hex: '#D4AF37', role: 'Accent & Metallic' },
          { name: 'Tuscan Terracotta', hex: '#C86D51', role: 'Primary Warmth' },
          { name: 'Sage & Olive', hex: '#708238', role: 'Floral Foliage' },
          { name: 'Soft Alabaster', hex: '#F9F6F0', role: 'Linens & Base' },
          { name: 'Midnight Navy', hex: '#1B263B', role: 'Tuxedo & Contrast' },
        ],
        decorNotes: 'Rustic wooden tables with flowing cheesecloth runners, glowing tapered candles in amber glass hurricane holders, hanging olive branch chandeliers, and personalized hand-lettered marble place cards.',
      },
      menu: [
        { course: 'Hors d’Oeuvres', dish: 'Burrata Crostini with Fig & Balsamic Reduction', dietary: 'Vegetarian' },
        { course: 'First Course', dish: 'Shaved Fennel, Citrus & Arugula Salad with Pomegranate Vinaigrette', dietary: 'Vegan, GF' },
        { course: 'Main Entrée', dish: 'Herb-Crusted Sea Bass or Wild Mushroom Truffle Risotto', dietary: 'Pescatarian / GF' },
        { course: 'Dessert', dish: 'Three-Tier Earl Grey & Lavender Cake with Honey Buttercream', dietary: 'Vegetarian' },
        { course: 'Signature Cocktail', dish: 'The Blushing Spritz (Prosecco, Blood Orange, Rosemary)', dietary: 'Cocktail' },
      ],
      activities: [
        { title: 'Audio Guestbook Vintage Telephone', description: 'Guests pick up a retro rotary telephone to record heartwarming voice messages and wedding advice for the couple.' },
        { title: 'Golden Hour Polaroid Photo Station', description: 'Guests snap instant Polaroid photos, paste them into a custom linen scrapbook, and write personal blessings.' },
        { title: 'Late Night Gelato Cart & Espresso Bar', description: 'Surprise dessert cart wheeled onto the dance floor at 10 PM with artisan pistachio and espresso gelato.' },
      ],
      speechTemplate: {
        title: 'Heartfelt Maid of Honor / Best Man Speech',
        content: `Good evening everyone. For those of you who don't know me, I am [Your Name], and having the privilege of standing beside [Couple's Names] today is something I will treasure forever.\n\nWhen [Partner A] first introduced [Partner B], I noticed something immediately: the effortless smile that appeared on their face. It was the kind of calm, genuine happiness that only happens when you find your true home in another human being.\n\nToday has been magical—from the vows to this unforgettable celebration. May your love continue to deepen through life's sweetest adventures and simplest mornings. Everyone, please raise your glasses to a lifetime of laughter, joy, and unconditional devotion. To [Couple's Names]!`,
      },
    };
  }

  if (eventType === 'birthday') {
    return {
      theme: {
        title: 'Neon Retro Arcade & Synthwave Chill',
        tagline: 'Electric 80s nostalgia with glowing neon typography, cyberpunk purples, and high-energy beats',
        palette: [
          { name: 'Cyberpunk Violet', hex: '#8B5CF6', role: 'Glow Accent' },
          { name: 'Electric Pink', hex: '#EC4899', role: 'Highlight' },
          { name: 'Neon Cyan', hex: '#06B6D4', role: 'Lighting Swatch' },
          { name: 'Deep Onyx', hex: '#0F172A', role: 'Base Background' },
          { name: 'Solar Amber', hex: '#F59E0B', role: 'Energy Accent' },
        ],
        decorNotes: 'Custom neon name sign against faux boxwood greenery wall, vintage arcade cocktail cabinets set to free-play, retro cassette-tape escort cards, and ultraviolet uplighting with glowing cocktail tumblers.',
      },
      menu: [
        { course: 'Snack Bar', dish: 'Gourmet Truffle Parmesan Popcorn & Artisanal Soft Pretzel Bites', dietary: 'Vegetarian' },
        { course: 'Main Bites', dish: 'Mini Wagyu Sliders & Crispy Korean Fried Cauliflower Bites', dietary: 'Options for Meat & Veg' },
        { course: 'Centerpiece', dish: 'Pixel-Art Funfetti Birthday Cake with Edible Neon Drip', dietary: 'Vegetarian' },
        { course: 'Signature Drink', dish: 'The 1984 Cyber-Mule (Vodka or Ginger Beer, Blue Curacao, Lime, Neon Glow Stirrer)', dietary: 'Cocktail / Mocktail' },
      ],
      activities: [
        { title: 'The Ultimate Decade Trivia Championship', description: 'Interactive smartphone trivia with live leaderboard on the projector screen testing friends on embarrassing memories & 90s/00s pop culture.' },
        { title: '360° Neon Video Spinner Booth', description: 'Guests step onto a lighted platform while a rotating camera captures high-definition slow-motion reels for social sharing.' },
        { title: 'Custom DIY Cocktail / Mocktail Station', description: 'Guests shake their own personalized drink with custom fruit infusions and edible glitter dust.' },
      ],
      speechTemplate: {
        title: 'The "Roast & Toast" Birthday Tribute',
        content: `Hey everyone! Thank you all for gathering here tonight to celebrate [Name]'s milestone birthday! Looking around this room, it's clear just how deeply loved you are.\n\nThey say that with age comes wisdom, although after knowing [Name] for [Number] years, I can confirm that mostly with age comes better taste in music, worse knees, and an undeniable ability to make any room happier just by walking in.\n\nTonight is about celebrating every triumph, every wild story, and the incredible friend you are. Let's raise our glasses to [Name]—may this next year be your most daring, prosperous, and joyful chapter yet. Cheers!`,
      },
    };
  }

  // Community
  return {
    theme: {
      title: 'Green Unity Eco-Festival',
      tagline: 'Sustainable, inclusive, and vibrant community celebration emphasizing local roots and future growth',
      palette: [
        { name: 'Emerald Forest', hex: '#059669', role: 'Primary Eco Brand' },
        { name: 'Sunny Marigold', hex: '#EAB308', role: 'Energy & Optimism' },
        { name: 'Earthy Clay', hex: '#B45309', role: 'Warm Accents' },
        { name: 'Clean Sky Cyan', hex: '#0EA5E9', role: 'Directional Signage' },
        { name: 'Canvas Natural', hex: '#F3F4F6', role: 'Recycled Materials' },
      ],
      decorNotes: 'Upcycled wooden pallet signage, biodegradable wildflower seed paper event badges, living potted succulent centerpieces that attendees can adopt at the end of the event, and zero single-use plastics.',
    },
    menu: [
      { course: 'Community Table', dish: 'Farm-to-Table Seasonal Flatbreads with Heirloom Tomatoes & Basil', dietary: 'Vegan Option' },
      { course: 'Street Food Hub', dish: 'Multicultural Dumpling & Street Taco Stations from Local Small Businesses', dietary: 'Halal, Veg, GF' },
      { course: 'Refreshment', dish: 'Fresh Cold-Pressed Lemonade with Mint & Hibiscus Iced Tea', dietary: 'Non-Alcoholic' },
      { course: 'Community Dessert', dish: 'Locally Sourced Organic Fruit Pies & Artisan Ice Cream Sandwiches', dietary: 'Vegetarian' },
    ],
    activities: [
      { title: 'Community Mural Live Painting', description: 'Local artists outline a large commemorative wooden canvas where community members of all ages paint their hopes for the neighborhood.' },
      { title: 'Silent Auction & Local Charity Drive', description: 'Digital bidding on donations from local artisans and restaurants, with live revenue counter projected on the main pavilion screen.' },
      { title: 'Kids Interactive STEM & Gardening Lab', description: 'Hands-on potting station where children plant their own vegetable seeds to take home.' },
    ],
    speechTemplate: {
      title: 'Community Keynote & Gratitude Address',
      content: `Welcome neighbors, partners, and friends! When we first set out to organize this gathering, our simple dream was to create a space where everyone in our community felt seen, connected, and celebrated.\n\nLooking out across this park today and seeing neighbors sharing meals, children laughing at the creative booths, and local businesses thriving together reminds us of what makes this community resilient and extraordinary.\n\nI want to express our deepest gratitude to our 40+ tireless volunteers, our local sponsors, and each one of you for being here today. Together, we aren't just celebrating—we are building a brighter future. Please enjoy the day!`,
    },
  };
}
