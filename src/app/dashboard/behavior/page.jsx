// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FaSmile,
//   FaFrown,
//   FaUserGraduate,
//   FaCrown,
//   FaTrophy,
//   FaListUl,
// } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// export default function BehaviorPage() {
//   const router = useRouter();
//   const API = "https://shaghaf-ishraqa.org/api";

//   const [students, setStudents] = useState([]);
//   const [positiveBehaviors, setPositiveBehaviors] = useState([]);
//   const [negativeBehaviors, setNegativeBehaviors] = useState([]);

//   const [selectedStudent, setSelectedStudent] = useState(null);

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedBehavior, setSelectedBehavior] = useState("");

//   const [eventsList, setEventsList] = useState([]);

//   const [showPositiveModal, setShowPositiveModal] = useState(false);
//   const [showNegativeModal, setShowNegativeModal] = useState(false);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   const loadData = async () => {
//     try {
//       const s = await fetch(`${API}/students`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const studentsData = await s.json();

//       const pos = await fetch(`${API}/behaviors/type/إيجابي`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const neg = await fetch(`${API}/behaviors/type/سلبي`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setStudents(studentsData);
//       setPositiveBehaviors(await pos.json());
//       setNegativeBehaviors(await neg.json());
//     } catch (err) {
//       console.log("LOAD ERROR:", err);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const saveBehavior = async () => {
//     if (!selectedCategory) return alert("اختر التصنيف");
//     if (!selectedBehavior) return alert("اختر اسم الحدث");

//     const payload = {
//       type: showPositiveModal ? "positive" : "negative",
//       category: selectedCategory,
//       event: selectedBehavior,
//     };

//     try {
//       await fetch(`${API}/students/${selectedStudent.id}/points`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       setShowPositiveModal(false);
//       setShowNegativeModal(false);
//       setSelectedCategory("");
//       setSelectedBehavior("");
//       setEventsList([]);

//       loadData();
//     } catch (err) {
//       console.log("SAVE ERROR:", err);
//     }
//   };

//   const topStudents = [...students]
//     .sort((a, b) => b.points - a.points)
//     .slice(0, 3);

//   return (
//     <section dir="rtl" className="min-h-screen px-4 py-6 font-[Tajawal]">
//       {/* ... same code ... */}

//       {/* ---------------------- Students Table ---------------------- */}
//       <div className="bg-white rounded-2xl shadow-xl p-5 mt-6">
//         <table className="w-full text-right border-separate border-spacing-y-2">
//           <thead>
//             <tr className="bg-blue-100 text-blue-800">
//               <th className="p-3">الاسم</th>
//               <th className="p-3">الصف</th>
//               <th className="p-3">النقاط</th>
//               <th className="p-3">الإجراء</th>
//             </tr>
//           </thead>

//           <tbody>
//             {students.map((s) => (
//               <tr key={s.id} className="bg-white shadow-sm rounded-lg">
//                 <td className="p-3 flex items-center gap-2">
//                   <FaUserGraduate className="text-blue-500" />
//                   {s.name}
//                 </td>

//                 <td className="p-3">{s.grade}</td>

//                 <td className="p-3">{Number(s.points).toFixed(2)}</td>

//                 <td className="p-3 flex gap-2">
//                   {/* Positive */}
//                   <button
//                     onClick={() => {
//                       setSelectedStudent(s);
//                       setSelectedCategory("");
//                       setSelectedBehavior("");
//                       setShowPositiveModal(true);
//                     }}
//                     className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
//                   >
//                     <FaSmile /> إيجابي
//                   </button>

//                   {/* Negative */}
//                   <button
//                     onClick={() => {
//                       setSelectedStudent(s);
//                       setSelectedCategory("");
//                       setSelectedBehavior("");
//                       setShowNegativeModal(true);
//                     }}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
//                   >
//                     <FaFrown /> سلبي
//                   </button>

//                   {/* FILE BUTTON — UPDATED */}
//                   <button
//                     onClick={() => router.push(`/dashboard/student?id=${s.id}`)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
//                   >
//                     <FaListUl /> الملف
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBehavior, setSelectedBehavior] = useState("");

  const [showPositiveModal, setShowPositiveModal] = useState(false);
  const [showNegativeModal, setShowNegativeModal] = useState(false);

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

      setShowPositiveModal(false);
      setShowNegativeModal(false);
      setSelectedCategory("");
      setSelectedBehavior("");
      loadData();
    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

  /* ---------------- Group Students By Grade ---------------- */
  const groupedStudents = students.reduce((acc, student) => {
    if (!acc[student.grade]) acc[student.grade] = [];
    acc[student.grade].push(student);
    return acc;
  }, {});

  return (
    <section
      dir="rtl"
      className="min-h-screen px-4 py-6 bg-gray-100 font-[Tajawal]"
    >
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-8">
        إدارة سلوك الطلاب
      </h1>

      {/* ---------------- Grade Category Cards ---------------- */}
      <div className="space-y-6">
        {Object.entries(groupedStudents).map(([grade, gradeStudents]) => {
          const isOpen = expandedGrade === grade;

          return (
            <div
              key={grade}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Grade Header Card */}
              <div
                onClick={() => setExpandedGrade(isOpen ? null : grade)}
                className="cursor-pointer p-5 flex justify-between items-center bg-blue-600 text-white"
              >
                <h2 className="text-lg font-bold">الصف {grade}</h2>

                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {/* Students Section */}
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
                        className="bg-gray-50 rounded-xl p-4 shadow hover:shadow-md transition"
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
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <FaSmile /> إيجابي
                          </button>

                          <button
                            onClick={() => {
                              setSelectedStudent(s);
                              setShowNegativeModal(true);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <FaFrown /> سلبي
                          </button>

                          <button
                            onClick={() =>
                              router.push(`/dashboard/student?id=${s.id}`)
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
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

      {/* ---------------- Modal ---------------- */}
      {(showPositiveModal || showNegativeModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-center">
              {showPositiveModal ? "إضافة سلوك إيجابي" : "إضافة سلوك سلبي"}
            </h3>

            <input
              type="text"
              placeholder="اسم الحدث"
              value={selectedBehavior}
              onChange={(e) => setSelectedBehavior(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={saveBehavior}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                حفظ
              </button>

              <button
                onClick={() => {
                  setShowPositiveModal(false);
                  setShowNegativeModal(false);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
