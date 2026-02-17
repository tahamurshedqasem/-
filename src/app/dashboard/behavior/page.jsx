// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { createPortal } from "react-dom";
// import Select from "react-select";
// import { FaSmile, FaFrown, FaUserGraduate, FaListUl } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// export default function BehaviorPage() {
//   const router = useRouter();
//   const API = "https://shaghaf-ishraqa.org/api";

//   const [students, setStudents] = useState([]);
//   const [positiveBehaviors, setPositiveBehaviors] = useState([]);
//   const [negativeBehaviors, setNegativeBehaviors] = useState([]);

//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedBehavior, setSelectedBehavior] = useState(null);

//   const [modalType, setModalType] = useState(null); // 🔥 important

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   /* ================= LOAD DATA ================= */

//   const loadData = async () => {
//     try {
//       const [s, pos, neg] = await Promise.all([
//         fetch(`${API}/students`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API}/behaviors/type/إيجابي`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API}/behaviors/type/سلبي`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setStudents(await s.json());
//       setPositiveBehaviors(await pos.json());
//       setNegativeBehaviors(await neg.json());
//     } catch (err) {
//       console.log("LOAD ERROR:", err);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   /* ================= HELPERS ================= */

//   const getCategory = (item) => item?.category || "";
//   const getBehaviorName = (item) => item?.event || item?.name || "";

//   const activeBehaviors =
//     modalType === "positive" ? positiveBehaviors : negativeBehaviors;

//   const uniqueCategories = useMemo(() => {
//     return [
//       ...new Set(
//         activeBehaviors
//           .map((b) => getCategory(b))
//           .filter((c) => c && c.trim() !== ""),
//       ),
//     ];
//   }, [activeBehaviors]);

//   const filteredEvents = useMemo(() => {
//     if (!selectedCategory) return [];
//     return activeBehaviors.filter(
//       (b) => getCategory(b) === selectedCategory.value,
//     );
//   }, [selectedCategory, activeBehaviors]);

//   /* ================= SAVE ================= */

//   const saveBehavior = async () => {
//     if (!selectedCategory) return alert("اختر التصنيف");
//     if (!selectedBehavior) return alert("اختر الحدث");
//     if (!modalType) return alert("خطأ في نوع السلوك");

//     try {
//       const response = await fetch(
//         `${API}/students/${selectedStudent.id}/points`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             type: modalType, // 🔥 هذا هو المفتاح
//             category: selectedCategory.value,
//             event: selectedBehavior.value,
//           }),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error(errorData);
//         return alert("حدث خطأ أثناء الحفظ");
//       }

//       closeModal();
//       loadData();
//     } catch (err) {
//       console.log("SAVE ERROR:", err);
//     }
//   };
// const closeModal = () => {
//   setModalType(null);
//   setSelectedCategory(null);
//   setSelectedBehavior(null);
//   setSelectedStudent(null);
// };

//   /* ================= UI ================= */

//   return (
//     <section dir="rtl" className="min-h-screen px-4 py-6 font-[Tajawal]">
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
//               <tr key={s.id} className="bg-white shadow-sm">
//                 <td className="p-3 flex items-center gap-2">
//                   <FaUserGraduate className="text-blue-500" />
//                   {s.name}
//                 </td>
//                 <td className="p-3">{s.grade}</td>
//                 <td className="p-3">{Number(s.points || 0).toFixed(2)}</td>
//                 <td className="p-3 flex gap-2">
//                   {/* POSITIVE */}
//                   <button
//                     onClick={() => {
//                       setSelectedStudent(s);
//                       setModalType("positive");
//                     }}
//                     className="bg-green-500 text-white px-3 py-1.5 rounded-lg"
//                   >
//                     إيجابي
//                   </button>

//                   <button
//                     onClick={() => {
//                       setSelectedStudent(s);
//                       setModalType("negative");
//                     }}
//                     className="bg-red-500 text-white px-3 py-1.5 rounded-lg"
//                   >
//                     سلبي
//                   </button>

//                   {/* FILE */}
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

//       {/* ================= MODAL ================= */}

//       {typeof window !== "undefined" &&
//         createPortal(
//           <AnimatePresence>
//             {modalType && (
//               <motion.div
//                 className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//               >
//                 <motion.div
//                   initial={{ scale: 0.9 }}
//                   animate={{ scale: 1 }}
//                   exit={{ scale: 0.9 }}
//                   className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-4"
//                 >
//                   <h2 className="text-lg font-bold">
//                     {modalType === "positive"
//                       ? "إضافة سلوك إيجابي"
//                       : "إضافة سلوك سلبي"}
//                   </h2>

