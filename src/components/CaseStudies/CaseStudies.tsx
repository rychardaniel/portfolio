import React from "react";
import { Activity } from "lucide-react";
import styles from "./CaseStudies.module.css";
import config from "../../data/config.json";

const CaseStudies: React.FC = () => {
    return (
        <section className={styles.sectionContainer}>
            <h2 className={styles.sectionHeader}>
                // INCIDENT_LOGS_&_PROJECTS
            </h2>

            <div className={styles.terminalWindow}>
                <div className={styles.terminalBar}>
                    <div className={styles.terminalTitle}>
                        root@server:~/logs/success_stories
                    </div>
                    <div className={styles.windowControls}>
                        <div
                            className={`${styles.control} ${styles.close}`}
                        ></div>
                        <div
                            className={`${styles.control} ${styles.min}`}
                        ></div>
                        <div
                            className={`${styles.control} ${styles.max}`}
                        ></div>
                    </div>
                </div>

                <div className={styles.terminalContent}>
                    {config.projects.map((project) => (
                        <div className={styles.logEntry} key={project.id}>
                            <div className={styles.logHeader}>
                                <span>[{project.timestamp}]</span>
                                <span>LEVEL: {project.level}</span>
                                <span>SERVICE: {project.service}</span>
                            </div>
                            <span className={styles.logTitle}>
                                {project.title}
                            </span>
                            <div className={styles.logBody}>
                                <p>
                                    <strong>BOTTLENECK:</strong>{" "}
                                    {project.bottleneck}
                                </p>
                                {project.diagram && (
                                    <div className={styles.diagramPlaceholder}>
                                        {project.diagram}
                                    </div>
                                )}
                                <p>
                                    <strong>RESOLUTION:</strong>{" "}
                                    {project.resolution}
                                </p>
                            </div>

                            <div className={styles.metricsGrid}>
                                {project.metrics.map((metric, idx) => (
                                    <div
                                        className={styles.metricItem}
                                        key={idx}
                                    >
                                        <span className={styles.metricLabel}>
                                            {metric.label}
                                        </span>
                                        <span className={styles.metricValue}>
                                            {metric.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div
                        style={{
                            color: "var(--color-accent-green)",
                            marginTop: "20px",
                        }}
                    >
                        <Activity
                            size={14}
                            style={{ display: "inline", marginRight: "5px" }}
                        />
                        Tail log... Awaiting new challenges.
                        <span className="blink">_</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CaseStudies;
