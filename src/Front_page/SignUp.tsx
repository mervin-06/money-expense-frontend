import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { apiRequest } from "../lib/api";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("salary");
  }, []);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      nameRef.current?.focus();
      toast.error("Please fill the name field");
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      nameRef.current?.focus();
      toast.error("Name should only contain letters");
      return;
    }

    if (!email.trim()) {
      emailRef.current?.focus();
      toast.error("Please fill the email field");
      return;
    }

    if (!password) {
      passwordRef.current?.focus();
      toast.error("Please fill the password field");
      return;
    }

    if (password.length < 6) {
      passwordRef.current?.focus();
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest<{ message?: string }>("/users", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      toast.success(data.message || "Account created successfully");
      navigate("/login", { replace: true });
    } 
    catch (error: any) {
      console.error("Signup error:", error);
      toast.error(
        error?.message?.includes("timeout")
          ? "Server is taking too long to respond. Please try again."
          : error?.message?.includes("fetch")
          ? "Cannot connect to backend. Check your internet connection."
          : error.message || "Server error",
      );
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Money Expense"
      title="Create your account"
    >
      <form className="auth-form" onSubmit={handleSignUp}>
        <label className="field">
          <span>Full name</span>
          <input
            ref={nameRef}
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Email address</span>
          <input
            ref={emailRef}
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
            ref={passwordRef}
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="form-footnote">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthShell>
  );
}
