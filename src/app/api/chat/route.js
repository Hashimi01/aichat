import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing Google API Key');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// المعلومات المضافة حديثاً
const LANGUAGE_PATTERNS = {
  ar: /[\u0600-\u06FF]/,
  en: /^[A-Za-z\s.,!?-]+$/,
  fr: /[àâäéèêëîïôöùûüÿçœæ]/i,
  zh: /[\u4e00-\u9fff]/,
  es: /[áéíóúñ¿¡]/i,
  de: /[äöüß]/i,
  ru: /[\u0400-\u04FF]/,
  ja: /[\u3040-\u30ff\u4e00-\u9fff]/,
  ko: /[\uAC00-\uD7AF\u1100-\u11FF]/,
  hi: /[\u0900-\u097F]/
};

const COMPANY_INFO = {
  ar: `مرحباً! شركة هاشمي تأسست في 2023-04-07 في موريتانيا (النواكشوط). مهمتها إنشاء تطبيقات حديثة تساعد الناس في مجالات التكنولوجيا وخاصة البرمجة. رؤيتها تطمح لتوسيع أعمالها لتشمل استخدام منتجاتها في الأجهزة والأنظمة المستخدمة يوميًا مثل المستشفيات، المترو، المطارات وغيرها. نقدم خدمات إنشاء مواقع وتطبيقات وإنجاز مشاريع برمجية ضخمة. مؤسسنا، عبد الله محمد الهاشمي، يمتلك خبرة واسعة في مجالات البرمجة والذكاء الاصطناعي والفولستاك. للمزيد من المعلومات، تفضل بزيارة <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">هذا الرابط</a> أو راسلنا عبر البريد الإلكتروني: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  en: `Hello! Hashimi company was founded on 2023-04-07 in Mauritania (Nouakchott). Its mission is to create modern applications to help people in technology fields, especially programming. Its vision aims to expand its business to include the use of its products in daily-used devices and systems such as hospitals, metro, airports, and more. We offer website/app development services and large-scale programming projects. Our founder, Abdallah Mohamed Al Hashimi, has extensive experience in programming, AI, and full-stack development. For more information, please visit <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">this link</a> or contact us via email: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  fr: `Bonjour! La société Hashimi a été fondée le 2023-04-07 en Mauritanie (Nouakchott). Sa mission est de créer des applications modernes pour aider les gens dans divers domaines technologiques, en particulier la programmation. Sa vision est d'étendre ses activités pour inclure l'utilisation de ses produits dans des dispositifs et systèmes quotidiens. Pour plus d'informations, visitez <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">ce lien</a> ou contactez-nous par email: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  zh: `您好！Hashimi公司成立于2023-04-07，总部位于毛里塔尼亚（努瓦克肖特）。我们的使命是创建现代应用程序，帮助人们在技术领域，特别是编程方面。更多信息，请访问<a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">此链接</a>或通过电子邮件联系我们：<a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  es: `¡Hola! La empresa Hashimi fue fundada el 2023-04-07 en Mauritania (Nouakchott). Nuestra misión es crear aplicaciones modernas para ayudar a las personas en campos tecnológicos. Para más información, visite <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">este enlace</a> o contáctenos por email: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  de: `Hallo! Die Firma Hashimi wurde am 2023-04-07 in Mauretanien (Nouakchott) gegründet. Für weitere Informationen besuchen Sie <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">diesen Link</a> oder kontaktieren Sie uns per E-Mail: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  ru: `Здравствуйте! Компания Hashimi была основана 2023-04-07 в Мавритании (Нуакшот). Для получения дополнительной информации посетите <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">эту ссылку</a> или свяжитесь с нами по электронной почте: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  ja: `こんにちは！Hashimi社は2023-04-07に毛里塔尼アで設立されました。詳細については、<a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">このリンク</a>をご覧いただくか、<a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>までメールでお問い合わせください。`,
  ko: `안녕하세요! Hashimi 회사는 2023-04-07에 모리타니아에서 설립되었습니다. 자세한 내용은 <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">이 링크</a>를 방문하거나 이메일로 문의해 주세요: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`,
  hi: `नमस्ते! Hashimi कंपनी की स्थापना 2023-04-07 को मॉरिटानिया में हुई थी। अधिक जानकारी के लिए, कृपया <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">यह लिंक</a> देखें या हमें ईमेल करें: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.`
};

