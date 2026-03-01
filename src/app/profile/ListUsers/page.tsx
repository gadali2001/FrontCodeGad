"use client";

import axios from "axios";
<<<<<<< HEAD
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  TbSearch,
=======
import { useEffect, useState } from "react";
import {
  TbSearch,
  TbFilter,
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
  TbEye,
  TbX,
  TbCheck,
  TbBan,
  TbTrash,
  TbMail,
  TbPhone,
  TbGenderBigender,
  TbCalendar,
  TbMapPin,
  TbUserCircle,
  TbShield,
  TbShieldCheck,
  TbShieldLock,
} from "react-icons/tb";

interface User {
  _id?: string;
  displayName?: string;
  userName: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  country?: string;
  city?: string;
  region?: string;
  email: string;
  password?: string;
  role: "user" | "admin" | "moderator";
  isEmailVerified: boolean;
  isDeleted: boolean;
  isBanned: boolean;
}

interface Filters {
  search: string;
  role: string;
  verified: string;
  banned: string;
  deleted: string;
  gender: string;
<<<<<<< HEAD
  city: string;
}

import { countries } from "@/countries";

=======
}

>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    role: "all",
    verified: "all",
    banned: "all",
    deleted: "all",
    gender: "all",
<<<<<<< HEAD
    city: "all",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // جلب المستخدمين
=======
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/all-users`,
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          },
        );
<<<<<<< HEAD
        const usersData = response.data.users;
        setUsers(usersData);
        setFilteredUsers(usersData);
=======
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
      } catch (err) {
        setError("فشل تحميل البيانات");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

<<<<<<< HEAD
  // تطبيق الفلاتر
=======
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
  useEffect(() => {
    let result = users;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.userName.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          (u.displayName && u.displayName.toLowerCase().includes(searchLower)),
      );
    }
    if (filters.role !== "all") {
      result = result.filter((u) => u.role === filters.role);
    }
    if (filters.verified !== "all") {
      const verified = filters.verified === "true";
      result = result.filter((u) => u.isEmailVerified === verified);
    }
    if (filters.banned !== "all") {
      const banned = filters.banned === "true";
      result = result.filter((u) => u.isBanned === banned);
    }
    if (filters.deleted !== "all") {
      const deleted = filters.deleted === "true";
      result = result.filter((u) => u.isDeleted === deleted);
    }
    if (filters.gender !== "all") {
      result = result.filter((u) => u.gender === filters.gender);
    }
<<<<<<< HEAD
    if (filters.city !== "all") {
      result = result.filter((u) => u.city === filters.city);
    }
=======
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
    setFilteredUsers(result);
  }, [filters, users]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      role: "all",
      verified: "all",
      banned: "all",
      deleted: "all",
      gender: "all",
<<<<<<< HEAD
      city: "all",
=======
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <TbShieldLock className="text-lg" />;
      case "moderator":
        return <TbShieldCheck className="text-lg" />;
      default:
        return <TbShield className="text-lg" />;
    }
  };

<<<<<<< HEAD
  // دالة حظر/إلغاء حظر المستخدم
  const handleBanToggle = async (user: User) => {
    const action = user.isBanned ? "إلغاء حظر" : "حظر";
    if (
      !confirm(
        `هل أنت متأكد من ${action} المستخدم ${user.displayName || user.userName}؟`,
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/toggle-ban/${user._id}`,
        {},
        {
          headers: { accessToken: token },
        },
      );

      // تحديث الحالة محلياً
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isBanned: !u.isBanned } : u,
        ),
      );
      // تحديث المستخدم المحدد إن كان مفتوحاً في المودال
      if (selectedUser?._id === user._id) {
        setSelectedUser((prev) =>
          prev ? { ...prev, isBanned: !prev.isBanned } : null,
        );
      }
    } catch (error) {
      console.error("فشل تحديث حالة الحظر:", error);
      alert("حدث خطأ، حاول مرة أخرى");
    }
  };

=======
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 p-8">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          إعادة المحاولة
        </button>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-3 md:p-6 lg:p-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
