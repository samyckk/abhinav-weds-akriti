export const wedding = {
  groom: 'Abhinav',
  bride: 'Akriti',
  weddingDate: '2026-11-24T08:00:00+05:30',
  dates: '24 & 25 November 2026',
  city: 'Saharanpur, Uttar\u00A0Pradesh', // non-breaking space keeps "Uttar Pradesh" on one line
  venue: 'Jaykim Banquets (Unit of JKK Orchid)',
  address: 'Saharanpur, Uttar\u00A0Pradesh',
  mapsUrl: 'https://maps.app.goo.gl/5Prty6rrUXZ9UH8u9',
  photos: { hero: '/couple/first.jpg', groom: '/couple/groom_childhood.png', bride: '/couple/bride_childhood.jpg', saveDate: '/couple/hero.png', venue: '/venue/banquet.jpg', finale: '' },
  /** Optional crop focus (CSS object-position) for a photo that its frame would otherwise cut badly. */
  photoFocus: { bride: '50% 8%' } as Partial<Record<'hero' | 'groom' | 'bride' | 'saveDate' | 'venue' | 'finale', string>>,
  /** Optional wide (16:9) versions of the backdrops, used from 601px up; empty falls back to the tall photo. */
  photosWide: { hero: '', saveDate: '' },
  /** The melody begins as the gate swings open; the sound button mutes it. */
  music: { startOnOpen: true },
  contacts: [
    { name: 'Vijendra & Deepa Gupta', relationship: "Groom’s family", phone: '+91 82183 62523' },
    { name: 'Rajesh & Madhu Jain', relationship: "Bride’s family", phone: '+91 92510 07277' },
  ],
};

export const events = [
  { title: 'Carnival Party & Haldi', time: '7:00 AM', start: '2026-11-24T07:00:00+05:30', end: '2026-11-24T09:00:00+05:30', description: 'Rang, masti aur haldi ki pehli khushboo…', photo: '/events/haldi.png', mood: 'haldi' },
  { title: 'Sangeet', time: '11:00 AM', start: '2026-11-24T11:00:00+05:30', end: '2026-11-24T13:00:00+05:30', description: 'Geet, naach aur dil khol kar jashn…', photo: '/events/sangeet.png', mood: 'sangeet' },
  { title: 'Baraat', time: '8:00 PM', start: '2026-11-24T20:00:00+05:30', end: '2026-11-24T22:00:00+05:30', description: 'Dhol bajenge, baraat niklegi aur khushiyan chhaayengi…', photo: '/events/baraat.png', mood: 'baraat' },
  { title: 'Wedding / Phere', time: '8:00 AM', start: '2026-11-25T08:00:00+05:30', end: '2026-11-25T10:00:00+05:30', description: 'Saat phere, saat vaade aur zindagi bhar ka saath…', photo: '/events/phere.png', mood: 'phere' },
  { title: 'Vidai', time: '11:00 AM', start: '2026-11-25T11:00:00+05:30', end: '2026-11-25T12:00:00+05:30', description: 'Aankhon mein aansu, dil mein duaayein aur ek nayi shuruaat…', photo: '/events/vidai.png', mood: 'vidai' },
];

export function calendarUrl(event: (typeof events)[number]) {
  const stamp = (date: string) => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: 'TEMPLATE', text: `${event.title} — ${wedding.groom} & ${wedding.bride}`, dates: `${stamp(event.start)}/${stamp(event.end)}`, details: event.description, location: `${wedding.venue}, ${wedding.address}`, ctz: 'Asia/Kolkata' })}`;
}