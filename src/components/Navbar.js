import { FiBell, FiMenu, FiUser } from "react-icons/fi";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/hooks";

export default function Header({ setOpen }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="w-full flex items-center justify-between bg-custom-blue h-14 px-6">
      <p className="text-white text-3xl font-semibold"> CLEE</p>
      <button
        className="text-3xl text-white md:hidden flex"
        onClick={() => setOpen(true)}
      >
        <FiMenu />
      </button>
    </div>
  );
}
