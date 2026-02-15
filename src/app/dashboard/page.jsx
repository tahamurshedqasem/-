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

  const [positiveBehaviors, setPositiveBehaviors] = useState([]);
  const [negativeBehaviors, setNegativeBehaviors] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBehavior, setSelectedBehavior] = useState(null);
  const [behaviorType, setBehaviorType] = useState(null);

  const [positiveCount, setPositiveCount] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);

  /* ---------------- FILTER STATES ---------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [sortByPoints, setSortByPoints] = useState("desc");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    try {
      const res = await fetch(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentsData = await res.json();
      setStudents(studentsData);

      const logsPos = await fetch(`${API}/logs/type/إيجابي`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const posLogs = await logsPos.json();
      setPositiveCount(posLogs.length);

      const logsNeg = await fetch(`${API}/logs/type/سلبي`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const negLogs = await logsNeg.json();
      setNegativeCount(negLogs.length);

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

  /* ---------------- FILTERING LOGIC ---------------- */
  const filteredStudents = students
    .filter((student) => {
      const matchesName = student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesGrade =
        filterGrade === "all" || String(student.grade) === filterGrade;

      return matchesName && matchesGrade;
    })
    .sort((a, b) =>
      sortByPoints === "desc" ? b.points - a.points : a.points - b.points,
    );

  const resetFilters = () => {
    setSearchTerm("");
    setFilterGrade("all");
    setSortByPoints("desc");
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  /* ---------------- SAVE BEHAVIOR ---------------- */
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
        },
        body: JSON.stringify(payload),
      });

      setSelectedStudent(null);
      setSelectedBehavior(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- STATS ---------------- */
  const stats = [
    {
      title: "عدد الطالبات",
      value: students.length,
      icon: <FaUserGraduate size={26} />,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "السلوك الإيجابي",
      value: positiveCount,
      icon: <FaSmile size={26} />,
      gradient: "from-green-400 to-green-600",
    },
    {
      title: "السلوك السلبي",
      value: negativeCount,
      icon: <FaFrown size={26} />,
      gradient: "from-red-400 to-red-600",
    },
    {
      title: "نسبة الانضباط",
      value:
        students.length > 0
          ? `${Math.round(
              (students.filter((s) => s.points > 0).length / students.length) *
                100,
            )}%`
          : "0%",
      icon: <FaChartPie size={26} />,
      gradient: "from-teal-400 to-teal-600",
    },
  ];

  return (
    <section dir="rtl" className="min-h-screen font-[Tajawal] px-4 py-6">
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

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl shadow-lg mt-8 p-4 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="بحث باسم الطالبة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="all">كل الصفوف</option>
          {[...new Set(students.map((s) => s.grade))].map((grade) => (
            <option key={grade} value={grade}>
              الصف {grade}
            </option>
          ))}
        </select>

        <select
          value={sortByPoints}
          onChange={(e) => setSortByPoints(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="desc">الأعلى نقاط</option>
          <option value="asc">الأقل نقاط</option>
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-500 text-white rounded-lg"
        >
          إعادة تعيين
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl mt-8 p-6">
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
              {filteredStudents.map((s) => (
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
    </section>
  );
}
