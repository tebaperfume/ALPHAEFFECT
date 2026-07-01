import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, User, Compass, Headphones, Sliders, DollarSign, Library, Menu, X } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchChange?: (val: string) => void;
}

export default function Navbar({ activeTab, setActiveTab, onSearchChange }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: Compass },
    { id: "discover", label: "Discover", icon: Library },
    { id: "engine", label: "Alpha Engine", icon: Sliders },
    { id: "visualizer", label: "Quantum Stage", icon: Headphones },
    { id: "premium", label: "Premium", icon: DollarSign },
  ];

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id + "-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-300">
      <nav
        className="max-w-7xl mx-auto h-16 rounded-full flex items-center justify-between px-6 md:px-10 border border-white/10 bg-black/40 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
        id="navbar-glass"
      >
        {/* LOGO LEFT */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {/* Mini Metallic Emblem */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              <path
                d="M50 10 L85 85 L70 85 L50 45 L30 85 L15 85 Z"
                fill="url(#nav-logo-grad)"
              />
              <defs>
                <linearGradient id="nav-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#888888" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 bg-white/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <span className="font-display font-light text-sm tracking-[0.4em] text-white select-none hidden sm:block">
            THE ALPHA EFFECT
          </span>
        </div>

        {/* CENTER MENU (Desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-5 py-2 text-xs tracking-[0.2em] font-light text-white/70 hover:text-white transition-colors duration-300 rounded-full cursor-pointer"
              >
                <span className="relative z-10">{item.label.toUpperCase()}</span>

                {/* Animated Glass Hover Backing & Active Underline */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-bg"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full -z-1"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-line"
                    className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-4">
          {/* Search Trigger */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  type="text"
                  placeholder="Search tracks, artists..."
                  value={searchValue}
                  onChange={handleSearchInput}
                  className="bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs py-1.5 px-3 rounded-full focus:outline-none focus:border-white/30 tracking-wider pr-8"
                />
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer relative"
              id="search-btn"
            >
              {isSearchOpen ? <X size={16} /> : <Search size={16} />}
            </button>
          </div>

          {/* User Profile Avatar with custom frosted ring */}
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-white/20 p-[1px] shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.35)] transition-all duration-300">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
                <User size={14} className="opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Premium Mini-Badge */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center text-[8px] font-bold text-black border border-black">
              A
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mt-2 mx-auto max-w-7xl rounded-3xl border border-white/10 bg-black/95 backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-40 relative flex flex-col gap-4"
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl text-sm font-light tracking-widest transition-all cursor-pointer ${
                    isActive ? "bg-white/10 border border-white/10 text-white font-medium" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Icon size={16} className="opacity-80" />
                  <span>{item.label.toUpperCase()}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
