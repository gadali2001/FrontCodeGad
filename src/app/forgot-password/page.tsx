"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

export default function ForgetPassword() {
  const router = useRouter();

  // حالات الصفحة: "email" (الخطوة الأولى) أو "reset" (الخطوة الثانية)
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  }); // type: "success" | "error"
  const [countdown, setCountdown] = useState<number>(0); // عداد لإعادة الإرسال

  const messageRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي إلى الرسالة
  useEffect(() => {
    if (message.text && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [message.text]);

  // عداد إعادة الإرسال
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );
  const toggleConfirmPasswordVisibility = useCallback(
    () => setShowConfirmPassword((prev) => !prev),
    [],
  );

  // طلب إرسال OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email.trim()) {
      setMessage({ type: "error", text: "البريد الإلكتروني مطلوب" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "البريد الإلكتروني غير صحيح" });
      return;
    }

    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forget-password`,
        { email },
      );
      setMessage({
        type: "success",
        text: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
      });
      setStep("reset");
      setCountdown(60); // بدء عداد 60 ثانية لإعادة الإرسال
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message;
        if (errMsg === "User not found") {
          setMessage({ type: "error", text: "البريد الإلكتروني غير مسجل" });
        } else {
          setMessage({
            type: "error",
            text: "حدث خطأ أثناء الإرسال. حاول مرة أخرى لاحقاً",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // إعادة إرسال OTP (مع عداد)
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setMessage({ type: "", text: "" });
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forget-password`,
        { email },
      );
      setMessage({ type: "success", text: "تم إعادة إرسال رمز التحقق" });
      setCountdown(60);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message;
        if (errMsg === "User not found") {
          setMessage({ type: "error", text: "البريد الإلكتروني غير مسجل" });
        } else {
          setMessage({
            type: "error",
            text: "حدث خطأ أثناء الإرسال. حاول مرة أخرى لاحقاً",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // إعادة تعيين كلمة المرور
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!otp.trim()) {
      setMessage({ type: "error", text: "رمز التحقق مطلوب" });
      return;
    }
    if (!newPassword) {
      setMessage({ type: "error", text: "كلمة المرور الجديدة مطلوبة" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "كلمة المرور وتأكيدها غير متطابقتين" });
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          email,
          otp,
          password: newPassword,
          confirmPassword,
        },
      );
      setMessage({
        type: "success",
        text: "تم تغيير كلمة المرور بنجاح! جارِ تحويلك إلى تسجيل الدخول...",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message;
        if (errMsg === "Invalid OTP") {
          setMessage({ type: "error", text: "رمز التحقق غير صحيح" });
        } else if (errMsg === "User not found") {
          setMessage({ type: "error", text: "حدث خطأ، يرجى البدء من جديد" });
          setStep("email");
        } else {
          setMessage({ type: "error", text: "حدث خطأ أثناء إعادة التعيين" });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // الرجوع إلى خطوة إدخال البريد
  const goBackToEmail = () => {
    setStep("email");
    setMessage({ type: "", text: "" });
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8"
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* عنوان الصفحة */}
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          {step === "email" ? "نسيت كلمة المرور؟" : "إعادة تعيين كلمة المرور"}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {step === "email"
            ? "أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق"
            : `أدخل الرمز المرسل إلى ${email}`}
        </p>

        {/* رسائل النجاح/الخطأ */}
        {message.text && (
          <div
            ref={messageRef}
            className={`mb-6 p-3 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-500/20 border border-green-500 text-green-700 dark:text-green-300"
                : "bg-red-500/20 border border-red-500 text-red-700 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === "email" ? (
          // ------------------- الخطوة الأولى: إدخال البريد -------------------
          <form onSubmit={handleSendOtp} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  className="block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="YourEmail@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
            </button>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <FiArrowLeft className="ml-1" /> العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        ) : (
          // ------------------- الخطوة الثانية: إدخال OTP وكلمة المرور -------------------
          <form onSubmit={handleResetPassword} className="space-y-5" noValidate>
            {/* رمز التحقق */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                رمز التحقق <span className="text-red-500">*</span>
              </label>
              <input
                id="otp"
                type="text"
                dir="ltr"
                className="block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 text-center text-lg tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                }
                disabled={loading}
                maxLength={6}
                required
              />
            </div>

            {/* كلمة المرور الجديدة */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                كلمة المرور الجديدة <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  className="block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
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

            {/* تأكيد كلمة المرور */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                تأكيد كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  dir="ltr"
                  className="block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? "إخفاء كلمة المرور"
                      : "إظهار كلمة المرور"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "جاري..." : "تأكيد وإعادة تعيين"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || countdown > 0}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0
                  ? `إعادة الإرسال (${countdown})`
                  : "إعادة إرسال الرمز"}
              </button>
            </div>

            {/* رابط العودة إلى خطوة البريد */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={goBackToEmail}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <FiArrowLeft className="ml-1" /> استخدام بريد إلكتروني آخر
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
