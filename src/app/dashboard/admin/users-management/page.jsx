"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaUserGraduate,
  FaPlus,
  FaTrash,
  FaFileExcel,
  FaUsersCog,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

export default function UsersManagementPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const API = "https://shaghaf-ishraqa.org/api";

  // ============================================
  // HOOKS (MUST ALWAYS BE AT THE TOP)
  // ============================================
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState("teachers");

  const [teachers, setTeachers] = useState([]);
  const [managements, setManagements] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    grade: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ============================================
  // AUTH CHECK (ADMIN ONLY)
  // ============================================
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      setAuthorized(true);
    } else {
      router.push("/dashboard");
    }

    setCheckingAuth(false);
  }, []);

  // ============================================
  // LOAD USERS FROM BACKEND
  // ============================================
  const loadUsers = async () => {
    setLoading(true);

    try {
      const t = await fetch(`${API}/users/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(await t.json());

      const m = await fetch(`${API}/users/management`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagements(await m.json());

      const s = await fetch(`${API}/users/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(await s.json());
    } catch (err) {
      console.error("Load Users Error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authorized) loadUsers();
  }, [authorized]);

  // ============================================
  // CURRENT TAB LIST
  // ============================================
  const currentList =
    activeTab === "teachers"
      ? teachers
      : activeTab === "managements"
      ? managements
      : students;

  // ============================================
  // ADD NEW USER
  // ============================================
  const handleAdd = () => {
    setFormData({ name: "", email: "", password: "", grade: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    let url = "";

    if (activeTab === "teachers") url = `${API}/users/teachers`;
    else if (activeTab === "managements") url = `${API}/users/management`;
    else url = `${API}/users/students`;

    const body =
      activeTab === "students"
        ? {
            name: formData.name,
            grade: formData.grade,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: activeTab === "teachers" ? "teacher" : "management",
          };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowModal(false);
      loadUsers();
    } else {
      alert("خطأ أثناء إضافة المستخدم ❌");
    }
  };

  // ============================================
  // DELETE USER
  // ============================================
  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد؟")) return;

    let url = "";

    if (activeTab === "teachers") url = `${API}/users/teachers/${id}`;
    else if (activeTab === "managements") url = `${API}/users/management/${id}`;
    else url = `${API}/users/students/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) loadUsers();
    else alert("تعذر الحذف ❌");
  };

  // ============================================
  // EXCEL IMPORT
  // ============================================
  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      try {
        if (activeTab !== "students") {
          await fetch(`${API}/users/import`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              users: rows.map((r) => ({
                name: r.name,
                email: r.email,
                password: r.password || "123456",
                role: activeTab === "teachers" ? "teacher" : "management",
              })),
            }),
          });
        } else {
          await fetch(`${API}/students/import`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              students: rows.map((r) => ({
                name: r.name,
                grade: r.grade,
              })),
            }),
          });
        }

        alert("تم الاستيراد بنجاح ✓");
        loadUsers();
      } catch (error) {
        alert("خطأ أثناء الاستيراد ❌");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // ============================================
  // SAFE RENDERING (NO HOOK ORDER BUGS)
  // ============================================
  if (checkingAuth) {
    return (
      <p className="text-center mt-10 text-gray-500">
        جاري التحقق من الصلاحيات...
      </p>
    );
  }

  if (!authorized) return null;

  // ============================================
  // PAGE RENDER
  // ============================================
  return (
    <section dir="rtl" className="min-h-screen px-4 py-6 font-[Tajawal]">
      <motion.h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 flex items-center gap-2">
        <FaUsersCog /> إدارة الكادر والطالبات
      </motion.h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {[
          { key: "teachers", label: "المعلمات", icon: <FaChalkboardTeacher /> },
          {
            key: "managements",
            label: "المرشدات والمديرات",
            icon: <FaClipboardList />,
          },
          { key: "students", label: "الطالبات", icon: <FaUserGraduate /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-gray-700">
          قائمة{" "}
          {activeTab === "teachers"
            ? "المعلمات"
            : activeTab === "managements"
            ? "المرشدات والمديرات"
            : "الطالبات"}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> إضافة جديد
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaFileExcel /> استيراد Excel
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleExcelImport}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg p-4 overflow-x-auto">
        {loading ? (
          <p className="text-center py-6 text-gray-500">جاري التحميل...</p>
        ) : (
          <table className="w-full min-w-[600px] border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="p-3">الاسم</th>
                {activeTab !== "students" && <th className="p-3">البريد</th>}
                {activeTab === "students" && <th className="p-3">الصف</th>}
                <th className="p-3 text-center">إجراء</th>
              </tr>
            </thead>

            <tbody>
              {currentList.map((u) => (
                <tr key={u.id} className="bg-white rounded-lg shadow-sm">
                  <td className="p-3">{u.name}</td>

                  {activeTab !== "students" && (
                    <td className="p-3">{u.email}</td>
                  )}

                  {activeTab === "students" && (
                    <td className="p-3">{u.grade}</td>
                  )}

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <FaTrash /> حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-xl font-bold text-blue-700 mb-4">
                إضافة مستخدم جديد
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  className="border p-2 w-full rounded-lg"
                  placeholder="الاسم"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                {activeTab !== "students" && (
                  <>
                    <input
                      type="email"
                      className="border p-2 w-full rounded-lg"
                      placeholder="البريد"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />

                    <input
                      type="password"
                      className="border p-2 w-full rounded-lg"
                      placeholder="كلمة المرور"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {activeTab === "students" && (
                  <input
                    type="text"
                    className="border p-2 w-full rounded-lg"
                    placeholder="الصف (مثال: 3/1)"
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                  />
                )}

                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                  حفظ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
