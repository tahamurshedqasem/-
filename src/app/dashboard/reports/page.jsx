"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChartPie, FaPrint, FaChartBar } from "react-icons/fa";

export default function ReportsPage() {
  const [studentsData, setStudentsData] = useState([]);
  const [behaviorStats, setBehaviorStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const resStats = await fetch(
        "https://shaghaf-ishraqa.org/api/reports/behavior-stats",
        { headers }
      );
      const stats = await resStats.json();

      const statsWithColors = stats.map((item) => ({
        ...item,
        color: item.name === "سلوك إيجابي" ? "#22c55e" : "#ef4444",
      }));

      setBehaviorStats(statsWithColors);

      const resStudents = await fetch(
        "https://shaghaf-ishraqa.org/api/reports/students-points",
        { headers }
      );
      const students = await resStudents.json();
      setStudentsData(students);

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-600 text-lg">
        جاري تحميل التقرير...
      </p>
    );

  const sortedStudents = [...studentsData].sort(
    (a, b) => b.points - a.points
  );

  return (
    <section dir="rtl" className="min-h-screen font-[Tajawal] px-4 md:px-8 py-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-2"
        >
          <FaChartPie /> التقارير والإحصائيات
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md"
        >
          <FaPrint /> طباعة التقرير
        </motion.button>
      </div>

      {/* SCREEN VERSION */}
      <div className="report-area bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
          <FaChartPie /> توزيع السلوكيات
        </h2>

        <div className="w-full h-72 mb-12">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={behaviorStats}
                dataKey="value"
                nameKey="name"
                label
                outerRadius="70%"
              >
                {behaviorStats.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="top" height={40} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
          <FaChartBar /> ترتيب الطالبات حسب النقاط
        </h2>

        <div className="ranking-list">
          {sortedStudents.map((student, index) => (
            <div className="rank-item" key={student.name}>
              <div className="rank-number">{index + 1}</div>

              <div className="rank-info">
                <h4 className="rank-name">{student.name}</h4>

                <div className="rank-bar">
                  <div
                    className="rank-bar-fill"
                    style={{
                      width: `${Math.min(student.points * 10, 100)}%`,
                    }}
                  ></div>
                </div>

                <p className="rank-points">{student.points} نقطة</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRINT VERSION */}
      <div className="print-area">
        <h1 className="print-title">تقرير السلوكيات والنتائج</h1>

        <p className="print-date">
          التاريخ: {new Date().toLocaleDateString("ar-SA")}
        </p>

        <h2 className="print-section-title">توزيع السلوكيات</h2>

        <svg width="400" height="300" style={{ margin: "0 auto" }}>
          <circle cx="200" cy="150" r="100" fill="#22c55e" />
          <path d="M200,150 L200,50 A100,100 0 0,1 300,150 Z" fill="#ef4444" />
        </svg>

        <h2 className="print-section-title">ترتيب الطالبات حسب النقاط</h2>

        {sortedStudents.map((student, i) => (
          <div key={i} className="print-student-row">
            <strong>
              {i + 1}- {student.name}
            </strong>{" "}
            — {student.points} نقطة
          </div>
        ))}
      </div>

      {/* STYLES */}
      <style jsx>{`
        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
        }

        .rank-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f7faff;
          border: 1px solid #dce8ff;
          padding: 15px;
          border-radius: 12px;
        }

        .rank-number {
          background: #3b82f6;
          color: white;
          font-weight: bold;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rank-info {
          flex: 1;
        }

        .rank-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #1e3a8a;
        }

        .rank-bar {
          width: 100%;
          height: 12px;
          background: #e5edff;
          border-radius: 6px;
          overflow: hidden;
        }

        .rank-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }

        .rank-points {
          font-size: 14px;
          color: #444;
          margin-top: 6px;
        }

        /* PRINT STYLES */
        .print-area {
          display: none;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 20mm;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }

          .report-area {
            display: none !important;
          }

          .print-area {
            display: block !important;
            width: 100%;
            font-size: 18px;
          }

          .print-title {
            text-align: center;
            font-size: 28px;
            margin-bottom: 10px;
          }

          .print-date {
            text-align: center;
            margin-bottom: 30px;
          }

          .print-section-title {
            text-align: center;
            font-size: 22px;
            margin: 30px 0 15px;
          }

          .print-student-row {
            margin-bottom: 12px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 6px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          h1,
          h2 {
            page-break-after: avoid;
          }
        }
      `}</style>
    </section>
  );
}
