# Data Intake Format

> **Copy one of the blocks below, fill it in, paste it back to me.**
> I'll convert it into the right shape for `data/projects.json` and (if you want) the matching project README.

---

## Project

```
TYPE: Project
ID: <lowercase-hyphenated-slug, e.g. "my-app">
TITLE: <display name, e.g. "My App">
STATUS: <todo | in-progress | done>
DESCRIPTION: <1–2 sentences — what it does and why it exists>
TECH_STACK: <comma-separated, e.g. "React, FastAPI, PostgreSQL">
GITHUB_URL: <https://github.com/... or leave blank>
LIVE_URL: <https://... or leave blank>
NOTES: <optional — architecture, deployment target, anything that helps>
```

**Rules**
- `ID` must be unique and stable (used as DOM key + README filename)
- `STATUS` must be one of exactly: `todo`, `in-progress`, `done`
- Keep `DESCRIPTION` under ~200 characters
- If it's not deployed yet, leave `LIVE_URL` blank — don't put the GH Pages link unless the project actually builds there

---

## Certification

```
TYPE: Certification
ID: <lowercase-hyphenated-slug, e.g. "aws-saa-c03">
TITLE: <full cert name>
STATUS: <todo | in-progress | done>
DESCRIPTION: <1–2 sentences — what it covered>
ISSUER: <Coursera, AWS, Google, IBM, ...>
DATE: <"December 2024" for done, "Started: May 2026" for in-progress, blank for todo>
CREDENTIAL_URL: <https://... verify/share link>
TECH_STACK: <optional — comma-separated topics covered>
NOTES: <optional>
```

**Rules**
- `DATE` is a free-text string (month + year) so "Started: May 2026" works
- For done certs, prefer the completion date over the issue date
- `CREDENTIAL_URL` is the public verify link Coursera / Credly / etc. give you
- If the cert has no tech/topics list, leave `TECH_STACK` blank

---

## Worked examples

### Project — VOTECHAIN

```
TYPE: Project
ID: votechain
TITLE: VOTECHAIN
STATUS: done
DESCRIPTION: Blockchain-based electronic voting system with multi-factor authentication, immutable vote records, and a real-time public transparency dashboard.
TECH_STACK: Python, Raspberry Pi, Blockchain, React, WebSockets
GITHUB_URL: https://github.com/pjpangilinan/votechain
LIVE_URL: https://votechain-7b4va.ondigitalocean.app
```

### Project — DAMPos

```
TYPE: Project
ID: dampos
TITLE: DAMPos
STATUS: done
DESCRIPTION: A mini operating-system simulation covering file management, memory management, process management, and miscellaneous system applications.
TECH_STACK: Operating Systems, File Management, Memory Management, Process Management
GITHUB_URL: https://github.com/pjpangilinan/DAMPos
LIVE_URL: https://dampos.streamlit.app/
```

### Certification — Google Cybersecurity Certificate

```
TYPE: Certification
ID: google-cybersecurity-certificate
TITLE: Google Cybersecurity Certificate
STATUS: todo
DESCRIPTION: A planned cybersecurity professional certificate focused on security fundamentals, risk management, networks, Linux, SQL, Python, and security operations.
ISSUER: Google / Coursera
DATE:
CREDENTIAL_URL: https://www.coursera.org/professional-certificates/google-cybersecurity
```

### Certification — IBM DevOps (in progress)

```
TYPE: Certification
ID: ibm-applied-devops-engineering
TITLE: IBM Applied DevOps Engineering
STATUS: in-progress
DESCRIPTION: An in-progress professional certificate focused on DevOps practices, automation, CI/CD, containers, and deployment workflows.
ISSUER: IBM / Coursera
DATE: Started: May 2026
CREDENTIAL_URL: https://www.coursera.org/professional-certificates/ibm-applied-devops-engineering
```

---

## What I'll do with it

1. Append the entry to `data/projects.json`
2. Confirm the `ID` doesn't collide with an existing entry
3. If it's a `Project` with a real `LIVE_URL`, mention it in the `README.md` profile "Featured Projects" grid
4. If it's a `Certification`, list it under "Certifications" in the `README.md` profile
5. (Optional, ask me) Generate a `project-readmes/<id>.md` template for the project repo

## When in doubt

- **Forks / templates / tiny demos** → `todo` is fine, just add a one-liner description
- **Re-skinned clones** → be honest in the description; recruiters spot fluff
- **Multi-service projects** → keep `TECH_STACK` to 4–6 items, the most senior
- **Old work** → still worth adding; "done" + an old `DATE` reads as experience
