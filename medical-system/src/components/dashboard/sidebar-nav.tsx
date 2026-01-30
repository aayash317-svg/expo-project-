"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, otherwise use simple template literals

type SidebarLink = {
    href: string;
    label: string;
    icon: React.ReactNode;
    external?: boolean;
};

export function SidebarNav({ links }: { links: SidebarLink[] }) {
    const pathname = usePathname();

    return (
        <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                ? "bg-primary/10 text-primary"
                                : link.external
                                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                    >
                        {link.icon}
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
