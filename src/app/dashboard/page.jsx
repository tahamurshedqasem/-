"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserGraduate,
  FaSmile,
  FaFrown,
  FaChartPie,
  FaSignOutAlt,
  FaClipboardList,
  FaTrophy,
  FaListUl,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const API = "https://shaghaf-ishraqa.org/api";
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: Load behaviors
  const [positiveBehaviors, setPositiveBehaviors] = useState([]);
  const [negativeBehaviors, setNegativeBehaviors] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBehavior, setSelectedBehavior] = useState(null);
  const [behaviorType, setBehaviorType] = useState(null);
const [positiveCount, setPositiveCount] = useState(0);
const [negativeCount, setNegativeCount] = useState(0);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load Students + Behaviors
  const loadData = async () => {
    try {
      const res = await fetch(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentsData = await res.json();
      setStudents(studentsData);

      // GET Positive Logs
      const logsPos = await fetch(`${API}/logs/type/إيجابي`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const posLogs = await logsPos.json();
      setPositiveCount(posLogs.length);

      // GET Negative Logs
      const logsNeg = await fetch(`${API}/logs/type/سلبي`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const negLogs = await logsNeg.json();
      setNegativeCount(negLogs.length);

      // Load available behavior events (like before)
      const pos = await fetch(`${API}/behaviors/type/إيجابي`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const neg = await fetch(`${API}/behaviors/type/سلبي`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPositiveBehaviors(await pos.json());
      setNegativeBehaviors(await neg.json());

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    loadData();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // Save points
  const saveBehavior = async () => {
    if (!selectedBehavior) return alert("اختر السلوك أولاً");

    const payload = {
      type: behaviorType === "positive" ? "positive" : "negative",
      category: selectedBehavior.category,
      event: selectedBehavior.event,
    };

    try {
      await fetch(`${API}/students/${selectedStudent.id}/points`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      setSelectedStudent(null);
      setSelectedBehavior(null);
      loadData();
    } catch (err) {
      console.error("Failed to save behavior:", err);
    }
  };

 const stats = [
   {
     title: "عدد الطالبات",
     value: students.length,
     icon: <FaUserGraduate size={26} />,
     gradient: "from-blue-400 to-blue-600",
   },
   {
     title: "السلوك الإيجابي",
     value: positiveCount, // ⬅ تم التعديل
     icon: <FaSmile size={26} />,
     gradient: "from-green-400 to-green-600",
   },
   {
     title: "السلوك السلبي",
     value: negativeCount, // ⬅ تم التعديل
     icon: <FaFrown size={26} />,
     gradient: "from-red-400 to-red-600",
   },
   {
     title: "نسبة الانضباط",
     value:
       students.length > 0
         ? `${Math.round(
             (students.filter((s) => s.points > 0).length / students.length) *
               100
           )}%`
         : "0%",
     icon: <FaChartPie size={26} />,
     gradient: "from-teal-400 to-teal-600",
   },
 ];

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-transparent font-[Tajawal] px-4 py-6"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <FaTrophy /> لوحة التحكم
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaSignOutAlt /> تسجيل الخروج
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 text-white bg-gradient-to-br ${item.gradient} shadow-lg flex flex-col items-center`}
          >
            <div className="bg-white/20 p-3 rounded-full mb-2">{item.icon}</div>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* STUDENTS TABLE */}
      <div className="bg-white/80 rounded-2xl shadow-xl mt-10 p-6 border border-blue-100">
        <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          <FaClipboardList /> قائمة الطالبات
        </h2>

        {loading ? (
          <p className="text-center py-6">جاري التحميل...</p>
        ) : (
          <table className="w-full text-right border-separate border-spacing-y-3">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="p-3">الاسم</th>
                <th className="p-3">الصف</th>
                <th className="p-3">النقاط</th>
                <th className="p-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className="bg-white hover:bg-blue-50 cursor-pointer shadow rounded-lg"
                >
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.grade}</td>
                  <td className="p-3">{Number(s.points).toFixed(2)}</td>
                  <td
                    className={`p-3 font-bold ${
                      s.status === "إيجابي"
                        ? "text-green-700"
                        : s.status === "سلبي"
                        ? "text-red-700"
                        : "text-blue-600"
                    }`}
                  >
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BEHAVIOR MODAL */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
                <FaListUl /> إضافة سلوك للطالبة
              </h2>

              <p className="text-gray-600 mb-3">
                الطالبة: <b>{selectedStudent.name}</b>
              </p>

              {/* Select behavior type */}
              <div className="flex gap-3 mb-4">
                <button
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                  onClick={() => setBehaviorType("positive")}
                >
                  سلوك إيجابي
                </button>
                <button
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                  onClick={() => setBehaviorType("negative")}
                >
                  سلوك سلبي
                </button>
              </div>

              {/* Behavior list */}
              {behaviorType && (
                <select
                  className="w-full border p-2 rounded-lg mb-4"
                  onChange={(e) =>
                    setSelectedBehavior(
                      (behaviorType === "positive"
                        ? positiveBehaviors
                        : negativeBehaviors
                      ).find((b) => b.id == e.target.value)
                    )
                  }
                >
                  <option value="">اختر السلوك</option>

                  {(behaviorType === "positive"
                    ? positiveBehaviors
                    : negativeBehaviors
                  ).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.category} - {b.event} ({b.points})
                    </option>
                  ))}
                </select>
              )}

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  إلغاء
                </button>

                <button
                  onClick={saveBehavior}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  حفظ
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
