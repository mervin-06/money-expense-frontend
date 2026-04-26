import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { apiRequest } from "../lib/api";

export default function LoginUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest<{
        message?: string;
        token: string;
        salary?: number | string;
        role?: string;
      }>("/users/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password: userPass }),
      });

      localStorage.setItem("token", data.token);

      const salaryValue = Number(data.salary);
      const normalizedSalary = Number.isFinite(salaryValue) ? salaryValue : 0;
      localStorage.setItem("salary", normalizedSalary.toString());

      if (data.role === "admin") {
        toast.success(data.message || "Admin login successful");
        navigate("/admin", { replace: true });
        return;
      }

      toast.success("Login successful");

      if (normalizedSalary > 0) {
        navigate("/expense", { replace: true });
      } else {
        navigate("/dash", { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Login to your account"
    >
      <form className="auth-form" onSubmit={handleLogin}>
        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Enter your password"
            value={userPass}
            onChange={(event) => setUserPass(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="form-links">
          <p className="form-footnote">
            Don't have an account? <Link to="/">Sign up</Link>
          </p>
          <p className="form-footnote">
            Forgot your password? <Link to="/forgot">Reset it</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
