import type { CreateExamInput, LocalizedText, OptionKey } from '@arivuvazhi/shared';

/**
 * TNPSC Group 4 (CCSE-IV) structure. Rules reflect the commonly published pattern and must be
 * re-checked against the latest official TNPSC notification before students rely on them.
 */
export const tnpscGroup4Exam: CreateExamInput = {
  code: 'TNPSC_GROUP_4',
  name: { en: 'TNPSC Group 4 (CCSE-IV)', ta: 'டிஎன்பிஎஸ்சி குரூப் 4 (ஒருங்கிணைந்த குடிமைப் பணிகள் தேர்வு-IV)' },
  description: {
    en: 'Combined Civil Services Examination – IV conducted by the Tamil Nadu Public Service Commission.',
    ta: 'தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையம் நடத்தும் ஒருங்கிணைந்த குடிமைப் பணிகள் தேர்வு – IV.',
  },
  languages: ['en', 'ta'],
  status: 'active',
  rules: {
    durationMinutes: 180,
    totalQuestions: 200,
    totalMarks: 300,
    marksPerQuestion: 1.5,
    negativeMarkPerWrong: 0,
    sections: [
      {
        code: 'PART_A',
        name: { en: 'Part A – Tamil Eligibility-cum-Scoring Test', ta: 'பகுதி அ – தமிழ் தகுதி மற்றும் மதிப்பீட்டுத் தேர்வு' },
        questionCount: 100,
        marks: 150,
        minimumQualifyingPercent: 40,
      },
      {
        code: 'PART_B',
        name: { en: 'Part B – General Studies and Aptitude', ta: 'பகுதி ஆ – பொது அறிவு மற்றும் திறனறிவு' },
        questionCount: 100,
        marks: 150,
      },
    ],
  },
};

interface SeedTopic {
  code: string;
  name: LocalizedText;
}

interface SeedSubject {
  code: string;
  name: LocalizedText;
  sectionCode: 'PART_A' | 'PART_B';
  topics: SeedTopic[];
}

export const tnpscGroup4Subjects: SeedSubject[] = [
  {
    code: 'GENERAL_TAMIL',
    name: { en: 'General Tamil', ta: 'பொதுத் தமிழ்' },
    sectionCode: 'PART_A',
    topics: [{ code: 'ILAKKANAM', name: { en: 'Grammar', ta: 'இலக்கணம்' } }],
  },
  {
    code: 'GENERAL_SCIENCE',
    name: { en: 'General Science', ta: 'பொது அறிவியல்' },
    sectionCode: 'PART_B',
    topics: [
      { code: 'PHYSICS', name: { en: 'Physics', ta: 'இயற்பியல்' } },
      { code: 'CHEMISTRY', name: { en: 'Chemistry', ta: 'வேதியியல்' } },
    ],
  },
  { code: 'CURRENT_EVENTS', name: { en: 'Current Events', ta: 'நடப்பு நிகழ்வுகள்' }, sectionCode: 'PART_B', topics: [] },
  {
    code: 'INDIAN_GEOGRAPHY',
    name: { en: 'Geography of India', ta: 'இந்தியாவின் புவியியல்' },
    sectionCode: 'PART_B',
    topics: [{ code: 'RIVERS', name: { en: 'Rivers and Drainage', ta: 'ஆறுகள் மற்றும் வடிகால் அமைப்பு' } }],
  },
  {
    code: 'INDIAN_HISTORY',
    name: { en: 'History and Culture of India', ta: 'இந்தியாவின் வரலாறும் பண்பாடும்' },
    sectionCode: 'PART_B',
    topics: [],
  },
  {
    code: 'INDIAN_POLITY',
    name: { en: 'Indian Polity', ta: 'இந்திய ஆட்சியியல்' },
    sectionCode: 'PART_B',
    topics: [{ code: 'CONSTITUTION', name: { en: 'Constitution of India', ta: 'இந்திய அரசியலமைப்பு' } }],
  },
  { code: 'INDIAN_ECONOMY', name: { en: 'Indian Economy', ta: 'இந்தியப் பொருளாதாரம்' }, sectionCode: 'PART_B', topics: [] },
  {
    code: 'NATIONAL_MOVEMENT',
    name: { en: 'Indian National Movement', ta: 'இந்திய தேசிய இயக்கம்' },
    sectionCode: 'PART_B',
    topics: [],
  },
  {
    code: 'TN_HERITAGE',
    name: {
      en: 'History, Culture, Heritage and Socio-Political Movements of Tamil Nadu',
      ta: 'தமிழ்நாட்டின் வரலாறு, பண்பாடு, மரபு மற்றும் சமூக-அரசியல் இயக்கங்கள்',
    },
    sectionCode: 'PART_B',
    topics: [{ code: 'TAMIL_LITERATURE', name: { en: 'Tamil Literature', ta: 'தமிழ் இலக்கியம்' } }],
  },
  {
    code: 'TN_ADMINISTRATION',
    name: { en: 'Development Administration in Tamil Nadu', ta: 'தமிழ்நாட்டில் வளர்ச்சி நிர்வாகம்' },
    sectionCode: 'PART_B',
    topics: [],
  },
  {
    code: 'APTITUDE',
    name: { en: 'Aptitude and Mental Ability', ta: 'திறனறிவும் மனக்கணக்கு நுண்ணறிவும்' },
    sectionCode: 'PART_B',
    topics: [
      { code: 'PERCENTAGE', name: { en: 'Percentage', ta: 'சதவீதம்' } },
      { code: 'SPEED_DISTANCE', name: { en: 'Time, Speed and Distance', ta: 'நேரம், வேகம் மற்றும் தூரம்' } },
      { code: 'NUMBER_SERIES', name: { en: 'Number Series', ta: 'எண் தொடர்' } },
    ],
  },
];

