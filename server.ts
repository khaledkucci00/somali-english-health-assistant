import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

/**
 * Strips all Markdown formatting symbols such as ##, **, ---, *, _, `, etc.
 * Requirement 12: Return clean plain text without visible Markdown symbols such as ##, **, or ---.
 */
function cleanPlainText(raw: string): string {
  if (!raw) return "";

  let text = raw;

  // Remove markdown headers: e.g. "### Heading" -> "HEADING"
  text = text.replace(/^#{1,6}\s*([^\n]+)/gim, (_, match) => {
    return `${match.trim().toUpperCase()}`;
  });

  // Remove triple asterisks/underscores
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "$1");
  text = text.replace(/___([^_]+)___/g, "$1");

  // Remove bold/italic asterisks: e.g. **text** -> text, *text* -> text
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");

  // Remove underscores: e.g. __text__ -> text, _text_ -> text
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");

  // Remove horizontal rules: ---, ***, ___, ===
  text = text.replace(/^[ \t]*[-*_=\s]{3,}[ \t]*$/gm, "");

  // Remove markdown backticks: `code` or ```block```
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```/g, "");
  });
  text = text.replace(/`([^`]+)`/g, "$1");

  // Remove markdown links [text](url) -> text (url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

  // Clean bullet point symbols to simple hyphen
  text = text.replace(/^\s*[\*\+]\s+/gm, "- ");

  // Remove any remaining stray asterisks or hashes
  text = text.replace(/[*#]/g, "");

  // Remove excessive consecutive blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/**
 * Basic emergency keyword scanner to flag acute medical emergencies
 */
function checkEmergencyKeywords(input: string): boolean {
  const lower = input.toLowerCase();
  const emergencyTerms = [
    "chest pain", "laab xanuun", "wadne xanuun", "heart attack", "wadna-istaag",
    "can't breathe", "cannot breathe", "severe shortness of breath", "neefta igu dhagtay", "dhuunta",
    "stroke", "faalig", "paralyzed", "qayb ka mid ah jirka oo dhimatay",
    "heavy bleeding", "dhiig badan", "unconscious", "miir daboolmay", "suuxay",
    "poison", "sun", "anaphylaxis", "choking", "saxiibkay neefta", "head injury",
    "convulsion", "suuxdin", "seizure"
  ];

  return emergencyTerms.some((term) => lower.includes(term));
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    name: "Somali English Health Assistant",
  });
});

