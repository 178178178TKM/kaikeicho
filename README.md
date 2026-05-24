# 家計帖 (kakeicho)

同棲カップル向けリアルタイム共有家計簿アプリ。

## セットアップ

### 1. Firebase プロジェクトの作成

1. https://console.firebase.google.com/ にアクセスしてプロジェクトを作成
2. 「Firestore Database」→「データベースを作成」→ ロケーション `asia-northeast1`
3. セキュリティルールを以下に設定:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      allow read, write:
        if request.auth != null;
    }
  }
}
```

4. 「Authentication」→「Sign-in method」→「匿名」を有効化
5. プロジェクト設定 → マイアプリ → ウェブアプリを追加 → `firebaseConfig` の値をメモ

### 2. GitHub リポジトリの設定

1. GitHub で `kakeicho` リポジトリを作成
2. Settings → Secrets and variables → Actions → 以下の6つを登録:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Settings → Pages → Source = 「GitHub Actions」を選択

### 3. ローカル開発

```bash
cp .env.example .env.local
# .env.local に Firebase 設定値を記入
npm install
npm run dev
```

### 4. デプロイ

`main` ブランチへのプッシュで自動デプロイされます。

```bash
git push origin main
```

GitHub Actions タブでビルド・デプロイの進行を確認してください。

## 使い方

1. アプリを開くと URL に `#room=XXXX` が自動付与される
2. その URL をパートナーに送るだけで共有完了
3. 記帳・削除・設定変更がリアルタイムで同期される

## 技術スタック

- Vite 5 + React 18
- Firebase Firestore v10 (リアルタイムDB)
- Firebase Anonymous Auth
- Tailwind CSS 3
- Recharts 2
- GitHub Pages