export interface SeedQuestion {
  key: string;
  subjectCode: string;
  topicCode: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: LocalizedText;
  options: [OptionKey, LocalizedText][];
  correctOption: OptionKey;
  explanation: LocalizedText;
}

/** Sample content to exercise the practice flow. Replace with verified, reviewed questions. */
export const tnpscGroup4SampleQuestions: SeedQuestion[] = [
  {
    key: 'Q001',
    subjectCode: 'GENERAL_TAMIL',
    topicCode: 'ILAKKANAM',
    difficulty: 'easy',
    text: { ta: 'தமிழில் உயிர் எழுத்துகள் எத்தனை?' },
    options: [
      ['A', { ta: '12' }],
      ['B', { ta: '18' }],
      ['C', { ta: '30' }],
      ['D', { ta: '247' }],
    ],
    correctOption: 'A',
    explanation: { ta: 'தமிழில் 12 உயிர் எழுத்துகள், 18 மெய் எழுத்துகள், 216 உயிர்மெய் எழுத்துகள், 1 ஆய்த எழுத்து என மொத்தம் 247 எழுத்துகள் உள்ளன.' },
  },
  {
    key: 'Q002',
    subjectCode: 'INDIAN_POLITY',
    topicCode: 'CONSTITUTION',
    difficulty: 'easy',
    text: { en: 'On which date did the Constitution of India come into force?', ta: 'இந்திய அரசியலமைப்பு எந்த நாளில் நடைமுறைக்கு வந்தது?' },
    options: [
      ['A', { en: '15 August 1947', ta: '15 ஆகஸ்ட் 1947' }],
      ['B', { en: '26 November 1949', ta: '26 நவம்பர் 1949' }],
      ['C', { en: '26 January 1950', ta: '26 ஜனவரி 1950' }],
      ['D', { en: '2 October 1950', ta: '2 அக்டோபர் 1950' }],
    ],
    correctOption: 'C',
    explanation: {
      en: 'The Constitution was adopted on 26 November 1949 and came into force on 26 January 1950, celebrated as Republic Day.',
      ta: 'அரசியலமைப்பு 26 நவம்பர் 1949 அன்று ஏற்றுக்கொள்ளப்பட்டு, 26 ஜனவரி 1950 அன்று நடைமுறைக்கு வந்தது; இந்நாள் குடியரசு தினமாகக் கொண்டாடப்படுகிறது.',
    },
  },
  {
    key: 'Q003',
    subjectCode: 'INDIAN_POLITY',
    topicCode: 'CONSTITUTION',
    difficulty: 'medium',
    text: {
      en: 'How many Fundamental Duties are listed in the Constitution of India?',
      ta: 'இந்திய அரசியலமைப்பில் எத்தனை அடிப்படைக் கடமைகள் பட்டியலிடப்பட்டுள்ளன?',
    },
    options: [
      ['A', { en: '10', ta: '10' }],
      ['B', { en: '11', ta: '11' }],
      ['C', { en: '12', ta: '12' }],
      ['D', { en: '6', ta: '6' }],
    ],
    correctOption: 'B',
    explanation: {
      en: 'Article 51A lists 11 Fundamental Duties. Ten were added by the 42nd Amendment (1976) and the eleventh by the 86th Amendment (2002).',
      ta: 'சரத்து 51A-வில் 11 அடிப்படைக் கடமைகள் உள்ளன. 42-வது திருத்தம் (1976) மூலம் பத்தும், 86-வது திருத்தம் (2002) மூலம் பதினொன்றாவதும் சேர்க்கப்பட்டன.',
    },
  },
  {
    key: 'Q004',
    subjectCode: 'GENERAL_SCIENCE',
    topicCode: 'CHEMISTRY',
    difficulty: 'easy',
    text: { en: 'What is the chemical symbol of gold?', ta: 'தங்கத்தின் வேதியியல் குறியீடு என்ன?' },
    options: [
      ['A', { en: 'Ag', ta: 'Ag' }],
      ['B', { en: 'Au', ta: 'Au' }],
      ['C', { en: 'Gd', ta: 'Gd' }],
      ['D', { en: 'Go', ta: 'Go' }],
    ],
    correctOption: 'B',
    explanation: {
      en: 'Au comes from the Latin word "aurum". Ag is silver.',
      ta: 'Au என்பது "ஆரம்" (aurum) என்ற இலத்தீன் சொல்லிலிருந்து வந்தது. Ag என்பது வெள்ளி.',
    },
  },
  {
    key: 'Q005',
    subjectCode: 'GENERAL_SCIENCE',
    topicCode: 'PHYSICS',
    difficulty: 'easy',
    text: { en: 'What is the SI unit of electric current?', ta: 'மின்னோட்டத்தின் SI அலகு என்ன?' },
    options: [
      ['A', { en: 'Volt', ta: 'வோல்ட்' }],
      ['B', { en: 'Ohm', ta: 'ஓம்' }],
      ['C', { en: 'Ampere', ta: 'ஆம்பியர்' }],
      ['D', { en: 'Watt', ta: 'வாட்' }],
    ],
    correctOption: 'C',
    explanation: {
      en: 'Electric current is measured in amperes (A). Volt measures potential difference, ohm resistance and watt power.',
      ta: 'மின்னோட்டம் ஆம்பியரில் (A) அளக்கப்படுகிறது. வோல்ட் மின்னழுத்த வேறுபாட்டையும், ஓம் மின்தடையையும், வாட் திறனையும் அளக்கின்றன.',
    },
  },
  {
    key: 'Q006',
    subjectCode: 'INDIAN_GEOGRAPHY',
    topicCode: 'RIVERS',
    difficulty: 'easy',
    text: { en: 'Which is the longest river in India?', ta: 'இந்தியாவின் மிக நீளமான ஆறு எது?' },
    options: [
      ['A', { en: 'Godavari', ta: 'கோதாவரி' }],
      ['B', { en: 'Ganga', ta: 'கங்கை' }],
      ['C', { en: 'Yamuna', ta: 'யமுனை' }],
      ['D', { en: 'Krishna', ta: 'கிருஷ்ணா' }],
    ],
    correctOption: 'B',
    explanation: {
      en: 'The Ganga flows about 2,525 km and is the longest river within India. The Godavari is the longest peninsular river.',
      ta: 'கங்கை சுமார் 2,525 கி.மீ. பாய்கிறது; இது இந்தியாவிற்குள் மிக நீளமான ஆறு. தீபகற்ப இந்தியாவின் மிக நீளமான ஆறு கோதாவரி.',
    },
  },
  {
    key: 'Q007',
    subjectCode: 'TN_HERITAGE',
    topicCode: 'TAMIL_LITERATURE',
    difficulty: 'easy',
    text: { en: 'Who wrote the Thirukkural?', ta: 'திருக்குறளை இயற்றியவர் யார்?' },
    options: [
      ['A', { en: 'Kambar', ta: 'கம்பர்' }],
      ['B', { en: 'Ilango Adigal', ta: 'இளங்கோவடிகள்' }],
      ['C', { en: 'Thiruvalluvar', ta: 'திருவள்ளுவர்' }],
      ['D', { en: 'Avvaiyar', ta: 'ஔவையார்' }],
    ],
    correctOption: 'C',
    explanation: {
      en: 'Thiruvalluvar wrote the Thirukkural, with 1,330 couplets in 133 chapters. Ilango Adigal wrote Silappathikaram; Kambar wrote Kamba Ramayanam.',
      ta: 'திருக்குறளை இயற்றியவர் திருவள்ளுவர்; இதில் 133 அதிகாரங்களில் 1,330 குறள்கள் உள்ளன. சிலப்பதிகாரத்தை இளங்கோவடிகளும், கம்பராமாயணத்தைக் கம்பரும் இயற்றினர்.',
    },
  },
  {
    key: 'Q008',
    subjectCode: 'APTITUDE',
    topicCode: 'PERCENTAGE',
    difficulty: 'easy',
    text: { en: 'What is 25% of 200?', ta: '200-இல் 25% என்பது எவ்வளவு?' },
    options: [
      ['A', { en: '25', ta: '25' }],
      ['B', { en: '40', ta: '40' }],
      ['C', { en: '50', ta: '50' }],
      ['D', { en: '75', ta: '75' }],
    ],
    correctOption: 'C',
    explanation: { en: '25% of 200 = (25 / 100) × 200 = 50.', ta: '200-இல் 25% = (25 / 100) × 200 = 50.' },
  },
  {
    key: 'Q009',
    subjectCode: 'APTITUDE',
    topicCode: 'SPEED_DISTANCE',
    difficulty: 'easy',
    text: {
      en: 'A train travels 60 km in 1 hour. How far will it travel in 2.5 hours at the same speed?',
      ta: 'ஒரு ரயில் 1 மணி நேரத்தில் 60 கி.மீ. செல்கிறது. அதே வேகத்தில் 2.5 மணி நேரத்தில் எவ்வளவு தூரம் செல்லும்?',
    },
    options: [
      ['A', { en: '120 km', ta: '120 கி.மீ.' }],
      ['B', { en: '135 km', ta: '135 கி.மீ.' }],
      ['C', { en: '150 km', ta: '150 கி.மீ.' }],
      ['D', { en: '180 km', ta: '180 கி.மீ.' }],
    ],
    correctOption: 'C',
    explanation: { en: 'Distance = speed × time = 60 × 2.5 = 150 km.', ta: 'தூரம் = வேகம் × நேரம் = 60 × 2.5 = 150 கி.மீ.' },
  },
  {
    key: 'Q010',
    subjectCode: 'APTITUDE',
    topicCode: 'NUMBER_SERIES',
    difficulty: 'medium',
    text: { en: 'Find the next number: 2, 6, 12, 20, 30, ?', ta: 'அடுத்த எண்ணைக் கண்டுபிடி: 2, 6, 12, 20, 30, ?' },
    options: [
      ['A', { en: '38', ta: '38' }],
      ['B', { en: '40', ta: '40' }],
      ['C', { en: '42', ta: '42' }],
      ['D', { en: '44', ta: '44' }],
    ],
    correctOption: 'C',
    explanation: {
      en: 'Differences are 4, 6, 8, 10, so the next difference is 12: 30 + 12 = 42. (Each term is n × (n + 1).)',
      ta: 'வேறுபாடுகள் 4, 6, 8, 10; அடுத்த வேறுபாடு 12: 30 + 12 = 42. (ஒவ்வொரு உறுப்பும் n × (n + 1).)',
    },
  },
];
