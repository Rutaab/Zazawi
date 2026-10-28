export const PHARMACIES = [
  {
    id: 'ph-001',
    name: 'CarePoint Pharmacy',
    address: '12 Nile Street, Khartoum',
    hours: 'Open 24 hours',
    rating: 4.8,
    distance: '0.8 km',
  },
  {
    id: 'ph-002',
    name: 'Al-Nile Medical Pharmacy',
    address: '45 Block 9, Bahri',
    hours: '8:00 – 23:00',
    rating: 4.6,
    distance: '1.6 km',
  },
  {
    id: 'ph-003',
    name: 'Zazawi Central Pharmacy',
    address: 'University Road, Omdurman',
    hours: '9:00 – 22:00',
    rating: 4.9,
    distance: '2.4 km',
  },
]

export const MOCK_ORDERS = [
  {
    id: '#ZAZ-448210',
    pharmacy: PHARMACIES[0],
    items: [
      { name: 'Panadol Extra', dosage: '500mg', qty: 2 },
      { name: 'Vitamin C', dosage: '1000mg', qty: 1 },
    ],
    status: 'Ready for Pickup',
    placedAt: '2026-10-17T09:30:00.000Z',
  },
  {
    id: '#ZAZ-331907',
    pharmacy: PHARMACIES[2],
    items: [{ name: 'Amoxicillin', dosage: '500mg', qty: 1 }],
    status: 'Completed',
    placedAt: '2026-10-09T15:10:00.000Z',
  },
]
