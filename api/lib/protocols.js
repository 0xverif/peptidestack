// Protocol templates based on goals and characteristics

const PEPTIDES = {
  bpc157: {
    name: 'BPC-157',
    fullName: 'Body Protection Compound-157',
    dosage: '250-500 mcg per day',
    route: 'Subcutaneous injection',
    timing: 'Morning, on empty stomach',
    frequency: 'Once daily',
    duration: '6 weeks',
    benefits: ['Gut healing', 'Tissue repair', 'Reduced inflammation', 'Tendon/ligament recovery'],
    description: 'A gastric pentadecapeptide that promotes healing throughout the body. Excellent foundation peptide.',
  },
  tb500: {
    name: 'TB-500',
    fullName: 'Thymosin Beta-4',
    dosage: '2-2.5 mg per dose',
    route: 'Subcutaneous injection',
    timing: 'Evening, twice weekly (Mon/Thu)',
    frequency: 'Twice weekly',
    duration: '8 weeks',
    benefits: ['Muscle repair', 'Flexibility', 'Hair regrowth', 'Cardiac protection'],
    description: 'Powerful tissue regeneration peptide that works synergistically with BPC-157.',
  },
  cjcIpa: {
    name: 'CJC-1295 + Ipamorelin',
    fullName: 'Growth Hormone Releasing Combo',
    dosage: '100 mcg each (200 mcg total)',
    route: 'Subcutaneous injection',
    timing: 'Before bed, 2-3 hours after last meal',
    frequency: '5 days per week (Mon-Fri)',
    duration: '12-16 weeks',
    benefits: ['Increased GH production', 'Fat loss', 'Muscle gain', 'Better sleep', 'Anti-aging'],
    description: 'Synergistic GH secretagogue combination that stimulates natural growth hormone production.',
  },
  ghrp6: {
    name: 'GHRP-6',
    fullName: 'Growth Hormone Releasing Peptide-6',
    dosage: '100-300 mcg per dose',
    route: 'Subcutaneous injection',
    timing: 'Before meals, 3x daily',
    frequency: 'Three times daily',
    duration: '8-12 weeks',
    benefits: ['Appetite increase', 'GH release', 'Fat loss', 'Muscle building'],
    description: 'Stimulates hunger and GH release. Best for those looking to gain mass.',
  },
  mk677: {
    name: 'MK-677 (Ibutamoren)',
    fullName: 'Ibutamoren Mesylate',
    dosage: '10-25 mg per day',
    route: 'Oral',
    timing: 'Before bed',
    frequency: 'Once daily',
    duration: '12-24 weeks',
    benefits: ['Sustained GH elevation', 'Sleep quality', 'Skin/hair improvement', 'Bone density'],
    description: 'Oral GH secretagogue for those who prefer not to inject. Longer duration protocol.',
  },
  aod9604: {
    name: 'AOD-9604',
    fullName: 'Advanced Obesity Drug Fragment',
    dosage: '300 mcg per day',
    route: 'Subcutaneous injection',
    timing: 'Morning, fasted',
    frequency: 'Once daily',
    duration: '12 weeks',
    benefits: ['Fat burning', 'No muscle wasting', 'Cartilage repair', 'No effect on blood sugar'],
    description: 'Modified GH fragment specifically for fat loss without the side effects of full GH.',
  },
  pt141: {
    name: 'PT-141 (Bremelanotide)',
    fullName: 'Bremelanotide',
    dosage: '1-2 mg per dose',
    route: 'Subcutaneous injection',
    timing: '45-60 minutes before activity',
    frequency: 'As needed (max 2x/week)',
    duration: 'As needed',
    benefits: ['Sexual function', 'Libido enhancement', 'Works for both men and women'],
    description: 'Melanocortin receptor agonist for sexual dysfunction and libido enhancement.',
  },
  epithalon: {
    name: 'Epithalon',
    fullName: 'Epitalon (AEDG peptide)',
    dosage: '5-10 mg per day',
    route: 'Subcutaneous injection',
    timing: 'Evening',
    frequency: 'Once daily for 10-20 days',
    duration: '10-20 day cycles, 2-3x per year',
    benefits: ['Telomere lengthening', 'Anti-aging', 'Sleep regulation', 'Antioxidant'],
    description: 'Telomerase activator for longevity. Used in short cycles throughout the year.',
  },
};

