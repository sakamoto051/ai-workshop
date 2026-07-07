#!/usr/bin/env python3
import os
import sys
import subprocess
import re

def print_result(title, status, detail=""):
    color = "\033[92m[PASS]\033[0m" if status else "\033[91m[FAIL]\033[0m"
    print(f"{color} {title}")
    if detail:
        print(f"       -> {detail}")

def check_rule_1():
    # 規約①: テストは unittest で書かれていること（pytest 禁止）
    test_file = "tests/test_calc.py"
    if not os.path.exists(test_file):
        return False, "tests/test_calc.py が存在しません。"
    
    with open(test_file, "r") as f:
        content = f.read()
    
    has_unittest = "unittest" in content
    has_pytest = "pytest" in content
    
    if not has_unittest:
        return False, "unittest がインポートされていません。"
    if has_pytest:
        return False, "pytest が使用されています（社内規約では unittest を使用してください）。"
        
    return True, "unittest を使用したテストコードを確認しました。"

def check_rule_2():
    # 規約②: calc.py で logging が使用されていること
    calc_file = "calc.py"
    if not os.path.exists(calc_file):
        return False, "calc.py が存在しません。"
        
    with open(calc_file, "r") as f:
        content = f.read()
        
    has_logging = "import logging" in content or "from logging" in content
    uses_logging = "logging." in content
    
    if not has_logging:
        return False, "logging モジュールがインポートされていません。"
    if not uses_logging:
        return False, "logging によるログ出力が記述されていません。"
        
    return True, "logging モジュールによるデバッグログの出力が確認されました。"

def check_rule_3():
    # 規約③: テストがすべてパスすること
    test_file = "tests/test_calc.py"
    if not os.path.exists(test_file):
        return False, "テストファイルがありません。"
        
    try:
        # python -m unittest を実行
        result = subprocess.run(
            [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if result.returncode == 0:
            return True, "すべてのテストが正常にパスしました。"
        else:
            return False, f"テスト実行エラー:\n{result.stderr}"
    except Exception as e:
        return False, f"テスト実行中に例外が発生しました: {str(e)}"

def main():
    print("=== コーディング規約 自動検証スクリプト ===")
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    r1_ok, r1_msg = check_rule_1()
    print_result("規約①: テストフレームワークに unittest を使用する", r1_ok, r1_msg)
    
    r2_ok, r2_msg = check_rule_2()
    print_result("規約②: デバッグ・ログ出力に logging モジュールを使用する", r2_ok, r2_msg)
    
    r3_ok, r3_msg = check_rule_3()
    print_result("規約③: テストを実行し、すべてグリーンであること", r3_ok, r3_msg)
    
    print("==========================================")
    if r1_ok and r2_ok and r3_ok:
        print("\033[92m【祝】すべての社内コーディング規約をクリアしました！\033[0m")
        sys.exit(0)
    else:
        print("\033[91m【警告】規約違反またはテストエラーがあります。修正してください。\033[0m")
        sys.exit(1)

if __name__ == "__main__":
    main()
