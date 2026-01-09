import React, { useState } from "react";
import styles from "./Footer.module.css";
import config from "../../data/config.json";

const Footer: React.FC = () => {
    const [command, setCommand] = useState("");
    const { socials } = config.profile;

    return (
        <footer className={styles.footerContainer}>
            <div className={styles.cliPrompt}>
                <div className={styles.promptLine}>
                    <span className={styles.user}>guest</span>
                    <span className={styles.at}>@</span>
                    <span className={styles.host}>portfolio</span>
                    <span className={styles.path}>:~</span>
                    <span className={styles.promptChar}>$</span>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            className={styles.commandInput}
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="type 'contact' or 'help'"
                            spellCheck={false}
                        />
                    </div>
                </div>

                {(command === "" ||
                    command.startsWith("c") ||
                    command.startsWith("h")) && (
                    <div className={styles.responseArea}>
                        <div
                            style={{
                                marginBottom: "8px",
                                color: "var(--color-text-muted)",
                            }}
                        >
                            # Accessing contact protocols...
                        </div>
                        <div>
                            <a href={socials.email} className={styles.link}>
                                ./send-email.sh
                            </a>
                            <a
                                href={socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                ./linkedin-connect
                            </a>
                            <a
                                href={socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                ./github-profile
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "20px",
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                }}
            >
                {config.profile.name} &copy; {new Date().getFullYear()} | Build
                v1.0.0
            </div>
        </footer>
    );
};

export default Footer;
