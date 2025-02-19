"use client";
import { motion } from "framer-motion";
import { FeatureSlider } from "./features/page";
import { StatsSection } from "./Statistics/page";

export default function HomePage() {
  const features = [
    {
      icon: "🤖",
      title: "ذكاء اصطناعي متقدم",
      description: "مدعوم بأحدث تقنيات الذكاء الاصطناعي للفهم والتواصل بشكل طبيعي",
    },
    {
      icon: "🌐",
      title: "دعم اللغة العربية",
      description: "تواصل بلغتك الأم مع دعم كامل للغة العربية ومعالجة النصوص",
    },
    {
      icon: "⚡",
      title: "استجابة فورية",
      description: "ردود سريعة ودقيقة على استفساراتك في مختلف المجالات",
    },
    {
      icon: "🔒",
      title: "خصوصية وأمان",
      description: "حماية كاملة لبياناتك وخصوصيتك مع تشفير من طرف إلى طرف",
    },
  ];

  return (
    <div className="space-y-20">
      <section className="py-20 text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text"
        >
          مساعد هاشمي الآلي
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-300 max-w-2xl mx-auto"
        >
          مساعدك الشخصي الذكي للمحادثة والمساعدة في مختلف المجالات
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/chat'}
          >
            ابدأ المحادثة مجاناً
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-lg font-medium text-slate-300 border border-slate-700 rounded-xl hover:bg-slate-800/50 transition-colors"
            onClick={() => window.location.href = '#features'}
          >
            تعرف على المميزات
          </motion.button>
        </motion.div>
      </section>

      <section className="py-20" id="features">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          مميزات المساعد
        </motion.h2>
        <FeatureSlider features={features} />
      </section>
      <StatsSection />
    </div>
  );
}