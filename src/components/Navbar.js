import { FiMenu } from "react-icons/fi";

export default function Header({ setOpen }) {
  return (
    <div className="w-full flex items-center justify-between bg-custom-blue h-14 px-6 z-40 sticky top-0">
      <p className="text-white text-3xl font-semibold"> CLEE</p>
      <button
        className="text-3xl text-white lg:hidden flex"
        onClick={() => setOpen(true)}
      >
        <FiMenu />
      </button>
    </div>
  );
}
