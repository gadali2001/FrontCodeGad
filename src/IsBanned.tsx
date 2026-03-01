import { TbLock, TbPhone } from "react-icons/tb";

export default function IsBanned() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl shadow-red-500/10 text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <TbLock className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">لقد تم حظر حسابك</h1>

        <div className="w-12 h-1 bg-red-500 rounded-full mx-auto my-4"></div>

        <p className="text-gray-300 text-lg mb-6">
          عذراً، تم تقييد حسابك بسبب مخالفة سياسات الاستخدام.
        </p>

        <div className="bg-gray-700/30 rounded-2xl p-4 mb-6 border border-gray-700/50">
          <p className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
            <TbPhone className="w-4 h-4" />
            للتواصل مع الدعم الفني
          </p>
          <a
            href="tel:+201093586806"
            dir="ltr"
            className="text-2xl font-bold text-white hover:text-red-400 transition-colors"
          >
            +20 109 358 6806
          </a>
        </div>

        <p className="text-gray-500 text-sm">
          إذا كنت تعتقد أن هذا خطأ، يرجى التواصل معنا عبر رقم الدعم.
        </p>
      </div>
    </div>
  );
}
