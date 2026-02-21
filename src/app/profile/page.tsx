"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "./components/Navbar";

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
          } else if (err === "Token Expired") {
            try {
              const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
                {
                  refreshToken: localStorage.getItem("refreshToken"),
                },
              );
              localStorage.setItem("accessToken", res.data.accessToken);
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

  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;

  // const listCard = [
  //   {
  //     title: "كورسات",
  //     value: "هنا يوجد جميع الكورسات التي نقدمها",
  //   },
  //   {
  //     title: "الدين",
  //     value: "هنا يوجد جميع الدورات الدينية التي نقدمها",
  //   },
  // ];
  return (
    <div className="min-h-screen dark:bg-gray-900 text-white">
      <Navbar displayName={profile.displayName} userName={profile.userName} />
      {/* <div className="flex flex-wrap gap-5 p-7">
        {listCard.map((item, index) => (
          <div key={index} className="border p-5 ">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p>{item.value}</p>
          </div>
        ))}
      </div> */}

      <div className="flex flex-col items-center justify-center gap-5 mt-10">
        <span>لسه شغال علي الموقع مخلصتش بنسبه 100%</span>
        <span>لو عندك اي اقتراحات او اسائله او مشكلة كلمني</span>
        <a
          href="https://wa.me/201093586806"
          className="text-blue-500 border border-blue-500 p-2 rounded"
        >
          تواصل معي
        </a>
      </div>
    </div>
  );
}
