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
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [icon, setIcon] = useState(
    <FaSmile className="text-green-500 text-2xl" />,
  );
  const [greetingText, setGreetingText] = useState("مرحباً بك!");

  /* ---------------- Greeting Based on Time ---------------- */
  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreetingText("صباح الخير!");
      setIcon(<FaSun className="text-yellow-400 text-2xl" />);
    } else if (hour >= 12 && hour < 18) {
      setGreetingText("مساء الخير!");
      setIcon(<FaMoon className="text-blue-500 text-2xl" />);
    } else {
      setGreetingText("مرحباً بك!");
      setIcon(<FaSmile className="text-green-500 text-2xl" />);
    }
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

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

        <h1 className="text-5xl font-extrabold text-blue-700 mb-3">
          شغف وإشراقة
        </h1>

        {/* Greeting Animation */}
        <div className="flex justify-center items-center gap-2">
          {icon}
          <TypeAnimation
            sequence={[greetingText, 2000]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-gray-700 text-2xl font-semibold"
          />
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

      {/* Footer */}
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
