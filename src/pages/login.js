import { MdEmail, MdPassword } from "react-icons/md";
import { useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";

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
    if (userDetail.username && userDetail.password) {
      props.loader(true);

      Api(
        "post",
        "auth/login",
        { ...userDetail, email: userDetail.username },
        router,
      ).then(
        (res) => {
          props.loader(false);

          if (
            (res?.status && res?.data?.user?.role === "admin") ||
            res?.data?.user?.role === "user"
          ) {
            localStorage.setItem("token", res.data.token);

            dispatch(setUser(res.data.user));

            setUserDetail({ username: "", password: "" });

            props.toaster({ type: "success", message: "Login Successful" });

            router.push("/");
          } else {
            props.toaster({ type: "error", message: "You are not authorized" });
          }
        },
        (err) => {
          props.loader(false);
          console.log(err);
          props.toaster({ type: "error", message: err?.message });
        },
      );
    } else {
      setSubmitted(true); // ✅ validation show karega
      props.toaster({ type: "error", message: "Missing credentials" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center  md:flex-row bg-gray-50">
      <div className="flex flex-col justify-center w-full md:w-1/2 lg:w-6/12 px-6 sm:px-10 md:px-16 lg:px-40 py-12 bg-white">
        <div className="mb-10 text-center">
          <div className="flex flex-col items-center gap-2 mb-4">
            <img
              className="w-[80px] md:w-[100px] object-contain"
              src="images/logo.png"
              alt="CLEE Logo"
            />
            <p className="text-lg font-semibold tracking-wide text-gray-800">
              CLEE
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Welcome Back
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 text-sm mt-3 max-w-[300px] mx-auto">
            Sign in to continue and access your dashboard
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center border border-gray-300 focus-within:border-black rounded-xl px-4 py-3 transition-all bg-gray-50 mb-4">
            <MdEmail className="text-gray-400 text-lg mr-3" />
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent outline-none w-full text-gray-700 text-sm"
              value={userDetail.username}
              onChange={(e) =>
                setUserDetail({ ...userDetail, username: e.target.value })
              }
            />
          </div>
          {submitted && userDetail.username === "" && (
            <p className="text-red-500 text-xs mb-4">Email is required</p>
          )}

          {/* Password */}
          <div className="flex items-center border border-gray-300 focus-within:border-black rounded-xl px-4 py-3 mb-4 transition-all bg-gray-50 relative">
            <MdPassword className="text-gray-400 text-lg mr-3" />
            <input
              type={!eyeIcon ? "password" : "text"}
              placeholder="Password"
              className="bg-transparent outline-none w-full text-gray-700 text-sm pr-8"
              value={userDetail.password}
              onChange={(e) =>
                setUserDetail({ ...userDetail, password: e.target.value })
              }
            />
            <div className="absolute right-4 cursor-pointer">
              {!eyeIcon ? (
                <IoEyeOffOutline
                  className="w-5 h-5 text-gray-400"
                  onClick={() => setEyeIcon(true)}
                />
              ) : (
                <IoEyeOutline
                  className="w-5 h-5 text-gray-400"
                  onClick={() => setEyeIcon(false)}
                />
              )}
            </div>
          </div>
          {submitted && userDetail.password === "" && (
            <p className="text-red-500 text-xs mb-4">Password is required</p>
          )}

          {/* Button */}
          <button
            onClick={submit}
            className="w-full cursor-pointer bg-[#0A4D91]
 text-white py-3 rounded-xl text-sm font-semibold  transition-all duration-300 shadow-md"
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 lg:w-6/12 relative">
        <img
          src="https://images.unsplash.com/photo-1556742208-999815fca738?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D"
          alt="Dashboard Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-white"></div>
      </div>
    </div>
  );
}
