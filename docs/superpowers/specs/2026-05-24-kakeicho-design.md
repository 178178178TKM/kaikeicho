# 設計書: 家計帖 (kakeicho)

**Date**: 2026-05-24  
**Project**: kakeicho  
**Location**: `C:\Users\test\Downloads\kakeicho`

---

## 1. 概要

同棲カップル2名がリアルタイムで家計を共有・記録できるWebアプリ。URL一つを渡すだけで共有が完結する。Firebase Firestore によるリアルタイム同期、匿名認証、GitHub Pages へのデプロイ。

---

## 2. 技術スタック

| 領域 | 技術 |
|---|---|
| ビルドツール | Vite 5.x |
| フレームワーク | React 18.x (JSX、TypeScript未使用) |
| スタイリング | Tailwind CSS 3.x |
| バックエンド | Firebase Firestore v10.x (Web SDK Modular) |
| 認証 | Firebase Anonymous Auth v10.x |
| グラフ | Recharts 2.x |
| アイコン | lucide-react |
| ホスティング | GitHub Pages |
| デプロイ | GitHub Actions |

依存追加禁止: 上記以外のUI/状態管理/ルーターライブラリは追加しない。

---

## 3. アーキテクチャ

```
ブラウザ (React SPA)
  │
  ├─ useRoom.js: crypto.getRandomValues で16桁ルームID生成
  │              URL hash (#room=XXXX) と同期
  │
  ├─ useBudget.js: onSnapshot でリアルタイム購読
  │                setDoc({merge:true}) で書込
  │                設定変更は500msデバウンス
  │
  └─ App.jsx → タブ別コンポーネント
       ↕ Firestore SDK
Firebase Firestore (rooms/{roomId})
  ↕ 匿名認証
Firebase Anonymous Auth

GitHub Actions (main push) → GitHub Pages
  https://<user>.github.io/kakeicho/
```

---

## 4. ディレクトリ構成

```
kakeicho/
├── .github/workflows/deploy.yml
├── public/favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── firebase.js
│   ├── hooks/
│   │   ├── useRoom.js
│   │   └── useBudget.js
│   ├── lib/
│   │   ├── calc.js
│   │   ├── format.js
│   │   └── constants.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── MonthSelector.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── TabNav.jsx
│   │   ├── InputForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── BreakdownChart.jsx
│   │   ├── SettingsPanel.jsx
│   │   ├── CategoryColorPicker.jsx
│   │   └── ShareModal.jsx
│   ├── styles/index.css
│   └── env.js
├── .env.example
├── .env.local         (gitignore対象)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js     (base: '/kakeicho/')
```

---

## 5. データモデル (Firestore)

```
rooms/{roomId}
  ├─ settings: Map
  │    ├─ nameA: string          (default: "あなた")
  │    ├─ nameB: string          (default: "パートナー")
  │    ├─ foodRatioA: number     (default: 60)
  │    ├─ otherRatioA: number    (default: 50)
  │    └─ categories: Array<{key, color, special}>
  ├─ expenses: Array<{id, date, category, amount, payer, memo}>
  ├─ createdAt: Timestamp
  └─ updatedAt: Timestamp
```

### 書込パターン
- 新規ルーム: ドキュメント不在時に `setDoc` でデフォルト設定を作成
- 更新: `setDoc({merge:true})` + `updatedAt: serverTimestamp()`
- 読込: `onSnapshot` でリアルタイム購読、ローカルキャッシュを即時反映
- デバウンス: 設定変更は500ms、記帳・削除は即時

---

## 6. 主要機能

### 認証
- 起動時に Firebase Anonymous Auth で自動サインイン
- 完了まで「準備中…」表示
- 失敗時はエラー + リロードボタン

### ルーム管理
- URL: `https://<user>.github.io/kakeicho/#room=<16桁英数字>`
- 初回: `crypto.getRandomValues` で生成 → `history.replaceState` でURL反映
- 既存: `#room=` があればそれを使用
- 不正ID (16桁英数字以外): 無視して新規生成

### 記帳
- 項目: 日付・支払者(a/b)・品目・金額(正整数)・摘要(任意、100文字以内)
- 記帳後: 金額・摘要クリア、日付・支払者・品目は保持

