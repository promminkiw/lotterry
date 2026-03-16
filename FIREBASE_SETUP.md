📋 Firebase Firestore Security Rules Setup
===========================================

⚠️ ปัญหา: Missing or insufficient permissions

🔧 วิธีแก้:

1️⃣ เข้า Firebase Console:
   👉 https://console.firebase.google.com/
   - เลือก Project "lottery-b751d"

2️⃣ ไปที่ Firestore Database:
   - เชื่อมต่อ -> Firestore -> Cloud Firestore

3️⃣ คลิก "Rules" tab

4️⃣ แทนที่ rules ทั้งหมดด้วยนี้:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ หมายเหตุ: สำหรับ Development เท่านั้น!
📌 ก่อน Production ต้องเปลี่ยนเป็น:
  - require authentication
  - check user permissions
  - validate data structure

5️⃣ คลิก "Publish" เพื่อบันทึก

6️⃣ รอ 5-10 วินาที แล้วรีเฟรชเบราว์เซอร์

✅ เพียงเท่านี้ดาต้า permissions error จะหายไป!
