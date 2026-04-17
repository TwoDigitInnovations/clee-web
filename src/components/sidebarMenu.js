import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";

// 🔁 Recursive Component
const MenuItem = ({ item, router, level = 0, setOpen1, open1 }) => {
  const [open, setOpen] = useState(false);

  const isActive = router.pathname === item.href;

  useEffect(() => {
    if (
      item.children?.some(
        (child) =>
          child.href === router.pathname ||
          child.children?.some((c) => c.href === router.pathname),
      )
    ) {
      setOpen(true);
    }
  }, [router.pathname, item]);

  return (
    <div>
      {/* Parent Item */}
      <div
        onClick={() => {
          item.children
            ? setOpen((prev) => !prev)
            : item.href && (setOpen1((prev) => !prev), router.push(item.href));
        }}
        className={`flex items-center justify-between px-4 py-2 rounded-md mb-1 cursor-pointer
        ${
          isActive ? "bg-white text-black" : "text-gray-300 hover:bg-white/10"
        }`}
        style={{ paddingLeft: `${level * 16 + 16}px` }} // 🔥 dynamic indent
      >
        <div className="flex items-center gap-3">
          {item.icon}
          <span className="font-medium">{item.title}</span>
        </div>

        {/* Arrow */}
        {item.children && (
          <ChevronRight
            size={18}
            className={`transition-transform ${open ? "rotate-90" : ""}`}
          />
        )}
      </div>

      {item.children && open && (
        <div className="space-y-1 mb-2">
          {item.children.map((child, idx) => (
            <MenuItem
              key={idx}
              item={child}
              router={router}
              level={level + 1}
              setOpen1={setOpen1} // 👈 add this
              open1={open1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function SidebarMenu({ menu, user, setOpen, open }) {
  const router = useRouter();

  return (
    <div>
      {menu.map((item, i) =>
        item.access.includes(user?.role) ? (
          <MenuItem
            key={i}
            item={item}
            router={router}
            setOpen1={setOpen}
            open1={open}
          />
        ) : null,
      )}
    </div>
  );
}
