// フロントエンド調査ハンズオン用のダミーコード
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  };

  return null;
}

export default LoginForm;
