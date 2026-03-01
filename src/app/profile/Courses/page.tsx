// app/courses/page.tsx
import Link from "next/link";
import {
  TbCode,
  TbBrandCss3,
  TbBrandJavascript,
  TbBrandNodejs,
  TbBrandTypescript,
  TbBrandTailwind,
  TbBrandBootstrap,
  TbBrandReact,
  TbBrandNextjs,
  TbApi,
  TbLanguage,
  TbIcons,
  TbBrandFramer,
  TbBrandRedux,
  TbBrandGit,
  TbClock,
  TbArrowLeft,
} from "react-icons/tb";

// قائمة الكورسات مع أيقوناتها (بعد الفصل)
const frontendCourses = [
  { name: "HTML", icon: TbCode, color: "text-orange-400" },
  { name: "CSS", icon: TbBrandCss3, color: "text-blue-400" },
  { name: "JavaScript", icon: TbBrandJavascript, color: "text-yellow-400" },
  { name: "Node.js", icon: TbBrandNodejs, color: "text-green-500" },
  { name: "TypeScript", icon: TbBrandTypescript, color: "text-blue-500" },
  { name: "Tailwind CSS", icon: TbBrandTailwind, color: "text-cyan-400" },
  { name: "Bootstrap", icon: TbBrandBootstrap, color: "text-purple-500" },
  { name: "React JS", icon: TbBrandReact, color: "text-sky-400" },
  { name: "Next JS", icon: TbBrandNextjs, color: "text-white" },
  { name: "Axios", icon: TbApi, color: "text-purple-400" },
  { name: "i18next", icon: TbLanguage, color: "text-emerald-400" },
  { name: "React Icons", icon: TbIcons, color: "text-pink-400" },
  { name: "Framer Motion", icon: TbBrandFramer, color: "text-indigo-400" },
  { name: "Redux", icon: TbBrandRedux, color: "text-violet-400" },
  { name: "Git & GitHub", icon: TbBrandGit, color: "text-orange-500" },
];

export default function CoursesPage() {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-3 md:p-6 lg:p-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <TbCode className="text-indigo-400 text-3xl" />
            دورات الـ Frontend
          </h1>
          <div className="flex gap-2">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl transition-all border border-indigo-500/30"
            >
              <TbArrowLeft className="text-lg" />
              رجوع
            </Link>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="mb-6 text-sm text-gray-400 flex items-center gap-2 bg-gray-800/30 p-3 rounded-xl backdrop-blur-sm w-fit">
          <span>
            عدد الدورات المتاحة:{" "}
            <span className="text-indigo-300 font-semibold">
              {frontendCourses.length}
            </span>
          </span>
          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
          <span className="flex items-center gap-1">
            <TbClock className="text-indigo-400" />
            <span>مستمرة في التحديث</span>
          </span>
        </div>

        {/* شبكة الكورسات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {frontendCourses.map((course, index) => {
            const Icon = course.icon;
            return (
              <div
                key={index}
                className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 bg-gray-700/50 rounded-xl ${course.color}`}
                  >
                    <Icon className="text-2xl md:text-3xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base md:text-lg mb-1">
                      {course.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      دورة شاملة في {course.name}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-xs bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                    تفاصيل قريباً
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ملاحظة ختامية */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-800 pt-6">
          <p>جميع الدورات مسجلة ومتاحة عند الطلب. سيتم إضافة المزيد قريباً.</p>
        </div>
      </div>
    </div>
  );
}
