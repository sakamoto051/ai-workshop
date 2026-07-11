// フロントエンド調査ハンズオン用のダミーコード
import { useState } from "react";
import { login, saveToken } from "./authClient";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    saveToken(result.token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      <button type="submit">Login</button>
      {error && <div dangerouslySetInnerHTML={{ __html: error }} />}
    </form>
  );
}

export default LoginForm;
