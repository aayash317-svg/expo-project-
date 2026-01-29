import Link from "next/link";
import {
    History,
    LayoutDashboard,
    LogOut,
    Settings,
    Shield,
    User
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">HealthOne</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/patient" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link href="/patient/records" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg font-medium transition-colors">
                        <History className="h-5 w-5" />
                        Medical History
                    </Link>
                    <Link href="/patient/profile" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg font-medium transition-colors">
                        <User className="h-5 w-5" />
                        Patient Profile
                    </Link>
                    <Link href="/patient/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg font-medium transition-colors">
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-border/50">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg font-medium transition-colors">
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur-sm bg-card/80">
                    <h2 className="font-semibold text-lg">Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            JD
                        </div>
                    </div>
                </header>
                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
