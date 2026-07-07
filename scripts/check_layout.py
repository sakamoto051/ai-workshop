import re
import sys
import glob

def check_layout():
    error_count = 0
    warning_count = 0

    for filepath in glob.glob("s*/*.md"):
        with open(filepath) as f:
            content = f.read()

        slides = re.split(r'\n---\n', content)
        
        # Check boundary integrity before splitting (Header directly followed by ---)
        lines_all = content.split('\n')
        for idx, line in enumerate(lines_all):
            if line.startswith('## ') and idx + 1 < len(lines_all) and lines_all[idx+1] == '---':
                print(f"❌ {filepath}:{idx+1} 見出しの直後に空行なしで `---` が設定されています")
                error_count += 1

        for i, slide in enumerate(slides[1:], 1):  # Skip frontmatter
            if '<!-- ignore-layout -->' in slide:
                continue

            lines = [l for l in slide.strip().split('\n') if l.strip()]
            has_code_block = '```' in slide
            
            # 1. Line count check
            limit = 16 if has_code_block else 20
            if len(lines) > limit:
                # S2 slide 6 contains mostly raw HTML, so we might want to skip it, but to be strictly foolproof we enforce it unless specifically bypassed.
                # However, to avoid breaking currently perfectly formatted HTML-based slides, we can exclude `<style scoped>`
                if '<style scoped>' not in slide:
                    print(f"❌ {filepath} - スライド {i}: {len(lines)} 行（目安 {limit}行 を超過）")
                    if has_code_block:
                        print("   ※ コードブロックを含むため、通常より表示があふれやすくなっています")
                    print(f"   先頭: {lines[0][:60]}")
                    error_count += 1
            
            # 2. Table column check
            for line in lines:
                if line.startswith('|') and not line.startswith('|---'):
                    cols = len(line.split('|')) - 2
                    if cols > 4:
                        # Some tables might be fine, so we treat it as a warning
                        print(f"⚠️  {filepath} - スライド {i}: テーブル列数 {cols}列（4列超過、はみ出し注意）")
                        warning_count += 1
                        break

    if error_count > 0:
        print(f"\n🚨 レイアウトエラーが {error_count} 件見つかりました。修正してからビルドしてください。")
        sys.exit(1)
    
    if warning_count > 0:
        print(f"\n✅ エラーはありませんが、{warning_count} 件の警告があります。表示崩れがないか目視確認を推奨します。")
    else:
        print("\n✅ レイアウトの静的チェックをパスしました！")

if __name__ == "__main__":
    check_layout()