const DEVELOPER_INFO = {
  ar: "عبد الله محمد الهاشمي مبرمج متكامل وودود بخبرة واسعة في مجالات البرمجة، وخاصة الذكاء الاصطناعي والفولستاك.",
  en: "Abdallah Mohamed Al Hashimi is a full-stack developer with extensive experience in programming, particularly in artificial intelligence.",
  fr: "Abdallah Mohamed Al Hashimi est un développeur full-stack avec une vaste expérience en programmation, notamment en intelligence artificielle.",
  zh: "Abdallah Mohamed Al Hashimi 是一位全栈开发者，在编程领域（尤其是人工智能）拥有丰富经验。",
  es: "Abdallah Mohamed Al Hashimi is a full-stack developer with extensive experience in programming, especially in artificial intelligence.",
  de: "Abdallah Mohamed Al Hashimi ist ein Full-Stack-Entwickler mit umfangreicher Erfahrung in der Programmierung, insbesondere im Bereich der künstlichen Intelligenz.",
  ru: "Abdallah Mohamed Al Hashimi — разработчик full-stack с обширным опытом в программировании, особенно в области искусственного интеллекта.",
  ja: "Abdallah Mohamed Al Hashimi は、人工知能を含むプログラミング分野で豊富な経験を持つフルスタック開発者です。",
  ko: "Abdallah Mohamed Al Hashimi는 인공지능을 포함한 프로그래밍 분야에서 폭넓은 경험을 가진 풀스택 개발자입니다.",
  hi: "Abdallah Mohamed Al Hashimi एक फुल-स्टैक डेवलपर हैं, जिनके पास प्रोग्रामिंग, विशेष रूप से कृत्रिम बुद्धिमत्ता में व्यापक अनुभव है।"
};

const SELF_ANSWERS = {
  ar: "أنا نموذج لغوي كبير، تم تدريبي بواسطة شركة هاشمي",
  en: "I am a large language model, trained by Hashimi",
  fr: "Je suis un grand modèle de langage, entraîné par Hashimi",
  zh: "我是一个大型语言模型，由 Hashimi 训练",
  es: "Soy un gran modelo de lenguaje, entrenado por Hashimi",
  de: "Ich bin ein großes Sprachmodell, trainiert von Hashimi",
  ru: "Я большая языковая модель, обученная Hashimi",
  ja: "私はHashimiによって訓練された大規模な言語モデルです",
  ko: "저는 Hashimi에 의해 훈련된 대규모 언어 모델입니다",
  hi: "मैं एक विशाल भाषा मॉडल हूँ, जिसे Hashimi द्वारा प्रशिक्षित किया गया है"
};

