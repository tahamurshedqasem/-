"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FaUserGraduate,
  FaStar,
  FaAward,
  FaLightbulb,
  FaHandsHelping,
} from "react-icons/fa";

export default function StudentProfilePage() {
  const { id } = useParams(); // student ID from URL

  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);

  const [initiatives, setInitiatives] = useState([]);
  const [excellence, setExcellence] = useState([]);
  const [talents, setTalents] = useState([]);

  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ===============================
  // Load student info + behavior logs
  // ===============================
  const loadData = async () => {
    try {
      // 1) Student info
      const res1 = await fetch(
        `https://shaghaf-ishraqa.org/api/students/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const studentData = await res1.json();

      // 2) Logs + categorized lists
      const res2 = await fetch(
        `https://shaghaf-ishraqa.org/api/students/${id}/logs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const logsData = await res2.json();

      setStudent(studentData);

      // FULL DATA FROM BACKEND
      setHistory(logsData.logs);
      setInitiatives(logsData.initiatives);
      setExcellence(logsData.excellence);
      setTalents(logsData.talents);

      setLoading(false);
    } catch (err) {
      console.error("Error loading student profile:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-600 text-lg">
        جاري تحميل بيانات الطالبة...
      </p>
    );

  if (!student)
    return (
      <p className="text-center mt-20 text-red-500 text-lg">
        لم يتم العثور على الطالبة
      </p>
    );

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
                {Number(student.points).toFixed(2)} نقطة
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
        <Section
          title="المبادرات"
          icon={<FaHandsHelping className="text-blue-500" />}
          data={initiatives}
          color="blue"
        />

        {/* --------- قسم التميز --------- */}
        <Section
          title="التميز والتفوق"
          icon={<FaAward className="text-yellow-500" />}
          data={excellence}
          color="yellow"
        />

        {/* --------- قسم المواهب --------- */}
        <Section
          title="الموهبة"
          icon={<FaLightbulb className="text-yellow-500" />}
          data={talents}
          color="purple"
        />

        {/* --------- السجل الكامل --------- */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaStar className="text-blue-500" /> سجل السلوك
          </h2>

          <ul className="space-y-3">
            {history.map((b, index) => (
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

/* ---------------------- Component: Section ---------------------- */
function Section({ title, icon, data, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border shadow-sm">
      <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        {icon} {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">لا توجد عناصر.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((i, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg bg-${color}-50 border border-${color}-200`}
            >
              <p className="font-semibold">{i.event}</p>
              <p className="text-gray-600 text-sm">التاريخ: {i.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
