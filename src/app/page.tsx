"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";

type LoginData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  // تحقق من وجود التوكن عند تحميل الصفحة (مرة واحدة فقط)
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.replace("/profile");
    }
  }, [router]);

  // Form state
  const [data, setData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errorHandler, setErrorHandler] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false); // حالة التذكر

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrorHandler("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorHandler("");
    setLoading(true);

    // Validation
    if (!data.email) {
      setErrorHandler("البريد الإلكتروني مطلوب");
      setLoading(false);
      return;
    }
    if (!data.password) {
      setErrorHandler("كلمة المرور مطلوبة");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setErrorHandler("البريد الإلكتروني غير صحيح");
      setLoading(false);
      return;
    }
    if (data.password.length < 6) {
      setErrorHandler("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        data,
      );
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      router.push("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 || error.response?.status === 401) {
          setErrorHandler("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else {
          setErrorHandler("حدث خطأ أثناء التسجيل اتصل بدعم 201093586806+");
        }
      } else {
        setErrorHandler("حدث خطأ أثناء التسجيل اتصل بدعم 201093586806+");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8"
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          تسجيل الدخول
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {errorHandler && (
            <p className="text-white bg-red-500/20 border border-red-500 rounded-lg p-2 m-2 text-center">
              {errorHandler}
            </p>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              البريد الإلكتروني
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                dir="ltr"
                className="block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 dark:border-gray-600"
                placeholder="YourEmail@email.com"
                value={data.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                className="block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 dark:border-gray-600"
                placeholder="••••••••"
                value={data.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
                disabled={loading}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                disabled={loading}
              />
              <label
                htmlFor="remember-me"
                className="mr-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                تذكرني
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "جاري التحميل..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
