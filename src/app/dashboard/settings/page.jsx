"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaMoon,
  FaSun,
  FaPalette,
  FaLanguage,
  FaSave,
  FaCog,
} from "react-icons/fa";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [color, setColor] = useState("blue");
  const [direction, setDirection] = useState("rtl");

  // ✅ Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedColor = localStorage.getItem("color") || "blue";
    const savedDir = localStorage.getItem("direction") || "rtl";

    setTheme(savedTheme);
    setColor(savedColor);
    setDirection(savedDir);

    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    document.documentElement.dir = savedDir;
  }, []);

  // ✅ Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // ✅ Change color
  const handleColorChange = (newColor) => {
    setColor(newColor);
    localStorage.setItem("color", newColor);
  };

  // ✅ Change language direction
  const handleDirectionChange = (newDir) => {
    setDirection(newDir);
    localStorage.setItem("direction", newDir);
    document.documentElement.dir = newDir;
  };

  // ✅ Save confirmation
  const handleSave = () => {
    alert("✅ تم حفظ الإعدادات بنجاح!");
  };

  // 🎨 Dynamic background colors for the save button
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    pink: "bg-pink-500 hover:bg-pink-600",
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-transparent font-[Tajawal] px-4 md:px-8 py-6"
    >
      {/* ===== عنوان الصفحة ===== */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-2 mb-6"
      >
        <FaCog className="text-blue-600" /> الإعدادات العامة
      </motion.h1>

      {/* ===== محتوى الإعدادات ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 md:p-8 border border-blue-100 dark:border-gray-700"
      >
        {/* 🌗 وضع المظهر */}
        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            <FaMoon /> وضع المظهر
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                theme === "light"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-yellow-300"
              }`}
            >
              {theme === "light" ? (
                <>
                  <FaSun /> الوضع الفاتح
                </>
              ) : (
                <>
                  <FaMoon /> الوضع الداكن
                </>
              )}
            </button>
          </div>
        </div>

        {/* 🎨 اللون الرئيسي */}
        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            <FaPalette /> اللون الرئيسي
          </h2>
          <div className="flex flex-wrap gap-4">
            {["blue", "green", "purple", "pink"].map((c) => (
              <button
                key={c}
                onClick={() => handleColorChange(c)}
                className={`w-10 h-10 rounded-full border-4 ${
                  color === c
                    ? "border-gray-400 scale-110"
                    : "border-transparent"
                } transition`}
                style={{
                  backgroundColor:
                    c === "blue"
                      ? "#3b82f6"
                      : c === "green"
                      ? "#22c55e"
                      : c === "purple"
                      ? "#8b5cf6"
                      : "#ec4899",
                }}
              ></button>
            ))}
          </div>
        </div>

        {/* 🌐 اتجاه اللغة */}
        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            <FaLanguage /> اتجاه اللغة
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleDirectionChange("rtl")}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                direction === "rtl"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              عربي (RTL)
            </button>
            <button
              onClick={() => handleDirectionChange("ltr")}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                direction === "ltr"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              English (LTR)
            </button>
          </div>
        </div>

        {/* 💾 زر الحفظ */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition ${colorClasses[color]}`}
          >
            <FaSave /> حفظ الإعدادات
          </button>
        </div>
      </motion.div>

      <footer className="text-center text-gray-500 text-xs md:text-sm mt-10 pb-4">
        © {new Date().getFullYear()} نظام نقاطي – إعدادات النظام.
      </footer>
    </section>
  );
}
