"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { countries } from "@/countries";

type RegisterData = {
  displayName: string;
  userName: string;
  day: string;
  month: string;
  year: string;
  gender: "male" | "female" | "";
  phone: string;
  country: string;
  city: string;
  region: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.replace("/profile");
    }
  }, [router]);

  const [data, setData] = useState<RegisterData>({
    displayName: "",
    userName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    phone: "",
    country: "",
    city: "",
    region: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [errorHandler, setErrorHandler] = useState<string>("");
  const [userNameError, setUserNameError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // reference for scrolling to error
  const errorRef = useRef<HTMLParagraphElement>(null);

  // scroll to error smoothly
  const scrollToError = useCallback(() => {
    if (errorRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, []);

  // scroll whenever errorHandler changes (new error message)
  useEffect(() => {
    if (errorHandler) {
      scrollToError();
    }
  }, [errorHandler, scrollToError]);

  const getDaysInMonth = (month: string, year: string): number => {
    if (!month || !year) return 31;
    const m = parseInt(month);
    const y = parseInt(year);
    if (isNaN(m) || isNaN(y)) return 31;
    return new Date(y, m, 0).getDate();
  };

  const maxDays = getDaysInMonth(data.month, data.year);

  useEffect(() => {
    if (data.day && parseInt(data.day) > maxDays) {
      setData((prev) => ({ ...prev, day: maxDays.toString() }));
    }
  }, [data.month, data.year, maxDays, data.day]);

  useEffect(() => {
    if (data.country) {
      const selectedCountry = countries.find((c) => c.name === data.country);
      setAvailableCities(selectedCountry ? selectedCountry.cities : []);
      if (selectedCountry && !selectedCountry.cities.includes(data.city)) {
        setData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [data.country, data.city]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const originalValue = value;
      const numericValue = originalValue.replace(/[^0-9]/g, "");
      setData((prev) => ({ ...prev, [name]: numericValue }));

      if (/[^0-9]/.test(originalValue)) {
        setPhoneError("رقم الهاتف يجب أن يحتوي على أرقام فقط");
      } else {
        setPhoneError("");
      }
    } else if (name === "userName") {
      const filtered = value.replace(/[^a-zA-Z0-9]/g, "");
      setData((prev) => ({ ...prev, [name]: filtered }));

      if (filtered !== value) {
        setUserNameError(
          "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط",
        );
      } else {
        setUserNameError("");
      }
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }

    setErrorHandler("");
  };

  const calculateAge = (day: string, month: string, year: string): number => {
    if (!day || !month || !year) return 0;
    const birthDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const validateForm = (): boolean => {
    if (!data.userName.trim()) {
      setUserNameError("اسم المستخدم مطلوب");
      setErrorHandler("اسم المستخدم مطلوب");
      return false;
    }
    const userNameRegex = /^[a-zA-Z0-9]+$/;
    if (!userNameRegex.test(data.userName)) {
      setUserNameError(
        "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط",
      );
      setErrorHandler("اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط");
      return false;
    }

    if (!data.phone.trim()) {
      setPhoneError("رقم الهاتف مطلوب");
      setErrorHandler("رقم الهاتف مطلوب");
      return false;
    }
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(data.phone)) {
      setPhoneError("رقم الهاتف يجب أن يحتوي على أرقام فقط");
      setErrorHandler("رقم الهاتف يجب أن يحتوي على أرقام فقط");
      return false;
    }
    if (data.phone.length < 7 || data.phone.length > 15) {
      setPhoneError("رقم الهاتف يجب أن يكون بين 7 و 15 رقم");
      setErrorHandler("رقم الهاتف يجب أن يكون بين 7 و 15 رقم");
      return false;
    }

    if (!data.day || !data.month || !data.year) {
      setErrorHandler("تاريخ الميلاد مطلوب");
      return false;
    }
    const age = calculateAge(data.day, data.month, data.year);
    if (age < 10 || age > 60) {
      setErrorHandler("يجب أن يكون العمر بين 10 و 60 سنة");
      return false;
    }

    if (!data.gender) {
      setErrorHandler("الرجاء اختيار الجنس");
      return false;
    }
    if (!data.country) {
      setErrorHandler("الدولة مطلوبة");
      return false;
    }
    if (!data.city) {
      setErrorHandler("المدينة مطلوبة");
      return false;
    }
    if (!data.email.trim()) {
      setErrorHandler("البريد الإلكتروني مطلوب");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setErrorHandler("البريد الإلكتروني غير صحيح");
      return false;
    }
    if (!data.password) {
      setErrorHandler("كلمة المرور مطلوبة");
      return false;
    }
    if (data.password.length < 6) {
      setErrorHandler("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setErrorHandler("كلمة المرور وتأكيدها غير متطابقين");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorHandler("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      // بعد تعيين الأخطاء، قم بالتمرير إلى رسالة الخطأ (حتى لو نفس الرسالة)
      scrollToError();
      return;
    }

    const dateOfBirth = `${data.year}-${data.month.padStart(2, "0")}-${data.day.padStart(2, "0")}`;

    const payload = {
      displayName: data.displayName?.trim() || "",
      userName: data.userName.trim(),
      dateOfBirth,
      gender: data.gender,
      phone: data.phone.trim(),
      country: data.country,
      city: data.city,
      region: data.region?.trim() || "",
      email: data.email.trim(),
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        payload,
      );
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (message === "Passwords do not match") {
          setErrorHandler("كلمة المرور وتأكيدها غير متطابقين");
        } else if (message === "Username already exists") {
          setErrorHandler("اسم المستخدم موجود بالفعل");
        } else if (message === "Phone already exists") {
          setErrorHandler("رقم الهاتف موجود بالفعل");
        } else if (message === "Email already exists") {
          setErrorHandler("البريد الإلكتروني موجود بالفعل");
        } else {
          setErrorHandler("حدث خطأ أثناء التسجيل اتصل بدعم 201093586806+");
        }
      } else {
        setErrorHandler("حدث خطأ أثناء الاتصال اتصل بدعم 201093586806+");
      }
      // التمرير إلى الخطأ في حالة فشل الإرسال أيضاً
      scrollToError();
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
    (currentYear - i).toString(),
  );
  const months = [
    { value: "1", label: "يناير" },
    { value: "2", label: "فبراير" },
    { value: "3", label: "مارس" },
    { value: "4", label: "أبريل" },
    { value: "5", label: "مايو" },
    { value: "6", label: "يونيو" },
    { value: "7", label: "يوليو" },
    { value: "8", label: "أغسطس" },
    { value: "9", label: "سبتمبر" },
    { value: "10", label: "أكتوبر" },
    { value: "11", label: "نوفمبر" },
    { value: "12", label: "ديسمبر" },
  ];
  const days = Array.from({ length: maxDays }, (_, i) => (i + 1).toString());

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8"
    >
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          إنشاء حساب جديد
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {errorHandler && (
            <p
              ref={errorRef}
              className="text-white bg-red-500/20 border border-red-500 rounded-lg p-3 text-center"
            >
              {errorHandler}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم المعروض */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                الاسم المعروض
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  className="block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="اسمك المعروض"
                  value={data.displayName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* اسم المستخدم */}
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                اسم المستخدم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    userNameError
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="اسم المستخدم"
                  value={data.userName}
                  onChange={handleChange}
                  disabled={loading}
                  title="أحرف إنجليزية وأرقام فقط"
                />
              </div>
              {userNameError && (
                <p className="mt-1 text-sm text-red-500">{userNameError}</p>
              )}
            </div>

            {/* تاريخ الميلاد */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاريخ الميلاد <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  name="day"
                  value={data.day}
                  onChange={handleChange}
                  disabled={loading}
                  className="py-3 px-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="">اليوم</option>
                  {days.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  name="month"
                  value={data.month}
                  onChange={handleChange}
                  disabled={loading}
                  className="py-3 px-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="">الشهر</option>
                  {months.map((m, index) => (
                    <option key={index} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                <select
                  name="year"
                  value={data.year}
                  onChange={handleChange}
                  disabled={loading}
                  className="py-3 px-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="">السنة</option>
                  {years.map((y, index) => (
                    <option key={index} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* الجنس */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                الجنس <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                className="block w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                value={data.gender}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">اختر الجنس</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            {/* رقم الهاتف */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    phoneError
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="01xxxxxxxxx"
                  value={data.phone}
                  onChange={handleChange}
                  disabled={loading}
                  inputMode="numeric"
                />
              </div>
              {phoneError && (
                <p className="mt-1 text-sm text-red-500">{phoneError}</p>
              )}
            </div>

            {/* الدولة */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                الدولة <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                className="block w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                value={data.country}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">اختر الدولة</option>
                {countries.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* المدينة */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                المدينة <span className="text-red-500">*</span>
              </label>
              <select
                id="city"
                name="city"
                className="block w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                value={data.city}
                onChange={handleChange}
                disabled={loading || !data.country}
              >
                <option value="">اختر المدينة</option>
                {availableCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* المنطقة */}
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                المنطقة
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiMapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="region"
                  name="region"
                  type="text"
                  className="block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="منطقتك"
                  value={data.region}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
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
                  name="email"
                  type="email"
                  dir="ltr"
                  className="block w-full pr-10 pl-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="YourEmail@example.com"
                  value={data.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                كلمة المرور <span className="text-red-500">*</span>
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
                  className="block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
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
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  dir="ltr"
                  className="block w-full pr-10 pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="••••••••"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "جاري التحميل..." : "تسجيل"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
