![header](https://github.com/user-attachments/assets/5d16ef6d-4cf2-4d1e-9e0d-3abb68c1a93f)

<br>

## 📌Features
`Re:dates`は、箇条書きで書かれた予定やメモをもとに、日付・曜日付きの予定整理や文章化を行うためのツールです。

### 1. 箇条書きベースの予定入力
Markdown形式で日程を箇条書きすると、右側に整形された結果が出力されます。
```md
# dates
- 1/8 12:00~14:00
- 1/9 12:00~14:00
- 1/10 終日
```

#### a. シンボルによる予定の展開
`@`や`;;`などの記号を シンボル として定義し、意味を後から紐づけることができます。
```md
# dates
- 1/8 @
- 1/9 @
- 1/10 終日

# @
12:00~14:00
```
上記のサンプルはどちらも次のように展開されます。
```
1/8(金) 12:00~14:00
1/9(土) 12:00~14:00
1/10(日) 終日
```

#### b. 日付フォーマット
`format`というシンボルに日付フォーマットを入力することができます。利用可能なフォーマットは以下の通りです。
- `yyyy` 年
- `ddd` 曜日
- `MM` 月
- `dd` 日

#### c. 年の設定
日にちとコメントの間に2桁または4桁の数値を挿入することで、年を明示的に設定することができます。
```md
# date
- 1/13 05 10:00~12:00
- 1/14 2012 *
- 1/15 *

# format
yyyy年 MM月dd日(ddd)

# *
終日
```
上記のサンプルは次のように展開されます。
```
2005年 1月13日(木) 10:00~12:00
2012年 1月14日(土) 終日
2026年 1月15日(木) 終日
```


### 2. Gemini Nano による文章化
ブラウザ内蔵の AI 機能を使い、箇条書きの予定を自然な文章に変換します

<br>

## 💡Requirement
AI機能を利用するためには、Chromium系ブラウザでRewriter APIのフラグを有効化する必要があります。
1. `chrome://flags/#rewriter-api-for-gemini-nano` をアドレスバーに入力
2. 「Rewriter API for Gemini Nano」を`Enabled`に変更
3. `chrome://restart`をアドレスバーに入力し、ブラウザを再起動する

AI機能は以下の環境で動作確認済みです。
- **Google Chrome :** バージョン 143.0.7499.170（公式ビルド）
- **Microsoft Edge :** バージョン 143.0.3650.96 (公式ビルド) 

<br>

## 🪪Licence
ソースコードのライセンスは[AGPL](https://www.gnu.org/licenses/agpl-3.0.html)です。<br>
(The source code is licensed under the [AGPL](https://www.gnu.org/licenses/agpl-3.0.html).)

<br>

## 😏Contributors
- ぼーまんのう
[<img width="16" alt="github-mark" src="https://github.com/user-attachments/assets/aac2e70c-0694-49e9-8648-1970c08a57bd">](https://github.com/Sea-cl0g)
[<img width="16" alt="x-logo-black" src="https://github.com/user-attachments/assets/dc730c9f-8d64-493f-a78c-ff7206166759">](https://x.com/boo_manKnow408)
[<img width="16" alt="qiita-image" src="https://github.com/user-attachments/assets/7ee1aa97-82b1-49b8-8e2b-1c2a0c0dc613">](https://qiita.com/boo_manKnow)