//                   {/* CATEGORY */}
//                   <Select
//                     isRtl
//                     isSearchable
//                     placeholder="اختر التصنيف"
//                     options={uniqueCategories.map((cat) => ({
//                       value: cat,
//                       label: cat,
//                     }))}
//                     value={selectedCategory}
//                     onChange={setSelectedCategory}
//                   />

//                   {/* EVENT */}
//                   <Select
//                     isRtl
//                     isSearchable
//                     placeholder="اختر الحدث"
//                     options={filteredEvents.map((ev) => ({
//                       value: getBehaviorName(ev),
//                       label: getBehaviorName(ev),
//                     }))}
//                     value={selectedBehavior}
//                     onChange={setSelectedBehavior}
//                   />

//                   <div className="flex justify-between pt-2">
//                     <button
//                       onClick={closeModal}
//                       className="bg-gray-400 text-white px-4 py-2 rounded"
//                     >
//                       إلغاء
//                     </button>

//                     <button
//                       onClick={saveBehavior}
//                       className="bg-blue-600 text-white px-4 py-2 rounded"
//                     >
//                       حفظ
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>,
//           document.body,
//         )}
//     </section>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { createPortal } from "react-dom";
// import Select from "react-select";
// import { FaUserGraduate, FaListUl } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// export default function BehaviorPage() {
//   const router = useRouter();
//   const API = "https://shaghaf-ishraqa.org/api";

//   const [students, setStudents] = useState([]);
//   const [positiveBehaviors, setPositiveBehaviors] = useState([]);
//   const [negativeBehaviors, setNegativeBehaviors] = useState([]);

//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedBehavior, setSelectedBehavior] = useState(null);

//   const [modalType, setModalType] = useState(null); // "positive" | "negative" | null

//   // ✅ Filters
//   const [filterName, setFilterName] = useState("");
//   const [filterGrade, setFilterGrade] = useState(null);
//   const [filterScoreMode, setFilterScoreMode] = useState(null);
//   const [filterScoreValue, setFilterScoreValue] = useState("");

//   // ✅ Show/hide by class
//   const [collapsedGrades, setCollapsedGrades] = useState({});

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   /* ================= LOAD DATA ================= */

//   const loadData = async () => {
//     try {
//       const [s, pos, neg] = await Promise.all([
//         fetch(`${API}/students`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API}/behaviors/type/إيجابي`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API}/behaviors/type/سلبي`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setStudents(await s.json());
//       setPositiveBehaviors(await pos.json());
//       setNegativeBehaviors(await neg.json());
//     } catch (err) {
//       console.log("LOAD ERROR:", err);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   /* ================= HELPERS ================= */

//   const getCategory = (item) => item?.category || "";
//   const getBehaviorName = (item) => item?.event || item?.name || "";
//   const getStudentPoints = (s) => Number(s?.points || 0);

//   const activeBehaviors =
//     modalType === "positive" ? positiveBehaviors : negativeBehaviors;

//   const uniqueCategories = useMemo(() => {
//     return [
//       ...new Set(
//         activeBehaviors
//           .map((b) => getCategory(b))
//           .filter((c) => c && c.trim() !== ""),
//       ),
//     ];
//   }, [activeBehaviors]);

//   const filteredEvents = useMemo(() => {
//     if (!selectedCategory) return [];
//     return activeBehaviors.filter(
//       (b) => getCategory(b) === selectedCategory.value,
//     );
//   }, [selectedCategory, activeBehaviors]);

//   // ✅ Grades options
//   const gradeOptions = useMemo(() => {
//     const grades = [
//       ...new Set(
//         students
//           .map((s) => String(s?.grade || "").trim())
//           .filter((g) => g !== ""),
//       ),
//     ].sort((a, b) => a.localeCompare(b, "ar"));

//     return grades.map((g) => ({ value: g, label: g }));
//   }, [students]);

//   // ✅ Score filter mode options
//   const scoreModeOptions = useMemo(
//     () => [
//       { value: "all", label: "الكل" },
//       { value: "gt", label: "أكبر من" },
//       { value: "lt", label: "أقل من" },
//       { value: "eq", label: "يساوي" },
//       { value: "between", label: "بين" },
//     ],
//     [],
//   );

//   /* ================= FILTERING ================= */

//   const passesScoreFilter = (points) => {
//     const mode = filterScoreMode?.value || "all";
//     const raw = (filterScoreValue || "").trim();

//     if (mode === "all") return true;

