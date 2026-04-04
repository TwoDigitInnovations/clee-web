"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { FiX, FiLogOut } from "react-icons/fi";
import { MdDashboard, MdOutlineMeetingRoom } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  BadgeCent,
  Calendar,
  ChartNoAxesColumn,
  MessageSquareMore,
  Settings,
  User,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser } from "@/redux/slices/userSlice";
import SidebarMenu from "./sidebarMenu";

function SidePannel({ open, setOpen }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const managementMenu = [
    {
      href: "/",
      title: "Dashboard",
      icon: <MdDashboard size={20} />,
      access: ["admin"],
    },
    {
      href: "/Calender",
      title: "Calender",
      icon: <Calendar size={20} />,
      access: ["admin"],
    },

    {
      href: "/Customers",
      title: "Customers",
      icon: <Users size={20} />,
      access: ["admin"],
    },
    {
      href: "/Reports",
      title: "Reports",
      icon: <ChartNoAxesColumn size={20} />,
      access: ["admin"],
    },

    {
      href: "/Messages",
      title: "Messages",
      icon: <MessageSquareMore size={20} />,
      access: ["admin"],
      children: [
        { title: "SMS Inbox", href: "/message/SMSInbox" },
        { title: "Sent Messages", href: "/message/SentMessages" },
        { title: "SMS Campaigns", href: "/message/SMSCampaigns" },
        { title: "Email marketing", href: "/message/EmailMarketing" },
      ],
    },

    {
      href: "/Sales",
      title: "Sales",
      icon: <BadgeCent size={20} />,
      access: ["admin"],
      children: [
        { title: "View Invoices", href: "/sales/ViewInvoices" },
        { title: "Create Invoices", href: "/sales/CreateInvoices" },
        { title: "Search Gift Vouchers", href: "/sales/SearchGiftVouchers" },
      ],
    },
  ];

  const SystemMenu = [
    {
      href: "/setup",
      title: "Setup",
      icon: <Settings size={20} />,
      access: ["admin"],
      children: [
        {
          title: "Your Business",
          href: "/messages/",
          children: [
            { title: "Business Details", href: "/Business/BusinessDetails" },
            { title: "Locations", href: "/Business/Locations" },
            { title: "Services", href: "/Business/Services" },
            { title: "Staff", href: "/Business/Staff" },
            { title: "Resources", href: "/Business/Resources" },
            { title: "Calender settings", href: "/Business/Calendersettings" },
            { title: "Online bookings", href: "/Business/Onlinebookings" },
            { title: "Clee pay", href: "/Business/Cleepay" },
            { title: "Online payments", href: "/Business/Onlinepayments" },
            { title: "Waitlist", href: "/Business/Waitlist" },
            { title: "Integrations", href: "/Business/Integrations" },
          ],
        },
        {
          title: "Stock",
          href: "/Stock",
          children: [
            { title: "Products", href: "/stock/Products" },
            { title: "Suppliers", href: "/stock/Suppliers" },
            { title: "Stock Orders", href: "/stock/StockOrders" },
          ],
        },
        {
          title: "Sales Tools",
          href: "/d",
          children: [
            { title: "Discounts", href: "/SalesTools/Discounts" },
            { title: "Gift Vouchers", href: "/SalesTools/GiftVouchers" },
            { title: "Promo code", href: "/SalesTools/Promocode" },
            { title: "Packages", href: "/SalesTools/Packages" },
            { title: "Rewards", href: "/SalesTools/Rewards" },
            { title: "Sales settings", href: "/SalesTools/Salessettings" },
          ],
        },
        { title: "Notifications", href: "/Notifications" },
        { title: "Consult", href: "/Consult" },
        { title: "Promote", href: "/Promote" },
        { title: "Administration", href: "/Administration" },
      ],
    },

    {
      href: "/Account",
      title: "Account",
      icon: <User size={20} />,
      access: ["admin"],
      // children: [
      //   { title: "View Invoices", href: "/messages/inbox" },
      //   { title: "Create Invoices", href: "/messages/sent" },
      //   { title: "Search Gift Vouchers", href: "/messages/draft" },
      // ],
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

        router.push("/auth/login");
      }
    });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
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
              className="w-[40px]"
              src="/images/logo.png"
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

        <div className="flex-1 overflow-y-auto scrollbar-hide px-4">
          <SidebarMenu menu={managementMenu} user={user} />

          <p className=" mt-8 uppercase text-gray-400 text-xs mb-3 px-2 tracking-wider">
            System
          </p>
          <SidebarMenu menu={SystemMenu} user={user} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div
            className="bg-white cursor-pointer text-black rounded-xl p-3 flex items-center gap-3 mb-3"
            onClick={() => router.push("/auth/MyProfile")}
          >
            {/* ✅ Profile Image */}
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src="/images/profilelogo.png"
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="font-semibold text-sm">{user?.fullname}</p>
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