const PROTOCOL_TEMPLATES = {
  fatLoss: {
    name: 'Fat Loss & Recomposition',
    description: 'Optimized for reducing body fat while preserving lean mass',
    phases: [
      { peptide: 'bpc157', weeks: '1-6', purpose: 'Foundation & metabolic optimization' },
      { peptide: 'aod9604', weeks: '3-14', purpose: 'Targeted fat burning' },
      { peptide: 'cjcIpa', weeks: '7-18', purpose: 'GH optimization for sustained results' },
    ],
  },
  recovery: {
    name: 'Injury Recovery & Healing',
    description: 'Accelerate healing from injuries, surgery, or chronic issues',
    phases: [
      { peptide: 'bpc157', weeks: '1-8', purpose: 'Systemic healing & inflammation reduction' },
      { peptide: 'tb500', weeks: '3-12', purpose: 'Tissue regeneration & repair' },
    ],
  },
  muscleGain: {
    name: 'Muscle Building & Performance',
    description: 'Support lean muscle development and athletic performance',
    phases: [
      { peptide: 'bpc157', weeks: '1-4', purpose: 'Prepare tissues for growth' },
      { peptide: 'cjcIpa', weeks: '1-16', purpose: 'Optimize GH for muscle synthesis' },
      { peptide: 'tb500', weeks: '8-16', purpose: 'Recovery & muscle repair' },
    ],
  },
  antiAging: {
    name: 'Longevity & Anti-Aging',
    description: 'Comprehensive protocol for age-related optimization',
    phases: [
      { peptide: 'cjcIpa', weeks: '1-16', purpose: 'Restore youthful GH levels' },
      { peptide: 'epithalon', weeks: '8-10, 20-22', purpose: 'Telomere support (2 cycles)' },
      { peptide: 'bpc157', weeks: '12-18', purpose: 'Systemic repair & gut health' },
    ],
  },
  energy: {
    name: 'Energy & Sleep Optimization',
    description: 'Improve energy levels, sleep quality, and daily performance',
    phases: [
      { peptide: 'cjcIpa', weeks: '1-12', purpose: 'Deep sleep & GH restoration' },
      { peptide: 'bpc157', weeks: '4-10', purpose: 'Gut-brain axis optimization' },
    ],
  },
  comprehensive: {
    name: 'Comprehensive Wellness',
    description: 'Full-spectrum protocol for overall optimization',
    phases: [
      { peptide: 'bpc157', weeks: '1-6', purpose: 'Foundation healing' },
      { peptide: 'tb500', weeks: '4-12', purpose: 'Tissue regeneration' },
      { peptide: 'cjcIpa', weeks: '8-20', purpose: 'GH optimization' },
    ],
  },
};

function matchProtocol(answers) {
  const { primaryGoal, secondaryGoal, age, experience, injectionComfort } = answers;

  let templateKey = 'comprehensive';

  // Match based on primary goal
  switch (primaryGoal) {
    case 'fat_loss':
      templateKey = 'fatLoss';
      break;
    case 'muscle':
      templateKey = 'muscleGain';
      break;
    case 'recovery':
      templateKey = 'recovery';
      break;
    case 'anti_aging':
      templateKey = 'antiAging';
      break;
    case 'energy':
      templateKey = 'energy';
      break;
    default:
      templateKey = 'comprehensive';
  }

  const template = PROTOCOL_TEMPLATES[templateKey];

  // Build full protocol with peptide details
  const protocol = {
    name: template.name,
    description: template.description,
    phases: template.phases.map((phase, index) => ({
      number: index + 1,
      peptide: PEPTIDES[phase.peptide],
      weeks: phase.weeks,
      purpose: phase.purpose,
    })),
    totalWeeks: calculateTotalWeeks(template.phases),
    adjustments: generateAdjustments(answers),
    warnings: generateWarnings(answers),
  };

  return protocol;
}

function calculateTotalWeeks(phases) {
  let maxWeek = 0;
  phases.forEach(phase => {
    const weeks = phase.weeks.split(/[-,]/).map(w => parseInt(w.trim()));
    const lastWeek = Math.max(...weeks);
    if (lastWeek > maxWeek) maxWeek = lastWeek;
  });
  return maxWeek;
}

function generateAdjustments(answers) {
  const adjustments = [];

  if (answers.age >= 50) {
    adjustments.push('Start at the lower end of all dosage ranges due to age-related sensitivity.');
  }

  if (answers.experience === 'none') {
    adjustments.push('Begin with 50% of recommended doses for the first week to assess tolerance.');
  }

  if (answers.injectionComfort === 'nervous') {
    adjustments.push('Consider starting with oral MK-677 instead of injectable peptides if anxiety persists.');
  }

  if (answers.weight && answers.weight < 150) {
    adjustments.push('Use lower end of dosage ranges due to body weight.');
  }

  if (answers.weight && answers.weight > 220) {
    adjustments.push('May use higher end of dosage ranges based on body weight.');
  }

  return adjustments;
}

function generateWarnings(answers) {
  const warnings = [];

  if (answers.conditions?.includes('diabetes')) {
    warnings.push('Monitor blood glucose closely. Some peptides may affect insulin sensitivity.');
  }

  if (answers.conditions?.includes('cancer_history')) {
    warnings.push('Consult oncologist before starting. GH-releasing peptides may be contraindicated.');
  }

  if (answers.age < 25) {
    warnings.push('Growth plates may still be open. GH peptides not recommended under 25.');
  }

  return warnings;
}

module.exports = { matchProtocol, PEPTIDES, PROTOCOL_TEMPLATES };
