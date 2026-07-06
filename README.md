<div align="center">

# Hi, I'm Patrick James Pangilinan 👋

**Cloud, DevOps & Agentic Engineer · Open to Remote**

I design and deploy full-stack applications with Python, React, and Docker, with a focus on automated CI/CD pipelines, clean infrastructure, and AI-augmented systems. Currently levelling up on AWS and infrastructure-as-code through hands-on projects.

[![Open to Work](https://img.shields.io/badge/Open%20to-Cloud%20%26%20DevOps%20%26%20Agentic%20roles-22c55e?style=flat-square&logo=target)](#-reach-out)
[![Remote](https://img.shields.io/badge/Remote-friendly-0ea5e9?style=flat-square&logo=earth)](#-reach-out)
[![Email](https://img.shields.io/badge/ProtonMail-6D4AFF?style=flat-square&logo=protonmail&logoColor=white)](mailto:patrickjpangilinan@protonmail.com)
[![Deploy](https://img.shields.io/github/actions/workflow/status/pjpangilinan/kanbalio/deploy.yml?branch=main&label=deploy&style=flat-square)](https://github.com/pjpangilinan/kanbalio/actions)
[![Résumé](https://img.shields.io/github/actions/workflow/status/pjpangilinan/kanbalio/build-resume.yml?branch=main&label=r%C3%A9sum%C3%A9&style=flat-square)](https://github.com/pjpangilinan/kanbalio/actions)
[![License](https://img.shields.io/github/license/pjpangilinan/kanbalio?style=flat-square)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/pjpangilinan/kanbalio?style=flat-square)](https://github.com/pjpangilinan/kanbalio/commits)

</div>

---

## ⚙️ This Site

[**Kanbalio**](https://pjpangilinan.github.io/kanbalio/) — my glassmorphic portfolio. It deploys itself:

1. Push to `main` → **GitHub Actions** builds the Vite site
2. Static assets go to **GitHub Pages**
3. Push to `resume/` → separate **GitHub Actions** workflow compiles `resume.tex` via `pdflatex` → commits `public/resume.pdf`
4. That commit triggers another deploy → live site always has the latest résumé

No server. No backend. Two workflows. One JSON-driven content layer.

---

## 🚀 Featured Projects

<table>
  <tr>
    <td colspan="2">
      <h3 align="center">⭐ Lead Project — <a href="https://github.com/pjpangilinan/dgos">DGOS — Digital Guest Ordering System</a></h3>
      <p align="center"><strong>Production restaurant ordering platform on AWS · ~$0.80/month · 255+ unit tests</strong></p>
      <p align="center">Customers scan QR codes → browse menus → place orders → see real-time kitchen status. 3 SPAs (customer, kitchen, admin) backed by Cognito, DynamoDB, Lambda, and WebSocket push. IaC via AWS CDK in TypeScript.</p>
      <p align="center">
        <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
        <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
        <img src="https://img.shields.io/badge/AWS%20Lambda-FF9900?style=flat-square&logo=awslambda&logoColor=white" />
        <img src="https://img.shields.io/badge/API%20Gateway-FF4F8B?style=flat-square&logo=amazonapigateway&logoColor=white" />
        <img src="https://img.shields.io/badge/DynamoDB-4053D6?style=flat-square&logo=amazondynamodb&logoColor=white" />
        <img src="https://img.shields.io/badge/CloudFront-FF4F8B?style=flat-square&logo=amazoncloudfront&logoColor=white" />
        <img src="https://img.shields.io/badge/Cognito-DD344C?style=flat-square&logo=amazoncognito&logoColor=white" />
        <img src="https://img.shields.io/badge/AWS%20CDK-FF9900?style=flat-square&logo=amazonwebservices&logoColor=white" />
      </p>
      <p align="center">
        <a href="https://github.com/pjpangilinan/dgos"><strong>Repo »</strong></a> ·
        <a href="https://dyk5iqkiyeb4c.cloudfront.net"><strong>Customer »</strong></a> ·
        <a href="https://dkykxlzz4d0zi.cloudfront.net"><strong>Kitchen »</strong></a> ·
        <a href="https://d2n6ostm7w9jzu.cloudfront.net"><strong>Admin »</strong></a>
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center"><a href="https://github.com/pjpangilinan/votechain">VOTECHAIN</a></h3>
      <p align="center">Blockchain-based e-voting with multi-factor auth and a real-time public transparency dashboard.</p>
      <p align="center">
        <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" />
        <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
        <img src="https://img.shields.io/badge/WebSockets-010101?style=flat-square&logo=socketdotio&logoColor=white" />
        <img src="https://img.shields.io/badge/Raspberry%20Pi-A22846?style=flat-square&logo=raspberrypi&logoColor=white" />
        <img src="https://img.shields.io/badge/Blockchain-121D33?style=flat-square&logo=bitcoin&logoColor=white" />
      </p>
      <p align="center"><a href="https://github.com/pjpangilinan/votechain"><strong>Repo »</strong></a> · <a href="https://votechain-7b4va.ondigitalocean.app"><strong>Live »</strong></a></p>
    </td>
    <td width="50%">
      <h3 align="center"><a href="https://github.com/pjpangilinan/muse-journ">Muse Journal</a></h3>
      <p align="center">Automated personal Spotify listening history archive. Self-hosted via GitHub Actions, permanent, searchable.</p>
      <p align="center">
        <img src="https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white" />
        <img src="https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" />
        <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" />
        <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" />
      </p>
      <p align="center"><a href="https://github.com/pjpangilinan/muse-journ"><strong>Repo »</strong></a> · <a href="https://pjpangilinan.github.io/muse-journ/"><strong>Live »</strong></a></p>
    </td>
  </tr>
</table>

---

## 🛠 Tech Stack

**Primary**
<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" />
</p>

**Currently Learning & Using**
<p>
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
</p>

---

## 📜 Certifications

- ✅ **AWS Cloud Solutions Architect** — AWS / Coursera, June 2026
- ✅ **Google Advanced Data Analytics Professional** — Coursera, Dec 2024
- ✅ **IBM DevOps, Cloud, and Agile Foundations** — IBM / Coursera, May 2026
- ✅ **ISO, CMMI & Project Quality Certification Mastery** — Coursera, May 2026
- ✅ **Network Automation Engineering Fundamentals** — Cisco / Coursera, May 2026
- 🔄 **Google Cybersecurity Certificate** — Google / Coursera _(in progress)_
- 🔄 **IBM Applied DevOps Engineering** — IBM / Coursera _(in progress)_

---

## 📊 GitHub Activity

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=pjpangilinan&show_icons=true&theme=tokyonight&hide_border=true&count_private=true" alt="GitHub Stats" height="165" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=pjpangilinan&layout=compact&theme=tokyonight&hide_border=true&count_private=true" alt="Top Languages" height="165" />
</p>
<p align="center">
  <img src="https://streak-stats.demolab.com?user=pjpangilinan&theme=tokyonight&hide_border=true&date_format=j%20M%5B%20Y%5D" alt="GitHub Streak" />
</p>

---

## 📫 Reach Out

<p>
  <a href="https://github.com/pjpangilinan"><img src="https://img.shields.io/badge/GitHub-pjpangilinan-181717?style=for-the-badge&logo=github" /></a>
  <a href="https://www.linkedin.com/in/patrick-james-pangilinan-490a41329/"><img src="https://img.shields.io/badge/LinkedIn-Patrick%20James%20Pangilinan-0A66C2?style=for-the-badge&logo=linkedin" /></a>
  <a href="mailto:patrickjpangilinan@protonmail.com"><img src="https://img.shields.io/badge/Email-ProtonMail-6D4AFF?style=for-the-badge&logo=protonmail&logoColor=white" /></a>
</p>