//     // between: "10-20" or "10,20"
//     if (mode === "between") {
//       const parts = raw.includes("-")
//         ? raw.split("-")
//         : raw.includes(",")
//           ? raw.split(",")
//           : [];
//       if (parts.length !== 2) return true;
//       const a = Number(parts[0].trim());
//       const b = Number(parts[1].trim());
//       if (Number.isNaN(a) || Number.isNaN(b)) return true;
//       const min = Math.min(a, b);
//       const max = Math.max(a, b);
//       return points >= min && points <= max;
//     }

//     const v = Number(raw);
//     if (Number.isNaN(v)) return true;

//     if (mode === "gt") return points > v;
//     if (mode === "lt") return points < v;
//     if (mode === "eq") return Math.abs(points - v) < 0.00001;

//     return true;
//   };

//   const filteredStudents = useMemo(() => {
//     const name = filterName.trim().toLowerCase();
//     const selectedGrade = filterGrade?.value;

//     return students
//       .filter((s) => {
//         const sName = String(s?.name || "").toLowerCase();
//         const sGrade = String(s?.grade || "").trim();
//         const pts = getStudentPoints(s);

//         if (name && !sName.includes(name)) return false;
//         if (selectedGrade && sGrade !== selectedGrade) return false;
//         if (!passesScoreFilter(pts)) return false;

//         return true;
//       })
//       .sort((a, b) => getStudentPoints(b) - getStudentPoints(a));
//   }, [students, filterName, filterGrade, filterScoreMode, filterScoreValue]);

//   // ✅ Group by grade (class)
//   const groupedByGrade = useMemo(() => {
//     const map = {};
//     for (const s of filteredStudents) {
//       const g = String(s?.grade || "غير محدد").trim() || "غير محدد";
//       if (!map[g]) map[g] = [];
//       map[g].push(s);
//     }
//     return Object.keys(map)
//       .sort((a, b) => a.localeCompare(b, "ar"))
//       .map((grade) => ({ grade, list: map[grade] }));
//   }, [filteredStudents]);

//   // ✅ Top students cards (best overall)
//   const topStudents = useMemo(() => {
//     return [...students]
//       .sort((a, b) => getStudentPoints(b) - getStudentPoints(a))
//       .slice(0, 5);
//   }, [students]);

//   // ✅ Top per class (best in each grade)
//   const bestPerGrade = useMemo(() => {
//     const bestMap = {};
//     for (const s of students) {
//       const g = String(s?.grade || "غير محدد").trim() || "غير محدد";
//       if (!bestMap[g]) bestMap[g] = s;
//       else if (getStudentPoints(s) > getStudentPoints(bestMap[g]))
//         bestMap[g] = s;
//     }
//     return Object.entries(bestMap)
//       .map(([grade, s]) => ({ grade, student: s }))
//       .sort((a, b) => a.grade.localeCompare(b.grade, "ar"));
//   }, [students]);

//   const toggleGrade = (grade) => {
//     setCollapsedGrades((prev) => ({
//       ...prev,
//       [grade]: !prev[grade],
//     }));
//   };

//   /* ================= SAVE ================= */

//   const saveBehavior = async () => {
//     if (!selectedCategory) return alert("اختر التصنيف");
//     if (!selectedBehavior) return alert("اختر الحدث");
//     if (!modalType) return alert("خطأ في نوع السلوك");

//     try {
//       const response = await fetch(
//         `${API}/students/${selectedStudent.id}/points`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             type: modalType, // 🔥 هذا هو المفتاح
//             category: selectedCategory.value,
//             event: selectedBehavior.value,
//           }),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error(errorData);
//         return alert("حدث خطأ أثناء الحفظ");
//       }

//       closeModal();
//       loadData();
//     } catch (err) {
//       console.log("SAVE ERROR:", err);
//     }
//   };

//   const closeModal = () => {
//     setModalType(null);
//     setSelectedCategory(null);
//     setSelectedBehavior(null);
//     setSelectedStudent(null);
//   };

//   /* ================= UI ================= */