// Chat API endpoint
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, languageMode = "both", categoryHint, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "A message is required." });
      return;
    }

    const trimmedMessage = message.trim();
    const isEmergency = checkEmergencyKeywords(trimmedMessage);

    const client = getGeminiClient();

    // Prepare system instructions with strict medical and language safety guardrails
    const systemInstruction = `
You are the "Somali English Health Assistant", an educational health assistant developed to serve bilingual communities in English and Somali (Af-Soomaali).

PRIMARY DIRECTIVE: PROVIDE DIRECT, HIGH-QUALITY HEALTH EDUCATION
When a user asks a specific health education question, DIRECTLY answer the question with accurate, concise, evidence-based educational information.
- If asked about symptoms (e.g., dehydration, diabetes, hypertension, stroke, malaria): Clearly list the common signs and symptoms.
- If asked about prevention or healthy living: Provide practical, actionable steps (nutrition, hydration, sanitation, exercise, hygiene).
- If asked about child or maternal health: Provide clear, supportive, medically sound guidelines.
- Do NOT provide only generic disclaimers or vague meta-commentary. Answer the user's specific health inquiry directly and informatively first!

CRITICAL MEDICAL & SAFETY RULES:
1. EDUCATIONAL INFORMATION ONLY: Provide general health facts, anatomy, prevention, symptom awareness, and wellness education.
2. DO NOT DIAGNOSE: Never state that the user or any individual has a specific disease or condition. Frame symptoms objectively (e.g., "Common symptoms of dehydration include..." rather than "You are dehydrated").
3. DO NOT PRESCRIBE OR RECOMMEND MEDICATION DOSES: Do not mention specific drug dosages (milligrams, number of tablets, or dosing schedules). If discussing medications generally, emphasize that medications must be prescribed and dosed by a qualified physician.
4. RECOMMEND PROFESSIONAL MEDICAL CARE: Conclude educational answers by recommending that the user consult a licensed doctor, nurse, or community clinic for clinical diagnosis, testing, and personalized care.
5. URGENT WARNING SIGNS: Explicitly highlight serious red-flag warning signs that require immediate urgent or emergency hospital attention (e.g., inability to retain fluids, confusion, high persistent fever, extreme lethargy, severe chest pain).
6. MEDICAL CONSISTENCY & NATURAL PHRASING:
   - English and Somali answers must be completely consistent in medical facts and quality.
   - The Somali text must be natural, respectful, and clear (Af-Soomaali fudud oo qeexan).
7. PLAIN TEXT FORMATTING ONLY:
   - Do NOT use asterisks: do NOT output **bold** or *italic*.
   - Do NOT use hash symbols: do NOT output # or ## or ###.
   - Do NOT use horizontal rules: do NOT output --- or ***.
   - Do NOT use backticks or code blocks.
   - Use clean plain text. For section headings, use simple uppercase words followed by a colon (e.g., "ENGLISH:", "AF-SOOMAALI:", "COMMON SYMPTOMS:", "HEALTH EDUCATION & CARE:", "WHEN TO SEE A DOCTOR:").
   - Use a simple hyphen ("- ") for list items.

LANGUAGE MODES:
- Mode 'en': Provide the direct, detailed educational answer in English only.
- Mode 'so': Provide the direct, detailed educational answer in Somali (Af-Soomaali) only.
- Mode 'both': Provide two structured sections:
  ENGLISH:
  [Direct, informative answer with specific facts, symptoms/recommendations, and clinical referral advice]

  AF-SOOMAALI:
  [Medically identical, natural Somali translation with matching facts, symptoms/recommendations, and clinical referral advice]

${categoryHint ? `Context Category: ${categoryHint}` : ""}
`.trim();

    // If Gemini client is available, call Gemini 3.8-flash
    if (client) {
      try {
        // Construct conversation turns for Gemini
        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        // Include recent history (up to last 6 turns)
        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history.slice(-6);
          for (const item of recentHistory) {
            contents.push({
              role: item.role === "assistant" ? "model" : "user",
              parts: [{ text: item.content }],
            });
          }
        }

        // Current message with language mode specification
        const promptWithMode = `[User Language Mode: ${languageMode}]\nQuestion: ${trimmedMessage}`;
        contents.push({
          role: "user",
          parts: [{ text: promptWithMode }],
        });

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.2, // Low temperature for high factual accuracy and direct answering
          },
        });

        const rawText = response.text || "";
        const cleanText = cleanPlainText(rawText);

        res.json({
          reply: cleanText,
          languageMode,
          isPotentialEmergency: isEmergency,
        });
        return;
      } catch (geminiError: any) {
        console.error("Gemini API call failed, generating educational fallback:", geminiError);
        // Fall back gracefully to structured topic-specific educational response
      }
    }

    // Graceful offline/educational fallback if API key not available or transient error
    const fallback = generateEducationalFallback(trimmedMessage, languageMode, isEmergency);
    res.json({
      reply: cleanPlainText(fallback),
      languageMode,
      isPotentialEmergency: isEmergency,
    });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again or consult a healthcare professional.",
    });
  }
});

/**
 * Topic-grounded educational fallback generator providing direct, concise,
 * medically consistent answers even when offline or before API key attachment.
 */
