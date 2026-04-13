import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KeyRound,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { logoutUser } from "@/redux/slices/userSlice";
import DashboardHeader from "@/components/DashboardHeader";
import Swal from "sweetalert2";

const changePassword = (payload) => async (dispatch) => {
  // replace with your real API call
  // e.g. await Api("post", "auth/change-password", payload, router);
  return { success: true };
};

function PasswordModal({ onClose, dispatch, toaster }) {
  const [form, setForm] = useState({ old: "", newPass: "", verify: "" });
  const [show, setShow] = useState({
    old: false,
    newPass: false,
    verify: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const strength = () => {
    const p = form.newPass;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-emerald-400",
  ];
  const strengthText = [
    "",
    "text-red-500",
    "text-amber-500",
    "text-blue-500",
    "text-emerald-500",
  ];
  const s = strength();

  const handleSave = async () => {
    setError("");
    if (!form.old || !form.newPass || !form.verify) {
      setError("All fields are required.");
      return;
    }
    if (form.newPass !== form.verify) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPass.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await dispatch(
        changePassword({ old_password: form.old, new_password: form.newPass }),
      );
      if (res?.success) {
        setSuccess(true);
        setTimeout(onClose, 1500);
      } else {
        setError(res?.message || "Something went wrong.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Lock size={17} className="text-custom-blue" />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              Change Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-xl px-4 py-3">
              <CheckCircle2 size={15} className="flex-shrink-0" />
              Password updated successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Old Password
            </label>
            <div className="relative">
              <input
                type={show.old ? "text" : "password"}
                value={form.old}
                onChange={set("old")}
                placeholder="Enter current password"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-300 focus:bg-white transition-all"
              />
              <button
                onClick={() => toggle("old")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {show.old ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={show.newPass ? "text" : "password"}
                value={form.newPass}
                onChange={set("newPass")}
                placeholder="Enter new password"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-300 focus:bg-white transition-all"
              />
              <button
                onClick={() => toggle("newPass")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {show.newPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength bar */}
            {form.newPass && (
              <div className="mt-2.5">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= s ? strengthColor[s] : "bg-slate-200"}`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-semibold ${strengthText[s]}`}>
                  {strengthLabel[s]}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Verify Password
            </label>
            <div className="relative">
              <input
                type={show.verify ? "text" : "password"}
                value={form.verify}
                onChange={set("verify")}
                placeholder="Re-enter new password"
                className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 placeholder:text-slate-300 bg-slate-50/60 focus:outline-none focus:ring-2 focus:bg-white transition-all
                  ${
                    form.verify && form.verify !== form.newPass
                      ? "border-red-300 focus:ring-red-300/50"
                      : form.verify && form.verify === form.newPass
                        ? "border-emerald-300 focus:ring-emerald-300/50"
                        : "border-slate-200 focus:ring-indigo-400/50 focus:border-indigo-300"
                  }`}
              />
              <button
                onClick={() => toggle("verify")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {show.verify ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {form.verify && form.verify === form.newPass && (
                <CheckCircle2
                  size={15}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || success}
            className="flex-1 px-4 py-2.5 bg-custom-blue/90 text-white text-sm font-semibold rounded-xl hover:bg-custom-blue/90 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Saving...
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={15} /> Saved!
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function Account(props) {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

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
        dispatch(logoutUser());
        router.push("/auth/login");
      }
    });
  };
  return (
    <>
      <DashboardHeader
        title="Account"
        subtitle="Manage Login Details, Change Password."
      />

      <div className="min-h-screen bg-[#f3f4f8] md:p-6 p-3">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <ShieldCheck size={16} className="text-custom-blue" />
              </div>
              <h2 className="text-base font-bold text-slate-800">
                Login Details
              </h2>
            </div>

            <div className="px-6 py-2 divide-y divide-slate-100">
              <InfoRow
                icon={User}
                label="Account type"
                value={user?.fullname}
              />
              <InfoRow icon={Mail} label="Logged in as" value={user?.email} />
              <InfoRow icon={KeyRound} label="Role" value={user?.role} />
            </div>

            <div className="px-4 md:px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex md:flex-row flex-col gap-2 w-fit md:items-center justify-between">
              <p className="text-xs text-slate-400">
                Last password change:{" "}
                <span className="font-semibold text-slate-600">
                  3 months ago
                </span>
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-custom-blue text-white text-sm font-semibold rounded-xl hover:bg-custom-blue/90 active:scale-95 transition-all shadow-sm"
              >
                <KeyRound size={15} />
                Change password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3">
              Password Security Tips
            </h3>
            <ul className="space-y-2">
              {[
                "Use at least 8 characters with uppercase, numbers and symbols",
                "Never reuse passwords across multiple platforms",
                "Change your password every 90 days for best security",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-slate-500"
                >
                  <CheckCircle2
                    size={13}
                    className="text-indigo-400 flex-shrink-0 mt-0.5"
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 md:p-6">
            <h3 className="text-sm font-bold text-red-500 mb-1">Danger Zone</h3>
            <p className="text-xs text-slate-400 mb-4">
              Logging out will end your current session on this device.
            </p>
            <button
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 active:scale-95 transition-all"
              onClick={logOut}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {modalOpen && (
        <PasswordModal
          onClose={() => setModalOpen(false)}
          dispatch={dispatch}
          toaster={props.toaster}
        />
      )}
    </>
  );
}