//   return (
//     <section dir="rtl" className="min-h-screen px-4 py-6 font-[Tajawal]">
//       {/* ✅ Top Students Cards */}
//       <div className="mt-4 space-y-4">
//         <div className="bg-white rounded-2xl shadow-xl p-5">
//           <h2 className="text-lg font-bold mb-3">
//             أفضل الطلاب (الأعلى نقاطًا)
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
//             {topStudents.map((s, idx) => (
//               <motion.div
//                 key={s.id}
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="rounded-xl border bg-white shadow-sm p-4"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <FaUserGraduate className="text-blue-500" />
//                     <div className="font-bold">{s.name}</div>
//                   </div>
//                   <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
//                     #{idx + 1}
//                   </div>
//                 </div>
//                 <div className="mt-2 text-sm text-gray-600">
//                   الصف: {s.grade}
//                 </div>
//                 <div className="mt-2 font-bold">
//                   النقاط: {getStudentPoints(s).toFixed(2)}
//                 </div>
//                 <div className="mt-3 flex gap-2">
//                   <button
//                     onClick={() => router.push(`/dashboard/student?id=${s.id}`)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm"
//                   >
//                     <FaListUl /> الملف
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* ✅ Best per class cards */}
//         <div className="bg-white rounded-2xl shadow-xl p-5">
//           <h2 className="text-lg font-bold mb-3">أفضل طالب في كل صف</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
//             {bestPerGrade.map(({ grade, student }) => (
//               <motion.div
//                 key={`${grade}-${student?.id}`}
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="rounded-xl border bg-white shadow-sm p-4"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="font-bold">{grade}</div>
//                   <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md">
//                     الأفضل
//                   </div>
//                 </div>
//                 <div className="mt-2 flex items-center gap-2">
//                   <FaUserGraduate className="text-blue-500" />
//                   <div className="font-bold">{student?.name}</div>
//                 </div>
//                 <div className="mt-2 font-bold">
//                   النقاط: {getStudentPoints(student).toFixed(2)}
//                 </div>
//                 <div className="mt-3">
//                   <button
//                     onClick={() =>
//                       router.push(`/dashboard/student?id=${student?.id}`)
//                     }
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm"
//                   >
//                     <FaListUl /> الملف
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ✅ Filters */}
//       <div className="bg-white rounded-2xl shadow-xl p-5 mt-6 space-y-4">
//         <h2 className="text-lg font-bold">فلترة الطلاب</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           {/* name */}
//           <div>
//             <label className="block text-sm mb-1 text-gray-700">الاسم</label>
//             <input
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//               placeholder="ابحث بالاسم..."
//               className="w-full border rounded-lg px-3 py-2 outline-none"
//             />
//           </div>

//           {/* class */}
//           <div>
//             <label className="block text-sm mb-1 text-gray-700">الصف</label>
//             <Select
//               isRtl
//               isSearchable
//               placeholder="كل الصفوف"
//               options={[{ value: "", label: "كل الصفوف" }, ...gradeOptions]}
//               value={filterGrade}
//               onChange={(v) => {
//                 if (!v || v.value === "") setFilterGrade(null);
//                 else setFilterGrade(v);
//               }}
//             />
//           </div>

//           {/* scoring */}
//           <div>
//             <label className="block text-sm mb-1 text-gray-700">النقاط</label>
//             <div className="grid grid-cols-2 gap-2">
//               <Select
//                 isRtl
//                 isSearchable={false}
//                 placeholder="الكل"
//                 options={scoreModeOptions}
//                 value={filterScoreMode}
//                 onChange={setFilterScoreMode}
//               />
//               <input
//                 value={filterScoreValue}
//                 onChange={(e) => setFilterScoreValue(e.target.value)}
//                 placeholder={
//                   filterScoreMode?.value === "between"
//                     ? "مثال: 10-20"
//                     : "مثال: 15"
//                 }
//                 className="w-full border rounded-lg px-3 py-2 outline-none"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => {
//               setFilterName("");
//               setFilterGrade(null);
//               setFilterScoreMode(null);
//               setFilterScoreValue("");
//             }}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
//           >
//             تصفير الفلاتر
//           </button>
//         </div>
//       </div>

//       {/* ================= TABLE (GROUPED BY CLASS + SHOW/HIDE) ================= */}

//       <div className="bg-white rounded-2xl shadow-xl p-5 mt-6">
//         <h2 className="text-lg font-bold mb-4">قائمة الطلاب حسب الصف</h2>

//         {groupedByGrade.length === 0 ? (
//           <div className="text-gray-600">لا يوجد نتائج مطابقة للفلترة.</div>
//         ) : (
//           <div className="space-y-4">
//             {groupedByGrade.map(({ grade, list }) => {
//               const isCollapsed = !!collapsedGrades[grade];
//               return (
//                 <div key={grade} className="border rounded-xl overflow-hidden">
//                   {/* Grade header */}
//                   <div className="flex items-center justify-between bg-blue-50 px-4 py-3">
//                     <div className="font-bold text-blue-800">
//                       الصف: {grade}{" "}
//                       <span className="text-sm text-blue-600">
//                         (عدد الطلاب: {list.length})
//                       </span>
//                     </div>

