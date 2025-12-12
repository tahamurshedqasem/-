"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaSchool,
  FaSignInAlt,
  FaLock,
  FaSun,
  FaMoon,
  FaSmile,
} from "react-icons/fa";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [icon, setIcon] = useState(
    <FaSmile className="text-yellow-500 text-2xl" />
  );



  const handleLogin = () => {
    router.push("/login");
  };

  const phrase = greeting.split("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <div className="flex justify-center mb-4">
          <FaSchool className="text-blue-600 text-6xl" />
        </div>

        {/* 🔴 EDIT: اسم النظام */}
        <h1 className="text-5xl font-extrabold text-blue-700 mb-3">
          شغف وإشراقة
        </h1>

        {/* Dynamic Greeting */}
        <div className="flex justify-center items-center gap-2">
          {icon}
          <motion.div
            className="text-gray-700 text-2xl font-semibold flex"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {phrase.map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <p className="text-gray-600 mt-2 text-lg">
          نُرحب بانضمامك ونتمنى لك تجربة مميزة ومليئة بالإنجاز.
        </p>
      </motion.div>

      {/* Login Button */}
      <motion.button
        onClick={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold px-12 py-4 rounded-2xl shadow-lg transition transform hover:scale-105"
      >
        <FaSignInAlt className="text-2xl" />
        تسجيل الدخول
      </motion.button>

      {/* 🔴 EDIT: Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 text-center text-sm text-gray-500"
      >
        <FaLock className="inline text-blue-400 mb-1" />
        <div>
          تم تنفيذه من قبل الموجهة الطلابية
          <br />
          <span className="font-semibold">عفراء آل منجم</span>
        </div>
      </motion.div>
    </div>
  );
}
