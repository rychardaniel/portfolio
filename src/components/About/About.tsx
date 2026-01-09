import React from "react";
import styles from "./About.module.css";
import config from "../../data/config.json";

const About: React.FC = () => {
    const { about } = config;

    return (
        <section className={styles.sectionContainer}>
            <div className={styles.manPage}>
                <div className={styles.headerLine}>
                    <span>DEVELOPER(1)</span>
                    <span>General Commands Manual</span>
                    <span>DEVELOPER(1)</span>
                </div>

                <div className={styles.sectionBlock}>
                    <h3 className={styles.title}>{about.name}</h3>
                    <div className={styles.content}>{about.nameContent}</div>
                </div>

                <div className={styles.sectionBlock}>
                    <h3 className={styles.title}>{about.synopsis}</h3>
                    <div className={styles.content}>
                        <span className={styles.flag}>
                            {about.synopsisContent.split(" ")[0]}
                        </span>{" "}
                        {about.synopsisContent.split(" ").slice(1).join(" ")}
                    </div>
                </div>

                <div className={styles.sectionBlock}>
                    <h3 className={styles.title}>{about.description}</h3>
                    <div className={styles.content}>
                        {about.descriptionContent.map((paragraph, index) => (
                            <p key={index} style={{ marginBottom: "1rem" }}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                <div className={styles.sectionBlock}>
                    <h3 className={styles.title}>{about.options}</h3>
                    <div className={styles.content}>
                        {about.optionsContent.map((option, index) => (
                            <div style={{ marginBottom: "10px" }} key={index}>
                                <span className={styles.flag}>
                                    {option.flag}
                                </span>
                                <div className={styles.description}>
                                    {option.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