### 清算計算ロジック
```javascript
const ratioA = (cat.special ? settings.foodRatioA : settings.otherRatioA) / 100;
const shareA = expense.amount * ratioA;
// balanceA = totalPaidA - totalShareA
// balanceA > 0: B が A に払う / balanceA < 0: A が B に払う
```
端数: `Math.round()` で四捨五入、1円単位。

### 内訳グラフ
- Recharts `<PieChart>` ドーナツ (innerRadius=45, outerRadius=95)
- 5%以上のセグメントにのみ「品目名 XX%」を直接ラベル表示
- `labelLine={false}`

### 設定
- 人物名 (nameA/nameB)
- 負担比率 (foodRatioA / otherRatioA、0-100クランプ)
- 品目管理 (追加・削除・名前変更・色変更・6:4フラグ)
- 共有URL: クリップボードにコピー、失敗時はテキストエリア表示
- 全記録消去: 確認ダイアログ後、expenses のみ空配列に

---

## 7. デザイン

### デザイントークン
```css
--bg-paper:   #f5f1e8  /* 和紙クリーム */
--ink:        #1a1a1a  /* 墨 */
--accent:     #4a6741  /* 苔緑 */
--vermillion: #b85450  /* 朱 */
--border:     #d4c9b3  /* 茶系ボーダー */
--muted:      #8a8a85  /* 灰 */

--font-display: 'Shippori Mincho B1', 'Noto Serif JP', serif
--font-body:    'Noto Sans JP', system-ui, sans-serif
```

### レイアウト
- 最大幅: `max-w-2xl` (672px)、中央寄せ、`px-5`
- 背景: radial-gradient ドット紋様 (20px) + クリーム地
- 罫線: 苔緑グラデーション 1px

---

## 8. デプロイ

### vite.config.js
```js
base: '/kakeicho/'
```

### GitHub Actions (deploy.yml)
- trigger: `push: branches: [main]` + `workflow_dispatch`
- steps: checkout → setup-node@v4 (Node 20) → `npm ci` → `npm run build` → upload-pages-artifact → deploy-pages

### 環境変数
GitHub Repository Secrets に6つ登録:
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
`VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

---

## 9. デモアプリからの差分

| デモアプリ | 本番 |
|---|---|
| `window.storage.get/set` | Firestore `onSnapshot` / `setDoc` |
| `#d=<base64>` URL共有 | `#room=<16桁>` ルームID |
| URLハッシュインポートUI | 削除 |
| JSONテキストインポートUI | 削除 |
| 単一JSXファイル | Vite + コンポーネント分割 |

カラーパレット・カテゴリ初期値・清算計算ロジック・UIスタイルはそのまま流用。

---

## 10. 実装フェーズ (推奨順)

1. **Phase 1** — Vite + React 環境構築、Tailwind・フォント・デザイントークン、基本レイアウト
2. **Phase 2** — Firebase接続 (`firebase.js`)、匿名Auth、`useRoom.js`、`useBudget.js` (onSnapshot)
3. **Phase 3** — 記帳フォーム (`InputForm.jsx`)、一覧・削除 (`ExpenseList.jsx`)
4. **Phase 4** — 清算計算 (`calc.js`)、`SummaryCard.jsx`
5. **Phase 5** — Recharts ドーナツチャート (`BreakdownChart.jsx`)
6. **Phase 6** — 設定パネル (`SettingsPanel.jsx`)、品目管理、共有URL
7. **Phase 7** — GitHub Actions ワークフロー、`vite.config.js` の base 設定、README
8. **Phase 8** — 受け入れテスト (2タブ同期・モバイル・オフライン)

---

## 11. 受け入れ基準

- `npm run dev` でローカル起動・動作確認
- `npm run build` がエラーなく完了、`dist/` 生成
- 初回アクセスで `#room=XXXX` が自動付与
- 別ブラウザ・別端末で同じURLを開くと同じデータが見える
- 一方の入力が1秒以内に他方へ反映
- 食費(special=true)は設定比率、その他は otherRatio で清算計算
- 月セレクタで過去月・未来月を表示可能
- 「共有URLをコピー」でクリップボードにURLが入る
- iPhone Safari / Android Chrome で表示崩れなし
