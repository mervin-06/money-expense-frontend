import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { apiRequest } from "../lib/api";

export default function Reset() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [newPass, setNewPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPass !== rePass) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiRequest(`/users/reset/${encodeURIComponent(email.trim())}`, {
        method: "PUT",
        body: JSON.stringify({ password: newPass }),
      });

      toast.success("Password updated successfully");
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Unable to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Choose a new password"
    >
      <form className="auth-form" onSubmit={handleReset}>
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
          <span>New password</span>
          <input
            type="password"
            placeholder="Enter your new password"
            value={newPass}
            onChange={(event) => setNewPass(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            placeholder="Confirm your password"
            value={rePass}
            onChange={(event) => setRePass(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="button button--primary" disabled={loading}>
          {loading ? "Updating..." : "Continue"}
        </button>
      </form>
    </AuthShell>
  );
}
