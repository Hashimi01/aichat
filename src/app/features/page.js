"use client";

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export function FeatureSlider({ features }) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration errors
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative px-4 py-8"
    >
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (index, className) => {
            return `<span class="${className} w-3 h-3 bg-blue-500"></span>`;
          }
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        }}
        dir="rtl"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="pb-12"
      >
        <AnimatePresence mode="wait">
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <motion.div
                variants={slideVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="h-full"
              >
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4 h-full hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-2xl"
                  >
                    {feature.icon}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </AnimatePresence>

        {/* Custom Navigation Buttons */}
        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
          <button className="swiper-button-prev !w-10 !h-10 !bg-blue-600/80 rounded-full !text-white after:!text-lg hover:!bg-blue-700 transition-colors" />
        </div>
        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 z-10">
          <button className="swiper-button-next !w-10 !h-10 !bg-blue-600/80 rounded-full !text-white after:!text-lg hover:!bg-blue-700 transition-colors" />
        </div>
      </Swiper>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/30">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${((activeIndex + 1) / features.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

// مكوّن الصفحة الرئيسي
export default function FeaturesSection() {
  const features = [
    {
      icon: "🤖",
      title: "ذكاء اصطناعي متقدم",
      description:
        "مدعوم بأحدث تقنيات الذكاء الاصطناعي للفهم والتواصل بشكل طبيعي.",
    },
    {
      icon: "🌐",
      title: "دعم اللغة العربية",
      description:
        "تواصل بلغتك الأم مع دعم كامل للغة العربية ومعالجة النصوص.",
    },
    {
      icon: "⚡",
      title: "استجابة فورية",
      description:
        "ردود سريعة ودقيقة على استفساراتك في مختلف المجالات.",
    },
    {
      icon: "💡",
      title: "تجربة مستخدم سلسة",
      description:
        "تصميم واجهة استخدام بديهية وسهلة لضمان تجربة رائعة للمستخدم.",
    },
    {
      icon: "🔒",
      title: "أمان وحماية البيانات",
      description:
        "نضمن سرية وأمان بياناتك باستخدام أحدث تقنيات التشفير والحماية.",
    },
    {
      icon: "🔗",
      title: "تكامل مع التطبيقات",
      description:
        "يتكامل بسلاسة مع مختلف التطبيقات والأدوات المستخدمة في عملك.",
    },
    {
      icon: "📊",
      title: "تحليل ذكي للبيانات",
      description:
        "يوفر تحليلات دقيقة وموثوقة تساعدك في اتخاذ القرارات الصحيحة.",
    },
    {
      icon: "📞",
      title: "دعم فني متواصل",
      description:
        "فريق دعم جاهز لمساعدتك على مدار الساعة في أي وقت تحتاج فيه للدعم.",
    },
    {
      icon: "🔄",
      title: "تحديثات مستمرة",
      description:
        "نقوم بتحديث النظام بشكل دوري لضمان أفضل أداء وميزات جديدة.",
    },
    {
      icon: "🚀",
      title: "تعلم وتطور دائم",
      description:
        "يستفيد من أحدث التقنيات والتعلم المستمر لتطوير خدماته وتحسينها.",
    },
  ];

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">مميزات المساعد</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          اكتشف القدرات المتقدمة لمساعد هاشمي الآلي وكيف يمكنه مساعدتك في مختلف المهام
        </p>
      </motion.div>
      <FeatureSlider features={features} />
    </section>
  );
}