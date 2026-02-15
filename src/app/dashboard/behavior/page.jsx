"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSmile,
  FaFrown,
  FaUserGraduate,
  FaListUl,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function BehaviorPage() {
  const router = useRouter();
  const API = "https://shaghaf-ishraqa.org/api";

  const [students, setStudents] = useState([]);
  const [expandedGrade, setExpandedGrade] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBehavior, setSelectedBehavior] = useState("");

  const [showPositiveModal, setShowPositiveModal] = useState(false);
  const [showNegativeModal, setShowNegativeModal] = useState(false);

  /* ---------------- FILTER STATES ---------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [sortByPoints, setSortByPoints] = useState("desc");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- Load Students ---------------- */
  const loadData = async () => {
    try {
      const s = await fetch(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(await s.json());
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- Save Behavior ---------------- */
  const saveBehavior = async () => {
    if (!selectedBehavior) return alert("اكتب اسم الحدث");

    const payload = {
      type: showPositiveModal ? "positive" : "negative",
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

      setShowPositiveModal(false);
      setShowNegativeModal(false);
      setSelectedBehavior("");
      loadData();
    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

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

  /* ---------------- TOP 3 AFTER FILTER ---------------- */
  const topStudents = [...filteredStudents]
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  /* ---------------- GROUP AFTER FILTER ---------------- */
  const groupedStudents = filteredStudents.reduce((acc, student) => {
    if (!acc[student.grade]) acc[student.grade] = [];
    acc[student.grade].push(student);
    return acc;
  }, {});

  const resetFilters = () => {
    setSearchTerm("");
    setFilterGrade("all");
    setSortByPoints("desc");
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen px-4 py-6 bg-gray-100 font-[Tajawal]"
    >
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-10">
        إدارة سلوك الطلاب
      </h1>

      {/* ---------------- FILTER SECTION ---------------- */}
      <div className="bg-white p-5 rounded-2xl shadow-lg mb-10 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="بحث باسم الطالب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="border p-2 rounded-lg w-full"
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
          className="border p-2 rounded-lg w-full"
        >
          <option value="desc">الأعلى نقاط أولاً</option>
          <option value="asc">الأقل نقاط أولاً</option>
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2"
        >
          إعادة تعيين
        </button>
      </div>

      {/* ---------------- TOP STUDENTS ---------------- */}
      {topStudents.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-center text-yellow-600 mb-6">
            🏆 أفضل الطلاب
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {topStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-yellow-300"
              >
                <div className="text-4xl mb-3">
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                </div>

                <h3 className="font-bold text-lg text-blue-700 mb-2">
                  {student.name}
                </h3>

                <p className="text-gray-600 mb-1">الصف {student.grade}</p>

                <p className="text-xl font-bold text-yellow-600">
                  {Number(student.points).toFixed(2)} نقطة
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- GRADE SECTIONS ---------------- */}
      <div className="space-y-6">
        {Object.entries(groupedStudents).map(([grade, gradeStudents]) => {
          const isOpen = expandedGrade === grade;

          return (
            <div
              key={grade}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div
                onClick={() => setExpandedGrade(isOpen ? null : grade)}
                className="cursor-pointer p-5 flex justify-between items-center bg-blue-600 text-white"
              >
                <h2 className="text-lg font-bold">الصف {grade}</h2>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {gradeStudents.map((s) => (
                      <div
                        key={s.id}
                        className="bg-gray-50 rounded-xl p-4 shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FaUserGraduate className="text-blue-500" />
                          <span className="font-semibold">{s.name}</span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          النقاط:
                          <span className="font-bold text-blue-600 mr-2">
                            {Number(s.points).toFixed(2)}
                          </span>
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            onClick={() => {
                              setSelectedStudent(s);
                              setShowPositiveModal(true);
                            }}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <FaSmile /> إيجابي
                          </button>

                          <button
                            onClick={() => {
                              setSelectedStudent(s);
                              setShowNegativeModal(true);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <FaFrown /> سلبي
                          </button>

                          <button
                            onClick={() =>
                              router.push(`/dashboard/student?id=${s.id}`)
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <FaListUl /> الملف
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
