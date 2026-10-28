export const medication = [
  {
    id: 'med-1',
    cat: 'medication',
    slug: 'match-the-generic-name',
    title: 'Match the generic name',
    excerpt:
      'One medicine can have many brands \u2014 always check the generic, not just the box.',
    intro:
      'The same active ingredient is sold under dozens of brand names. Knowing the generic name prevents accidental double-dosing and mixture errors.',
    sections: [
      {
        heading: 'Brand versus generic',
        body: 'The generic name is the medicine itself; brand names are marketing labels. Paracetamol, for example, appears under many different brands.',
      },
      {
        heading: 'The double-dose trap',
        body: 'Combination cold remedies often contain paracetamol. Taking them alongside a paracetamol tablet can easily exceed a safe dose.',
      },
      {
        heading: 'Check every time',
        body: 'Read the active ingredient on each box, especially when buying a different brand of what you usually take.',
      },
    ],
    keyPoints: [
      'Generic name = the active medicine',
      'One medicine can have many brands',
      'Combination products cause double doses',
      'Check the active ingredient on every box',
    ],
    faq: [
      {
        q: 'Are generics as good as brands?',
        a: 'Yes \u2014 they must meet the same quality standards and contain the same active ingredient.',
      },
      {
        q: 'How do I avoid doubling up?',
        a: 'Compare the active ingredient and strength of everything you take before adding a new product.',
      },
    ],
    tags: ['generic medicine', 'paracetamol', 'brand names', 'safety'],
    updated: '2026-10-12',
  },
  {
    id: 'med-2',
    cat: 'medication',
    slug: 'complete-the-full-course',
    title: 'Complete the full course',
    excerpt:
      'Stopping early lets surviving bacteria grow stronger against the medicine.',
    intro:
      'Antibiotics kill susceptible bacteria first. Stopping early leaves the hardier ones alive \u2014 and they multiply, which drives resistance.',
    sections: [
      {
        heading: 'Why the full course',
        body: 'Even when you feel better within a day or two, the course length is set to clear the infection completely and prevent relapse.',
      },
      {
        heading: 'Resistance is real',
        body: 'Stopping early is one of the main ways bacteria learn to survive antibiotics, making future infections harder to treat.',
      },
      {
        heading: 'Antibiotics are not for viruses',
        body: 'Colds and flu are viral and do not respond to antibiotics. Taking them unnecessarily adds risk with no benefit.',
      },
    ],
    keyPoints: [
      'Finish the prescribed course',
      'Feeling better does not mean cured',
      'Early stopping drives resistance',
      'Antibiotics do not treat viral illnesses',
    ],
    faq: [
      {
        q: 'Can I save leftover antibiotics?',
        a: 'No. Do not reuse or share leftovers \u2014 return them to a pharmacy for safe disposal.',
      },
      {
        q: 'What if I miss a dose?',
        a: 'Follow the label or ask your pharmacist. Do not take a double dose to catch up unless advised.',
      },
    ],
    tags: ['antibiotics', 'resistance', 'adherence', 'infection'],
    updated: '2026-10-11',
  },
  {
    id: 'med-3',
    cat: 'medication',
    slug: 'check-interactions-first',
    title: 'Check interactions first',
    excerpt:
      'Ask the pharmacist before mixing herbs, supplements or a new prescription.',
    intro:
      'Interactions can make a medicine weaker, stronger or dangerous. They are common and often avoidable with one quick question at the pharmacy.',
    sections: [
      {
        heading: 'Not just prescriptions',
        body: 'Herbal remedies, vitamins and even some foods can interact with medicines \u2014 grapefruit is a classic example with several drugs.',
      },
      {
        heading: 'Bring the full list',
        body: 'Show your pharmacist everything you take, including supplements and anything bought over the counter.',
      },
      {
        heading: 'Tell them your conditions',
        body: 'Kidney or liver problems, pregnancy and allergies all change which combinations are safe.',
      },
    ],
    keyPoints: [
      'Supplements can interact too',
      'Bring your full medicine list',
      'Mention pregnancy and organ conditions',
      'Ask before adding anything new',
    ],
    faq: [
      {
        q: 'Can food really interact with medicine?',
        a: 'Yes. Grapefruit, dairy and high-fibre meals can all change how some medicines are absorbed.',
      },
      {
        q: 'How do I know if there is an interaction?',
        a: 'Ask your pharmacist \u2014 a quick check of your full list is the reliable way.',
      },
    ],
    tags: ['drug interactions', 'supplements', 'pharmacist', 'safety'],
    updated: '2026-10-10',
  },
  {
    id: 'med-4',
    cat: 'medication',
    slug: 'store-medicines-correctly',
    title: 'Store medicines correctly',
    excerpt:
      'Some need the fridge; all keep better away from heat and humidity.',
    intro:
      'Heat, light and moisture break medicines down, reducing their strength or creating harmful by-products. Storage is part of safety.',
    sections: [
      {
        heading: 'Away from heat and damp',
        body: 'The bathroom cabinet is a poor choice \u2014 steam and warmth degrade many medicines. A cool, dry, dark cupboard is better.',
      },
      {
        heading: 'Follow fridge instructions',
        body: 'Some medicines, like certain insulin and liquid antibiotics, must stay refrigerated. Never freeze them unless told to.',
      },
      {
        heading: 'Keep them safe and labelled',
        body: 'Store out of reach of children, keep original packaging and labels, and check expiry dates regularly.',
      },
    ],
    keyPoints: [
      'Avoid bathroom heat and humidity',
      'Check which medicines need the fridge',
      'Keep original labelled packaging',
      'Dispose of expired medicines safely',
    ],
    faq: [
      {
        q: 'Are expired medicines dangerous?',
        a: 'They may simply be less effective, but some degrade into harmful compounds. Do not use them.',
      },
      {
        q: 'Can I keep tablets in a pill organiser?',
        a: 'For a week or two it is fine, but some medicines are light-sensitive and should stay in their original packaging.',
      },
    ],
    tags: ['medicine storage', 'expiry', 'safety', 'pharmacist'],
    updated: '2026-10-09',
  },
  {
    id: 'med-5',
    cat: 'medication',
    slug: 'never-share-prescriptions',
    title: 'Never share prescriptions',
    excerpt:
      'What is safe for one person can quietly harm another.',
    intro:
      'Prescriptions are matched to one person\u2019s weight, condition and other medicines. Sharing them ignores every part of that calculation.',
    sections: [
      {
        heading: 'Personal by design',
        body: 'Dose and choice depend on age, kidney function, allergies, pregnancy and existing medicines \u2014 none of which transfers with the pill.',
      },
      {
        heading: 'Real risks',
        body: 'Sharing antibiotics can delay the right diagnosis, and sharing painkillers can cause serious harm, particularly with blood thinners or kidney disease.',
      },
      {
        heading: 'Better alternative',
        body: 'If someone has the same symptoms, encourage them to see a professional. A consultation is safer than borrowed pills.',
      },
    ],
    keyPoints: [
      'Doses are tailored to one person',
      'Sharing can hide a real diagnosis',
      'Antibiotics should never be shared',
      'Point people to professional advice',
    ],
    faq: [
      {
        q: 'What if it is just a painkiller?',
        a: 'Even common painkillers can be unsafe for some people, especially with kidney disease or other medicines.',
      },
      {
        q: 'How should I dispose of leftovers?',
        a: 'Return them to a pharmacy. Do not keep them for future use or give them away.',
      },
    ],
    tags: ['prescriptions', 'sharing', 'safety', 'antibiotics'],
    updated: '2026-10-08',
  },
  {
    id: 'med-6',
    cat: 'medication',
    slug: 'verify-online-pharmacies',
    title: 'Verify online pharmacies',
    excerpt:
      'Buy from licensed sellers only \u2014 unverified pills are a real and growing risk.',
    intro:
      'Counterfeit and substandard medicines are widely sold online. Buying from a licensed pharmacy is the difference between a real treatment and an unknown substance.',
    sections: [
      {
        heading: 'The scale of the problem',
        body: 'A large share of medicines sold by unlicensed sites are fake, underdosed or contaminated \u2014 sometimes containing harmful ingredients.',
      },
      {
        heading: 'How to check',
        body: 'Use pharmacies recommended by your doctor or recognised regulators, look for a physical address and pharmacist, and be wary of prices far below market.',
      },
      {
        heading: 'Red flags',
        body: 'No prescription required for controlled medicine, no pharmacist to speak to, or pressure to buy quickly are all warning signs.',
      },
    ],
    keyPoints: [
      'Buy only from licensed pharmacies',
      'Check for a real address and pharmacist',
      'Be wary of drastically low prices',
      'No prescription needed is a red flag',
    ],
    faq: [
      {
        q: 'Are discount sites always fake?',
        a: 'Not always, but risk rises sharply when a seller is unlicensed, has no pharmacist and undercuts everyone.',
      },
      {
        q: 'How can I confirm a pharmacy is genuine?',
        a: 'Check official regulator listings or ask your doctor or local pharmacist for a trusted online option.',
      },
    ],
    warning:
      'Never buy controlled or prescription medicines from unverified websites \u2014 counterfeits cause real harm.',
    tags: ['online pharmacy', 'counterfeit', 'safety', 'prescription'],
    updated: '2026-10-07',
  },
]
