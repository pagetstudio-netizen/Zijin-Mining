import { useLocation } from "wouter";
import { House, Package, UsersRound, UserRound } from "lucide-react";

const navItems = [
  { path: "/",            label: "maison",  DashboardIcon: House },
  { path: "/my-products", label: "produit", DashboardIcon: Package },
  { path: "/team",        label: "équipe", DashboardIcon: UsersRound },
  { path: "/account",     label: "mon",    DashboardIcon: UserRound },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav
      className="bottom-nav dashboard-bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-[0_-1px_2px_rgba(0,0,0,.05)]"
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
              <item.DashboardIcon
                aria-hidden="true"
                className="dashboard-bottom-icon"
                strokeWidth={isActive ? 2.6 : 2.2}
              />
              <span
                className="dashboard-bottom-label"
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
