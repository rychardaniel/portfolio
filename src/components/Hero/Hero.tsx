import React from "react";
import { Terminal, Cpu, Activity, Server } from "lucide-react";
import styles from "./Hero.module.css";
import config from "../../data/config.json";

const Hero: React.FC = () => {
    const { profile, systemStatus } = config;

    return (
        <section className={styles.heroContainer}>
            <div className={styles.header}>
                <div className={styles.role}>
                    <Terminal size={16} />
                    <span>
                        {profile.name} // {profile.role}
                    </span>
                </div>
                <h1 className={styles.title}>
                    SYSTEM STATUS:{" "}
                    <span className={styles.highlight}>ONLINE</span>
                </h1>
                <p
                    style={{
                        color: "var(--color-text-muted)",
                        maxWidth: "600px",
                    }}
                >
                    {profile.description}
                </p>
            </div>

            <div className={styles.statusGrid}>
                <div className={styles.statusCard}>
                    <div className={styles.label}>Availability</div>
                    <div className={styles.value}>
                        {systemStatus.availability}
                    </div>
                    <div className={`${styles.indicator} ${styles.good}`}>
                        <Server
                            size={14}
                            style={{ display: "inline", marginRight: "4px" }}
                        />
                        OPERATIONAL
                    </div>
                </div>

                <div className={styles.statusCard}>
                    <div className={styles.label}>Uptime (Yrs)</div>
                    <div className={styles.value}>{systemStatus.uptime}</div>
                    <div className={`${styles.indicator} ${styles.good}`}>
                        <Activity
                            size={14}
                            style={{ display: "inline", marginRight: "4px" }}
                        />
                        CONTINUOUS
                    </div>
                </div>

                <div className={styles.statusCard}>
                    <div className={styles.label}>Avg Latency</div>
                    <div className={styles.value}>{systemStatus.latency}</div>
                    <div className={`${styles.indicator} ${styles.good}`}>
                        <Cpu
                            size={14}
                            style={{ display: "inline", marginRight: "4px" }}
                        />
                        OPTIMIZED
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
