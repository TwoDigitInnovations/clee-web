"use client";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const publicPages = ["/auth/login", "/auth/ForgotPassword","/auth/Signup","/privacyPolicy", "/termofServices"];
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <div className="flex min-h-screen bg-white">
      {!isPublicPage && <SidePannel open={open} setOpen={setOpen} />}

      <div className="flex-1 flex flex-col md:w-full w-[400px]">
        {!isPublicPage && (
          <div className="sticky top-0 z-40">
            <div className=" items-center justify-between lg:hidden flex">
              <Navbar setOpen={setOpen} />
              
            </div>
          </div>
        )}

        <main className={` ${isPublicPage ? "pl-0" : "lg:pl-72"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
