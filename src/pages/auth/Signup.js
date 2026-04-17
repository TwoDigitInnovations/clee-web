import { MdEmail, MdPassword, MdPhone, MdPerson } from "react-icons/md";
import { useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useAppDispatch } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { registerUser } from "@/redux/actions/userActions";

export default function Signup(props) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(false);

  const [userDetail, setUserDetail] = useState({
    fullName: "",
    email: "", // email
    phone: "",
    password: "",
  });
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    let updatedValue = value;

    // 👇 password ke liye trim
    if (field === "password") {
      updatedValue = value.trim();
    }

    const updated = { ...userDetail, [field]: updatedValue };
    setUserDetail(updated);

    if (submitted) {
      const allErrors = validateObject(updated);
      setErrors(allErrors);
    }
  };

  const validateObject = (data) => {
    const errors = {};

    if (!data.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (data.fullName.trim().length < 3) {
      errors.fullName = "Name must be at least 3 characters";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(data.phone)) {
      errors.phone = "Enter a valid phone number";
    }

    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(data.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(data.password)) {
      errors.password = "Password must contain at least one number";
    }

    return errors;
  };

  const submit = async () => {
    setSubmitted(true);

    const data = {
      fullname: userDetail.fullName,
      email: userDetail.email,
      phone: userDetail.phone,
      password: userDetail.password,
      role: "admin",
    };

    try {
      props.loader(true);

      const res = await dispatch(registerUser(data, router));

      if (res?.status || res?.success) {
        setUserDetail({
          fullName: "",
          email: "",
          phone: "",
          password: "",
        });

        props.toaster({
          type: "success",
          message: "Account created successfully!",
        });

        router.push("/auth/login");
      } else {
        props.toaster({
          type: "error",
          message: res?.message || "Registration failed. Try again.",
        });
      }
    } catch (err) {
      console.log(err);
      props.toaster({
        type: "error",
        message: err?.message || "Something went wrong",
      });
    } finally {
      props.loader(false);
    }
  };

  const inputBox = (hasError) => ({
    background: hasError ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.08)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.15)"}`,
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full overflow-hidden">
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src="/images/Women.png"
          alt="Signup Image"
          className="min-h-[500px] absolute inset-0 w-full object-cover object-center"
        />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0A4D91]/60 to-transparent" />
      </div>

      <div
        className="flex flex-col justify-center w-full md:w-1/2 px-8 sm:px-14 md:px-16 lg:px-28 py-12 min-h-screen"
        style={{
          background:
            "linear-gradient(141.17deg, #0A4D91 23.72%, #133251 100.58%)",
        }}
      >
        <div className="flex flex-col items-start mb-8">
          <h1 className="text-[33.5px] lg:text-[44px] font-bold text-white leading-tight mb-3">
            Create an Account
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-[300px]">
            Begin your journey with Lumière Architectural Atelier.
          </p>
        </div>

        <div className="w-full max-w-sm">
          {/* ── Full Name ── */}
          <label className="block text-blue-200 text-xs font-semibold tracking-wide mb-2 uppercase">
            Full name
          </label>
          <div
            className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all"
            style={inputBox(submitted && errors.fullName)}
          >
            <MdPerson className="text-blue-300 text-lg mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Alexandra Vance"
              className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400"
              value={userDetail.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>
          {submitted && errors.fullName && (
            <p className="text-red-400 text-xs mb-3">{errors.fullName}</p>
          )}

          {/* ── Email ── */}
          <label className="block text-blue-200 text-xs font-semibold tracking-wide mt-4 mb-2 uppercase">
            Email address
          </label>
          <div
            className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all"
            style={inputBox(submitted && errors.email)}
          >
            <MdEmail className="text-blue-300 text-lg mr-3 flex-shrink-0" />
            <input
              type="email"
              placeholder="name@email.com"
              className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400"
              value={userDetail.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          {submitted && errors.email && (
            <p className="text-red-400 text-xs mb-3">{errors.email}</p>
          )}

          <label className="block text-blue-200 text-xs font-semibold tracking-wide mt-4 mb-2 uppercase">
            Phone number
          </label>
          <div
            className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all"
            style={inputBox(submitted && errors.phone)}
          >
            <MdPhone className="text-blue-300 text-lg mr-3 flex-shrink-0" />
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400"
              value={userDetail.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          {submitted && errors.phone && (
            <p className="text-red-400 text-xs mb-3">{errors.phone}</p>
          )}

          {/* ── Password ── */}
          <label className="block text-blue-200 text-xs font-semibold tracking-wide mt-4 mb-2 uppercase">
            Password
          </label>
          <div
            className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all relative"
            style={inputBox(submitted && errors.password)}
          >
            <MdPassword className="text-blue-300 text-lg mr-3 flex-shrink-0" />
            <input
              type={!eyeIcon ? "password" : "text"}
              placeholder="••••••••"
              className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400 pr-8"
              value={userDetail.password}
              onChange={(e) => handleChange("password", e.target.value)}
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
          {submitted && errors.password && (
            <p className="text-red-400 text-xs mb-3">{errors.password}</p>
          )}

          {/* Terms */}
          <p className="text-blue-300 text-xs leading-relaxed max-w-[240px] mt-4 mb-5">
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

          {/* Submit Button */}
          <button
            onClick={submit}
            className="w-full cursor-pointer text-white py-3 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 shadow-lg bg-[linear-gradient(180deg,rgba(179,217,255,0.9)_-22.92%,rgba(176,213,250,0)_26.73%),radial-gradient(110%_250%_at_76%_67%,#0A4D91_0%,#65ADF5_100%)] bg-blend-overlay"
          >
            Create Account
          </button>

          {/* Divider */}
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

          {/* Already have account */}
          <p className="text-blue-300 text-xs text-center">
            Already have an account?{" "}
            <button
              className="text-[#EC5B13] font-semibold hover:underline"
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
