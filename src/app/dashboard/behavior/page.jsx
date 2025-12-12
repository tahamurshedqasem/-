"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSmile,
  FaFrown,
  FaUserGraduate,
  FaCrown,
  FaTrophy,
  FaListUl,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function BehaviorPage() {
  const router = useRouter();
  const API = "https://shaghaf-ishraqa.org/api";

  const [students, setStudents] = useState([]);
  const [positiveBehaviors, setPositiveBehaviors] = useState([]);
  const [negativeBehaviors, setNegativeBehaviors] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);

  // اختيار التصنيف
  const [selectedCategory, setSelectedCategory] = useState("");

  // اختيار الحدث
  const [selectedBehavior, setSelectedBehavior] = useState("");

  // القائمة الناتجة بعد اختيار التصنيف
  const [eventsList, setEventsList] = useState([]);

  const [showPositiveModal, setShowPositiveModal] = useState(false);
  const [showNegativeModal, setShowNegativeModal] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load Students + Behaviors
  const loadData = async () => {
    try {
      const s = await fetch(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentsData = await s.json();

      const pos = await fetch(`${API}/behaviors/type/إيجابي`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const neg = await fetch(`${API}/behaviors/type/سلبي`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(studentsData);
      setPositiveBehaviors(await pos.json());
      setNegativeBehaviors(await neg.json());
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save behavior
  const saveBehavior = async () => {
    if (!selectedCategory) return alert("اختر التصنيف");
    if (!selectedBehavior) return alert("اختر اسم الحدث");

    const payload = {
      type: showPositiveModal ? "positive" : "negative",
      category: selectedCategory,
      event: selectedBehavior,
    };

    try {
      await fetch(`${API}/students/${selectedStudent.id}/points`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // إغلاق المودال وتنظيف المتغيرات
      setShowPositiveModal(false);
      setShowNegativeModal(false);
      setSelectedCategory("");
      setSelectedBehavior("");
      setEventsList([]);

      loadData();
    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

  // Top students
  const topStudents = [...students]
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  return (
    <section dir="rtl" className="min-h-screen px-4 py-6 font-[Tajawal]">
      {/* ---------------------- Positive Modal ---------------------- */}
      {showPositiveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaListUl /> اختر السلوك الإيجابي
            </h3>

            {/* اختيار التصنيف */}
            <select
              className="w-full border p-2 rounded-lg mb-3"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                const filtered = positiveBehaviors
                  .filter((b) => b.category === e.target.value)
                  .map((b) => b.event);
                setEventsList(filtered);
                setSelectedBehavior("");
              }}
            >
              <option value="">اختر التصنيف</option>
              {[...new Set(positiveBehaviors.map((b) => b.category))].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>

            {/* اختيار الحدث */}
            {eventsList.length > 0 && (
              <select
                className="w-full border p-2 rounded-lg mb-3"
                value={selectedBehavior}
                onChange={(e) => setSelectedBehavior(e.target.value)}
              >
                <option value="">اختر اسم الحدث</option>
                {eventsList.map((event, i) => (
                  <option key={i} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setShowPositiveModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>

              <button
                onClick={saveBehavior}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- Negative Modal ---------------------- */}
      {showNegativeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaListUl /> اختر السلوك السلبي
            </h3>

            <select
              className="w-full border p-2 rounded-lg mb-3"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                const filtered = negativeBehaviors
                  .filter((b) => b.category === e.target.value)
                  .map((b) => b.event);
                setEventsList(filtered);
                setSelectedBehavior("");
              }}
            >
              <option value="">اختر التصنيف</option>
              {[...new Set(negativeBehaviors.map((b) => b.category))].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>

            {eventsList.length > 0 && (
              <select
                className="w-full border p-2 rounded-lg mb-3"
                value={selectedBehavior}
                onChange={(e) => setSelectedBehavior(e.target.value)}
              >
                <option value="">اختر اسم الحدث</option>
                {eventsList.map((event, i) => (
                  <option key={i} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setShowNegativeModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>

              <button
                onClick={saveBehavior}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- PAGE HEADER ---------------------- */}
      <motion.h1 className="text-3xl font-bold text-blue-700 mb-5 flex items-center gap-2">
        <FaSmile /> سجل السلوك
      </motion.h1>

      {/* ---------------------- TOP STUDENTS ---------------------- */}
      <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">
          <FaCrown /> أفضل الطالبات
        </h2>

        {topStudents.length === 0 ? (
          <p className="text-gray-500">لا توجد بيانات حاليا</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topStudents.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl shadow p-4 text-center border border-yellow-200"
              >
                <FaUserGraduate className="text-yellow-600 text-3xl mb-2" />
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-gray-500">الصف: {s.grade}</p>
                <p className="mt-2 text-yellow-700 font-semibold flex items-center justify-center gap-1">
                  <FaTrophy /> {Number(s.points).toFixed(2)} نقطة
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------------- Students Table ---------------------- */}
      <div className="bg-white rounded-2xl shadow-xl p-5 mt-6">
        <table className="w-full text-right border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-3">الاسم</th>
              <th className="p-3">الصف</th>
              <th className="p-3">النقاط</th>
              <th className="p-3">الإجراء</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="bg-white shadow-sm rounded-lg">
                <td className="p-3 flex items-center gap-2">
                  <FaUserGraduate className="text-blue-500" />
                  {s.name}
                </td>

                <td className="p-3">{s.grade}</td>

                <td className="p-3">{Number(s.points).toFixed(2)}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedStudent(s);
                      setSelectedCategory("");
                      setSelectedBehavior("");
                      setShowPositiveModal(true);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <FaSmile /> إيجابي
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStudent(s);
                      setSelectedCategory("");
                      setSelectedBehavior("");
                      setShowNegativeModal(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <FaFrown /> سلبي
                  </button>

                  <button
                    onClick={() => router.push(`/dashboard/student/${s.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <FaListUl /> الملف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
