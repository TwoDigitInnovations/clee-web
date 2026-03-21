import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";

export default function SidebarMenu({ menu, user }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null);

 
  useEffect(() => {
    menu.forEach((item, i) => {
      if (item.children?.some((c) => c.href === router.pathname)) {
        setOpenMenu(i);
      }
    });
  }, [router.pathname, menu]);

  return (
    <div>
      {menu.map((item, i) =>
        item.access.includes(user?.role) ? (
          <div key={i}>
            
            {/* Parent */}
            <div
              onClick={() =>
                item.children
                  ? setOpenMenu(openMenu === i ? null : i)
                  : router.push(item.href)
              }
              className={`flex items-center justify-between px-4 py-2 rounded-md mb-1 cursor-pointer
              ${
                router.pathname === item.href
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </div>

              {/* Arrow */}
              {item.children && (
                <ChevronRight
                  size={18}
                  className={`transition-transform ${
                    openMenu === i ? "rotate-90" : ""
                  }`}
                />
              )}
            </div>

            {/* Children */}
            {item.children && openMenu === i && (
              <div className="ml-8 space-y-1 mb-2">
                {item.children.map((child, idx) => (
                  <Link
                    key={idx}
                    href={child.href}
                    className={`block px-3 py-1 rounded-md text-sm
                    ${
                      router.pathname === child.href
                        ? "bg-white text-black"
                        : "text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}
