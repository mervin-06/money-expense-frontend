import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { apiRequest } from "../lib/api";

export default function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);

  const handleOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await apiRequest(`/users/verify-otp/${encodeURIComponent(email.trim())}`, {
        method: "POST",
        body: JSON.stringify({ otp }),
      });

      toast.success("OTP verified successfully");
      navigate("/reset", { state: { email: email.trim() } });
    } catch (error: any) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Verification"
      title="Confirm your OTP"
    >
      <form className="auth-form" onSubmit={handleOtp}>
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

        <label className="field">
          <span>One-time password</span>
          <input
            type="text"
            placeholder="Enter the OTP"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            required
          />
        </label>

        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Continue"}
        </button>
      </form>
    </AuthShell>
  );
}
