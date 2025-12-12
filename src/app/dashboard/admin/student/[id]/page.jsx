"use client";
import { useState } from "react";
import {
  FaUserGraduate,
  FaStar,
  FaSmile,
  FaFrown,
  FaAward,
  FaLightbulb,
  FaHandsHelping,
} from "react-icons/fa";

export default function StudentProfilePage() {
  const [student] = useState({
    id: 1,
    name: "سارة أحمد",
    grade: "3/1",
    points: 1.75,
    status: "إيجابي",
  });

  const [history] = useState([
    {
      type: "إيجابي",
      category: "مبادرات",
      event: "مبادرة النظافة",
      date: "2025-01-03",
    },
    {
      type: "إيجابي",
      category: "تميز وتفوق",
      event: "مركز أول",
      date: "2025-01-01",
    },
    {
      type: "سلبي",
      category: "سلوك",
      event: "إزعاج في الفصل",
      date: "2024-12-22",
    },
    {
      type: "إيجابي",
      category: "مثاليات أخلاقية",
      event: "حسن الخلق",
      date: "2024-12-10",
    },
  ]);

  // استخراج أقسام معينة
  const initiatives = history.filter((h) => h.category === "مبادرات");
  const excellence = history.filter((h) => h.category === "تميز وتفوق");
  const talents = history.filter((h) => h.category === "موهبة");
  const behavior = history; // جميع السجلات

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-6 py-8 font-[Tajawal]"
    >
      {/* ---------------------- بطاقة بيانات الطالبة ---------------------- */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-blue-100 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="bg-blue-200 text-blue-700 w-16 h-16 rounded-full flex justify-center items-center text-3xl shadow">
            <FaUserGraduate />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-blue-700">{student.name}</h1>
            <p className="text-gray-600">الصف: {student.grade}</p>

            <div className="mt-2 flex gap-3 items-center">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm shadow">
                {student.points.toFixed(2)} نقطة
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm shadow ${
                  student.status === "إيجابي"
                    ? "bg-green-100 text-green-700"
                    : student.status === "سلبي"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {student.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------- الأقسام ---------------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* --------- قسم المبادرات --------- */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaHandsHelping className="text-blue-500" /> المبادرات
          </h2>

          {initiatives.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد مبادرات مسجلة.</p>
          ) : (
            <ul className="space-y-3">
              {initiatives.map((i, index) => (
                <li
                  key={index}
                  className="bg-blue-50 p-3 rounded-lg border border-blue-100"
                >
                  <p className="font-semibold">{i.event}</p>
                  <p className="text-gray-600 text-sm">التاريخ: {i.date}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --------- قسم التميز والتفوق --------- */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaAward className="text-yellow-500" /> التميز والتفوق
          </h2>

          {excellence.length === 0 ? (
            <p className="text-gray-500 text-sm">لا يوجد تميز مسجل.</p>
          ) : (
            <ul className="space-y-3">
              {excellence.map((i, index) => (
                <li
                  key={index}
                  className="bg-yellow-50 p-3 rounded-lg border border-yellow-200"
                >
                  <p className="font-semibold">{i.event}</p>
                  <p className="text-gray-600 text-sm">التاريخ: {i.date}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --------- قسم الموهبة --------- */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500" /> الموهبة
          </h2>

          {talents.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد مواهب مسجلة.</p>
          ) : (
            <ul className="space-y-3">
              {talents.map((i, index) => (
                <li
                  key={index}
                  className="bg-purple-50 p-3 rounded-lg border border-purple-200"
                >
                  <p className="font-semibold">{i.event}</p>
                  <p className="text-gray-600 text-sm">التاريخ: {i.date}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --------- قسم السلوك الكامل --------- */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaStar className="text-blue-500" /> سجل السلوك
          </h2>

          <ul className="space-y-3">
            {behavior.map((b, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow border border-gray-200"
              >
                <div>
                  <p className="font-semibold">{b.event}</p>
                  <p className="text-gray-600 text-sm">
                    التصنيف: {b.category} | التاريخ: {b.date}
                  </p>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    b.type === "إيجابي"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.type}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="text-center text-gray-500 text-xs mt-10">
        © {new Date().getFullYear()} نظام نقاطي – ملف الطالبة.
      </footer>
    </section>
  );
}
