import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { apiRequest } from "../lib/api";

export default function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await apiRequest("/users/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });

      toast.success("OTP sent to your email");
      navigate("/otp", { state: { email: email.trim() } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Forgot your password?"
    >
      <form className="auth-form" onSubmit={handleForgot}>
        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="button button--primary" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </AuthShell>
  );
}
