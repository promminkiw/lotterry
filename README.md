# ระบบบันทึกหวย (Lottery Management System)

ระบบเว็บแอปสำหรับบันทึกและจัดการข้อมูลการซื้อหวย โดยใช้ Next.js, TypeScript, Tailwind CSS และ Firebase Firestore

## ✨ คุณสมบัติหลัก

- ✅ จัดการหลายงวดได้ พร้อมสถานะเปิด/ปิด
- ✅ บันทึกรายการซื้อหวยพร้อมการ validate
- ✅ สรุปยอดเลข 2 ตัว (00-99) และ 3 ตัว (000-999)
- ✅ รายงานรวมปลายเหมือนของแต่ละงวด
- ✅ ส่งออก Excel พร้อมรูปแบบที่สวยงาม
- ✅ ลบงวดพร้อมข้อมูลทั้งหมด (มี modal ยืนยัน)
- ✅ Responsive design สำหรับ desktop และ tablet
- ✅ ทั้งระบบใช้ภาษาไทย
- ✅ Admin dashboard ที่สวยงาม

## 🛠️ เทคโนโลยีที่ใช้

- **Next.js 14** - App Router framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **Firebase Firestore** - Database
- **XLSX** - Excel export
- **React** - UI library

## 📋 ข้อกำหนดก่อนติดตั้ง

- Node.js 18+
- npm หรือ yarn
- Firebase account พร้อม Firestore database

## 🚀 วิธีติดตั้งและรัน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า Firebase

- สร้างโปรเจกต์ใหม่ใน [Firebase Console](https://console.firebase.google.com)
- สร้าง Firestore Database
- คัดลอก Firebase configuration

### 3. สร้างไฟล์ .env.local

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. รัน development server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
npm start
```

## 📁 โครงสร้างโปรเจกต์

```
src/
├── app/              # Pages and layouts
├── components/       # Reusable components
├── services/         # Firebase services
├── utils/            # Utilities
├── types/            # TypeScript types
└── lib/              # Library configurations
```

## 📖 หน้าเว็บหลัก

- `/dashboard` - แดชบอร์ด
- `/draws` - จัดการงวด
- `/draws/[id]/purchases` - รายการซื้อ
- `/draws/[id]/summary` - สรุปเลข
- `/draws/[id]/report` - รายงาน

## ✔️ Validation Rules

- **ชื่อลูกค้า**: ต้องไม่ว่าง
- **เลข 2 ตัว**: 00-99
- **เลข 3 ตัว**: 000-999
- **จำนวนเงิน**: > 0

## 🔒 Security

- ไม่มีระบบ login
- ต้องตั้ง Firestore Security Rules ให้เหมาะสม

---

**Happy Lottery Tracking! 🎰**