<<<<<<< HEAD
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <TbUserCircle className="text-indigo-400 text-3xl" />
              إدارة المستخدمين
            </h1>

            {/* filter toggle - visible on small screens */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters((s) => !s)}
                aria-expanded={showFilters}
                className="sm:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/30 text-gray-200 border border-gray-700"
                title="إظهار/إخفاء الفلاتر"
              >
                <TbSearch />
                <span className="text-sm">فلاتر</span>
              </button>

              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all border border-indigo-500/30"
              >
                <TbUserCircle className="text-lg " />
                Profile
              </Link>
            </div>
          </div>

          {/* Profile link on xs screens */}
          <Link
            href="/profile"
            className="sm:hidden flex items-center gap-2 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all border border-indigo-500/30"
          >
            <TbUserCircle className="text-lg " />
            Profile
          </Link>
=======
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <TbUserCircle className="text-indigo-400 text-3xl" />
            إدارة المستخدمين
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-600/30 transition-all backdrop-blur-sm sm:hidden w-full sm:w-auto justify-center"
          >
            <TbFilter className="text-lg" />
            {showFilters ? "إخفاء الفلترة" : "إظهار الفلترة"}
          </button>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-3">
          <div className="relative">
<<<<<<< HEAD
            <label htmlFor="user-search" className="sr-only">
              بحث
            </label>
            <TbSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              id="user-search"
=======
            <TbSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              className="w-full pr-12 pl-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm text-sm md:text-base"
