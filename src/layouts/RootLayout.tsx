import { AppLayout } from "@components/layout/AppLayout";
import { useA11yStore } from "@store/a11yStore";
import { GlobalStyle } from "@styles/GlobalStyle";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    const fontScale = useA11yStore((s) => s.fontScale);

    useEffect(() => {
        document.documentElement.style.setProperty("--font-scale", String(fontScale));
    }, [fontScale]);

    return (
        <>
            <GlobalStyle/>
            <AppLayout>
                <Outlet />
            </AppLayout>
        </>
    )
}