//                     <button
//                       onClick={() => toggleGrade(grade)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm"
//                     >
//                       {isCollapsed ? "إظهار" : "إخفاء"}
//                     </button>
//                   </div>

//                   <AnimatePresence initial={false}>
//                     {!isCollapsed && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         className="overflow-hidden"
//                       >
//                         <table className="w-full text-right border-separate border-spacing-y-2 p-2">
//                           <thead>
//                             <tr className="bg-blue-100 text-blue-800">
//                               <th className="p-3">الاسم</th>
//                               <th className="p-3">الصف</th>
//                               <th className="p-3">النقاط</th>
//                               <th className="p-3">الإجراء</th>
//                             </tr>
//                           </thead>

//                           <tbody>
//                             {list.map((s) => (
//                               <tr key={s.id} className="bg-white shadow-sm">
//                                 <td className="p-3 flex items-center gap-2">
//                                   <FaUserGraduate className="text-blue-500" />
//                                   {s.name}
//                                 </td>
//                                 <td className="p-3">{s.grade}</td>
//                                 <td className="p-3">
//                                   {getStudentPoints(s).toFixed(2)}
//                                 </td>
//                                 <td className="p-3 flex gap-2">
//                                   {/* POSITIVE */}
//                                   <button
//                                     onClick={() => {
//                                       setSelectedStudent(s);
//                                       setModalType("positive");
//                                     }}
//                                     className="bg-green-500 text-white px-3 py-1.5 rounded-lg"
//                                   >
//                                     إيجابي
//                                   </button>

//                                   <button
//                                     onClick={() => {
//                                       setSelectedStudent(s);
//                                       setModalType("negative");
//                                     }}
//                                     className="bg-red-500 text-white px-3 py-1.5 rounded-lg"
//                                   >
//                                     سلبي
//                                   </button>

//                                   {/* FILE */}
//                                   <button
//                                     onClick={() =>
//                                       router.push(
//                                         `/dashboard/student?id=${s.id}`,
//                                       )
//                                     }
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
//                                   >
//                                     <FaListUl /> الملف
//                                   </button>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* ================= MODAL ================= */}

//       {typeof window !== "undefined" &&
//         createPortal(
//           <AnimatePresence>
//             {modalType && (
//               <motion.div
//                 className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//               >
//                 <motion.div
//                   initial={{ scale: 0.9 }}
//                   animate={{ scale: 1 }}
//                   exit={{ scale: 0.9 }}
//                   className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-4"
//                 >
//                   <h2 className="text-lg font-bold">
//                     {modalType === "positive"
//                       ? "إضافة سلوك إيجابي"
//                       : "إضافة سلوك سلبي"}
//                   </h2>

//                   {/* CATEGORY */}
//                   <Select
//                     isRtl
//                     isSearchable
//                     placeholder="اختر التصنيف"
//                     options={uniqueCategories.map((cat) => ({
//                       value: cat,
//                       label: cat,
//                     }))}
//                     value={selectedCategory}
//                     onChange={setSelectedCategory}
//                   />

//                   {/* EVENT */}
//                   <Select
//                     isRtl
//                     isSearchable
//                     placeholder="اختر الحدث"
//                     options={filteredEvents.map((ev) => ({
//                       value: getBehaviorName(ev),
//                       label: getBehaviorName(ev),
//                     }))}
//                     value={selectedBehavior}
//                     onChange={setSelectedBehavior}
//                   />

//                   <div className="flex justify-between pt-2">
//                     <button
//                       onClick={closeModal}
//                       className="bg-gray-400 text-white px-4 py-2 rounded"
//                     >
//                       إلغاء
//                     </button>

