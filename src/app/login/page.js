"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://shaghaf-ishraqa.org/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // ✅ مهم جدًا
        },
        body: JSON.stringify({ email, password }),
      });


      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.message || "خطأ في تسجيل الدخول");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ في الاتصال بالخادم");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-50 relative overflow-hidden">
      {/* خلفيات متحركة */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 bg-blue-200/30 rounded-full top-20 left-10 blur-3xl"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.5, rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute w-80 h-80 bg-teal-200/20 rounded-full bottom-16 right-10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 bg-white/90 backdrop-blur-lg shadow-2xl border border-blue-100 rounded-3xl p-10 w-full max-w-md"
      >
        {/* ===== Header ===== */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-full shadow-md mb-3">
            <IoSchoolOutline size={28} />
          </div>

          {/* 🔴 EDIT: اسم النظام */}
          <h1 className="text-3xl font-bold text-blue-700 tracking-wide">
            شغف وإشراقة
          </h1>

          <p className="text-gray-500 text-sm mt-1">للكادر المدرسي فقط</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* البريد */}
          <div className="relative">
            <FaUserAlt className="absolute left-3 top-3 text-blue-400" />
            <input
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-blue-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-center text-sm font-medium"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2.5 rounded-lg font-semibold shadow-md transition-all"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </motion.button>
        </form>

        {/* 🔴 EDIT: Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
          تم تنفيذه من قبل الموجهة الطلابية
          <br />
          <span className="font-semibold">عفراء آل منجم</span>
        </div>
      </motion.div>
    </section>
  );
}
