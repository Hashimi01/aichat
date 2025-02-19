// components/Statistics/StatsSection.js
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Brain, Globe } from 'lucide-react';

export function StatsSection() {
  const [stats] = useState([
    {
      icon: Users,
      value: "100+",
      label: "مستخدم نشط",
      description: "يستخدمون المساعد يومياً"
    },
    {
      icon: MessageSquare,
      value: "5 آلاف",
      label: "محادثة",
      description: "تم إجراؤها بنجاح"
    },
    {
      icon: Brain,
      value: "95%",
      label: "دقة الفهم",
      description: "في فهم الاستفسارات"
    },
    {
      icon: Globe,
      value: "24/7",
      label: "دعم متواصل",
      description: "على مدار الساعة"
    }
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">إحصائيات وأرقام</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            تعرف على تأثير مساعد هاشمي الآلي في مساعدة المستخدمين وتحسين تجاربهم
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden group"
            >
              {/* Background Gradient Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                  <stat.icon size={24} />
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold mt-1 text-slate-200">
                    {stat.label}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    {stat.description}
                  </p>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Usage Examples Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">مجالات الاستخدام</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "المحادثات اليومية",
                description: "دردشة ذكية ومحادثات طبيعية في مختلف المواضيع"
              },
              {
                title: "المساعدة التقنية",
                description: "حل المشكلات التقنية وتقديم الدعم الفني المتخصص"
              },
              {
                title: "تحليل البيانات",
                description: "تحليل وتفسير البيانات واستخراج الرؤى المفيدة"
              }
            ].map((usage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold mb-2">{usage.title}</h4>
                <p className="text-slate-400">{usage.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}