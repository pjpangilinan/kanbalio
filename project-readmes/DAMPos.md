# DAMPos

> A mini operating-system simulation covering file management, memory management, process management, and miscellaneous system applications. Wrapped in a Streamlit UI for live interaction.

<p>
  <img src="https://img.shields.io/badge/status-live-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
</p>

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white" />
  <img src="https://img.shields.io/badge/Operating%20Systems-2C3E50?style=for-the-badge&logo=linux&logoColor=white" />
  <img src="https://img.shields.io/badge/File%20Management-34495E?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Memory%20Management-16A085?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Process%20Management-27AE60?style=for-the-badge" />
</p>

## 🔗 Links
- **Live:** https://dampos.streamlit.app/
- **Repo:** https://github.com/pjpangilinan/DAMPos

---

## 📸 Screenshots

> Replace with 2–3 real screenshots: file manager view, memory layout, process scheduler.

| File Manager | Memory Layout | Process Scheduler |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                  Streamlit UI                    │
│  (file ops · memory ops · process ops · tools)   │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              DAMPos Core (Python)                │
├──────────────┬──────────────┬───────────────────┤
│ File Manager │ Memory Mgr   │ Process Scheduler │
│   · create   │   · alloc    │   · fork          │
│   · read     |   · free     │   · schedule      │
│   · write    |   · paging   │   · signal        │
│   · delete   |              │                   │
└──────────────┴──────────────┴───────────────────┘
                     │
                     ▼
              In-memory state
            (simulated FS / RAM / PCB)
```

**Components**
- **UI (Streamlit):** Interactive controls for each subsystem
- **File Manager:** CRUD over a simulated file system
- **Memory Manager:** Allocation, freeing, and paging simulation
- **Process Manager:** Fork, schedule, and signal simulation
- **State:** All subsystems run on in-memory simulated state (no real kernel)

---

## 🚀 Quick Start

```bash
git clone https://github.com/pjpangilinan/DAMPos.git
cd DAMPos

pip install -r requirements.txt
streamlit run app.py
```

Opens at `http://localhost:8501`.

---

## 🧠 What I Learned

- How core OS subsystems (file, memory, process) actually behave in isolation
- Trade-offs between contiguous allocation, paging, and segmentation
- Process scheduling algorithms (FCFS, SJF, Round Robin)
- Wrapping a CLI-style simulation in a Streamlit UI for demos

---

## 📜 License

MIT
