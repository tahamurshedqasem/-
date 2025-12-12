"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import * as XLSX from "xlsx";
import { FaSearch, FaPlus, FaUserGraduate, FaFileUpload } from "react-icons/fa";

export default function StudentsPage() {
  const [students, setStudents] = useState([
    { id: 1, name: "سارة أحمد", grade: "3/1", points: 1.25, status: "إيجابي" },
    { id: 2, name: "ريم خالد", grade: "2/2", points: -0.5, status: "سلبي" },
  ]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", grade: "" });

  // بحث فوري
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // تحميل ملف Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // تحويل البيانات إلى الشكل المطلوب
      const importedStudents = jsonData.map((row, index) => ({
        id: Date.now() + index,
        name: row["الاسم"] || row["Name"] || "بدون اسم",
        grade: row["الصف"] || row["Class"] || "-",
        points: parseFloat(row["النقاط"] || 0),
        status:
          row["الحالة"] ||
          (row["النقاط"] > 0.75
            ? "إيجابي"
            : row["النقاط"] < 0
            ? "سلبي"
            : "جيد"),
      }));

      setStudents((prev) => [...prev, ...importedStudents]);
    };
    reader.readAsArrayBuffer(file);
  };

  // إضافة طالبة يدوياً
  const addStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return;
    setStudents([
      ...students,
      {
        id: Date.now(),
        name: newStudent.name,
        grade: newStudent.grade || "-",
        points: 0,
        status: "جيد",
      },
    ]);
    setNewStudent({ name: "", grade: "" });
    setShowModal(false);
  };

  return (
    <section className="min-h-screen bg-transparent">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-blue-700 flex items-center gap-2"
        >
          <FaUserGraduate className="text-blue-600" /> إدارة الطالبات 
        </motion.h1>

        <div className="flex gap-2 flex-wrap">
          {/* زر رفع Excel */}
          <label className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md cursor-pointer transition">
            <FaFileUpload />
            <span>رفع Excel</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* زر إضافة طالبة */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <FaPlus /> إضافة طالبة
          </motion.button>
        </div>
      </div>

      {/* مربع البحث */}
      <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl px-4 py-2 mb-6 shadow-sm w-full sm:w-96">
        <FaSearch className="text-blue-400" />
        <input
          type="text"
          placeholder="ابحث عن طالبة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none bg-transparent text-sm"
        />
      </div>

      {/* الجدول */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-blue-100 overflow-x-auto"
      >
        <table className="w-full text-right text-gray-700 border-separate border-spacing-y-2 min-w-[600px]">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-3 rounded-s-lg">الاسم</th>
              <th className="p-3">الصف</th>
              <th className="p-3">النقاط</th>
              <th className="p-3 rounded-e-lg">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="bg-white hover:bg-blue-50 transition rounded-lg shadow-sm"
                >
                  <td className="p-3 font-medium">{student.name}</td>
                  <td className="p-3">{student.grade}</td>
                  <td className="p-3">{student.points.toFixed(2)}</td>
                  <td
                    className={`p-3 font-semibold ${
                      student.status === "إيجابي"
                        ? "text-green-600"
                        : student.status === "سلبي"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {student.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  لا توجد بيانات حالياً.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* مودال إضافة طالبة يدوياً */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-blue-100"
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-4">
                إضافة طالبة جديدة
              </h2>
              <form onSubmit={addStudent} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    اسم الطالبة
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="مثلاً: نورة خالد"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    الصف / الشعبة
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="مثلاً: 3/2"
                    value={newStudent.grade}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, grade: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
