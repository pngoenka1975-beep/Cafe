# Customer Accounts Setup

The website code is ready. Complete these one-time Firebase steps before customer sign-in is live.

1. Create a project at [Firebase Console](https://console.firebase.google.com/), then add a **Web app**.
2. In **Authentication > Sign-in method**, enable **Email/Password**.
3. In **Firestore Database**, create a production database.
4. Copy the Firebase web configuration into `firebase-config.js`. This public web configuration is safe to publish; do not put a Firebase service-account key in the website.
5. In **Authentication > Settings > Authorized domains**, add your final website domain before deploying.
6. Update `google-apps-script.txt` in your existing Google Sheet Apps Script project and deploy a new Web App version. It will create separate `Customers` and `Customer Orders` tabs automatically. Only names, emails, opt-ins, and order requests are sent there—never passwords.

## Firestore security rules

In Firebase Console, open **Firestore Database > Rules** and publish the following rules. They ensure a signed-in customer can read and update only their own data.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /customers/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;

      match /orders/{orderId} {
        allow create, read: if request.auth != null && request.auth.uid == userId;
        allow update, delete: if false;
      }
    }
  }
}
```

Customer sessions use Firebase's persistent browser sign-in, so customers can return months later and log in with the same email and password.
