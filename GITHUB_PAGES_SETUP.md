# 🚀 คู่มือการนำเกม Star Math Pilot ขึ้นรันบนเว็บผ่าน GitHub Pages

โปรเจกต์นี้ได้รับการตั้งค่าพร้อมสำหรับการเผยแพร่บนเว็บฟรีผ่าน **GitHub Pages** ด้วยระบบ **GitHub Actions (CI/CD)** อัตโนมัติเรียบร้อยแล้ว ทุกครั้งที่คุณ Push โค้ดขึ้น GitHub ระบบจะทำการ Build และอัปเดตหน้าเว็บให้อัตโนมัติ

---

## 📋 ขั้นตอนการนำขึ้น GitHub (ทำเพียงครั้งแรก)

### ขั้นตอนที่ 1: สร้าง Repository บน GitHub
1. เข้าไปที่ [GitHub.com](https://github.com) และลงชื่อเข้าใช้
2. คลิกปุ่ม **+** ที่มุมขวาบน หรือกดปุ่มเขียว **New** (สร้าง Repository ใหม่)
3. ตั้งชื่อ Repository เช่น: `star-math-pilot`
4. เลือกสถานะเป็น **Public** (สาธารณะ เพื่อให้ใช้ GitHub Pages ฟรีได้)
5. **ไม่ต้อง** ติ๊กช่อง *Add a README file* (เพราะในโปรเจกต์มีไฟล์อยู่แล้ว)
6. คลิกปุ่ม **Create repository**

---

### ขั้นตอนที่ 2: อัปโหลดโค้ดขึ้น GitHub (Push Code)
เปิด Terminal ในโฟลเดอร์โปรเจกต์ แล้วรันคำสั่งตามลำดับ (เปลี่ยน `<YOUR-USERNAME>` และ `<YOUR-REPO-NAME>` ให้ตรงกับบัญชีของคุณ):

```bash
# 1. เตรียม Git
git init
git add .
git commit -m "feat: initial commit - Star Math Pilot with 8-bit BGM and 2-mode responsive layout"

# 2. ตั้งชื่อ Branch หลักเป็น main
git branch -M main

# 3. เชื่อมต่อกับ Repository บน GitHub
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 4. Push โค้ดขึ้น GitHub
git push -u origin main
```

*(หมายเหตุ: หากเคยมี git อยู่แล้ว สามารถใช้แค่ `git add .` -> `git commit` -> `git push` ได้เลย)*

---

### ขั้นตอนที่ 3: เปิดใช้งาน GitHub Pages ใน Settings (สำคัญที่สุด ⭐️)

เมื่อ Push โค้ดขึ้นไปแล้ว ให้เปิดใช้งานระบบ Pages ดังนี้:

1. ในหน้า Repository ของคุณบน GitHub ให้คลิกแท็บ **Settings** (รูปเฟืองด้านบน)
2. ที่แถบเมนูด้านซ้าย ในหมวด *Code and automation* ให้คลิกเลือก **Pages**
3. ในหัวข้อ **Build and deployment**:
   - ตรงช่อง **Source** ให้คลิกเปลี่ยนจาก `Deploy from a branch` เป็น **GitHub Actions**
4. ระบบจะเชื่อมกับไฟล์ `.github/workflows/deploy.yml` ที่สร้างไว้ให้ทันที!

---

### ขั้นตอนที่ 4: ตรวจสอบสถานะและเริ่มเล่น

1. คลิกไปที่แท็บ **Actions** ด้านบนของ GitHub
2. คุณจะเห็น Workflow ชื่อ **"Deploy Star Math Pilot to GitHub Pages"** กำลังทำงาน
3. เมื่อทำงานเสร็จ (ขึ้นเครื่องหมายถูกสีเขียว ✅ ใช้เวลาประมาณ 1-2 นาที)
4. ลิงก์สำหรับเข้าเล่นเกมของคุณคือ:
   ```
   https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```
   *(ตัวอย่างเช่น: `https://somchai.github.io/star-math-pilot/`)*

---

## 🛠 สิ่งที่ได้รับการกำหนดค่าไว้แล้วในโปรเจกต์

- ✅ **`vite.config.ts`**: ตั้งค่า `base: './'` ให้เป็น relative path ทำให้โหลด Asset (รูปภาพ, สคริปต์, CSS) ได้สมบูรณ์ ไม่ว่าจะโฮสต์ไว้ใน sub-folder ใดของ GitHub Pages
- ✅ **`.github/workflows/deploy.yml`**: ไฟล์คำสั่ง GitHub Actions อัตโนมัติ (ติดตั้ง Node 20, รัน `npm run build`, และ Deploy ไปยัง GitHub Pages ทันทีที่ push)
- ✅ **Web Audio API BGM**: เพลงประกอบ 8-Bit Chiptune เล่นได้ 100% บนทุกเบราว์เซอร์ ทั้ง Safari (iOS), Chrome (Android & PC), Edge โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
- ✅ **Responsive 2-Mode**: เล่นได้ทั้งโหมด **มือถือแนวตั้ง (100dvh ไม่ต้องเลื่อนจอ)** และโหมด **PC แนวนอน** พร้อมปุ่มสลับโหมดที่มุมจอ
