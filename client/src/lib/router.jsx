"use client";

// Compatibility bridge while feature components use Next's router underneath.
// This keeps the existing UI components focused on their marketplace behavior.
import NextLink from "next/link";
import { useEffect } from "react";
import { useParams as useNextParams, usePathname, useRouter } from "next/navigation";

export function Link({ to, ...props }) {
  return <NextLink href={to} {...props} />;
}

export function NavLink({ to, end, className, ...props }) {
  const pathname = usePathname();
  const active = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const resolvedClassName = typeof className === "function" ? className({ isActive: active }) : [className, active && "active"].filter(Boolean).join(" ");
  return <NextLink href={to} className={resolvedClassName} {...props} />;
}

export function useNavigate() {
  const router = useRouter();
  return (href, options = {}) => options.replace ? router.replace(href) : router.push(href);
}

export function useLocation() {
  return { pathname: usePathname() };
}

export function useParams() {
  return useNextParams();
}

export function Navigate({ to, replace }) {
  const router = useRouter();
  useEffect(() => { replace ? router.replace(to) : router.push(to); }, [replace, router, to]);
  return null;
}
