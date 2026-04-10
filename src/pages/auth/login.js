import { MdEmail, MdPassword } from "react-icons/md";
import { useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";
import { loginUser } from "@/redux/actions/userActions";

export default function Login(props) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    username: "",
    password: "",
  });
  const [eyeIcon, setEyeIcon] = useState(false);
  const dispatch = useAppDispatch();

  const submit = async () => {
    if (!userDetail.username || !userDetail.password) {
      setSubmitted(true);
      props.toaster({ type: "error", message: "Missing credentials" });
      return;
    }

    const data = {
      email: userDetail.username,
      password: userDetail.password,
    };

    try {
      props.loader(true);

      const res = await dispatch(loginUser(data, router));

      if (res?.success) {
        setUserDetail({ username: "", password: "" });
        props.toaster({
          type: "success",
          message: "Login Successful",
        });
      } else {
        props.toaster({
          type: "error",
          message: res?.message || "You are not authorized",
        });
      }
    } catch (err) {
      console.log(err);
      props.toaster({
        type: "error",
        message: err?.message || "Login failed",
      });
    } finally {
      props.loader(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full overflow-hidden">
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src="/images/Women.png"
          alt="Signin Image"
          className="min-h-[500px] absolute inset-0 w-full  object-cover object-center"
        />

        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0A4D91]/60 to-transparent" />
      </div>

      <div
        className="flex flex-col justify-center w-full md:w-1/2 px-8 sm:px-14 md:px-16 lg:px-32 py-12 min-h-screen"
        style={{
          background:
            "linear-gradient(141.17deg, #0A4D91 23.72%, #133251 100.58%)",
        }}
      >
        <div className="flex flex-col items-start mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
            Welcome Back
          </h1>

          <p className="text-blue-200 text-sm leading-relaxed max-w-[280px]">
            Enter your credentials to access your sanctuary.
          </p>
        </div>

        <div className="w-full max-w-sm">
          <label className="block text-blue-200 text-xs font-semibold tracking-wide mb-2 uppercase">
            Email address
          </label>
          <div
            className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <MdEmail className="text-blue-300 text-lg mr-3 flex-shrink-0" />
            <input
              type="email"
              placeholder="name@email.com"
              className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400"
              value={userDetail.username}
              onChange={(e) =>
                setUserDetail({ ...userDetail, username: e.target.value })
              }
            />
          </div>
          {submitted && userDetail.username === "" && (
            <p className="text-red-400 text-xs mb-3">Email is required</p>
          )}

          <label className="block text-blue-200 text-xs font-semibold tracking-wide mt-5 mb-2 uppercase">
            Password
          </label>
          <div
            className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all relative"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <MdPassword className="text-blue-300 text-lg mr-3 flex-shrink-0" />
            <input
              type={!eyeIcon ? "password" : "text"}
              placeholder="••••••"
              className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400 pr-8"
              value={userDetail.password}
              onChange={(e) =>
                setUserDetail({ ...userDetail, password: e.target.value })
              }
            />
            <div className="absolute right-4 cursor-pointer">
              {!eyeIcon ? (
                <IoEyeOffOutline
                  className="w-5 h-5 text-blue-300"
                  onClick={() => setEyeIcon(true)}
                />
              ) : (
                <IoEyeOutline
                  className="w-5 h-5 text-blue-300"
                  onClick={() => setEyeIcon(false)}
                />
              )}
            </div>
          </div>
          {submitted && userDetail.password === "" && (
            <p className="text-red-400 text-xs mb-3">Password is required</p>
          )}

          {/* Forgot password */}
          <div className="flex justify-end mt-2 mb-6">
            <span className="text-xs text-blue-300">
              Forgot password?{" "}
              <button
                className="text-[#EC5B13] font-semibold hover:underline"
                onClick={() => router.push("/auth/ForgotPassword")}
              >
                Reset password
              </button>
            </span>
          </div>

          <button
            onClick={submit}
            className="w-full cursor-pointer text-white py-3 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 shadow-lg bg-[linear-gradient(180deg,rgba(179,217,255,0.9)_-22.92%,rgba(176,213,250,0)_26.73%),radial-gradient(110%_250%_at_76%_67%,#0A4D91_0%,#65ADF5_100%)] bg-blend-overlay"
            // style={{
            //   background: "linear-gradient(90deg, #1565C0 0%, #1E88E5 100%)",
            //   boxShadow: "0 4px 20px rgba(30,136,229,0.4)",
            // }}
          >
            Sign in
          </button>

          <p className="text-blue-300 text-xs text-center mt-5 leading-relaxed max-w-[260px] mx-auto">
            By clicking on Sign up, you agree to our{" "}
            <span
              className="text-[#EC5B13] cursor-pointer hover:underline"
              onClick={() => router.push("/termofServices")}
            >
              Terms of service
            </span>{" "}
            and{" "}
            <span
              className="text-[#EC5B13] cursor-pointer hover:underline"
              onClick={() => router.push("/privacyPolicy")}
            >
              Privacy policy
            </span>
            .
          </p>

          <div className="flex items-center gap-3 my-5">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
            <span className="text-blue-400 text-xs">or</span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
          </div>

          {/* Request Access */}
          <p className="text-blue-300 text-xs text-center">
            Don't have an account?{" "}
            <button
              className="text-[#EC5B13] font-semibold hover:underline"
              onClick={() => router.push("/auth/Signup")}
            >
              Signup
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
