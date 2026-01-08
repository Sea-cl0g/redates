![header]()

<br>

## 📌Features
`Re:dates`は、箇条書きで書かれた予定やメモをもとに、日付・曜日付きの予定整理や文章化を行うためのツールです。

- ### 箇条書きベースの予定入力
Markdown形式で日程を箇条書きすると、右側に整形された結果が出力されます。
```md
# dates
- 1/8 12:00~14:00
- 1/9 12:00~14:00
- 1/10 終日
```

- ### シンボルによる予定の展開
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
12月23日（12:00~14:00）
12月23日（12:00~14:00）
1月3日（終日）
```

- ### Gemini Nano による文章化
ブラウザ内蔵の AI 機能を使い、箇条書きの予定を自然な文章に変換します

- ### ~~キャッシュ保存（未実装）~~
入力データや生成結果をローカルキャッシュに保存します。

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
The source code is licensed under the [AGPL](https://www.gnu.org/licenses/agpl-3.0.html).
> ソースコードのライセンスは[AGPL](https://www.gnu.org/licenses/agpl-3.0.html)です。

<br>

## 📚Author
### **ぼーまんのう**

[<img width="104" alt="icon_driller" src="https://github.com/user-attachments/assets/283de1f1-3d91-4186-a3ac-45fb3b32b4a3">]()
> 何も知りません。糸球体と合わさると腎小体になります。
#### -*follow me!!*-

[<img width="32" alt="github-mark" src="https://github.com/user-attachments/assets/aac2e70c-0694-49e9-8648-1970c08a57bd">](https://github.com/Sea-cl0g)
[<img width="32" alt="x-logo-black" src="https://github.com/user-attachments/assets/dc730c9f-8d64-493f-a78c-ff7206166759">](https://x.com/boo_manKnow408)
[<img width="32" alt="qiita-icon" src="https://github.com/user-attachments/assets/7ee1aa97-82b1-49b8-8e2b-1c2a0c0dc613">](https://qiita.com/boo_manKnow)