# Future Vision v3.0 Redesign Report

## 1. Executive Summary

事業内容を変えず、Future Visionを「説明する資料」から「理解させる資料」へ再設計した。3事業の共通思想、各一次事業、将来展開、連携モデルを17ページの本編へ整理し、詳細情報は4ページのAppendixへ移した。

## 2. Information Architecture

旧版は13ページの中で事業・Data・Partnership・優先順位を高密度に説明していた。v3.0は次の順番へ変更した。

1. 3事業
2. 共通思想
3. 行動と結果から学ぶ構造
4. 複業.Lab
5. BDX
6. Cafe
7. Cafe × 複業.Lab
8. Partnership
9. 成長戦略
10. Final Vision

## 3. Copy Reduction

| 指標 | v2.0 | v3.0 |
|---|---:|---:|
| 全ページ | 13 | 21 |
| 本編ページ | 13 | 17 |
| 本編表示文字数 | 3,398 | 1,923 |
| 1ページ平均 | 261.4 | 113.1 |
| 本文削減率 | - | 43.4% |
| 本編の主要図解 | 19 | 17 |
| Appendix | なし | 4ページ / 998文字 |

文字数はHTMLの各`section.slide`内にある表示テキストを、空白を除いて集計した。

## 4. New Slides

- 「可能性を、現実の一歩から育てる。」を共通思想として追加
- 行動からデータが生まれる構造を独立
- 学習とサービス改善の循環を独立
- 3事業の現在と将来を1ページずつに分離
- CafeのDiscovery、Artist Growth、Event連携を分離
- Cafe × 複業.Labを具体例で可視化

## 5. Visual System

- 1ページ1メッセージ
- Headline → Diagram → Key Messageの固定優先順位
- 3事業をCareer / Condition / Artistのラベルと控えめな色で識別
- 横Flow、Loop、Branch、Training Bridge、Partnershipの図解を用途別に実装
- Mobileでは横図を縮小せず、縦Flowへ変換

## 6. Appendix

- 複業.Labの企業・自治体・地域Experiment
- BDXのBallet Method、MOVE / LEARN / CARE、連携先との役割
- CafeのDiscovery、Artist Growth、Event Companyとの役割
- Raw Data非販売、Consent、事業間分離などのTrust原則

## 7. Responsive / Print

- Desktop 1440 × 900: PASS
- Tablet 1024 × 768 / 768 × 1024: PASS
- Mobile 390 × 844 / 375 × 812: PASS
- A4横Print Media: PASS（21ページ、ページ内Overflow 0）
- Horizontal Overflow: PASS（全5 Viewportで0）
- Browser Console: Error 0 / Warning 0

## 8. Visual QA

Cover、共通思想、複業.Lab、BDX現在・将来、Cafe Discovery、Artist Growth、Cafe × 複業.Lab、Partnership、Final、AppendixをScreenshotで確認した。

- Headlineの不自然な単語途中の改行を修正
- Mobile固定Navigationを非表示にし、見出しとの重なりを解消
- 横FlowをMobile / Tabletで縦Flowへ変換
- 1024pxで横Flowが画面外へ出ないよう可変幅化
- Dark Themeの連携カードとFinal MessageのContrastを改善

## 9. URL / Deploy

- URL: `https://satomitsu1986.github.io/reports/future-vision/`
- Deploy: 既存の`main` → GitHub Pages運用で反映

## 10. Remaining Issues

実装上の未解決事項なし。企業・自治体・各Partnerとの展開は、資料内でFuture Hypothesisとして維持している。