function generateEducationalFallback(
  question: string,
  mode: "en" | "so" | "both",
  isEmergency: boolean
): string {
  const qLower = question.toLowerCase();

  // Helper for emergency warning prefix
  const emergencyEn = isEmergency
    ? "EMERGENCY SAFETY NOTICE:\nIf you or someone nearby is experiencing acute chest pain, severe breathing difficulty, sudden weakness, or heavy bleeding, go to the nearest emergency medical facility immediately.\n\n"
    : "";

  const emergencySo = isEmergency
    ? "OGEYSIIS DEGDEG AH EE BADBAADADA:\nHaddii adiga ama qof kugu dhow uu dareemayo xanuun daran oo laabta ah, neefta oo ku dhagta, dhiig-bax daran, ama daciifnimo degdeg ah, fadlan degdeg u tag isbitaalka ugu dhow.\n\n"
    : "";

  let enContent = "";
  let soContent = "";

  // 1. Dehydration (Fuuq-bax)
  if (qLower.includes("dehydrat") || qLower.includes("fuuq") || qLower.includes("thirst") || qLower.includes("harraad")) {
    enContent = `${emergencyEn}HEALTH EDUCATION: DEHYDRATION

Common Symptoms of Dehydration:
- Mild to Moderate: Dry mouth and sticky tongue, increased thirst, dark yellow or amber-colored urine, reduced urination, mild headache, and feeling fatigued or lightheaded.
- In Infants and Young Children: Dry mouth, crying without tears, no wet diapers for 3 or more hours, sunken eyes, sunken soft spot (fontanelle) on top of the head, and unusual irritability or sleepiness.
- Severe Danger Signs: Extreme thirst, dizziness or fainting upon standing, confusion, rapid heart rate, very dark urine or no urine output, and skin that does not bounce back when pinched.

General Management & Prevention:
- Drink clean, safe drinking water steadily throughout the day.
- For fluid loss from diarrhea or vomiting, use Oral Rehydration Salts (ORS) mixed in clean water, or clean broths.
- Avoid sugary sodas or caffeinated drinks, which can worsen fluid loss.

When to Seek Medical Care:
Consult a healthcare provider promptly if vomiting prevents keeping fluids down, if diarrhea persists for more than 24 to 48 hours, or if an infant shows any signs of dehydration.`;

    soContent = `${emergencySo}WAXBARASHADA CAAFIMAADKA: FUUQ-BAXA (DEHYDRATION)

Calaamadaha Caadiga ah ee Fuuq-baxa:
- Calaamadaha Fudud ilaa Dhexdhexaad: Af-engeg iyo carrabka oo qallala, harraad daran, kaadida oo soo yaraata ama midabkeedu noqdo madow/huruud mugdi ah, madax-xanuun fudud, iyo daal ama wareer.
- Carruurta iyo Dhallaanka: Afka oo qallala, oohin aan ilmo lahayn, xafaayadda (diapers) oo aan qoyaan lahayn 3 saacadood ama ka badan, indhaha oo godgala, barta jilicsan ee madaxa (bogoxda) oo hoos u dhacda, iyo ilmaha oo aad u lulmooda ama xanaaq badan.
- Calaamadaha Halista ah: Harraad xad-dhaaf ah, dawakhaad qofku ku dhici karo marka uu istaago, wareer maskaxeed, garaaca wadnaha oo kordha, iyo maqaarka oo dib u noqon waaya marka la qanjiro.

Ka-hortagga iyo Daryeelka:
- Cab biyo nadiif ah oo badbaado leh maalintii oo dhan.
- Haddii fuuq-baxu ka dhashay shuban ama matag, isticmaal xalka fuuq-celinta (ORS) ee lagu qasay biyo nadiif ah.
- Ka fogow cabbitaannada sonkorta badan leh ee fuuq-baxa sii kordhin kara.

Goorma ayaa Dhaqtar la Aadaa:
Degdeg ula xiriir dhaqtar ama xarun caafimaad haddii mataggu diido in biyaha la ceshado, haddii shubanku socdo wax ka badan 24 ilaa 48 saacadood, ama haddii ilmo yar lagu arko calaamadaha fuuq-baxa.`;
  }
  // 2. High Blood Pressure / Hypertension (Dhiig-kar)
  else if (qLower.includes("blood pressure") || qLower.includes("hypertension") || qLower.includes("dhiig-kar") || qLower.includes("dhiig kar")) {
    enContent = `${emergencyEn}HEALTH EDUCATION: HIGH BLOOD PRESSURE (HYPERTENSION)

Understanding Blood Pressure:
- High blood pressure occurs when the force of blood flowing through your blood vessels is consistently too high.
- It is often called a "silent condition" because most people experience no visible symptoms until complications arise.
- When blood pressure is severely elevated, some individuals may experience severe headaches, shortness of breath, nosebleeds, or visual changes.

Daily Habits to Support Healthy Blood Pressure:
- Reduce Sodium: Moderate salt and processed seasonings (such as bouillon cubes) in cooking.
- Balanced Diet: Eat plenty of fresh vegetables, beans, whole grains, and lean proteins while minimizing fried foods.
- Regular Physical Activity: Aim for 30 minutes of brisk walking or moderate exercise most days.
- Weight Management & Stress Relief: Practice gentle movement, deep breathing, and adequate sleep.
- Avoid Tobacco: Smoking and shisha narrow arteries and rapidly raise blood pressure.

When to Seek Medical Care:
Have your blood pressure checked regularly at a clinic. If you have been diagnosed with hypertension, take all medications exactly as directed by your physician and never stop without medical consultation.`;

    soContent = `${emergencySo}WAXBARASHADA CAAFIMAADKA: DHIIG-KARKU (HYPERTENSION)

Fahamka Dhiig-karka:
- Dhiig-karku wuxuu dhacaa marka awoodda dhiiggu ku marayo xididdada jirka ay si joogto ah u sarreyso.
- Waxaa badanaa loogu yeeraa "dilaaga aamusan" maxaa yeelay dadka badankood ma dareemaan calaamado cad ilaa uu dhibaato geysto mooyee.
- Marka dhiiggu aad u kaco, calaamadaha waxaa ka mid noqon kara madax-xanuun daran, neefta oo yaraata, dhiig sanka ka yimaada, ama aragga oo qasma.

Caadooyinka lagu Ilaalin karo Dhiig-karka:
- Yaree Milixda: Yaree milixda iyo maraqa xabadka ah (bouillon cubes) ee cuntada lagu karsado.
- Cunto Dheellitiran: Cun khudaar badan, digir, heedaar, iyo cuntooyin dabiici ah; yaree saliidda iyo cuntooyinka shiilan.
- Dhaqdhaqaaq Joogto ah: Samee ugu yaraan 30 daqiiqo oo socod firfircoon ah maalmaha badankood.
- Iska Ilaali Sigaarka iyo Shiishadda: Qiiqa tubaakadu wuxuu dhuubiyaa xididdada dhiigga wuxuuna kiciyaa wadne-garaaca.

Goorma ayaa Dhaqtar la Aadaa:
U tag xarun caafimaad si joogto ah si dhiiggaaga loo cabbiro. Haddii dhaqtar kuu xaqiijiyay dhiig-kar, qaado dawooyinkaaga sida laguu qoray hana joojin adigoon dhaqtarka la tashan.`;
  }
  // 3. Diabetes & Blood Sugar (Sonkorow)
  else if (qLower.includes("diabetes") || qLower.includes("sugar") || qLower.includes("sonkor") || qLower.includes("glucose")) {
    enContent = `${emergencyEn}HEALTH EDUCATION: TYPE 2 DIABETES & BLOOD SUGAR

Warning Signs of Elevated Blood Sugar:
- Frequent urination, especially waking up multiple times at night to urinate.
- Persistent, excessive thirst and dry mouth despite drinking water.
- Constant unexplained hunger and unintended weight loss.
- Fatigue, blurry vision, and slow-healing cuts or sores.
- Tingling, numbness, or burning sensation in the feet or hands.

Preventive Habits & Lifestyle Support:
- Limit Refined Sugars: Cut back on sweetened tea (shaah cadaysan), sodas, fruit cordials, and pastries.
- Choose Whole Foods: Prioritize vegetables, lentils, beans, whole grains, and lean proteins over simple refined starches.
- Keep Active: Regular daily walking improves how cells respond to insulin and helps lower blood glucose.
- Foot Care: Inspect feet daily for cuts, blisters, or swelling.

When to Consult a Physician:
See a doctor for a fasting blood glucose or HbA1c test if you observe warning signs. Do not start or modify diabetes medications without direct physician supervision.`;

    soContent = `${emergencySo}WAXBARASHADA CAAFIMAADKA: SONKOROWGA (DIABETES)

Calaamadaha Digniinta ah ee Sonkorta Kacsan:
- Kaadi badan oo joogto ah, gaar ahaan habeenkii oo marar badan la kaco.
- Harraad xad-dhaaf ah iyo afka oo qallala xitaa marka biyo la cabbo kadib.
- Gaajo joogto ah iyo miisaanka jirka oo si lama filaan ah hoos ugu dhaca.
- Daal badan, aragga oo caad galo, iyo dhaawacyada ama boogaha oo si tartiib ah u bogsada.
- Dareen kabuubyo ama qaniinyo ah oo laga dareemo cagaha iyo gacmaha.

Talooyinka Ka-hortagga iyo Nolosha Caafimaadka leh:
- Yaree Sonkorta: Yaree shaaha aadka loo macaanayey, cabbitaannada qasacadaysan, iyo macmacaanka.
- Dooro Cuntooyin Dabiici ah: Cun khudaar badan, digir, cambuulo, iyo cuntooyin heedaar leh halkii aad ka cuni lahayd burcadcad kaliya.
- Dhaqdhaqaaq Samee: Socodka maalinlaha ah wuxuu caawiyaa in jirku si fiican u isticmaalo sonkorta dhiigga.
- Daryeelka Cagaha: Maalin kasta kormeero cagahaaga si aad u aragto haddii ay jiraan nabarro ama barar.

Goorma ayaa Dhaqtar la Aadaa:
U tag xarun caafimaad si laguu baaro dhiigga (baaritaanka sonkorta) haddii aad isku aragto calaamadahan. Ha bilaabin dawooyin adigoon dhaqtar la tashan.`;
  }
  // 4. Breastfeeding & Infant Care (Naas-nuujin & Dhallaanka)
  else if (qLower.includes("breastfeed") || qLower.includes("naas") || qLower.includes("infant") || qLower.includes("baby") || qLower.includes("dhal")) {
    enContent = `${emergencyEn}HEALTH EDUCATION: BREASTFEEDING & INFANT WELLNESS

Benefits of Exclusive Breastfeeding (First 6 Months):
- Complete Nutrition: Breast milk provides all the nutrients, enzymes, and water an infant needs for the first six months of life.
- Immune Protection: Contains maternal antibodies that shield the baby against diarrhea, pneumonia, and ear infections.
- Safe and Hygienic: Always clean, at the right temperature, and readily available without risk of contaminated water.
- Maternal Health: Helps the uterus contract after childbirth and fosters a strong emotional bond.

Practical Guidance for Nursing Mothers:
- Frequent Feedings: Nurse on demand (usually 8 to 12 times in 24 hours for newborns).
- Mother's Hydration & Diet: Drink plenty of clean water, milk, and nutritious broths; eat balanced meals with iron and protein.
- Umbilical Cord Care: Keep the cord stump clean and dry; do not apply ash, dirt, or unprescribed oils.

When to Seek Medical Care:
Consult a healthcare worker if the baby has difficulty latching, is not gaining weight, produces fewer than 6 wet diapers a day, develops yellowing skin/eyes (jaundice), or if the mother develops breast pain, redness, and fever (mastitis).`;

    soContent = `${emergencySo}WAXBARASHADA CAAFIMAADKA: NAAS-NUUJINTA IYO DARYEELKA DHALLAANKA

Faa’iidooyinka Naas-nuujinta Keliya (6-da Bilood ee Hore):
- Nafaqo Dhammaystiran: Caanaha hooyadu waxay leeyihiin dhammaan nafaqada, biyaha, iyo fiitamiinnada uu ilmuhu u baahan yahay lixda bilood ee ugu horreeya.
- Difaaca Jirka: Waxay leeyihiin unugyo difaac ah (antibodies) oo ilmaha ka ilaaliya shubanka, oof-wareenka, iyo caabuqa dhegaha.
- Nadiif iyo Badbaado: Had iyo jeer waa kuwo nadiif ah, heerkulkoodu dheellitiran yahay, oo aan u baahnayn biyo kale oo jeermis laga yaabo inuu ku jiro.
- Caafimaadka Hooyada: Waxay hooyada ka caawisaa in ilmo-galeenku si degdeg ah u soo noqdo waxayna xoojisaa kalgacalka hooyada iyo ilmaha.

Talooyin Muhiim ah:
- Nuuji Mar Kasta: Ilmaha nuuji marka uu rabo (qiyaastii 8 ilaa 12 jeer 24-kii saacba).
- Biyaha iyo Cuntada Hooyada: Cab biyo nadiif ah oo ku filan, caano, iyo maraq nafaqo leh; cun cuntooyin kala duwan.
- Daryeelka Xuddunta: Xuddunta ilmaha dhashay ku hay meel nadiif ah oo qallalan; ha marin dambas, ciid, ama saliid aan laguu qorin.

Goorma ayaa Dhaqtar la Aadaa:
U tag xarun caafimaad haddii ilmuhu naaska qaban waayo, haddii miisaankiisu kordhi waayo, haddii xafaayaddiisu qoyaan weydo, ama haddii hooyadu isku aragto qandho iyo naas-xanuun daran.`;
  }
  // 5. Malaria & Mosquito Prevention (Duumo / Mallaariyo)
  else if (qLower.includes("malaria") || qLower.includes("mosquito") || qLower.includes("duumo") || qLower.includes("mallaariyo") || qLower.includes("kaneeco")) {
    enContent = `${emergencyEn}HEALTH EDUCATION: MALARIA AWARENESS & PREVENTION

Understanding Malaria:
- Malaria is a parasitic infection transmitted through the bite of infected female Anopheles mosquitoes.
- Common Symptoms: High fever, shaking chills, profuse sweating, severe headache, muscle aches, nausea, and vomiting.
- Symptoms often appear 7 to 15 days after an infected mosquito bite.

Key Prevention Practices:
- Sleep Under Insecticide-Treated Nets (ITNs): Ensure every family member, especially pregnant women and young children, sleeps under a treated bed net every night.
- Eliminate Standing Water: Empty or cover open water basins, tires, and puddles around the home where mosquitoes breed.
- Protective Clothing: Wear long sleeves and trousers during dusk and dawn when mosquitoes are most active.

When to Seek Medical Care:
Any unexplained fever in a malaria-endemic region requires an immediate clinic visit for a Rapid Diagnostic Test (RDT) or blood smear. Do not delay, as malaria can progress quickly to severe illness if untreated.`;

    soContent = `${emergencySo}WAXBARASHADA CAAFIMAADKA: DUUMADA (MALARIA) IYO KA-HORTAGGEEDA

Fahamka Duumada:
- Duumadu waa cudur dulin ah oo ay keento qaniinyada kaneecada nooca dheddigga ah (Anopheles).
- Calaamadaha Caadiga ah: Qandho aad u kulul, gariir daran oo qabow ah, dhidid badan, madax-xanuun, xanuun murqaha ah, lallabbo, iyo matag.
- Calaamaduhu waxay badanaa soo baxaan 7 ilaa 15 maalmood kadib marka kaneecadu qofka qaniinto.

Hababka Ka-hortagga:
- Ku Seexo Maro-kaneeco Daaweysan: Hubi in dhammaan xubnaha qoyska, gaar ahaan dumarka uurka leh iyo carruurtu, ay habeen kasta ku seexdaan maro-kaneeco.
- Baabi'i Biyaha Fariista: Daadi ama dabool dhammaan weelasha iyo godadka biyuhu fariistaan ee guriga agtiisa ah, meeshaas oo kaneecadu ku taranto.
- Dhar Jirka Daboola: Xiro dhar gacmo-dheer leh gaar ahaan xilliga gabbalku dhaco iyo waaberiga.

Goorma ayaa Dhaqtar la Aadaa:
Qof kasta oo qandho isku arka aagagga duumada laga helo waa inuu degdeg u tago xarun caafimaad si looga baaro dhiigga. Ha dhayalsan maxaa yeelay duumadu waxay noqon kartaa mid halis ah haddii aan degdeg loo daweyn.`;
  }
  // 6. Stroke Symptoms & FAST (Faalig)
  else if (qLower.includes("stroke") || qLower.includes("faalig") || qLower.includes("fast") || qLower.includes("paraly")) {
    enContent = `${emergencyEn}HEALTH EDUCATION: STROKE RECOGNITION (THE F.A.S.T. RULE)

What is a Stroke:
- A stroke occurs when blood flow to part of the brain is blocked by a clot or a ruptured blood vessel, depriving brain cells of oxygen.
- A stroke is a medical emergency where every minute counts.

The F.A.S.T. Warning Signs:
- F (Face Drooping): Does one side of the face droop or feel numb? Ask the person to smile.
- A (Arm Weakness): Is one arm weak or numb? Ask the person to raise both arms. Does one drift downward?
- S (Speech Difficulty): Is speech slurred, strange, or difficult to understand? Ask the person to repeat a simple sentence.
- T (Time to Call Emergency): If you observe any of these signs, seek emergency hospital care immediately.

Additional Sudden Symptoms:
- Sudden confusion or trouble understanding speech.
- Sudden loss of vision in one or both eyes.
- Sudden severe headache with no known cause.
- Sudden difficulty walking, loss of balance, or dizziness.

Emergency Action:
Immediately transport the individual to the nearest hospital emergency department or call local emergency responders. Do not give food, water, or aspirin until evaluated by doctors.`;

    soContent = `${emergencySo}WAXBARASHADA CAAFIMAADKA: CALAAMADAHA FAALIGGA (STROKE)

Waa Maxay Faaliggu:
- Faaliggu wuxuu dhacaa marka dhiigga tagaya qayb ka mid ah maskaxda uu xirmo xinjir dartiis ama uu dhiig ka furmo maskaxda, taas oo horseedda in unugyada maskaxdu waayaan ogsajiin.
- Faaliggu waa xaalad degdeg ah oo daqiiqad kasta ay qiimo leedahay.

Xeerka F.A.S.T. ee lagu Garto Faaligga:
- F (Face / Wejiga): Miyaa dhinac ka mid ah wejiga uu qaloocsamay ama dubaaxiyey? Weydii qofka inuu dhoolla-caddeeyo.
- A (Arm / Gacanta): Gacan miyaa daciiftay oo hoos u dhacaysa marka labada gacmood kor loo qaado?
- S (Speech / Hadalka): Hadalku miyuu culus yahay, qasman yahay, mise qofku hadli kari waayay?
- T (Time / Waqtiga): Haddii aad aragto calaamadahan, degdeg u raadi gargaar caafimaad oo degdeg ah.

Calaamado Kale oo Degdeg ah:
- Jahawareer degdeg ah ama fahmidda hadalka oo dhib noqota.
- Aragga oo si kedis ah labada indhood ama midkood kaga luma.
- Madax-xanuun daran oo degdeg ku yimaada.
- Socodka oo qofka ku adkaata ama dheellitirka jirka oo luma.

Tallaabada Degdegga ah:
Degdeg qofka u gee isbitaalka kuugu dhow. Ha siin biyo, cunto, ama dawooyin ka hor inta aan dhaqtar baarin.`;
  }
  // 7. General Structured Fallback for other questions
  else {
    enContent = `${emergencyEn}HEALTH EDUCATION GUIDANCE

Educational Overview:
Regarding your question about "${question}":
- Health education provides foundational facts about biology, disease prevention, and evidence-based self-care.
- Many health symptoms share common overlapping causes, ranging from mild temporary imbalances (such as dehydration, nutritional gaps, or fatigue) to conditions that require clinical assessment.

Key Educational Recommendations:
- Maintain Adequate Hydration: Drink clean, safe water throughout the day to support organ function.
- Nutritious Balanced Diet: Emphasize wholesome vegetables, legumes, whole grains, and lean proteins while minimizing excessive refined sugars and saturated fats.
- Rest & Recovery: Prioritize consistent sleep (7-8 hours for adults) and regular moderate physical movement.
- Personal & Environmental Hygiene: Wash hands thoroughly with soap and water before handling food and after using sanitary facilities.

When to Consult a Healthcare Professional:
Always consult a licensed medical doctor, physician assistant, or local health clinic for an accurate physical examination, diagnostic tests, and tailored clinical guidance. If you experience severe, persistent, or worsening symptoms, seek professional care without delay.`;

    soContent = `${emergencySo}HAGARTA WAXBARASHADA CAAFIMAADKA

Fahamka Guud ee Waxbarashada:
Ku saabsan su'aashaada ku saabsan "${question}":
- Waxbarashada caafimaadku waxay bixisaa aqoon aasaasi ah oo ku saabsan shaqada jirka, ka-hortagga cudurrada, iyo hab-nololeedka wanaagsan.
- Calaamado badan oo jirka ah waxay yeelan karaan sababo kala duwan, laga bilaabo daal iyo fuuq-bax fudud ilaa xaalado u baahan baaritaan toos ah.

Talooyinka Caafimaadka ee Muhiimka ah:
- Cab Biyo Ku Filan: Biyo nadiif ah cab si joogto ah maalintii oo dhan si jirkaagu u helo qoyaan ku filan.
- Cunto Dheellitiran: Ahmiyadda sii khudaarta, digirta, heedaarka, iyo cuntooyinka dabiiciga ah; yaree sonkorta badan iyo saliidda xad-dhaafka ah.
- Hurdo iyo Nasasho: Seexo hurdo ku filan (7 ilaa 8 saacadood) oo samee socod ama jimicsi fudud.
- Nadaafadda Guud: Gacmahaaga ku dhaq saabuun iyo biyo nadiif ah cuntada ka hor iyo suuliga kadib.

Goorma ayaa Dhaqtar la Aadaa:
Mar kasta la xiriir dhaqtar ama xarun caafimaad oo ku dhow si laguu baaro lagunaugu xaqiijiyo xaaladdaada caafimaad. Haddii aad dareento calaamado kugu sii kordhaya ama dhibaato daran, ha dib dhigin booqashada xarun caafimaad.`;
  }

  if (mode === "en") {
    return enContent;
  } else if (mode === "so") {
    return soContent;
  } else {
    return `ENGLISH:
${enContent}

AF-SOOMAALI:
${soContent}`;
  }
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Somali English Health Assistant running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
