import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const roleAccess = {
  user: ["/", "/profile", "/Settings"],
  admin: ["/"],
};

const publicPages = ["/privacyPolicy", "/termsAndConditions"];

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();
    const { pathname } = router;

    const [auth, setAuth] = useState(null);

    useEffect(() => {
      const user = localStorage.getItem("userDetail");
      const token = localStorage.getItem("token");

      if (user && token) {
        const parsedUser = JSON.parse(user);
        const role = parsedUser?.role;

        if (publicPages.includes(pathname)) {
          setAuth(true);
        } else {
          setAuth(roleAccess[role]?.includes(pathname));
        }
      } else {
        setAuth(false);
      }
    }, [pathname]);

    useEffect(() => {
      if (auth === false && !publicPages.includes(pathname)) {
        localStorage.clear();
        router.replace("/auth/login");
      }
    }, [auth, pathname]);

    if (auth === null) return null;

    return auth || publicPages.includes(pathname) ? (
      <Component {...props} />
    ) : null;
  };
};

export default isAuth;
