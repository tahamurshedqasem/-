"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChartBar,
  FaSmile,
  FaCog,
  FaSignOutAlt,
  FaUsersCog,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) router.push("/login");
    setRole(storedRole);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("button")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseLinks = [
    { name: "لوحة التحكم", icon: <FaTachometerAlt />, href: "/dashboard" },
    { name: "السلوك", icon: <FaSmile />, href: "/dashboard/behavior" },
    { name: "التقارير", icon: <FaChartBar />, href: "/dashboard/reports" },
    { name: "الإعدادات", icon: <FaCog />, href: "/dashboard/settings" },
    {
      name: "إدارة السلوكات",
      icon: <FaSmile />,
      href: "/dashboard/behaviors-management",
    },
  ];

  const adminLinks = [
    {
      name: "إدارة المستخدمين",
      icon: <FaUsersCog />,
      href: "/dashboard/admin/users-management",
    },
  ];

  const navLinks = role === "admin" ? [...baseLinks, ...adminLinks] : baseLinks;

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800 overflow-hidden"
    >
      {/* ===== Mobile Topbar ===== */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-blue-700 text-white px-4 py-3 shadow-md">
        {/* 🔴 EDIT: Website name */}
        <h1 className="text-lg font-bold">شغف وإشراقة</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          <FaBars />
        </button>
      </div>

      {/* ===== Sidebar ===== */}
      <motion.aside
        ref={sidebarRef}
        initial={{ x: 0 }}
        animate={{ width: collapsed ? "80px" : "260px" }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:static top-0 right-0 z-40 flex flex-col justify-between bg-gradient-to-b from-blue-700 to-blue-500 text-white shadow-2xl h-screen ${
          menuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-blue-400">
            {/* 🔴 EDIT: Website name */}
            <span className="text-xl font-bold whitespace-nowrap">
              {collapsed ? "✨" : "شغف وإشراقة"}
            </span>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-white/80 hover:text-white text-lg"
            >
              {collapsed ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-2 py-4 overflow-y-auto flex-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-r-full transition-all ${
                    active
                      ? "bg-white/30 border-r-4 border-white"
                      : "hover:bg-white/10 text-white/80"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {!collapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-blue-400">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <FaSignOutAlt />
            {!collapsed && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </motion.aside>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ===== Main Content ===== */}
      <main
        className={`flex-1 overflow-y-auto ${
          collapsed ? "lg:mr-[80px]" : "lg:mr-[260px]"
        } mt-14 lg:mt-0`}
      >
        <div className="min-h-screen p-6">{children}</div>

        {/* 🔴 EDIT: Footer */}
        <footer className="text-center text-sm text-gray-600 py-4 border-t">
          تم تنفيذه من قبل الموجهة الطلابية
          <br />
          <span className="font-semibold">عفراء آل منجم</span>
        </footer>
      </main>
    </div>
  );
}
