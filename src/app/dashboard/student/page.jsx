"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaUserGraduate,
  FaStar,
  FaAward,
  FaLightbulb,
  FaHandsHelping,
  FaPrint,
} from "react-icons/fa";

export default function PageWrapper() {
  return (
    <Suspense fallback={<p className="text-center mt-20">جاري التحميل...</p>}>
      <StudentProfilePage />
    </Suspense>
  );
}

function StudentProfilePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [excellence, setExcellence] = useState([]);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const loadData = async () => {
    if (!id || !token) return;

    try {
      const res1 = await fetch(
        `https://shaghaf-ishraqa.org/api/students/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const studentData = await res1.json();

      const res2 = await fetch(
        `https://shaghaf-ishraqa.org/api/students/${id}/logs`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const logsData = await res2.json();

      setStudent(studentData);
      setHistory(logsData.logs || []);
      setInitiatives(logsData.initiatives || []);
      setExcellence(logsData.excellence || []);
      setTalents(logsData.talents || []);

      setLoading(false);
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, token]);

  if (!student || loading)
    return (
      <p className="text-center mt-20 text-gray-600">جاري تحميل البيانات...</p>
    );

  return (
    <>
      {/* PRINT AREA */}
      <section id="print-area" dir="rtl" className="font-[Tajawal]">
        {/* Header Card */}
        <div className="bg-white p-8 border shadow">
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-700">
                {student.name}
              </h1>

              <p className="text-gray-600 mt-2 text-lg">
                الصف: {student.grade}
              </p>

              <div className="mt-4 flex gap-4 flex-wrap">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">
                  {Number(student.points).toFixed(2)} نقطة
                </span>

                <span
                  className={`px-4 py-2 rounded-full text-sm ${
                    student.status === "إيجابي"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {student.status}
                </span>
              </div>
            </div>

            <div className="bg-blue-200 text-blue-700 w-20 h-20 rounded-full flex items-center justify-center text-4xl">
              <FaUserGraduate />
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 no-print"
          >
            <FaPrint /> طباعة الملف
          </button>
        </div>

        {/* Sections */}
        <div className="mt-10 space-y-8">
          <Section title="المبادرات" data={initiatives} />
          <Section title="التميز والتفوق" data={excellence} />
          <Section title="الموهبة" data={talents} />

          <div className="bg-white p-6 border">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              سجل السلوك
            </h2>

            {history.length === 0 ? (
              <p>لا يوجد سجل.</p>
            ) : (
              <ul className="space-y-4">
                {history.map((b, index) => (
                  <li key={index} className="p-4 border flex justify-between">
                    <div>
                      <p className="font-semibold text-lg">{b.event}</p>
                      <p className="text-gray-600 text-sm">
                        التصنيف: {b.category} | التاريخ: {b.date}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        b.type === "إيجابي"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.type}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* FINAL PRINT FIX */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            width: 210mm;
            height: auto;
            margin: 0;
            padding: 0;
          }

          body * {
            visibility: hidden;
          }

          #print-area,
          #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            top: 0;
            right: 0;
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            box-sizing: border-box;
            background: white;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

function Section({ title, data }) {
  return (
    <div className="bg-white p-6 border">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">{title}</h2>

      {data.length === 0 ? (
        <p>لا توجد عناصر.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((i, index) => (
            <li key={index} className="p-4 border">
              <p className="font-semibold">{i.event}</p>
              <p className="text-gray-600 text-sm">التاريخ: {i.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
