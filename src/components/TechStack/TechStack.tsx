import React from "react";
import { Database, LayoutTemplate, Box, GitBranch } from "lucide-react";
import styles from "./TechStack.module.css";
import config from "../../data/config.json";

const iconMap: Record<string, React.ElementType> = {
    LayoutTemplate,
    Database,
    Box,
    GitBranch,
};

const TechStack: React.FC = () => {
    return (
        <section className={styles.sectionContainer}>
            <h2 className={styles.sectionHeader}>// SYSTEM_RESOURCES</h2>

            <div className={styles.grid}>
                {config.techStack.map((group, index) => {
                    const IconComponent = iconMap[group.icon] || Box;

                    return (
                        <div className={styles.group} key={index}>
                            <div className={styles.groupTitle}>
                                <IconComponent size={16} /> {group.category}
                            </div>
                            {group.skills.map((skill, idx) => (
                                <Skill
                                    key={idx}
                                    name={skill.name}
                                    level={skill.level}
                                    version={skill.version}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const Skill: React.FC<{ name: string; level: string; version: string }> = ({
    name,
    level,
    version,
}) => (
    <div>
        <div className={styles.skillRow}>
            <span className={styles.skillName}>{name}</span>
            <span className={styles.skillMetric}>
                [{version}] LOAD: {level}
            </span>
        </div>
        <div className={styles.barContainer}>
            <div className={styles.barFill} style={{ width: level }}></div>
        </div>
    </div>
);

export default TechStack;