<<<<<<< HEAD
              aria-label="بحث بالمستخدمين"
            />
          </div>

          {/* Filters panel: hidden on xs until toggled */}
          <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
              >
                <option value="all">كل الأدوار</option>
                <option value="user">مستخدم</option>
                <option value="admin">مدير</option>
                <option value="moderator">مشرف</option>
              </select>

              <select
                name="verified"
                value={filters.verified}
                onChange={handleFilterChange}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
              >
                <option value="all">كل حالات التحقق</option>
                <option value="true">بريد مؤكد</option>
                <option value="false">بريد غير مؤكد</option>
              </select>

              <select
                name="banned"
                value={filters.banned}
                onChange={handleFilterChange}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
              >
                <option value="all">كل حالات الحظر</option>
                <option value="true">محظور</option>
                <option value="false">غير محظور</option>
              </select>

              <select
                name="deleted"
                value={filters.deleted}
                onChange={handleFilterChange}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
              >
                <option value="all">كل حالات الحذف</option>
                <option value="true">محذوف</option>
                <option value="false">غير محذوف</option>
              </select>

              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
              >
                <option value="all">كل الجنسين</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>

              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
              >
                <option value="all">كل المحافظات</option>
                {countries[0].cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <button
                onClick={resetFilters}
                className="px-3 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all flex items-center justify-center gap-2 text-white text-sm md:text-base border border-gray-600 backdrop-blur-sm"
              >
                <TbX />
                <span className="hidden sm:inline">إعادة تعيين</span>
              </button>
            </div>
=======
            />
          </div>

          {/* Filters panel */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 transition-all ${
              showFilters ? "grid" : "hidden sm:grid"
            }`}
          >
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
            >
              <option value="all">كل الأدوار</option>
              <option value="user">مستخدم</option>
              <option value="admin">مدير</option>
              <option value="moderator">مشرف</option>
            </select>

            <select
              name="verified"
              value={filters.verified}
              onChange={handleFilterChange}
              className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
            >
              <option value="all">كل حالات التحقق</option>
              <option value="true">بريد مؤكد</option>
              <option value="false">بريد غير مؤكد</option>
            </select>

            <select
              name="banned"
              value={filters.banned}
              onChange={handleFilterChange}
              className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
            >
              <option value="all">كل حالات الحظر</option>
              <option value="true">محظور</option>
              <option value="false">غير محظور</option>
            </select>

            <select
              name="deleted"
              value={filters.deleted}
              onChange={handleFilterChange}
              className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
            >
              <option value="all">كل حالات الحذف</option>
              <option value="true">محذوف</option>
              <option value="false">غير محذوف</option>
            </select>

            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2.5 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all backdrop-blur-sm"
            >
              <option value="all">كل الجنسين</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-3 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all flex items-center justify-center gap-2 text-white text-sm md:text-base border border-gray-600 backdrop-blur-sm"
            >
              <TbX /> إعادة تعيين
            </button>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 text-sm text-gray-400 flex items-center gap-2 bg-gray-800/30 p-3 rounded-xl backdrop-blur-sm w-fit">
          <span>
            إجمالي المستخدمين:{" "}
            <span className="text-indigo-300 font-semibold">
              {users.length}
            </span>
          </span>
<<<<<<< HEAD
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
=======
          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
          <span>
            المعروض:{" "}
            <span className="text-indigo-300 font-semibold">
              {filteredUsers.length}
            </span>
          </span>
        </div>

<<<<<<< HEAD
        {/* Responsive Cards (Mobile) */}
=======
        {/* Responsive Table / Cards */}
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
        <div className="lg:hidden space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-gray-800/30 rounded-xl backdrop-blur-sm">
              لا يوجد مستخدمون مطابقون
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <div
                key={user._id || index}
                className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-white text-lg">
                      {user.displayName || user.userName}
                    </div>
                    {user.displayName && (
                      <div className="text-xs text-gray-500">
                        @{user.userName}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : user.role === "moderator"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {getRoleIcon(user.role)}
                    {user.role === "admin"
                      ? "مدير"
                      : user.role === "moderator"
                        ? "مشرف"
                        : "مستخدم"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">البريد:</div>
<<<<<<< HEAD
                  <div className="text-white truncate max-w-[220px]">
                    {user.email}
                  </div>

                  <div className="text-gray-400">المحافظة:</div>
                  <div className="text-white truncate">{user.city || "—"}</div>
=======
                  <div className="text-white truncate">{user.email}</div>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a

                  <div className="text-gray-400">بريد مؤكد:</div>
                  <div className="flex items-center gap-1">
                    {user.isEmailVerified ? (
                      <>
                        <TbCheck className="text-emerald-400" />{" "}
                        <span className="text-white">مؤكد</span>
                      </>
                    ) : (
                      <>
                        <TbX className="text-red-400" />{" "}
                        <span className="text-white">غير مؤكد</span>
                      </>
                    )}
                  </div>

                  <div className="text-gray-400">محظور:</div>
                  <div className="flex items-center gap-1">
                    {user.isBanned ? (
                      <>
                        <TbBan className="text-red-400" />{" "}
                        <span className="text-white">محظور</span>
                      </>
                    ) : (
                      <>
                        <TbCheck className="text-emerald-400" />{" "}
<<<<<<< HEAD
                        <span className="text-white">غير محظور</span>
=======
                        <span className="text-white">نشط</span>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                      </>
                    )}
                  </div>

                  <div className="text-gray-400">محذوف:</div>
                  <div className="flex items-center gap-1">
                    {user.isDeleted ? (
                      <>
                        <TbTrash className="text-red-400" />{" "}
                        <span className="text-white">محذوف</span>
                      </>
                    ) : (
                      <>
                        <TbCheck className="text-emerald-400" />{" "}
                        <span className="text-white">موجود</span>
                      </>
                    )}
                  </div>
                </div>

<<<<<<< HEAD
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleBanToggle(user)}
                      className={`w-full sm:w-auto p-3 rounded-lg transition-all inline-flex items-center justify-center gap-2 border ${
                        user.isBanned
                          ? "bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border-emerald-500/30"
                          : "bg-red-600/20 hover:bg-red-600/40 text-red-300 border-red-500/30"
                      } text-sm`}
                      title={user.isBanned ? "إلغاء الحظر" : "حظر"}
                    >
                      <TbBan className="text-base" />
                      <span className="hidden sm:inline">
                        {user.isBanned ? "إلغاء الحظر" : "حظر"}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedUser(user)}
                    className="w-full sm:w-auto p-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg transition-all inline-flex items-center justify-center gap-2 border border-indigo-500/30 text-sm"
                  >
                    <TbEye className="text-base" />
                    <span className="hidden sm:inline">عرض</span>
=======
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg transition-all inline-flex items-center gap-2 border border-indigo-500/30 text-sm"
                  >
                    <TbEye className="text-base" />
                    عرض التفاصيل
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50">
<<<<<<< HEAD
          <table className="w-full min-w-[900px] table-fixed">
            <thead className="bg-gray-900/60">
              <tr>
                <th className="px-5 py-4 text-right text-gray-300 font-medium w-12">
=======
          <table className="w-full">
            <thead className="bg-gray-900/60">
              <tr>
                <th className="px-5 py-4 text-right text-gray-300 font-medium">
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  #
                </th>
                <th className="px-5 py-4 text-right text-gray-300 font-medium">
                  اسم المستخدم
                </th>
<<<<<<< HEAD
                <th className="px-5 py-4 text-right text-gray-300 font-medium min-w-[220px]">
                  البريد الإلكتروني
                </th>
                <th className="px-5 py-4 text-right text-gray-300 font-medium">
                  المحافظة
=======
                <th className="px-5 py-4 text-right text-gray-300 font-medium">
                  البريد الإلكتروني
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                </th>
                <th className="px-5 py-4 text-right text-gray-300 font-medium">
                  الدور
                </th>
                <th className="px-5 py-4 text-right text-gray-300 font-medium">
                  بريد مؤكد
                </th>
                <th className="px-5 py-4 text-right text-gray-300 font-medium">
                  محظور
                </th>
                <th className="px-5 py-4 text-right text-gray-300 font-medium">
                  محذوف
                </th>
                <th className="px-5 py-4 text-center text-gray-300 font-medium">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
<<<<<<< HEAD
                    colSpan={9}
=======
                    colSpan={8}
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    لا يوجد مستخدمون مطابقون
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className="hover:bg-indigo-900/20 transition-colors"
                  >
                    <td className="px-5 py-4 text-gray-300">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">
                        {user.displayName || user.userName}
                      </div>
                      {user.displayName && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          @{user.userName}
                        </div>
                      )}
                    </td>
<<<<<<< HEAD
                    <td className="px-5 py-4 text-gray-300 truncate max-w-[260px]">
                      {user.email}
                    </td>
                    <td className="px-5 py-4 text-gray-300">
                      {user.city || "—"}
                    </td>
=======
                    <td className="px-5 py-4 text-gray-300">{user.email}</td>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
                          user.role === "admin"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : user.role === "moderator"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role === "admin"
                          ? "مدير"
                          : user.role === "moderator"
                            ? "مشرف"
                            : "مستخدم"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        {user.isEmailVerified ? (
                          <TbCheck className="text-lg" />
                        ) : (
                          <TbX className="text-lg text-red-400" />
                        )}
                        <span className="text-xs text-white">
                          {user.isEmailVerified ? "مؤكد" : "غير مؤكد"}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5">
                        {user.isBanned ? (
                          <TbBan className="text-lg text-red-400" />
                        ) : (
                          <TbCheck className="text-lg text-emerald-400" />
                        )}
                        <span className="text-xs text-white">
<<<<<<< HEAD
                          {user.isBanned ? "محظور" : "غير محظور"}
=======
                          {user.isBanned ? "محظور" : "نشط"}
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5">
                        {user.isDeleted ? (
                          <TbTrash className="text-lg text-red-400" />
                        ) : (
                          <TbCheck className="text-lg text-emerald-400" />
                        )}
                        <span className="text-xs text-white">
                          {user.isDeleted ? "محذوف" : "موجود"}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
<<<<<<< HEAD
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleBanToggle(user)}
                            className={`p-2.5 rounded-xl transition-all inline-flex items-center gap-2 border ${
                              user.isBanned
                                ? "bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border-emerald-500/30"
                                : "bg-red-600/20 hover:bg-red-600/40 text-red-300 border-red-500/30"
                            }`}
                            title={
                              user.isBanned ? "إلغاء الحظر" : "حظر المستخدم"
                            }
                          >
                            <TbBan className="text-lg" />
                            <span className="hidden xl:inline text-sm">
                              {user.isBanned ? "إلغاء الحظر" : "حظر"}
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all inline-flex items-center gap-2 border border-indigo-500/30"
                        >
                          <TbEye className="text-lg" />
                          <span className="hidden xl:inline text-sm">عرض</span>
                        </button>
                      </div>
=======
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all inline-flex items-center gap-2 border border-indigo-500/30"
                      >
                        <TbEye className="text-lg" />
                        <span className="text-sm">عرض</span>
                      </button>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedUser && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUser(null)}
          >
            <div
<<<<<<< HEAD
              className="bg-gray-800/90 backdrop-blur-xl rounded-2xl w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto p-4 md:p-6 shadow-2xl border border-gray-700"
=======
              className="bg-gray-800/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 md:p-6 shadow-2xl border border-gray-700"
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  <TbUserCircle className="text-indigo-400 text-2xl md:text-3xl" />
                  تفاصيل المستخدم
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <TbX className="text-xl md:text-2xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Right Column */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      اسم العرض
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50">
                      {selectedUser.displayName || "—"}
                    </p>
                  </div>
<<<<<<< HEAD

=======
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      اسم المستخدم
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50">
                      @{selectedUser.userName}
                    </p>
                  </div>
<<<<<<< HEAD

=======
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      البريد الإلكتروني
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2 break-all">
<<<<<<< HEAD
                      <TbMail className="text-indigo-400" />{" "}
                      <span>{selectedUser.email}</span>
                    </p>
                  </div>

=======
                      <TbMail className="text-indigo-400" />
                      <span>{selectedUser.email}</span>
                    </p>
                  </div>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      رقم الهاتف
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2">
<<<<<<< HEAD
                      <TbPhone className="text-indigo-400" />{" "}
                      {selectedUser.phone || "—"}
                    </p>
                  </div>

=======
                      <TbPhone className="text-indigo-400" />
                      {selectedUser.phone || "—"}
                    </p>
                  </div>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      تاريخ الميلاد
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2">
<<<<<<< HEAD
                      <TbCalendar className="text-indigo-400" />{" "}
                      {formatDate(selectedUser.dateOfBirth)}
                    </p>
                  </div>

=======
                      <TbCalendar className="text-indigo-400" />
                      {formatDate(selectedUser.dateOfBirth)}
                    </p>
                  </div>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      الجنس
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2">
<<<<<<< HEAD
                      <TbGenderBigender className="text-indigo-400" />{" "}
=======
                      <TbGenderBigender className="text-indigo-400" />
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                      {selectedUser.gender === "male"
                        ? "ذكر"
                        : selectedUser.gender === "female"
                          ? "أنثى"
                          : selectedUser.gender === "other"
                            ? "آخر"
                            : "—"}
                    </p>
                  </div>
                </div>

                {/* Left Column */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      الدور
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50">
                      <span
<<<<<<< HEAD
                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium inline-flex items-center gap-2 ${selectedUser.role === "admin" ? "bg-red-500/20 text-red-300" : selectedUser.role === "moderator" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}
=======
                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium inline-flex items-center gap-2 ${
                          selectedUser.role === "admin"
                            ? "bg-red-500/20 text-red-300"
                            : selectedUser.role === "moderator"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-emerald-500/20 text-emerald-300"
                        }`}
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                      >
                        {getRoleIcon(selectedUser.role)}
                        {selectedUser.role === "admin"
                          ? "مدير"
                          : selectedUser.role === "moderator"
                            ? "مشرف"
                            : "مستخدم"}
                      </span>
                    </p>
                  </div>
<<<<<<< HEAD

                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      المحافظة
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2">
                      <TbMapPin className="text-indigo-400" />{" "}
                      {selectedUser.city || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      المدينة/المنطقة
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2">
                      <TbMapPin className="text-indigo-400" />{" "}
                      {selectedUser.region || selectedUser.country || "—"}
                    </p>
                  </div>

=======
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      العنوان
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2 flex-wrap">
                      <TbMapPin className="text-indigo-400" />
                      {selectedUser.country || ""} {selectedUser.city || ""}{" "}
                      {selectedUser.region || ""}
                    </p>
                  </div>
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      حالة البريد
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2">
                      {selectedUser.isEmailVerified ? (
                        <>
                          <TbCheck className="text-emerald-400 text-lg md:text-xl" />
                          <span>مؤكد</span>
                        </>
                      ) : (
                        <>
                          <TbX className="text-red-400 text-lg md:text-xl" />
                          <span>غير مؤكد</span>
                        </>
                      )}
                    </p>
                  </div>
<<<<<<< HEAD

=======
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      الحظر
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2">
                      {selectedUser.isBanned ? (
                        <>
                          <TbBan className="text-red-400 text-lg md:text-xl" />
                          <span>محظور</span>
                        </>
                      ) : (
                        <>
                          <TbCheck className="text-emerald-400 text-lg md:text-xl" />
                          <span>غير محظور</span>
                        </>
                      )}
                    </p>
                  </div>
<<<<<<< HEAD

=======
>>>>>>> c572f96adc0eef12cfb0ceb6e3edce3689188a6a
                  <div>
                    <label className="text-xs md:text-sm text-gray-400 block mb-1">
                      الحذف
                    </label>
                    <p className="text-white text-sm md:text-base bg-gray-700/30 p-2 md:p-3 rounded-xl border border-gray-600/50 flex items-center gap-2">
                      {selectedUser.isDeleted ? (
                        <>
                          <TbTrash className="text-red-400 text-lg md:text-xl" />
                          <span>محذوف</span>
                        </>
                      ) : (
                        <>
                          <TbCheck className="text-emerald-400 text-lg md:text-xl" />
                          <span>غير محذوف</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-6 md:px-8 py-2.5 md:py-3 bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg font-medium text-sm md:text-base"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