//                     <button
//                       onClick={saveBehavior}
//                       className="bg-blue-600 text-white px-4 py-2 rounded"
//                     >
//                       حفظ
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>,
//           document.body,
//         )}
//     </section>
//   );
// }
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Select from "react-select";
import { FaUserGraduate, FaListUl } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function BehaviorPage() {
  const router = useRouter();
  const API = "https://shaghaf-ishraqa.org/api";

  const [students, setStudents] = useState([]);
  const [positiveBehaviors, setPositiveBehaviors] = useState([]);
  const [negativeBehaviors, setNegativeBehaviors] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBehavior, setSelectedBehavior] = useState(null);

  const [modalType, setModalType] = useState(null); // "positive" | "negative" | null

  // ✅ Filters
  const [filterName, setFilterName] = useState("");
  const [filterGrade, setFilterGrade] = useState(null);
  const [filterScoreMode, setFilterScoreMode] = useState(null);
  const [filterScoreValue, setFilterScoreValue] = useState("");

  // ✅ Show/hide by class
  const [collapsedGrades, setCollapsedGrades] = useState({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ================= LOAD DATA ================= */

  const loadData = async () => {
    try {
      const [s, pos, neg] = await Promise.all([
        fetch(`${API}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/behaviors/type/إيجابي`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/behaviors/type/سلبي`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStudents(await s.json());
      setPositiveBehaviors(await pos.json());
      setNegativeBehaviors(await neg.json());
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= HELPERS ================= */

  const getCategory = (item) => item?.category || "";
  const getBehaviorName = (item) => item?.event || item?.name || "";
  const getStudentPoints = (s) => Number(s?.points || 0);

  const activeBehaviors =
    modalType === "positive" ? positiveBehaviors : negativeBehaviors;

  const uniqueCategories = useMemo(() => {
    return [
      ...new Set(
        activeBehaviors
          .map((b) => getCategory(b))
          .filter((c) => c && c.trim() !== ""),
      ),
    ];
  }, [activeBehaviors]);

  const filteredEvents = useMemo(() => {
    if (!selectedCategory) return [];
    return activeBehaviors.filter(
      (b) => getCategory(b) === selectedCategory.value,
    );
  }, [selectedCategory, activeBehaviors]);

  // ✅ Grades options
  const gradeOptions = useMemo(() => {
    const grades = [
      ...new Set(
        students
          .map((s) => String(s?.grade || "").trim())
          .filter((g) => g !== ""),
      ),
    ].sort((a, b) => a.localeCompare(b, "ar"));

    return grades.map((g) => ({ value: g, label: g }));
  }, [students]);

  // ✅ Score filter mode options
  const scoreModeOptions = useMemo(
    () => [
      { value: "all", label: "الكل" },
      { value: "gt", label: "أكبر من" },
      { value: "lt", label: "أقل من" },
      { value: "eq", label: "يساوي" },
      { value: "between", label: "بين" },
    ],
    [],
  );

  /* ================= FILTERING ================= */

  const passesScoreFilter = (points) => {
    const mode = filterScoreMode?.value || "all";
    const raw = (filterScoreValue || "").trim();

    if (mode === "all") return true;

    // between: "10-20" or "10,20"
    if (mode === "between") {
      const parts = raw.includes("-")
        ? raw.split("-")
        : raw.includes(",")
          ? raw.split(",")
          : [];
      if (parts.length !== 2) return true;
      const a = Number(parts[0].trim());
      const b = Number(parts[1].trim());
      if (Number.isNaN(a) || Number.isNaN(b)) return true;
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      return points >= min && points <= max;
    }

    const v = Number(raw);
    if (Number.isNaN(v)) return true;

    if (mode === "gt") return points > v;
    if (mode === "lt") return points < v;
    if (mode === "eq") return Math.abs(points - v) < 0.00001;

    return true;
  };

  const filteredStudents = useMemo(() => {
    const name = filterName.trim().toLowerCase();
    const selectedGrade = filterGrade?.value;

    return students
      .filter((s) => {
        const sName = String(s?.name || "").toLowerCase();
        const sGrade = String(s?.grade || "").trim();
        const pts = getStudentPoints(s);

        if (name && !sName.includes(name)) return false;
        if (selectedGrade && sGrade !== selectedGrade) return false;
        if (!passesScoreFilter(pts)) return false;

        return true;
      })
      .sort((a, b) => getStudentPoints(b) - getStudentPoints(a));
  }, [students, filterName, filterGrade, filterScoreMode, filterScoreValue]);

  // ✅ Group by grade (class)
  const groupedByGrade = useMemo(() => {
    const map = {};
    for (const s of filteredStudents) {
      const g = String(s?.grade || "غير محدد").trim() || "غير محدد";
      if (!map[g]) map[g] = [];
      map[g].push(s);
    }
    return Object.keys(map)
      .sort((a, b) => a.localeCompare(b, "ar"))
      .map((grade) => ({ grade, list: map[grade] }));
  }, [filteredStudents]);

  // ✅ Top students cards (best overall)
  const topStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => getStudentPoints(b) - getStudentPoints(a))
      .slice(0, 5);
  }, [students]);

  // ✅ Top per class (best in each grade)
  const bestPerGrade = useMemo(() => {
    const bestMap = {};
    for (const s of students) {
      const g = String(s?.grade || "غير محدد").trim() || "غير محدد";
      if (!bestMap[g]) bestMap[g] = s;
      else if (getStudentPoints(s) > getStudentPoints(bestMap[g]))
        bestMap[g] = s;
    }
    return Object.entries(bestMap)
      .map(([grade, s]) => ({ grade, student: s }))
      .sort((a, b) => a.grade.localeCompare(b.grade, "ar"));
  }, [students]);

  const toggleGrade = (grade) => {
    setCollapsedGrades((prev) => ({
      ...prev,
      [grade]: !prev[grade],
    }));
  };

  /* ================= SAVE ================= */

  const saveBehavior = async () => {
    if (!selectedCategory) return alert("اختر التصنيف");
    if (!selectedBehavior) return alert("اختر الحدث");
    if (!modalType) return alert("خطأ في نوع السلوك");

    try {
      const response = await fetch(
        `${API}/students/${selectedStudent.id}/points`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: modalType, // 🔥 هذا هو المفتاح
            category: selectedCategory.value,
            event: selectedBehavior.value,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        return alert("حدث خطأ أثناء الحفظ");
      }

      closeModal();
      loadData();
    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCategory(null);
    setSelectedBehavior(null);
    setSelectedStudent(null);
  };

  /* ================= UI HELPERS ================= */

  const StudentMobileCard = ({ s }) => (
    <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FaUserGraduate className="text-blue-500 shrink-0" />
          <div className="font-bold truncate">{s.name}</div>
        </div>
        <div className="text-sm font-bold">
          {getStudentPoints(s).toFixed(2)}
        </div>
      </div>

      <div className="text-sm text-gray-600">الصف: {s.grade}</div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSelectedStudent(s);
            setModalType("positive");
          }}
          className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none"
        >
          إيجابي
        </button>

        <button
          onClick={() => {
            setSelectedStudent(s);
            setModalType("negative");
          }}
          className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none"
        >
          سلبي
        </button>

        <button
          onClick={() => router.push(`/dashboard/student?id=${s.id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm flex-1 sm:flex-none"
        >
          <FaListUl /> الملف
        </button>
      </div>
    </div>
  );

  /* ================= UI ================= */

  return (
    <section
      dir="rtl"
      className="min-h-screen px-3 sm:px-4 lg:px-8 py-5 font-[Tajawal]"
    >
      {/* ✅ Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          إدارة السلوك والنقاط
        </h1>
        <div className="text-sm text-gray-600">
          إجمالي الطلاب: <span className="font-bold">{students.length}</span>
        </div>
      </div>

      {/* ✅ Top Students Cards */}
      <div className="mt-5 space-y-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold mb-3">
            أفضل الطلاب (الأعلى نقاطًا)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {topStudents.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-white shadow-sm p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FaUserGraduate className="text-blue-500 shrink-0" />
                    <div className="font-bold truncate">{s.name}</div>
                  </div>
                  <div className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md shrink-0">
                    #{idx + 1}
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600 truncate">
                  الصف: {s.grade}
                </div>

                <div className="mt-2 font-bold">
                  النقاط: {getStudentPoints(s).toFixed(2)}
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => router.push(`/dashboard/student?id=${s.id}`)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm"
                  >
                    <FaListUl /> الملف
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ✅ Best per class cards */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold mb-3">
            أفضل طالب في كل صف
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {bestPerGrade.map(({ grade, student }) => (
              <motion.div
                key={`${grade}-${student?.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-white shadow-sm p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold truncate">{grade}</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md shrink-0">
                    الأفضل
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 min-w-0">
                  <FaUserGraduate className="text-blue-500 shrink-0" />
                  <div className="font-bold truncate">{student?.name}</div>
                </div>

                <div className="mt-2 font-bold">
                  النقاط: {getStudentPoints(student).toFixed(2)}
                </div>

                <div className="mt-3">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/student?id=${student?.id}`)
                    }
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm"
                  >
                    <FaListUl /> الملف
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 mt-6 space-y-4">
        <h2 className="text-base sm:text-lg font-bold">فلترة الطلاب</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* name */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">الاسم</label>
            <input
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="ابحث بالاسم..."
              className="w-full border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          {/* class */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">الصف</label>
            <Select
              isRtl
              isSearchable
              placeholder="كل الصفوف"
              options={[{ value: "", label: "كل الصفوف" }, ...gradeOptions]}
              value={filterGrade}
              onChange={(v) => {
                if (!v || v.value === "") setFilterGrade(null);
                else setFilterGrade(v);
              }}
            />
          </div>

          {/* scoring */}
          <div>
            <label className="block text-sm mb-1 text-gray-700">النقاط</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Select
                isRtl
                isSearchable={false}
                placeholder="الكل"
                options={scoreModeOptions}
                value={filterScoreMode}
                onChange={setFilterScoreMode}
              />
              <input
                value={filterScoreValue}
                onChange={(e) => setFilterScoreValue(e.target.value)}
                placeholder={
                  filterScoreMode?.value === "between"
                    ? "مثال: 10-20"
                    : "مثال: 15"
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setFilterName("");
              setFilterGrade(null);
              setFilterScoreMode(null);
              setFilterScoreValue("");
            }}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            تصفير الفلاتر
          </button>
        </div>
      </div>

      {/* ================= GROUPED BY CLASS + SHOW/HIDE ================= */}

      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 mt-6">
        <h2 className="text-base sm:text-lg font-bold mb-4">
          قائمة الطلاب حسب الصف
        </h2>

        {groupedByGrade.length === 0 ? (
          <div className="text-gray-600">لا يوجد نتائج مطابقة للفلترة.</div>
        ) : (
          <div className="space-y-4">
            {groupedByGrade.map(({ grade, list }) => {
              const isCollapsed = !!collapsedGrades[grade];
              return (
                <div key={grade} className="border rounded-xl overflow-hidden">
                  {/* Grade header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-blue-50 px-4 py-3">
                    <div className="font-bold text-blue-800">
                      الصف: {grade}{" "}
                      <span className="text-sm text-blue-600">
                        (عدد الطلاب: {list.length})
                      </span>
                    </div>

                    <button
                      onClick={() => toggleGrade(grade)}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      {isCollapsed ? "إظهار" : "إخفاء"}
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {/* ✅ Mobile view: cards */}
                        <div className="block md:hidden p-3 space-y-3">
                          {list.map((s) => (
                            <StudentMobileCard key={s.id} s={s} />
                          ))}
                        </div>

                        {/* ✅ Desktop view: table (with safe horizontal scroll if needed) */}
                        <div className="hidden md:block">
                          <div className="overflow-x-auto">
                            <table className="min-w-[900px] w-full text-right border-separate border-spacing-y-2 p-2">
                              <thead>
                                <tr className="bg-blue-100 text-blue-800">
                                  <th className="p-3">الاسم</th>
                                  <th className="p-3">الصف</th>
                                  <th className="p-3">النقاط</th>
                                  <th className="p-3">الإجراء</th>
                                </tr>
                              </thead>

                              <tbody>
                                {list.map((s) => (
                                  <tr key={s.id} className="bg-white shadow-sm">
                                    <td className="p-3 flex items-center gap-2">
                                      <FaUserGraduate className="text-blue-500" />
                                      {s.name}
                                    </td>
                                    <td className="p-3">{s.grade}</td>
                                    <td className="p-3">
                                      {getStudentPoints(s).toFixed(2)}
                                    </td>
                                    <td className="p-3 flex gap-2">
                                      <button
                                        onClick={() => {
                                          setSelectedStudent(s);
                                          setModalType("positive");
                                        }}
                                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg"
                                      >
                                        إيجابي
                                      </button>

                                      <button
                                        onClick={() => {
                                          setSelectedStudent(s);
                                          setModalType("negative");
                                        }}
                                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg"
                                      >
                                        سلبي
                                      </button>

                                      <button
                                        onClick={() =>
                                          router.push(
                                            `/dashboard/student?id=${s.id}`,
                                          )
                                        }
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
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {modalType && (
              <motion.div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] px-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white w-full max-w-md rounded-xl shadow-xl p-5 sm:p-6 space-y-4"
                >
                  <h2 className="text-lg font-bold">
                    {modalType === "positive"
                      ? "إضافة سلوك إيجابي"
                      : "إضافة سلوك سلبي"}
                  </h2>

                  {/* CATEGORY */}
                  <Select
                    isRtl
                    isSearchable
                    placeholder="اختر التصنيف"
                    options={uniqueCategories.map((cat) => ({
                      value: cat,
                      label: cat,
                    }))}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                  />

                  {/* EVENT */}
                  <Select
                    isRtl
                    isSearchable
                    placeholder="اختر الحدث"
                    options={filteredEvents.map((ev) => ({
                      value: getBehaviorName(ev),
                      label: getBehaviorName(ev),
                    }))}
                    value={selectedBehavior}
                    onChange={setSelectedBehavior}
                  />

                  <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
                    <button
                      onClick={closeModal}
                      className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      إلغاء
                    </button>

                    <button
                      onClick={saveBehavior}
                      className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      حفظ
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
