"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbLogout, TbSettings } from "react-icons/tb";

export default function Navbar({
  displayName,
  userName,
}: {
  displayName?: string;
  userName: string;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);

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
        if (err === "Token Expired") {
          localStorage.clear();
          router.push("/");
        } else if (err === "Token Blacklisted") {
          localStorage.clear();
          router.push("/");
        }
      }
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow shadow-white/20">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold flex">مرحباً</span>
        <div className="text-xl font-bold ms-2 flex flex-col items-center gap-2">
          <span>{displayName || userName}</span>
          {displayName && (
            <span className={displayName ? "text-sm -mt-3 text-gray-400" : ""}>
              {userName}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="group flex justify-center items-center gap-2 border border-red-500 hover:bg-red-500 active:scale-95 cursor-pointer p-2 rounded"
          onClick={() => setSettings(true)}
        >
          <TbSettings className="text-xl group-hover:animate-spin" />
          الاعدادات
        </button>
        <button
          type="button"
          className="flex justify-center items-center gap-2 border border-red-500 hover:bg-red-500 active:scale-95 cursor-pointer p-2 rounded"
          onClick={() => setChecking(true)}
        >
          <TbLogout />
          تسجيل الخروج
        </button>
      </div>

      {/* logout modal */}
      {checking && (
        <div
          onClick={() => setChecking(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/20 bg-opacity-50 flex items-center justify-center"
        >
          <div className="flex items-center justify-center flex-col gap-5 border w-1/4 h-1/4">
            <span className="text-xl font-bold">
              هل انت متاكد من انك تريد الخروج ؟
            </span>
            <div className="flex gap-2">
              <button
                className="py-2 px-4 rounded border border-red-500 bg-red-500 hover:bg-transparent hover:text-red-500 active:scale-95 cursor-pointer"
                onClick={handleLogout}
              >
                نعم
              </button>
              <button
                className="py-2 px-4 rounded border border-green-500 bg-green-500 hover:bg-transparent hover:text-green-500 active:scale-95 cursor-pointer"
                onClick={() => setChecking(false)}
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}

      {/* settings modal */}
      {settings && (
        <div
          onClick={() => setSettings(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/20 bg-opacity-50 flex items-center justify-center"
        >
          <div className="flex items-center justify-center flex-col gap-5 border p-5">
            <span className="text-xl font-bold">
              لسه مخلصتهاش اتسنا عليا بس شويه وهعملك شغل عالي
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