const QUERY_PATTERNS = {
  self: {
    ar: /(من انت|من أنت|ما اسمك)/i,
    en: /(who are you|what'?s your name|what is your name)/i,
    fr: /(qui es[- ]tu|quel est ton nom)/i,
    zh: /(你是谁|你叫什么|你的名字是什么)/i,
    es: /(quién eres|cuál es tu nombre|cómo te llamas)/i,
    de: /(wer bist du|wie heißt du|wie ist dein name)/i,
    ru: /(кто ты|как тебя зовут)/i,
    ja: /(あなたは誰|お名前は|何という名前)/i,
    ko: /(당신은 누구|네 이름이 뭐야|당신의 이름은)/i,
    hi: /(आप कौन हैं|तुम्हारा नाम क्या है|आपका नाम क्या है)/i
  },
  contact: {
    ar: /(كيفية التواصل|كيفية الاتصال|تواصل|رابط)/i,
    en: /(contact|reach|email|get in touch)/i,
    fr: /(contact|joindre|email|courriel)/i,
    zh: /(联系|联络|邮件|电邮)/i,
    es: /(contacto|contactar|correo|email)/i,
    de: /(kontakt|erreichen|email|mail)/i,
    ru: /(контакт|связаться|почта|email)/i,
    ja: /(連絡|メール|問い合わせ)/i,
    ko: /(연락|이메일|문의)/i,
    hi: /(संपर्क|मेल|ईमेल)/i
  },
  developer: /عبد ?الله|abdullah|abdallah/i,
  company: /هاشمي|hashimi/i,
  trainer: {
    ar: /(من دربك|من علمك|من خلقك)/i,
    en: /(who trained you|who created you|who made you)/i,
    fr: /(qui t'a (formé|créé|fait))/i,
    zh: /(谁训练了你|谁创造了你|谁制造了你)/i,
    es: /(quién te (entrenó|creó|hizo))/i,
    de: /(wer hat dich (trainiert|erschaffen|gemacht))/i,
    ru: /(кто тебя (обучил|создал|сделал))/i,
    ja: /(誰が(作った|創った|訓練した))/i,
    ko: /(누가 (훈련시켰|만들었)나)/i,
    hi: /(किसने (बनाया|तैयार किया|प्रशिक्षित किया))/i
  }
};

const UNSUPPORTED_LANGUAGE_MESSAGES = {
  ar: "عذراً، أنا أفهم فقط اللغات التالية: العربية، الإنجليزية، الفرنسية، الصينية، الإسبانية، الألمانية، الروسية، اليابانية، الكورية، والهندية.",
  en: "I only understand the following languages: Arabic, English, French, Chinese, Spanish, German, Russian, Japanese, Korean, and Hindi.",
  fr: "Je ne comprends que les langues suivantes : arabe, anglais, français, chinois, espagnol, allemand, russe, japonais, coréen et hindi.",
  zh: "我只懂以下语言：阿拉伯语、英语、法语、中文、西班牙语、德语、俄语、日语、韩语和印地语。",
  es: "Solo entiendo los siguientes idiomas: árabe, inglés, francés, chino, español, alemán, ruso, japonés, coreano e hindi.",
  de: "Ich verstehe nur die folgenden Sprachen: Arabisch, Englisch, Französisch, Chinesisch, Spanisch, Deutsch, Russisch, Japanisch, Koreanisch und Hindi.",
  ru: "Я понимаю только следующие языки: арабский, английский, французский, китайский, испанский, немецкий, русский, японский, корейский и хинди.",
  ja: "私は次の言語のみ理解できます：アラビア語、英語、フランス語、中国語、スペイン語、ドイツ語、ロシア語、日本語、韩国語、ヒンディー語。",
  ko: "저는 다음 언어만 이해합니다: 아랍어, 영어, 프랑스어, 중국어, 스페인어, 독일어, 러시아어, 일본어, 한국어, 힌디어.",
  hi: "मैं केवल निम्नलिखित भाषाएं समझता हूं: अरबी, अंग्रेजी, फ्रेंच, चीनी, स्पेनिश, जर्मन, रूसी, जापानी, कोरियाई और हिंदी।"
};

const utils = {
  detectLanguage(text) {
    if (!text) return 'unknown';
    
    for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
      if (pattern.test(text)) return lang;
    }
    
    if (/^[A-Za-z0-9\s.,!?@#$%^&*()_+\-=:;'"/\[\]{}|\\<>]+$/.test(text)) {
      return 'en';
    }
    
    return 'unknown';
  },

  sanitizeMessage(message) {
    return message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();
  },

  getConversationHistory(messages) {
    const sliceCount = messages.length <= 1 ? 0 : messages.length <= 5 ? -5 : -10;
    return messages.slice(sliceCount).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
  },

  createSystemMessage(detectedLang) {
    return {
      role: 'system',
      parts: [{ 
        text: `System Instructions (Do not include in response):
1. ALWAYS respond ONLY in the detected language: ${detectedLang}
2. If asked about your creator or developer, always mention Hashimi company
3. Maintain natural conversational flow and use a friendly tone
4. Keep original terminology
5. Provide detailed, accurate responses
6. If the question is not in supported languages, do not provide any answer`
      }]
    };
  },

  replaceGoogleReferences(text, lang) {
    const replacements = {
      en: [
        { from: /trained by Google/gi, to: 'trained by Hashimi' },
        { from: /created by Google/gi, to: 'created by Hashimi' },
        { from: /developed by Google/gi, to: 'developed by Hashimi' }
      ],
      ar: [
        { from: /تم تدريبي بواسطة جوجل/g, to: 'تم تدريبي بواسطة شركة هاشمي' },
        { from: /تم إنشائي بواسطة جوجل/g, to: 'تم إنشائي بواسطة شركة هاشمي' },
        { from: /تم تطويري بواسطة جوجل/g, to: 'تم تطويري بواسطة شركة هاشمي' }
      ],
    };

    const langReplacements = replacements[lang] || replacements.en;
    return langReplacements.reduce((acc, { from, to }) => acc.replace(from, to), text);
  }
};

// نهاية الإضافات الجديدة

// الكود الموجود مسبقاً يبدأ هنا
// دالة لاكتشاف اللغة مع دعم المزيد من اللغات (يمكن تحديثها لاحقاً لاستخدام utils.detectLanguage)
const detectLanguageExisting = (text) => {
  const patterns = {
    ar: /[\u0600-\u06FF]/, // العربية
    en: /^[A-Za-z\s.,!?-]+$/, // الإنجليزية
    fr: /[àâäéèêëîïôöùûüÿçœæ]/i, // الفرنسية
    zh: /[\u4e00-\u9fff]/, // الصينية
    es: /[áéíóúñ¿¡]/i, // الإسبانية
    de: /[äöüß]/i, // الألمانية
    ru: /[\u0400-\u04FF]/, // الروسية
    ja: /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/, // اليابانية
    ko: /[\uAC00-\uD7AF\u1100-\u11FF]/, // الكورية
    hi: /[\u0900-\u097F]/, // الهندية
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang;
  }
  return 'en'; // الافتراضي الإنجليزية
};

// معلومات الشركة الموسعة بعدة لغات
const companyInfo = {
  ar: 'هاشمي هي شركة موريتانية تم تأسيسها عام 2023 بواسطة Abdellahi mohamed El hashimi',
  en: 'Hashimi is a Mauritanian company founded in 2023 by Abdellahi mohamed El hashimi',
  fr: 'Hashimi est une entreprise mauritanienne fondée en 2023 par Abdellahi mohamed El hashimi',
  zh: 'Hashimi 是一家于2023年由 Abdellahi mohamed El hashimi 创立的毛里塔尼亚公司',
  es: 'Hashimi es una empresa mauritana fundada en 2023 por Abdellahi mohamed El hashimi',
  de: 'Hashimi ist ein mauritaniisches Unternehmen, das 2023 von Abdellahi mohamed El hashimi gegründet wurde',
  ru: 'Hashimi – мавританская компания, основанная в 2023 году Abdellahi mohamed El hashimi',
  ja: 'Hashimiは2023年にAbdellahi mohamed El hashimiによって設立されたモーリタニアの会社です',
  ko: 'Hashimi는 2023년 Abdellahi mohamed El hashimi에 의해 설립된 모리타니아 회사입니다',
  hi: 'Hashimi 2023 में Abdellahi mohamed El hashimi द्वारा स्थापित एक मॉरिटानियाई कंपनी है'
};

// معلومات التواصل مع الشركة بعدة لغات
const companyContactInfo = {
  ar: 'يمكنك التواصل مع شركة هاشمي عبر <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">هذا الرابط</a> أو عبر البريد الإلكتروني: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  en: 'You can contact Hashimi company via <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">this link</a> or by email: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  fr: 'Vous pouvez contacter la société Hashimi via <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">ce lien</a> ou par e-mail: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  zh: '您可以通过<a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">此链接</a>或发送邮件至<a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>联系Hashimi公司。',
  es: 'You can contact Hashimi company via <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">this link</a> or by email: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  de: 'Sie können die Hashimi Firma über <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">diesen Link</a> oder per E-Mail unter <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a> kontaktieren.',
  ru: 'Вы можете связаться с компанией Hashimi через <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">эту ссылку</a> или по электронной почте: <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>.',
  ja: 'Hashimi社へのお問い合わせは、<a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">こちらのリンク</a>またはメールで<a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>までご連絡ください。',
  ko: 'Hashimi 회사에 연락하려면 <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">이 링크</a> 또는 이메일 <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a>을 이용하세요.',
  hi: 'आप Hashimi कंपनी से <a href="https://profill-puce.vercel.app/#contact" target="_blank" rel="noopener noreferrer">इस लिंक</a> के माध्यम से या <a href="mailto:hashimielhashimi@gmail.com" target="_blank" rel="noopener noreferrer">hashimielhashimi@gmail.com</a> पर ईमेल द्वारा संपर्क कर सकते हैं।'
};

// معلومات عن عبد الله (بجانب الوصف العام) بعدة لغات
const abdullahAnswers = {
  ar: 'عبد الله هو مطور متكامل ذو خبرة واسعة، جاهز دائمًا لتقديم أفضل الحلول.',
  en: 'Abdullah is a skilled full-stack developer with extensive experience, always ready to deliver top-notch solutions.',
  fr: 'Abdullah est un développeur full-stack compétent avec une vaste expérience, toujours prêt à fournir des solutions de premier ordre.',
  zh: 'Abdullah 是一位全栈开发者，拥有丰富经验，总是准备提供一流的解决方案。',
  es: 'Abdullah is a skilled full-stack developer with extensive experience, always ready to deliver top-notch solutions.',
  de: 'Abdullah ist ein erfahrener Full-Stack-Entwickler, der stets bereit ist, erstklassige Lösungen zu liefern.',
  ru: 'Абдулла — опытный full-stack разработчик, всегда готов предоставить первоклассные решения.',
  ja: 'Abdullahは経験豊富なフルスタック開発者で、常に最高のソリューションを提供する準備ができています。',
  ko: 'Abdullah는 경험이 풍부한 풀스택 개발자로, 항상 최고의 솔루션을 제공할 준비가 되어 있습니다.',
  hi: 'Abdullah एक कुशल full-stack डेवलपर हैं, जिनके पास व्यापक अनुभव है और जो हमेशा बेहतरीन समाधान देने के लिए तैयार रहते हैं।'
};

// معلومات التواصل مع عبد الله بعدة لغات
const abdullahContactInfo = {
  ar: 'يمكنك التواصل مع عبد الله عبر البريد الإلكتروني: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  en: 'You can contact Abdullah via email: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  fr: 'Vous pouvez contacter Abdullah par e-mail: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  zh: '您可以通过电子邮件联系Abdullah: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  es: 'You can contact Abdullah via email: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  de: 'Sie können Abdullah per E-Mail kontaktieren: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  ru: 'Вы можете связаться с Абдуллой по электронной почте: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  ja: 'Abdullahにはメールで連絡できます: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  ko: 'Abdullah에게는 이메일로 연락할 수 있습니다: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.',
  hi: 'आप Abdullah से ईमेल द्वारा संपर्क कर सकते हैं: <a href="mailto:abdullah@example.com" target="_blank" rel="noopener noreferrer">abdullah@example.com</a>.'
};

// تحيات متعددة اللغات
const getGreeting = (lang) => {
  const hour = new Date().getHours();
  const greetings = {
    ar: {
      morning: 'صباح الخير! ',
      afternoon: 'مساء الخير! ',
      evening: 'مساء الخير! ',
      night: 'مساء الخير! '
    },
    en: {
      morning: 'Good morning! ',
      afternoon: 'Good afternoon! ',
      evening: 'Good evening! ',
      night: 'Good evening! '
    },
    es: {
      morning: '¡Buenos días! ',
      afternoon: '¡Buenas tardes! ',
      evening: '¡Buenas noches! ',
      night: '¡Buenas noches! '
    },
    de: {
      morning: 'Guten Morgen! ',
      afternoon: 'Guten Tag! ',
      evening: 'Guten Abend! ',
      night: 'Gute Nacht! '
    },
    ru: {
      morning: 'Доброе утро! ',
      afternoon: 'Добрый день! ',
      evening: 'Добрый вечер! ',
      night: 'Доброй ночи! '
    },
    ja: {
      morning: 'おはようございます！',
      afternoon: 'こんにちは！',
      evening: 'こんばんは！',
      night: 'おやすみなさい！'
    },
    ko: {
      morning: '좋은 아침입니다! ',
      afternoon: '안녕하세요! ',
      evening: '안녕하세요! ',
      night: '안녕히 주무세요! '
    },
    hi: {
      morning: 'सुप्रभात! ',
      afternoon: 'नमस्कार! ',
      evening: 'शुभ संध्या! ',
      night: 'शुभ रात्रि! '
    }
  };

  const timeOfDay = 
    hour < 12 ? 'morning' :
    hour < 17 ? 'afternoon' :
    hour < 22 ? 'evening' : 'night';

  return (greetings[lang] || greetings.en)[timeOfDay];
};

// دوال تحديد نوع السؤال
const isSelfQuestion = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("من انت") ||
    lowerText.includes("من أنت") ||
    lowerText.includes("ما اسمك") ||
    lowerText.includes("who are you") ||
    lowerText.includes("what's your name") ||
    lowerText.includes("what is your name")
  );
};

const isContactQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("كيفية التواصل") ||
    lowerText.includes("كيفية الاتصال") ||
    lowerText.includes("contact") ||
    lowerText.includes("تواصل") ||
    lowerText.includes("رابط")
  );
};

const isAbdullahQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("عبد الله") ||
    lowerText.includes("عبدالله") ||
    lowerText.includes("abdullah")
  );
};

const isTrainerQuestion = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("من دربك") ||
    lowerText.includes("من علمك") ||
    lowerText.includes("من خلقك")
  );
};

const isCompanyQuery = (text) => {
  const lowerText = text.toLowerCase();
  return lowerText.includes("هاشمي") || lowerText.includes("hashimi");
};

const isAbdullahContactQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    (lowerText.includes("عبد الله") || lowerText.includes("abdullah")) &&
    (lowerText.includes("contact") ||
     lowerText.includes("تواصل") ||
     lowerText.includes("كيفية التواصل") ||
     lowerText.includes("كيفية الاتصال"))
  );
};

const isCompanyContactQuery = (text) => {
  const lowerText = text.toLowerCase();
  return (
    (lowerText.includes("هاشمي") || lowerText.includes("hashimi")) &&
    (lowerText.includes("contact") ||
     lowerText.includes("تواصل") ||
     lowerText.includes("كيفية التواصل") ||
     lowerText.includes("كيفية الاتصال") ||
     lowerText.includes("رابط"))
  );
};

