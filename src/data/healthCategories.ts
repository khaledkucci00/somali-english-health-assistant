import { HealthCategory } from '../types';

export const HEALTH_CATEGORIES: HealthCategory[] = [
  {
    id: 'maternal-child',
    nameEn: 'Maternal & Child Health',
    nameSo: 'Caafimaadka Hooyada & Dhallaanka',
    iconName: 'Baby',
    descriptionEn: 'Prenatal care, newborn wellness, breastfeeding, and infant nutrition.',
    descriptionSo: 'Daryeelka uurka, fayo-qabka dhallaanka, naas-nuujinta, iyo nafaqada carruurta.',
    questions: [
      {
        id: 'mc-1',
        en: 'What are the main health benefits of exclusive breastfeeding during the first six months?',
        so: 'Waa maxay faa’iidooyinka ugu waaweyn ee naas-nuujinta keliya lixda bilood ee ugu horreeya?',
        keywords: ['breastfeeding', 'naas-nuujin', 'infant', 'six months']
      },
      {
        id: 'mc-2',
        en: 'What danger signs during pregnancy require immediate medical attention?',
        so: 'Waa maxay calaamadaha halista ah ee uurka xilligiisa u baahan daryeel caafimaad oo degdeg ah?',
        keywords: ['pregnancy danger signs', 'calaamadaha halista uurka', 'bleeding', 'headache']
      },
      {
        id: 'mc-3',
        en: 'Why are routine antenatal checkups essential for an expecting mother?',
        so: 'Maxay baaritaannada joogtada ah ee uurka (antenatal care) muhiim ugu yihiin hooyada uurka leh?',
        keywords: ['antenatal', 'baaritaanka uurka', 'clinic', 'checkup']
      },
      {
        id: 'mc-4',
        en: 'How should a mother safely care for a newborn infant\'s umbilical cord stump at home?',
        so: 'Sidee hooyadu guriga ugu daryeeli kartaa xuddunta ilmaha dhashay si badbaado leh?',
        keywords: ['umbilical cord', 'daryeelka xuddunta', 'newborn', 'dhallaanka']
      },
      {
        id: 'mc-5',
        en: 'When and how should complementary solid foods be introduced to an infant?',
        so: 'Goorma iyo sidee ayaa cuntooyinka adag loogu bilaabaa ilmaha naaska nuuga?',
        keywords: ['complementary feeding', 'cunto adag', 'weaning', 'nafaqada ilmaha']
      },
      {
        id: 'mc-6',
        en: 'What are the most crucial childhood vaccines and why is the vaccination schedule important?',
        so: 'Waa maxay talaallada ugu muhiimsan ee carruurta iyo sababta jadwalka talaalka loo ilaaliyo?',
        keywords: ['vaccines', 'talaalka carruurta', 'immunization', 'jadwalka talaalka']
      },
      {
        id: 'mc-7',
        en: 'What safe home practices help manage a mild infant fever before seeing a healthcare worker?',
        so: 'Waa maxay tallaabooyinka nabdoon ee guriga lagula tacaalo qandhada fudud ee ilmaha ka hor inta aan dhaqtar la tegin?',
        keywords: ['infant fever', 'qandhada ilmaha', 'sponging', 'fluids']
      },
      {
        id: 'mc-8',
        en: 'How can a breastfeeding mother maintain sufficient hydration and nutritious milk supply?',
        so: 'Sidee hooyada naas-nuujisa u ilaalin kartaa cabbitaanka biyaha iyo nafaqada caanaha?',
        keywords: ['hydration', 'milk supply', 'biyaha', 'naas-nuujin']
      },
      {
        id: 'mc-9',
        en: 'What are common signs of dehydration in infants and young toddlers?',
        so: 'Waa maxay calaamadaha lagu garto fuuq-baxa ku dhaca dhallaanka iyo carruurta yaryar?',
        keywords: ['dehydration', 'fuuq-bax', 'sunken eyes', 'dry mouth']
      },
      {
        id: 'mc-10',
        en: 'What are the typical signs of postpartum recovery and when should a mother seek post-birth review?',
        so: 'Waa maxay calaamadaha caadiga ah ee soo kabashada dhalmada kadib, goormase loo baahan yahay baaritaan?',
        keywords: ['postpartum', 'dhalmada kadib', 'recovery', 'soo kabashada hooyada']
      }
    ]
  },
  {
    id: 'nutrition-hydration',
    nameEn: 'Nutrition & Healthy Living',
    nameSo: 'Nafaqada & Nolosha Caafimaadka leh',
    iconName: 'Apple',
    descriptionEn: 'Balanced meals, water intake, portion control, and micronutrient wellness.',
    descriptionSo: 'Cunto dheellitiran, cabbitaanka biyaha, xaddiga cuntada, iyo fitamiinnada muhiimka ah.',
    questions: [
      {
        id: 'nh-1',
        en: 'What does a balanced daily diet look like with traditional Somali foods like canjeero, bariis, and beans?',
        so: 'Sidee loo dhisi karaa cunto dheellitiran iyadoo la isticmaalayo cuntooyinka Soomaalida sida canjeerada, bariiska, iyo digirta?',
        keywords: ['balanced diet', 'cunto dheellitiran', 'bariis', 'canjeero', 'digir']
      },
      {
        id: 'nh-2',
        en: 'Why is drinking enough clean water every day crucial in warm or arid climates?',
        so: 'Maxay cabbitaanka biyo nadiif ah oo ku filan maalin kasta muhiim ugu tahay cimilada kulul ama qalalan?',
        keywords: ['water intake', 'cabbitaanka biyaha', 'hydration', 'fuuq']
      },
      {
        id: 'nh-3',
        en: 'How can families reduce excess dietary salt, bouillon cubes, and processed seasonings in cooking?',
        so: 'Sidee qoysasku u yareyn karaan milixda badan, xawaashka la farsameeyay, iyo maraqa xabadka ah ee cuntada?',
        keywords: ['salt reduction', 'milixda', 'bouillon cubes', 'maraq xabad']
      },
      {
        id: 'nh-4',
        en: 'What natural food sources are rich in iron to help prevent iron-deficiency anemia?',
        so: 'Waa maxay cuntooyinka dabiiciga ah ee qaniga ku ah xadiidka (iron) si looga hortago dhiig-yarida?',
        keywords: ['iron deficiency', 'anemia', 'dhiig-yari', 'xadiid', 'spinach', 'liver']
      },
      {
        id: 'nh-5',
        en: 'What are the health benefits of adding vegetables like moringa, spinach, and tomatoes to everyday meals?',
        so: 'Waa maxay faa’iidooyinka caafimaad ee khudaarta sida muringada, koostada, iyo yaanyada loogu daro cuntada?',
        keywords: ['vegetables', 'khudaar', 'moringa', 'koosto', 'muringa']
      },
      {
        id: 'nh-6',
        en: 'How does high consumption of refined sugar and sweetened tea (shaah cadaysan) affect health?',
        so: 'Sidee sonkorta badan iyo shaaha aadka loo macaanayey u saameeyaan caafimaadka guud?',
        keywords: ['sugar', 'shaah', 'sonkor', 'sweet tea', 'diabetes risk']
      },
      {
        id: 'nh-7',
        en: 'What are simple, safe ways to store cooked leftovers without refrigeration to prevent foodborne illness?',
        so: 'Waa maxay hababka fudud ee cuntada hadhay loo kaydin karo haddii aan qaboojiye jirin si looga fogaado sumowga cuntada?',
        keywords: ['food storage', 'kaydinta cuntada', 'food poisoning', 'sumowga cuntada']
      },
      {
        id: 'nh-8',
        en: 'Why is physical movement like brisk daily walking beneficial for energy, joints, and digestion?',
        so: 'Maxay socodka firfircoon ee maalinlaha ah faa’iido ugu leeyahay tamarta, lafaha, iyo dheefshiidka?',
        keywords: ['physical activity', 'socodka', 'exercise', 'dheefshiidka']
      },
      {
        id: 'nh-9',
        en: 'Which foods provide calcium and vitamin D for strong bones across all stages of life?',
        so: 'Waa maxay cuntooyinka bixiya kalsiyamta (calcium) iyo fitamiin D-ga si loo helo lafo adag?',
        keywords: ['calcium', 'vitamin D', 'kalsiyam', 'lafo adag', 'milk', 'qorraxda']
      },
      {
        id: 'nh-10',
        en: 'How can portion awareness and mindful eating habits help maintain a healthy body weight?',
        so: 'Sidee la socodka xaddiga cuntada loo cuno u caawisaa ilaalinta miisaanka caafimaadka qaba?',
        keywords: ['portion control', 'xaddiga cuntada', 'weight management', 'miisaanka']
      }
    ]
  },
  {
    id: 'chronic-disease',
    nameEn: 'Chronic Disease Prevention',
    nameSo: 'Ka-hortagga Cudurrada Dabadheeraada',
    iconName: 'HeartPulse',
    descriptionEn: 'Cardiovascular wellness, blood pressure, diabetes prevention, and kidney care.',
    descriptionSo: 'Caafimaadka wadnaha, dhiig-karka, ka-hortagga sonkorowga, iyo daryeelka kelyaha.',
    questions: [
      {
        id: 'cd-1',
        en: 'What is high blood pressure (hypertension) and what daily habits help keep it in a healthy range?',
        so: 'Waa maxay dhiig-karku, maxaase ah caadooyinka maalinlaha ah ee lagu ilaalin karo xaddigiisa caafimaadka qaba?',
        keywords: ['hypertension', 'dhiig-kar', 'blood pressure', 'wadne']
      },
      {
        id: 'cd-2',
        en: 'What are the main risk factors for Type 2 diabetes and how can lifestyle changes lower this risk?',
        so: 'Waa maxay sababaha keena sonkorowga nooca labaad (Type 2 diabetes) iyo sidee looga hortagi karaa?',
        keywords: ['diabetes', 'sonkorow', 'blood sugar', 'glucose']
      },
      {
        id: 'cd-3',
        en: 'Why is hypertension often called a "silent killer" and why are periodic blood pressure checks vital?',
        so: 'Maxaa dhiig-karka loogu yeeraa "dilaaga aamusan", maxayse muhiim u tahay in mar kasta la cabbiro dhiigga?',
        keywords: ['silent killer', 'dilaaga aamusan', 'blood pressure check', 'cabbirka dhiigga']
      },
      {
        id: 'cd-4',
        en: 'What are the warning signs of chronically elevated blood sugar levels that suggest seeing a doctor?',
        so: 'Waa maxay calaamadaha digniinta ah ee sonkorta dhiigga oo kacsan oo qofka ku dhiirrigeliya inuu dhaqtar arko?',
        keywords: ['high blood sugar', 'calaamadaha sonkorta', 'thirst', 'frequent urination']
      },
      {
        id: 'cd-5',
        en: 'How does tobacco use, shisha smoking, and secondhand smoke harm the cardiovascular system?',
        so: 'Sidee isticmaalka sigaarka, shiishadda, iyo qiiqa kale u dhibaateeyaan xididdada dhiigga iyo wadnaha?',
        keywords: ['smoking', 'sigaar', 'shisha', 'shiishad', 'tobacco', 'heart health']
      },
      {
        id: 'cd-6',
        en: 'What does the FAST acronym stand for in recognizing early warning signs of a stroke?',
        so: 'Waa maxay calaamadaha lagu garto faaligga ama dhiig-furan maskaxda (Stroke)?',
        keywords: ['stroke', 'faalig', 'FAST', 'stroke symptoms', 'face drooping']
      },
      {
        id: 'cd-7',
        en: 'Why is it important to protect kidney health through adequate water intake and moderating painkillers?',
        so: 'Maxay muhiim u tahay in kelyaha lagu ilaaliyo biyo ku filan iyo yareynta dawooyinka xanuun baab’iyaha ee aan loo baahnayn?',
        keywords: ['kidney health', 'caafimaadka kelyaha', 'painkillers', 'xanuun baab’iye']
      },
      {
        id: 'cd-8',
        en: 'What is the role of dietary cholesterol and unsaturated fats in long-term arterial wellness?',
        so: 'Waa maxay doorka dufanka (cholesterol) iyo dufannada caafimaadka qaba ku leeyihiin xididdada dhiigga?',
        keywords: ['cholesterol', 'dufan', 'arteries', 'heart health']
      },
      {
        id: 'cd-9',
        en: 'Why should individuals diagnosed with chronic conditions take their physician-prescribed medications consistently?',
        so: 'Maxay dadka qaba cudurrada dabadheeraada ugu muhiim tahay inay dawooyinkooda u qaataan sida dhaqtarku u qoray?',
        keywords: ['medication adherence', 'qaadashada dawooyinka', 'prescriptions', 'doctor advice']
      },
      {
        id: 'cd-10',
        en: 'What gentle physical activities are suitable for seniors or those with chronic joint discomfort?',
        so: 'Waa maxay dhaqdhaqaaqyada fudud ee ku habboon dadka da’da ah ama qaba xanuunka kalagoysyada?',
        keywords: ['senior exercise', 'dadka da’da ah', 'joint discomfort', 'kalagoysyo']
      }
    ]
  },
  {
    id: 'infectious-hygiene',
    nameEn: 'Infectious Diseases & Hygiene',
    nameSo: 'Cudurrada Faafa & Nadaafadda',
    iconName: 'ShieldAlert',
    descriptionEn: 'Water sanitation, handwashing, malaria prevention, respiratory etiquette, and outbreak safety.',
    descriptionSo: 'Nadaafadda biyaha, gacmo-dhaqashada, ka-hortagga duumada, iyo joojinta faafidda cudurrada.',
    questions: [
      {
        id: 'ih-1',
        en: 'What are the critical times to wash hands with soap and water to prevent the spread of germs?',
        so: 'Waa maxay xilliyada ugu muhiimsan ee ay tahay in gacmaha lagu dhaqo saabuun iyo biyo nadiif ah?',
        keywords: ['handwashing', 'gacmo-dhaqashada', 'soap and water', 'saabuun']
      },
      {
        id: 'ih-2',
        en: 'How can households effectively prevent mosquito bites and protect themselves against malaria?',
        so: 'Sidee qoysasku uga hortagi karaan qaniinyada kaneecada una ilaalin karaan naftooda duumada (mallaariyada)?',
        keywords: ['malaria', 'duumo', 'mallaariyo', 'mosquito net', 'maro-kaneeco']
      },
      {
        id: 'ih-3',
        en: 'How is cholera transmitted through contaminated water or food, and how can drinking water be made safe?',
        so: 'Sidee daacuunka (cholera) ku faafaa, sideese biyaha guriga looga dhigi karaa kuwo badbaado leh oo la cabbi karo?',
        keywords: ['cholera', 'daacuun', 'safe water', 'biyo nadiif ah', 'boiling water']
      },
      {
        id: 'ih-4',
        en: 'What are the common symptoms of pulmonary tuberculosis (TB) and why is early medical testing critical?',
        so: 'Waa maxay calaamadaha qaaxada (TB) ee sambabada, maxayse baaritaanka hore muhiim u tahay?',
        keywords: ['tuberculosis', 'qaaxo', 'cough', 'qufac', 'sputum']
      },
      {
        id: 'ih-5',
        en: 'What simple cough and sneeze etiquette steps help prevent passing respiratory viruses to family members?',
        so: 'Waa maxay anshaxa iyo tallaabooyinka fudud ee daboolista qufaca iyo hindhisada si aan dadka kale loo qaadsiin?',
        keywords: ['respiratory hygiene', 'qufac', 'hindhiso', 'etiquette', 'flu spread']
      },
      {
        id: 'ih-6',
        en: 'How can acute diarrhea in children be managed at home with oral rehydration salts (ORS) while seeking medical advice?',
        so: 'Sidee shubanka degdegga ah ee carruurta loogu maareeyaa guriga iyadoo la adeegsanayo xalka fuuq-celinta (ORS)?',
        keywords: ['diarrhea', 'shuban', 'ORS', 'fuuq-celin', 'hydration']
      },
      {
        id: 'ih-7',
        en: 'What steps should be taken to clean a cut or scrape immediately to prevent skin infections or tetanus?',
        so: 'Waa maxay tallaabooyinka degdegga ah ee lagu nadiifiyo dhaawaca ama xagashada maqaarka si looga fogaado jeermis?',
        keywords: ['wound care', 'dhaawaca', 'tetanus', 'dhaqidda nabarka']
      },
      {
        id: 'ih-8',
        en: 'How can community members eliminate standing water containers around homes to stop dengue and mosquito breeding?',
        so: 'Sidee dadka xaafadda ku nool u baabi’in karaan biyaha fariista guriga agtiisa si kaneecada looga hortago?',
        keywords: ['standing water', 'biyo fariistay', 'mosquito breeding', 'dengue']
      },
      {
        id: 'ih-9',
        en: 'What are common symptoms of bacterial conjunctivitis ("pink eye") and how do you stop it spreading at home?',
        so: 'Waa maxay calaamadaha indha-xanuunka faafa (conjunctivitis), sideese looga hortagaa inuu qoyska ku dhex faafo?',
        keywords: ['conjunctivitis', 'indho-xanuun', 'pink eye', 'hygiene']
      },
      {
        id: 'ih-10',
        en: 'Why is it dangerous to misuse leftover antibiotics for simple viral colds or runny noses?',
        so: 'Maxay khatar u tahay in dawooyinka jeermis-dilaha (antibiotics) loo isticmaalo hargabka ama ifilada caadiga ah?',
        keywords: ['antibiotic resistance', 'antibiotics', 'jeermis-dile', 'hargab', 'cold']
      }
    ]
  },
  {
    id: 'mental-wellbeing',
    nameEn: 'Mental Well-being & Stress',
    nameSo: 'Caafimaadka Maskaxda & Walwalka',
    iconName: 'Smile',
    descriptionEn: 'Stress management, sleep hygiene, emotional support, and community grounding.',
    descriptionSo: 'Maareynta walbahaarka, hurdada caafimaadka leh, taageerada dareenka, iyo xasiloonida maskaxda.',
    questions: [
      {
        id: 'mw-1',
        en: 'What are the common physical and emotional signs of chronic stress on the human body?',
        so: 'Waa maxay calaamadaha jireed iyo kuwa dareen ee lagu garto walbahaarka muddada dheer socda (stress)?',
        keywords: ['stress signs', 'calaamadaha walbahaarka', 'fatigue', 'headache']
      },
      {
        id: 'mw-2',
        en: 'What simple, non-pharmacological breathing exercises can calm an acute feeling of panic or racing heartbeat?',
        so: 'Waa maxay laylisyada fudud ee neef-qaadashada ee dejin kara dareenka baqdinta degdegga ah ama wadne-garaaca?',
        keywords: ['breathing exercise', 'neef-qaadasho', 'panic', 'calm', 'walwalka']
      },
      {
        id: 'mw-3',
        en: 'What healthy bedtime routines and sleep hygiene practices help achieve restful, consistent sleep?',
        so: 'Waa maxay caadooyinka wanaagsan ee hurdada ka hor caawiya helitaanka hurdo xasiloon oo ku filan?',
        keywords: ['sleep hygiene', 'hurdada', 'bedtime', 'insomnia']
      },
      {
        id: 'mw-4',
        en: 'How can spending time with family, elders, and community members support emotional resilience?',
        so: 'Sidee la joogitaanka qoyska, odayaasha, iyo xiriirka bulshadu u xoojiyaan adkeysiga iyo xasiloonida dareenka?',
        keywords: ['community support', 'xiriirka bulshada', 'family', 'resilience']
      },
      {
        id: 'mw-5',
        en: 'How can families open supportive conversations about anxiety and sadness without judgment or stigma?',
        so: 'Sidee qoysasku u furi karaan wadahadal taageero leh oo ku saabsan walwalka iyo murugada iyadoo aan qofka la ceebayn?',
        keywords: ['mental health stigma', 'ceebaynta', 'sadness', 'murugada', 'anxiety']
      },
      {
        id: 'mw-6',
        en: 'How does daily physical activity or outdoor morning sunlight improve mood and reduce mental fatigue?',
        so: 'Sidee dhaqdhaqaaqa jirka ama qorraxda subaxdii u wanaajiyaan niyadda ayna u yareeyaan daalka maskaxda?',
        keywords: ['mood', 'niyadda', 'sunlight', 'qorraxda subax', 'exercise']
      },
      {
        id: 'mw-7',
        en: 'What healthy coping techniques help individuals process the difficult emotions of grief and loss?',
        so: 'Waa maxay hababka caafimaadka qaba ee qofka ka caawin kara maaraynta murugada daran marka uu ehel ka geeriyoodo?',
        keywords: ['grief', 'geerida', 'tiiraanyo', 'coping', 'loss']
      },
      {
        id: 'mw-8',
        en: 'What signs indicate that sadness, depression, or overwhelming worry warrants seeing a doctor or counselor?',
        so: 'Waa maxay calaamadaha muujinaya in murugada ama walwalka badan uu u baahan yahay talo dhaqtar ama la-taliye?',
        keywords: ['when to seek help', 'la-talin caafimaad', 'depression', 'counselor']
      },
      {
        id: 'mw-9',
        en: 'How can practicing gratitude, spiritual prayer (du\'a/salaad), and quiet reflection bring mental peace?',
        so: 'Sidee ku mahad-naqidda, ducada, salaadda, iyo fekerka deggen u keenaan nabad galka maskaxda?',
        keywords: ['gratitude', 'salaad', 'duco', 'spiritual peace', 'xasilooni']
      },
      {
        id: 'mw-10',
        en: 'How can caregivers taking care of sick relatives prevent caregiver burnout and look after their own health?',
        so: 'Sidee qofka daryeela bukaanka ugu ilaalin karaa naftiisa daalka badan (caregiver burnout)?',
        keywords: ['caregiver burnout', 'daryeelka bukaanka', 'self-care', 'daal']
      }
    ]
  }
];

// Helper to get total question count
export const TOTAL_EXAMPLE_QUESTIONS_COUNT = HEALTH_CATEGORIES.reduce(
  (sum, cat) => sum + cat.questions.length,
  0
);
