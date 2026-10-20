# แผนการนำเกมขึ้นรันบนเว็บผ่าน GitHub Pages (Automated Deployment)

เตรียมการตั้งค่าโปรเจกต์ Star Math Pilot ให้พร้อมสำหรับนำขึ้น GitHub และเปิดให้ทุกคนเล่นผ่านเว็บได้ฟรี 100% ผ่านบริการ **GitHub Pages** พร้อมระบบ **GitHub Actions** ทำการสร้าง (Build) และดีพลอย (Deploy) ให้อัตโนมัติทุกครั้งที่มีการกด Push โค้ด

---

## User Review & Critical Decisions

> [!IMPORTANT]
> สรุปแนวทางที่ผู้ใช้เลือกใน Phase 1:
> 1. **โฮสติ้งหลัก**: **GitHub Pages** (ฟรี ไม่จำกัดแบนด์วิดท์สำหรับ static web)
> 2. **ระบบการอัปเดต**: **GitHub Actions CI/CD** (สร้างและเผยแพร่อัตโนมัติทันทีที่ Push เข้า branch `main`)

- **การแก้ปัญหา Asset Path ของ GitHub Pages**: GitHub Pages มักจะโฮสต์แอปพลิเคชันที่ `https://<username>.github.io/<repo-name>/` ซึ่งหากไม่กำหนดค่า `base` ให้เป็น relative (`base: './'`) ไฟล์ CSS/JS ในโฟลเดอร์ `/assets/` จะโหลดไม่ติด (Error 404). เราจะกำหนดค่า `base: './'` ใน `vite.config.ts` เพื่อให้รองรับทั้ง Root Domain, Sub-path Repository และ Custom Domain ได้อย่างไร้ปัญหา
- **Node.js & Dependency Installation**: ใน GitHub Actions workflow จะใช้ Node.js v20/22 และรัน `npm install --legacy-peer-deps` ตามด้วย `npm run build` เพื่อให้คอมไพล์โฟลเดอร์ `dist` ได้อย่างราบรื่น

---

## 1. Overview & Core Concept

- **What It Does**: จัดเตรียมไฟล์คอนฟิกทั้งหมดที่จำเป็นในการนำโค้ดขึ้น GitHub, ตั้งค่า CI/CD Automation ผ่าน GitHub Actions, และจัดทำคู่มือทีละสเต็ป (Step-by-Step Guide) ภาษาไทยที่เข้าใจง่าย
- **Target Audience**: ผู้พัฒนาที่ต้องการเผยแพร่เกม Star Math Pilot ให้เด็กๆ หรือผู้เล่นทั่วไปเล่นผ่านอินเทอร์เน็ตได้ทุกที่ทุกเวลาบนทุกอุปกรณ์ (มือถือ, แท็บเล็ต, PC)
- **Key Value**: ไม่ต้องเช่าเซิร์ฟเวอร์, ไม่ต้องเสียค่าใช้จ่ายรายเดือน, เมื่อแก้ไขโค้ดแล้ว push ขึ้น GitHub ระบบจะอัปเดตหน้าเว็บให้อัตโนมัติภายใน 1-2 นาที

---

## 2. User Experience & Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ผู้พัฒนาแก้ไขโค้ดในเครื่อง หรือใน AI Studio                │
│    git commit -m "Update game"                              │
│    git push origin main                                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GitHub Actions ทำงานอัตโนมัติ (.github/workflows/deploy)  │
│    - Checkout โค้ด                                          │
│    - ติดตั้ง Dependencies (npm install)                       │
│    - สร้าง Production Bundle (npm run build -> dist)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. เผยแพร่ขึ้น GitHub Pages สำเร็จ                           │
│    🌐 https://<your-username>.github.io/<repo-name>/        │
│    (เล่นได้ทันทีทั้งมือถือแนวตั้ง และ PC แนวนอน)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Key Technical Decisions & Trade-Offs

- **Decision 1: Relative Base Path (`base: './'`) ใน `vite.config.ts`**
  - *Chosen Approach*: กำหนด `base: './'` แทนที่จะฟิกซ์ชื่อโฟลเดอร์เป็น `base: '/star-math-pilot/'`
  - *Why*: ทำให้ผู้ใช้สามารถตั้งชื่อ GitHub Repository เป็นชื่ออะไรก็ได้ตามใจชอบ โดยไม่ต้องกลับมาแก้ไขโค้ด `vite.config.ts` ซ้ำอีก
- **Decision 2: Modern GitHub Pages Actions (Deploy via Actions Artifact)**
  - *Chosen Approach*: ใช้ `actions/upload-pages-artifact@v3` และ `actions/deploy-pages@v4`
  - *Why*: เป็นมาตรฐานทางการล่าสุดของ GitHub ที่ไม่ต้องสร้าง branch `gh-pages` แยกให้รก repository ปลอดภัย รวดเร็ว และตั้งค่าง่ายที่สุดผ่านเมนู Settings ของ GitHub

---

## 4. Implementation Steps (ไฟล์ที่จะสร้างและปรับปรุง)

1. **`vite.config.ts`**:
   - เพิ่ม `base: './'` ใน configuration เพื่อให้ asset URLs รองรับ subfolder ของ GitHub Pages
2. **`.github/workflows/deploy.yml`**:
   - สร้างไฟล์ Workflow สำหรับสั่งรัน Build & Deploy ขึ้น GitHub Pages อัตโนมัติเมื่อมีการ push โค้ดเข้า branch `main` หรือ `master`
3. **`README.md` & `GITHUB_PAGES_SETUP.md`**:
   - จัดทำคู่มือแนะนำวิธีการสร้าง Repository บน GitHub, วิธี Push โค้ดครั้งแรก, และการเปิดใช้งาน GitHub Pages ในหน้า Settings แบบจับมือทำ