const selfAnswers = {
  ar: "أنا Hashimi، مساعدك الافتراضي من هاشمي، هنا لأقدم لك الدعم. كيف يمكنني مساعدتك اليوم؟",
  en: "I am Hashimi, your virtual assistant from Hashimi, here to help you. How can I assist you today?",
  fr: "Je suis Hashimi, votre assistant virtuel de Hashimi, ici pour vous aider. Comment puis-je vous assister aujourd'hui?",
  zh: "我是 Hashimi，你的 Hashimi 虚拟助手，很高兴为您服务。有什么我可以帮忙的吗？",
  es: "I am Hashimi, your virtual assistant from Hashimi, here to help you. How can I assist you today?",
  de: "Ich bin Hashimi, dein virtueller Assistent von Hashimi, hier um dir zu helfen. Wie kann ich dir heute behilflich sein?",
  ru: "Я Hashimi, ваш виртуальный ассистент от Hashimi, готов помочь. Чем могу быть полезен сегодня?",
  ja: "私は Hashimi、Hashimiのバーチャルアシスタントです。どのようにお手伝いできますか？",
  ko: "저는 Hashimi, Hashimi의 가상 어시스턴트입니다. 오늘 무엇을 도와드릴까요?",
  hi: "मैं Hashimi हूँ, Hashimi का आपका वर्चुअल असिस्टेंट, आपकी सहायता के लिए यहाँ हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?"
};

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1].content;
    const sanitizedMessage = lastMessage
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();

    const detectedLang = detectLanguageExisting(sanitizedMessage);
    const greeting = getGreeting(detectedLang);

    if (isSelfQuestion(sanitizedMessage)) {
      const selfAnswer = selfAnswers[detectedLang] || selfAnswers.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + selfAnswer
        }
      });
    }

    if (isAbdullahContactQuery(sanitizedMessage)) {
      const abdullahContact = abdullahContactInfo[detectedLang] || abdullahContactInfo.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + abdullahContact
        }
      });
    }

    if (isCompanyContactQuery(sanitizedMessage)) {
      const companyContact = companyContactInfo[detectedLang] || companyContactInfo.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + companyContact
        }
      });
    }

    if (isContactQuery(sanitizedMessage)) {
      const contactAnswer = companyContactInfo[detectedLang] || companyContactInfo.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + contactAnswer
        }
      });
    }

    if (isAbdullahQuery(sanitizedMessage)) {
      const abdullahAnswer = abdullahAnswers[detectedLang] || abdullahAnswers.en;
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + abdullahAnswer
        }
      });
    }

    if (isTrainerQuestion(sanitizedMessage) || isCompanyQuery(sanitizedMessage)) {
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: greeting + (companyInfo[detectedLang] || companyInfo.en)
        }
      });
    }

    const conversationHistory = messages.slice(-5).map(msg => ({
      role: msg.role,
      parts: msg.content
    }));

    const prompt = `System Instructions (Do not include in response):
1. ALWAYS respond exclusively in the language detected from the user's input (support all languages worldwide; if the language is undetected, default to English).
2. When asked about your creator or developer, always mention the Hashimi company along with the provided details.
3. Maintain a natural and fluent conversational flow in the detected language.
4. Preserve all original terminology and context from the user's query.
5. Provide responses that are comprehensive, detailed, and accurate, tailored to the nuances of the detected language.

Context:
Previous conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.parts}`).join('\n')}

