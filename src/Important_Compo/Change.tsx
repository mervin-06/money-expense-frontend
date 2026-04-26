import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { apiRequest } from "../lib/api";

export default function Change() {
  const navigate = useNavigate();
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewPass = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest<{ message?: string }>(
        `/users/${encodeURIComponent(email.trim())}`,
        {
          method: "PUT",
          body: JSON.stringify({
            currpassword: currPass,
            Newpassword: newPass,
          }),
        },
      );

      toast.success(data.message || "Password updated successfully");
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Unable to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Security settings"
      title="Change your password"
    >
      <form className="auth-form" onSubmit={handleNewPass}>
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
          <span>Current password</span>
          <input
            type="password"
            placeholder="Enter your current password"
            value={currPass}
            onChange={(event) => setCurrPass(event.target.value)}
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

        <button type="submit" className="button button--primary" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
