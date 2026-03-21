import { MdEmail, MdLock, MdCheckCircle } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";

export default function ForgotPassword(props) {
  const router = useRouter();

  // Steps: 1 = Send OTP, 2 = Verify OTP, 3 = New Password
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef([]);
  const [token, setToken] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputBox = (hasError) => ({
    background: hasError ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.08)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.15)"}`,
  });

  const validateEmail = (val = email) => {
    if (!val.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Enter a valid email address";
    return "";
  };

  const validateOtp = () => {
    if (otp.join("").length < 6) return "Please enter the complete 6-digit OTP";
    return "";
  };

  const validatePasswords = (data = passwords) => {
    const errs = {};
    if (!data.newPassword) {
      errs.newPassword = "Password is required";
    } else if (data.newPassword.length < 8) {
      errs.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(data.newPassword)) {
      errs.newPassword = "Must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(data.newPassword)) {
      errs.newPassword = "Must contain at least one number";
    }

    if (!data.confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (data.newPassword !== data.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted) {
      const arr = pasted.split("");
      setOtp([...arr, ...Array(6 - arr.length).fill("")]);
      otpRefs.current[Math.min(arr.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleSendOtp = async () => {
    setSubmitted(true);
    const err = validateEmail();
    setEmailError(err);
    if (err) {
      props.toaster({ type: "error", message: "Please fix the errors below" });
      return;
    }

    props.loader(true);
    Api("post", "auth/sendOTP", { email }, router).then(
      (res) => {
        props.loader(false);
        if (res?.status) {
          props.toaster({
            type: "success",
            message: "OTP sent to your email!",
          });
          setSubmitted(false);
          setToken(res.data.token);
          setStep(2);
        } else {
          props.toaster({
            type: "error",
            message: res?.message || "Failed to send OTP. Try again.",
          });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.message || "Something went wrong.",
        });
      },
    );
  };
    const handleReSendOtp = async () => {
    setSubmitted(true);
    const err = validateEmail();
    setEmailError(err);
    if (err) {
      props.toaster({ type: "error", message: "Please fix the errors below" });
      return;
    }

    props.loader(true);
    Api("post", "auth/resendOTP", { email }, router).then(
      (res) => {
        props.loader(false);
        if (res?.status) {
          props.toaster({
            type: "success",
            message: "OTP sent to your email!",
          });
          setSubmitted(false);
          setToken(res.data.token);
          setStep(2);
        } else {
          props.toaster({
            type: "error",
            message: res?.message || "Failed to send OTP. Try again.",
          });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.message || "Something went wrong.",
        });
      },
    );
  };

  const handleVerifyOtp = async () => {
    setSubmitted(true);
    const err = validateOtp();
    setOtpError(err);
    if (err) {
      props.toaster({ type: "error", message: err });
      return;
    }

    props.loader(true);
    Api("post", "auth/verifyOTP", { token, otp: otp.join("") }, router).then(
      (res) => {
        props.loader(false);
        if (res?.status) {
          props.toaster({
            type: "success",
            message: "OTP verified successfully!",
          });
          setSubmitted(false);
          setStep(3);
        } else {
          props.toaster({
            type: "error",
            message: res?.message || "Invalid OTP. Please try again.",
          });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.message || "Something went wrong.",
        });
      },
    );
  };

  const handleResetPassword = async () => {
    setSubmitted(true);
    const errs = validatePasswords();
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) {
      props.toaster({ type: "error", message: "Please fix the errors below" });
      return;
    }

    props.loader(true);
    Api(
      "post",
      "auth/changePassword",
      { token, password: passwords.newPassword },
      router,
    ).then(
      (res) => {
        props.loader(false);
        if (res?.status) {
          props.toaster({
            type: "success",
            message: "Password reset successfully!",
          });
          router.push("/auth/login");
        } else {
          props.toaster({
            type: "error",
            message: res?.message || "Failed to reset password.",
          });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.message || "Something went wrong.",
        });
      },
    );
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={{
              background:
                step > s
                  ? "rgba(101,173,245,0.9)"
                  : step === s
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.08)",
              border:
                step === s
                  ? "2px solid rgba(255,255,255,0.6)"
                  : step > s
                    ? "2px solid rgba(101,173,245,0.9)"
                    : "2px solid rgba(255,255,255,0.15)",
              color: step >= s ? "white" : "rgba(255,255,255,0.4)",
            }}
          >
            {step > s ? <MdCheckCircle className="text-sm" /> : s}
          </div>
          {s < 3 && (
            <div
              className="h-px w-8 transition-all duration-500"
              style={{
                background:
                  step > s ? "rgba(101,173,245,0.7)" : "rgba(255,255,255,0.15)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const btnStyle =
    "mt-6 w-full cursor-pointer text-white py-3 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 shadow-lg bg-[linear-gradient(180deg,rgba(179,217,255,0.9)_-22.92%,rgba(176,213,250,0)_26.73%),radial-gradient(110%_250%_at_76%_67%,#0A4D91_0%,#65ADF5_100%)] bg-blend-overlay";

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full overflow-hidden">
      {/* Left Image Panel */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src="/images/women.png"
          alt="Forgot Password"
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
        <button
          onClick={() =>
            step === 1 ? router.push("/auth/login") : setStep((s) => s - 1)
          }
          className="flex items-center gap-2 text-[#EC5B13] text-xs mb-6 cursor-pointer hover:text-white transition-colors w-fit"
        >
          <IoArrowBack className="text-sm" />
          {step === 1 ? "Back to Login" : "Back"}
        </button>

        {/* Heading */}
        <div className="flex flex-col items-start mb-6">
          <h1 className="text-[33.5px] lg:text-5xl font-bold text-white leading-tight mb-3">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "New Password"}
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-[320px]">
            {step === 1 &&
              "Enter your email and we'll send you instructions to reset your password."}
            {step === 2 &&
              `We've sent a 6-digit OTP to ${email}. Please enter it below.`}
            {step === 3 && "Create a strong new password for your account."}
          </p>
        </div>

        <StepIndicator />

        <div className="w-full max-w-sm">
          {step === 1 && (
            <>
              <label className="block text-blue-200 text-xs font-semibold tracking-wide mb-2 uppercase">
                Email address
              </label>
              <div
                className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all"
                style={inputBox(submitted && emailError)}
              >
                <MdEmail className="text-blue-300 text-lg mr-3 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (submitted) setEmailError(validateEmail(e.target.value));
                  }}
                />
              </div>
              {submitted && emailError && (
                <p className="text-red-400 text-xs mb-2">{emailError}</p>
              )}

              <button onClick={handleSendOtp} className={btnStyle}>
                Send OTP
              </button>

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

              <p className="text-blue-300 text-xs text-center">
                If you don't receive an email within 5 minutes, please check
                your spam folder or contact your system administrator.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-blue-200 text-xs font-semibold tracking-wide mb-4 uppercase">
                Enter 6-digit OTP
              </label>

              <div className="flex gap-3 mb-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-white text-lg font-bold rounded-lg outline-none transition-all duration-200 flex-1"
                    style={{
                      background:
                        submitted && otpError
                          ? "rgba(239,68,68,0.08)"
                          : digit
                            ? "rgba(101,173,245,0.18)"
                            : "rgba(255,255,255,0.08)",
                      border: `2px solid ${
                        submitted && otpError
                          ? "rgba(239,68,68,0.6)"
                          : digit
                            ? "rgba(101,173,245,0.6)"
                            : "rgba(255,255,255,0.15)"
                      }`,
                      caretColor: "white",
                    }}
                  />
                ))}
              </div>

              {submitted && otpError && (
                <p className="text-red-400 text-xs mb-2">{otpError}</p>
              )}

              <p className="text-blue-300 text-xs mt-3">
                Didn't receive the code?{" "}
                <button
                  onClick={() => {
                    setOtp(["", "", "", "", "", ""]);
                    setOtpError("");
                    setSubmitted(false);
                    handleReSendOtp();
                  }}
                  className="text-[#65ADF5] font-semibold cursor-pointer hover:underline"
                >
                  Resend OTP
                </button>
              </p>

              <button onClick={handleVerifyOtp} className={btnStyle}>
                Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-blue-200 text-xs font-semibold tracking-wide mt-2 mb-2 uppercase">
                New Password
              </label>
              <div
                className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all"
                style={inputBox(submitted && passwordErrors.newPassword)}
              >
                <MdLock className="text-blue-300 text-lg mr-3 flex-shrink-0" />
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400"
                  value={passwords.newPassword}
                  onChange={(e) => {
                    const updated = {
                      ...passwords,
                      newPassword: e.target.value,
                    };
                    setPasswords(updated);
                    if (submitted)
                      setPasswordErrors(validatePasswords(updated));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="text-blue-300 hover:text-white transition-colors ml-2 cursor-pointer"
                >
                  {showNew ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </button>
              </div>
              {submitted && passwordErrors.newPassword && (
                <p className="text-red-400 text-xs mb-2">
                  {passwordErrors.newPassword}
                </p>
              )}

              <label className="block text-blue-200 text-xs font-semibold tracking-wide mt-4 mb-2 uppercase">
                Confirm New Password
              </label>
              <div
                className="flex items-center rounded-lg px-4 py-3 mb-1 transition-all"
                style={inputBox(submitted && passwordErrors.confirmPassword)}
              >
                <MdLock className="text-blue-300 text-lg mr-3 flex-shrink-0" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  className="bg-transparent outline-none w-full text-white text-sm placeholder-blue-400"
                  value={passwords.confirmPassword}
                  onChange={(e) => {
                    const updated = {
                      ...passwords,
                      confirmPassword: e.target.value,
                    };
                    setPasswords(updated);
                    if (submitted)
                      setPasswordErrors(validatePasswords(updated));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-blue-300 hover:text-white transition-colors ml-2 cursor-pointer"
                >
                  {showConfirm ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </button>
              </div>
              {submitted && passwordErrors.confirmPassword && (
                <p className="text-red-400 text-xs mb-2">
                  {passwordErrors.confirmPassword}
                </p>
              )}

              <div className="mt-3 space-y-1">
                {[
                  {
                    label: "At least 8 characters",
                    test: passwords.newPassword.length >= 8,
                  },
                  {
                    label: "One uppercase letter",
                    test: /[A-Z]/.test(passwords.newPassword),
                  },
                  {
                    label: "One number",
                    test: /[0-9]/.test(passwords.newPassword),
                  },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{
                        background: rule.test
                          ? "rgba(101,173,245,0.9)"
                          : "rgba(255,255,255,0.2)",
                      }}
                    />
                    <span
                      className="text-xs transition-colors"
                      style={{
                        color: rule.test
                          ? "rgba(101,173,245,0.9)"
                          : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={handleResetPassword} className={btnStyle}>
                Reset Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
