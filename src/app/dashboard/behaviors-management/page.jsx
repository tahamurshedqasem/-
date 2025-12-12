"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaListUl,
  FaSmile,
  FaFrown,
} from "react-icons/fa";

export default function BehaviorsManagementPage() {
  const API = "https://shaghaf-ishraqa.org/api";

  const [behaviors, setBehaviors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingBehavior, setEditingBehavior] = useState(null);

  const [form, setForm] = useState({
    type: "",
    category: "",
    event: "",
    points: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ===============================
  // Load all behaviors
  // ===============================
  const loadBehaviors = async () => {
    try {
      const res = await fetch(`${API}/behaviors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBehaviors(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading behaviors:", error);
    }
  };

  useEffect(() => {
    loadBehaviors();
  }, []);

  // ===============================
  // Open modal (add/edit)
  // ===============================
  const openModal = (behavior = null) => {
    if (behavior) {
      setEditingBehavior(behavior);
      setForm({
        type: behavior.type,
        category: behavior.category,
        event: behavior.event,
        points: behavior.points,
      });
    } else {
      setEditingBehavior(null);
      setForm({ type: "", category: "", event: "", points: "" });
    }
    setShowModal(true);
  };

  // ===============================
  // Save behavior
  // ===============================
  const saveBehavior = async () => {
    if (!form.type || !form.category || !form.event || form.points === "") {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

    const url = editingBehavior
      ? `${API}/behaviors/${editingBehavior.id}`
      : `${API}/behaviors`;

    const method = editingBehavior ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          points: Number(form.points), // << FLOAT FIX HERE
        }),
      });

      setShowModal(false);
      loadBehaviors();
    } catch (error) {
      console.error("Error saving behavior:", error);
    }
  };

  // ===============================
  // Delete behavior
  // ===============================
  const deleteBehavior = async (id) => {
    if (!confirm("هل تريد حذف هذا السلوك؟")) return;

    try {
      await fetch(`${API}/behaviors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      loadBehaviors();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <section dir="rtl" className="min-h-screen px-4 py-6 font-[Tajawal]">
      <motion.h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-6">
        <FaListUl /> إدارة السلوكات
      </motion.h1>

      {/* ADD BUTTON */}
      <button
        onClick={() => openModal()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
      >
        <FaPlus /> إضافة سلوك جديد
      </button>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl p-5 mt-6 overflow-x-auto">
        {loading ? (
          <p className="text-center py-6 text-gray-500">
            جاري تحميل البيانات...
          </p>
        ) : (
          <table className="w-full text-right border-separate border-spacing-y-2 min-w-[700px]">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="p-3">النوع</th>
                <th className="p-3">التصنيف</th>
                <th className="p-3">الحدث</th>
                <th className="p-3">النقاط</th>
                <th className="p-3 text-center">الإجراء</th>
              </tr>
            </thead>

            <tbody>
              {behaviors.map((b) => (
                <tr key={b.id} className="bg-white rounded-lg shadow-sm">
                  <td className="p-3 font-semibold flex items-center gap-2">
                    {b.type === "إيجابي" ? (
                      <FaSmile className="text-green-500" />
                    ) : (
                      <FaFrown className="text-red-500" />
                    )}
                    {b.type}
                  </td>

                  <td className="p-3">{b.category}</td>
                  <td className="p-3">{b.event}</td>

                  <td className="p-3 font-bold">
                    {b.points > 0 ? "+" : ""}
                    {b.points}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => openModal(b)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <FaEdit /> تعديل
                    </button>

                    <button
                      onClick={() => deleteBehavior(b.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
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
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4">
            <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
              {editingBehavior ? "تعديل السلوك" : "إضافة سلوك جديد"}
            </h2>

            {/* TYPE */}
            <select
              className="w-full border rounded-lg p-2"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">اختر النوع</option>
              <option value="إيجابي">إيجابي</option>
              <option value="سلبي">سلبي</option>
            </select>

            {/* CATEGORY */}
            <input
              type="text"
              placeholder="التصنيف"
              className="w-full border rounded-lg p-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            {/* EVENT NAME */}
            <input
              type="text"
              placeholder="اسم الحدث"
              className="w-full border rounded-lg p-2"
              value={form.event}
              onChange={(e) => setForm({ ...form, event: e.target.value })}
            />

            {/* POINTS (FLOAT) */}
            <input
              type="number"
              step="0.01"
              placeholder="النقاط مثال: 0.25 أو -0.50"
              className="w-full border rounded-lg p-2"
              value={form.points}
              onChange={(e) =>
                setForm({
                  ...form,
                  points: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />

            {/* BUTTONS */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                إلغاء
              </button>

              <button
                onClick={saveBehavior}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
