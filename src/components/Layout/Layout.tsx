import React from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className="scanline"></div>
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
};

export default Layout;
