import re
import sys
import glob

def check_flow():
    error_count = 0

    for filepath in glob.glob("s*/*.md"):
        with open(filepath) as f:
            content = f.read()

        headings = [line for line in content.split('\n') if line.startswith('## ')]
        
        step_counter = 0
        has_summary = False

        for idx, heading in enumerate(headings):
            # 1. Check Step sequence
            step_match = re.search(r'ステップ\s*(\d+)', heading)
            if step_match:
                step_num = int(step_match.group(1))
                if step_num != step_counter + 1:
                    print(f"❌ {filepath}: 『{heading}』の順番が不正です。前のステップは {step_counter} でした。")
                    error_count += 1
                step_counter = step_num
            
            # 2. Check Details placement (must be after a step or demo, rough heuristic)
            if '詳細:' in heading:
                if step_counter == 0 and 'デモ' not in ''.join(headings[:idx]):
                    print(f"❌ {filepath}: 『{heading}』が早すぎます。詳細解説はステップやデモの後に配置してください。")
                    error_count += 1

            # 3. Check Summary placement
            if 'まとめ' in heading:
                if idx != len(headings) - 1:
                    print(f"❌ {filepath}: 『{heading}』はスライドの最後に配置してください。後ろに別の解説が続いています。")
                    error_count += 1
                has_summary = True

            # 4. Check Intro placement
            if 'ゴール' in heading or '本日のフロー' in heading:
                if idx > 3:
                    print(f"❌ {filepath}: 『{heading}』はスライドの冒頭（導入部）に配置してください。")
                    error_count += 1

    if error_count > 0:
        print(f"\n🚨 論理フロー（スライドの順番）エラーが {error_count} 件見つかりました。構成を見直してください。")
        sys.exit(1)
    else:
        print("\n✅ スライドの解説フロー（順番）チェックをパスしました！")

if __name__ == "__main__":
    check_flow()
