import sys

def main():
    if len(sys.argv) < 4:
        print("usage: calc.py <a> <op> <b>")
        return 1
    a = float(sys.argv[1])
    op = sys.argv[2]
    b = float(sys.argv[3])
    if op == "+":
        print(a + b)
    elif op == "-":
        print(a - b)
    elif op == "*":
        print(a * b)
    elif op == "/":
        if b == 0:
            print("div by zero")
            return 1
        print(a / b)
    else:
        print("unknown op")
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
