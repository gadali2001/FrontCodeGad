"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "./components/Navbar";
import { TbBook, TbPlus } from "react-icons/tb";
import IsBanned from "@/IsBanned";
import Link from "next/link";

type ProfileType = {
  displayName?: string;
  userName: string;
  email: string;
  role: string;
};

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileType>({
    displayName: "",
    userName: "",
    email: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isBanned, setIsBanned] = useState<boolean>(false); // حالة الحظر

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
          {
            headers: {
              accessToken: token,
            },
          },
        );
        setProfile(response.data.user);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const err = error.response?.data?.message;
          if (err === "Please Login") {
            router.push("/");
          } else if (err === "Token Blacklisted") {
            localStorage.clear();
            router.push("/");
          } else if (err === "User is banned") {
            // المستخدم محظور
            // localStorage.clear(); // اختياري: مسح التوكنات
            setIsBanned(true); // تفعيل عرض مكون الحظر
          } else if (err === "Token Expired") {
            try {
              const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
                {
                  refreshToken: localStorage.getItem("refreshToken"),
                },
              );
              localStorage.setItem("accessToken", res.data.accessToken);
              // بعد تجديد التوكن، نعيد محاولة جلب البيانات
              fetchProfile();
            } catch (error: unknown) {
              if (axios.isAxiosError(error)) {
                const err = error.response?.data?.message;
                if (
                  err === "Token Expired" ||
                  err === "Token Blacklisted" ||
                  err === "User not found"
                ) {
                  localStorage.clear();
                  router.push("/");
                }
              }
            }
          } else {
            setErrorMessage("حدث خطأ أثناء التسجيل اتصل بدعم 201093586806+");
          }
        } else {
          setErrorMessage("حدث خطأ أثناء التسجيل اتصل بدعم 201093586806+");
        }
      }
    };

    fetchProfile();
  }, [router]);

  // عرض خطأ عام إن وجد
  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;

  // إذا كان المستخدم محظوراً، اعرض مكون IsBanned
  if (isBanned) {
    return <IsBanned />;
  }

  // المحتوى العادي (غير المحظور)
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar data={profile} />

      {/* قسم البطاقات */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-2">
          <span className="w-1 h-8 bg-indigo-500 rounded-full"></span>
          ابدأ رحلتك التعليمية
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* بطاقة الكورسات */}
          <Link
            href="/profile/Courses"
            className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:shadow-xl hover:shadow-indigo-500/20 transition-all cursor-pointer hover:border-indigo-500/50 hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-colors">
              <TbBook className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
              الكورسات
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              استعرض جميع الكورسات المتاحة في مختلف المجالات وابدأ التعلم خطوة
              بخطوة
            </p>
            <span className="text-indigo-400 text-sm font-medium flex items-center gap-1">
              تصفح الكورسات
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
          </Link>

          {/* بطاقة الدين الإسلامي */}
          <div className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:shadow-xl hover:shadow-emerald-500/20 transition-all cursor-pointer hover:border-emerald-500/50 hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600/30 transition-colors">
              <TbBook className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              الدين الإسلامي
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              دروس ومقالات عن الإسلام وتعاليمه السمحة، لفهم أعمق للدين الحنيف
            </p>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              استكشف المحتوى
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
          </div>

          {/* بطاقة قابلة للإضافة لاحقاً */}
          <div className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-not-allowed opacity-60">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
              <TbPlus className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">قريباً</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              محتوى جديد قيد الإعداد، تابعونا قريباً
            </p>
            <span className="text-purple-400 text-sm font-medium">
              قيد التطوير
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
