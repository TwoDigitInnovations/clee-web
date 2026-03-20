"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { FiX, FiLogOut } from "react-icons/fi";
import { MdDashboard, MdOutlineMeetingRoom } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { BadgeCent, Calendar, ChartNoAxesColumn, MessageSquareMore, ParkingMeter, User2, UserPlusIcon, Users } from "lucide-react";
import { userContext } from "@/pages/_app";
import { ChevronRight } from "lucide-react";
import { FiFileText, FiShield, FiBell } from "react-icons/fi";
import { PiUserList } from "react-icons/pi";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser } from "@/redux/slices/userSlice";

function SidePannel({ open, setOpen }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const managementMenu = [
    {
      href: "/",
      title: "Dashboard",
      icon: <MdDashboard size={20} />,
      access: ["user"],
    },
    {
      href: "/Calender",
      title: "Calender",
      icon: <Calendar size={20} />,
      access: ["user"],
    },

    {
      href: "/Customers",
      title: "Customers",
      icon: <Users size={20} />,
      access: ["user"],
    },
    {
      href: "/Reports",
      title: "Reports",
      icon: <ChartNoAxesColumn size={20} />,
      access: ["user"],
    },

    {
      href: "/Messages",
      title: "Messages",
      icon: <MessageSquareMore size={20} />,
      access: ["user"],
    },

    {
      href: "/Sales",
      title: "Sales",
      icon: <BadgeCent size={20} />,
      access: ["user"],
    },
  ];

  const logOut = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff2d2d",
      cancelButtonColor: "#0a4d91",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        title: "text-xl font-semibold",
        confirmButton: "px-6 py-2",
        cancelButton: "px-6 py-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUser()); // ✅ Redux state clear
        localStorage.removeItem("userDetail"); // optional (agar alag key use ho rahi hai)
        localStorage.removeItem("token");

        router.push("/login");
      }
    });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 
  bg-[linear-gradient(180deg,#0A4886_0%,#021120_100%)]
  text-white z-50 flex flex-col transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-3 mb-4 bg-[radial-gradient(289.12%_3126.69%_at_49.85%_50.51%,#FFFFFF_0%,#EC5B13_100%)]">
          <div className="flex justify-center gap-14">
            <img
              className="w-[40px]  "
              src="images/logo.png"
              onClick={() => router.push("/")}
              alt="Logo"
            />
            <p className="text-custom-blue text-4xl font-semibold"> CLEE</p>
          </div>
          <button
            className="lg:hidden text-2xl ps-4 text-custom-blue font-bold"
            onClick={() => setOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
        
          {managementMenu.map((item, i) =>
            item.access.includes(user?.role) ? (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-4 py-2 rounded-md mb-1 transition-all
                ${
                  router.pathname === item.href
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
                <ChevronRight size={18} />
              </Link>
            ) : null,
          )}

          <p className=" mt-8 uppercase text-gray-400 text-xs mb-3 px-2 tracking-wider">
            System
          </p>

          <Link
            href="/setup"
            className={`flex items-center justify-between px-4 py-2 rounded-xl  ${
              router.pathname === "/Settings"
                ? "bg-white text-black"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <span>Setup</span>
            <ChevronRight size={18} />
          </Link>
          <Link
            href="/account"
            className={`flex items-center justify-between px-4 py-2 rounded-xl  ${
              router.pathname === "/Settings"
                ? "bg-white text-black"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <span>Account</span>
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="p-4 border-t border-white/10">
          <div
            className="bg-white cursor-pointer text-black rounded-xl p-3 flex items-center gap-3 mb-3"
            onClick={() => router.push("/profile")}
          >
            {/* <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full"
            /> */}
            <div className="bg-black rounded-4xl w-8 h-8 flex justify-center items-center">
              <User2 className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>

          <button
            className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90"
            onClick={logOut}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
export default SidePannel;
