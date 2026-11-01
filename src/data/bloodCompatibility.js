export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPATIBILITY_DATA = {
  'O-': {
    group: 'O-',
    name: 'O Negative',
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    type: 'Universal Red Cell Donor',
    rarity: 'approx. 7% of population',
    plasmaReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    description: 'Vital in emergencies when patient blood type is unknown before transfusion.',
    badgeColor: 'bg-red-100 text-red-800 border-red-200'
  },
  'O+': {
    group: 'O+',
    name: 'O Positive',
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    type: 'High Demand Blood Type',
    rarity: 'approx. 37% of population',
    plasmaReceiveFrom: ['O+', 'A+', 'B+', 'AB+'],
    description: 'Most frequently needed blood type in trauma centers and surgeries.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  'A-': {
    group: 'A-',
    name: 'A Negative',
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    type: 'Rare Red Cell Type',
    rarity: 'approx. 6% of population',
    plasmaReceiveFrom: ['A-', 'A+', 'AB-', 'AB+'],
    description: 'Often in high demand for platelet donations and specialized transfusions.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  'A+': {
    group: 'A+',
    name: 'A Positive',
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    type: 'Common Blood Type',
    rarity: 'approx. 34% of population',
    plasmaReceiveFrom: ['A+', 'AB+'],
    description: 'Second most common blood type; critical for cancer and surgery patients.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  'B-': {
    group: 'B-',
    name: 'B Negative',
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    type: 'Rare Donor Type',
    rarity: 'approx. 2% of population',
    plasmaReceiveFrom: ['B-', 'B+', 'AB-', 'AB+'],
    description: 'Very scarce blood group. Immediate donors are crucial during surgeries.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  'B+': {
    group: 'B+',
    name: 'B Positive',
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    type: 'Moderate Frequency Type',
    rarity: 'approx. 9% of population',
    plasmaReceiveFrom: ['B+', 'AB+'],
    description: 'Supports sickle cell therapies and critical care trauma emergencies.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  'AB-': {
    group: 'AB-',
    name: 'AB Negative',
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    type: 'Rarest Blood Type',
    rarity: 'approx. 1% of population',
    plasmaReceiveFrom: ['AB-', 'AB+'],
    description: 'The rarest blood type in the world. Plasma from AB- is universal.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  'AB+': {
    group: 'AB+',
    name: 'AB Positive',
    canDonateTo: ['AB+'],
    canReceiveFrom: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    type: 'Universal Red Cell Recipient',
    rarity: 'approx. 4% of population',
    plasmaReceiveFrom: ['AB+'],
    description: 'Can receive red blood cells from any blood group. Universal plasma donor.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200'
  }
};
