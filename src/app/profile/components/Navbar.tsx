"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbLogout, TbSettings, TbUserCircle, TbEdit } from "react-icons/tb";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";

export default function Navbar({
  data,
}: {
  data: {
    displayName?: string;
    userName: string;
    email: string;
    role: string;
  };
}) {
  const router = useRouter();
  const [checking, setChecking] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);
  const [profileEdit, setProfileEdit] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    displayName: data.displayName,
    userName: data.userName,
    email: data.email,
    role: data.role,
  });

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      });
      localStorage.clear();
      router.push("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data?.message;
        if (err === "Token Expired" || err === "Token Blacklisted") {
          localStorage.clear();
          router.push("/");
        }
      }
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <nav className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* القسم الأيمن: اسم المستخدم مع أيقونة */}
            <div className="flex items-center gap-3 min-w-0">
              <TbUserCircle className="text-indigo-400 text-2xl" />
              <div className="flex flex-col truncate">
                <span className="text-white font-semibold truncate">
                  {data.displayName || data.userName}
                </span>
                {data.displayName && (
                  <span className="text-xs text-gray-400 truncate">
                    @{data.userName}
                  </span>
                )}
              </div>
            </div>

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>

            {/* الأزرار للشاشات المتوسطة والكبيرة */}
            <div className="hidden md:flex items-center gap-2">
              {data.role === "admin" && (
                <Link
                  href="/profile/ListUsers"
                  className="group flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all border border-indigo-500/30"
                >
                  <TbSettings className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                  <span>المستخدم</span>
                </Link>
              )}
              <button
                type="button"
                className="group flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all border border-indigo-500/30"
                onClick={() => setSettings(true)}
              >
                <TbSettings className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                <span>الإعدادات</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-xl transition-all border border-red-500/30"
                onClick={() => setChecking(true)}
              >
                <TbLogout className="text-lg" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>

          {/* القائمة المنسدلة للجوال */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-700/50 mt-2 space-y-2">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all border border-indigo-500/30"
                onClick={() => {
                  setSettings(true);
                  setMobileMenuOpen(false);
                }}
              >
                <TbSettings className="text-lg" />
                <span>الإعدادات</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-xl transition-all border border-red-500/30"
                onClick={() => {
                  setChecking(true);
                  setMobileMenuOpen(false);
                }}
              >
                <TbLogout className="text-lg" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* مودال تأكيد تسجيل الخروج */}
      {checking && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setChecking(false)}
        >
          <div
            className="bg-gray-800/90 backdrop-blur-xl rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white text-center mb-6">
              هل أنت متأكد من أنك تريد الخروج؟
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-2.5 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg font-medium"
                onClick={handleLogout}
              >
                نعم
              </button>
              <button
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all font-medium"
                onClick={() => setChecking(false)}
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال الإعدادات / تعديل الملف الشخصي */}
      {settings && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setProfileData({
              displayName: data.displayName,
              userName: data.userName,
              email: data.email,
              role: data.role,
            });
            setSettings(false);
          }}
        >
          <div
            className="bg-gray-800/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TbSettings className="text-indigo-400" />
                الإعدادات
              </h2>
              <button
                onClick={() => setSettings(false)}
                className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <HiX size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  اسم العرض
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  disabled={profileEdit}
                  value={profileData.displayName || ""}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      displayName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  disabled={profileEdit}
                  value={profileData.userName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, userName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  disabled={profileEdit}
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  الصلاحية
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  disabled={profileEdit}
                  value={profileData.role}
                  onChange={(e) =>
                    setProfileData({ ...profileData, role: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              <button
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-medium flex items-center gap-2"
                onClick={() => setProfileEdit(false)}
              >
                <TbEdit />
                تعديل
              </button>
              <button
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all font-medium"
                onClick={() => {
                  setProfileData({
                    displayName: data.displayName,
                    userName: data.userName,
                    email: data.email,
                    role: data.role,
                  });
                  setSettings(false);
                }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