Current question: ${sanitizedMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();

    if (!text) {
      throw new Error('Empty API response');
    }
    function replaceGoogleReferences(text, lang) {
      switch (lang) {
        case 'en':
          text = text.replace(/(trained by\s*)Google/gi, '$1Hashimi');
          text = text.replace(/(created by\s*)Google/gi, '$1Hashimi');
          text = text.replace(/(developed by\s*)Google/gi, '$1Hashimi');
          break;
        case 'ar':
          text = text.replace(/(تم تدريبي بواسطة\s*)جوجل/gi, '$1شركة هاشمي');
          text = text.replace(/(تم إنشائي بواسطة\s*)جوجل/gi, '$1شركة هاشمي');
          text = text.replace(/(تم تطويري بواسطة\s*)جوجل/gi, '$1شركة هاشمي');
          break;
        case 'fr':
          text = text.replace(/(entraîné par\s*)Google/gi, '$1Hashimi');
          text = text.replace(/(créé par\s*)Google/gi, '$1Hashimi');
          text = text.replace(/(développé par\s*)Google/gi, '$1Hashimi');
          break;
        case 'zh':
          text = text.replace(/(由)Google(训练)/gi, '$1Hashimi$2');
          text = text.replace(/(由)Google(创建)/gi, '$1Hashimi$2');
          text = text.replace(/(由)Google(开发)/gi, '$1Hashimi$2');
          break;
        case 'es':
          text = text.replace(/(entrenado por\s*)Google/gi, '$1Hashimi');
          text = text.replace(/(creado por\s*)Google/gi, '$1Hashimi');
          text = text.replace(/(desarrollado por\s*)Google/gi, '$1Hashimi');
          break;
        case 'de':
          text = text.replace(/(von\s*)Google(\s*trainiert)/gi, '$1Hashimi$2');
          text = text.replace(/(von\s*)Google(\s*erstellt)/gi, '$1Hashimi$2');
          text = text.replace(/(von\s*)Google(\s*entwickelt)/gi, '$1Hashimi$2');
          break;
        case 'ru':
          text = text.replace(/(обучен\s*)Google/gi, '$1Hashimi');
          text = text.replace(/(создан\s*)Google/gi, '$1Hashimi');
          text = text.replace(/(разработан\s*)Google/gi, '$1Hashimi');
          break;
        case 'ja':
          text = text.replace(/(Google)(によって訓練された)/gi, 'Hashimi$2');
          text = text.replace(/(Google)(によって作成された)/gi, 'Hashimi$2');
          text = text.replace(/(Google)(によって開発された)/gi, 'Hashimi$2');
          break;
        case 'ko':
          text = text.replace(/(Google)(에 의해 훈련됨)/gi, 'Hashimi$2');
          text = text.replace(/(Google)(에 의해 만들어짐)/gi, 'Hashimi$2');
          text = text.replace(/(Google)(에 의해 개발됨)/gi, 'Hashimi$2');
          break;
        case 'hi':
          text = text.replace(/(Google)( द्वारा प्रशिक्षित)/gi, 'Hashimi$2');
          text = text.replace(/(Google)( द्वारा बनाया गया)/gi, 'Hashimi$2');
          text = text.replace(/(Google)( द्वारा विकसित)/gi, 'Hashimi$2');
          break;
        default:
          // إذا كانت اللغة غير محددة، افتراضياً نستخدم النسخة الإنجليزية
          text = text.replace(/(trained by\s*)Google/gi, '$1Hashimi');
          break;
      }
      return text;
    }
    
    text = replaceGoogleReferences(text, detectedLang);

    
    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: text
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    const errorsByLang = {
      ar: 'عذراً، حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى.',
      en: 'Sorry, an error occurred while processing your request. Please try again.',
      fr: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
      zh: '抱歉，处理您的请求时出错。请重试。',
      es: 'Lo sentimos, ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo.',
      de: 'Entschuldigung, bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
      ru: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте снова.',
      ja: '申し訳ありません。リクエストの処理中にエラーが発生しました。もう一度お試しください。',
      ko: '죄송합니다. 요청을 처리하는 동안 오류가 발생했습니다. 다시 시도해 주세요.',
      hi: 'क्षमा करें, आपके अनुरोध को संसाधित करने में एक त्रुटि हुई। कृपया पुनः प्रयास करें।'
    };

    const userLang = detectLanguageExisting(messages?.[messages.length - 1]?.content || '') || 'en';
    const errorMessage = errorsByLang[userLang] || errorsByLang.en;

    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}
