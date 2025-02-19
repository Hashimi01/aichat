"use client"
// components/Layout/Header.js
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full border-b border-slate-800/40 bg-slate-900/80 backdrop-blur-md z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* شعار الموقع كرابط للصفحة الرئيسية */}
          <Link href="/" legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4 space-x-reverse"
            >
              <div className="w-16 h-16 rounded-lg bg-blue-600/20 flex items-center justify-center ml-7">
              <Image src="/12.png" alt="logo" width={60} height={60} />

              </div>
             Hashimi Ai
             
            </motion.a>
          </Link>

          {/* قائمة الروابط */}
          <nav className="flex items-center space-x-4 space-x-reverse">
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/features', label: 'المميزات' },
              { 
                href: '/chat', 
                label: 'ابدأ المحادثة',
                className: 'px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'
              }
            ].map((link) => (
              <Link key={link.href} href={link.href} legacyBehavior>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={
                    link.className ||
                    "px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
                  }
                >
                  {link.label}
                </motion.a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

// "use client"
// components/Layout/Footer.js
export function Footr() {
  return (
    <footer className="border-t border-slate-800/40 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} مساعد هاشمي الآلي. جميع الحقوق محفوظة
          </p>
          <div className="flex items-center space-x-4 space-x-reverse">
            {[
              { href: '/privacy', label: 'سياسة الخصوصية' },
              { href: '/terms', label: 'الشروط والأحكام' }
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
