"use client"
// components/Layout/Header.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/features', label: 'المميزات' },
    { 
      href: '/chat', 
      label: 'ابدأ المحادثة',
      className: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg bg-slate-900/95' : 'bg-slate-900/80'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 rtl"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Image 
                  src="/12.png" 
                  alt="logo" 
                  width={48} 
                  height={48}
                  className="w-8 h-8 md:w-12 md:h-12 object-contain" 
                />
              </div>
              <span className="text-lg md:text-xl font-bold text-white">
                Hashimi Ai
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="relative group"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
                    ${link.className ? 
                      `${link.className} text-white` : 
                      'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 border-t border-slate-800/40"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
                    ${link.className ? 
                      `${link.className} text-white` : 
                      'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;

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
