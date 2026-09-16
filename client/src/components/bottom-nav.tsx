import { useLocation } from "wouter";
import { House, Package, UsersRound, UserRound } from "lucide-react";
import homeNavIcon from "@assets/20260228_010602_1787388821497.png";
import productsNavIcon from "@assets/20260228_010503_1787388821543.png";
import teamNavIcon from "@assets/25702_1787389231677.png";
import accountNavIcon from "@assets/20260228_010619_1787388821589.png";

const navItems = [
  { path: "/",            label: "maison",  icon: homeNavIcon, DashboardIcon: House },
  { path: "/my-products", label: "produit", icon: productsNavIcon, DashboardIcon: Package },
  { path: "/team",        label: "équipe",  icon: teamNavIcon, DashboardIcon: UsersRound },
  { path: "/account",     label: "mon",     icon: accountNavIcon, DashboardIcon: UserRound },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const isDashboard = location === "/";

  return (
    <nav
      className={`bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-[0_-1px_2px_rgba(0,0,0,.05)] ${isDashboard ? "dashboard-bottom-nav" : ""}`}
       style={{ borderColor: "rgba(217, 166, 0, 0.25)" }}
    >
      <div className="mx-auto flex h-[59px] max-w-[500px] items-center justify-around pb-1">
        {navItems.map((item) => {
          const isActive = location === item.path;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (item.path === "/") {
                  window.dispatchEvent(new Event("home-tab-clicked"));
                }
              }}
              className="flex h-full flex-1 flex-col items-center justify-center gap-[2px]"
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              {isDashboard ? (
                <item.DashboardIcon
                  aria-hidden="true"
                  className="dashboard-bottom-icon"
                  strokeWidth={isActive ? 2.6 : 2.2}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="bottom-nav-icon h-[32px] w-[32px]"
                  style={{
                    backgroundColor: isActive ? "#d9a600" : "#8f969b",
                    WebkitMaskImage: `url("${item.icon}")`,
                    maskImage: `url("${item.icon}")`,
                  }}
                />
              )}
              <span
                className={`text-[11px] font-medium leading-none ${isDashboard ? "dashboard-bottom-label" : ""}`}
                 style={{ color: isActive ? "#d9a600" : "#55565a" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
