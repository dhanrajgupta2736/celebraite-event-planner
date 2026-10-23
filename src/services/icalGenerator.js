/**
 * iCalendar (.ics) Generator - CelebrAIte
 * Generates RFC 5545 compliant calendar files for day-of operational schedules.
 */

/**
 * Formats a date string and time into an iCalendar DTSTART / DTEND format (YYYYMMDDTHHMMSSZ)
 */
function parseTimeToIcsDate(eventDateStr, timeStr) {
  const baseDate = eventDateStr ? new Date(eventDateStr) : new Date();
  const year = baseDate.getFullYear();
  const month = String(baseDate.getMonth() + 1).padStart(2, '0');
  const day = String(baseDate.getDate()).padStart(2, '0');

  // Parse timeStr like "03:30 PM" or "10:00 AM"
  let hours = 12;
  let minutes = 0;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  }

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  return `${year}${month}${day}T${hStr}${mStr}00Z`;
}

/**
 * Generates full RFC 5545 .ics string for the event's day-of run-sheet
 * @param {object} event
 * @returns {string}
 */
export function generateIcsCalendar(event) {
  const runSheet = event.dayOfRunSheet || [];
  const eventTitle = (event.title || 'Celebration').replace(/[,;\n]/g, ' ');
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CelebrAIte//Autonomous Event Intelligence//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${eventTitle} Day-of Schedule`,
  ];

  runSheet.forEach((slot, index) => {
    const dtStart = parseTimeToIcsDate(event.date, slot.time);
    const uid = `celebraite-${event.id || 'evt'}-${index}-${Date.now()}@celebraite.ai`;

    ics.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART:${dtStart}`,
      `SUMMARY:${(slot.title || 'Event Slot').replace(/[,;\n]/g, ' ')}`,
      `DESCRIPTION:Owner: ${(slot.owner || 'Lead Coordinator').replace(/[,;\n]/g, ' ')}${
        slot.note ? ' | Note: ' + slot.note.replace(/[,;\n]/g, ' ') : ''
      }`,
      `LOCATION:${(event.location || 'Celebration Venue').replace(/[,;\n]/g, ' ')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

/**
 * Triggers a browser download of the generated .ics file
 */
export function downloadIcsFile(event) {
  const icsData = generateIcsCalendar(event);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `celebraite-${event.id || 'schedule'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
