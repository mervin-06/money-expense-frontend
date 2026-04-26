import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { apiRequest } from "../lib/api";

export default function DashBoard() {
  const navigate = useNavigate();
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSalary = async () => {
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    if (!salary) {
      toast.error("Please enter salary");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/users/salary", {
        method: "PUT",
        token,
        body: JSON.stringify({ salary: Number(salary) }),
      });

      localStorage.setItem("salary", salary);
      toast.success("Salary saved");
      navigate("/expense", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("salary");
    navigate("/login", { replace: true });
  };

  return (
    <AppShell
      badge="Onboarding"
      title="Set your monthly salary"
      actions={
        <button className="button button--ghost" onClick={handleLogout}>
          Logout
        </button>
      }
    >
      <section className="content-grid content-grid--single">
        <article className="panel panel--center">
          <div className="panel__intro">
            <h2>Salary setup</h2>
          </div>

          <label className="field">
            <span>Monthly salary</span>
            <input
              type="number"
              placeholder="Enter your salary"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
            />
          </label>

          <button className="button button--primary" onClick={handleSalary} disabled={loading}>
            {loading ? "Saving..." : "Save salary"}
          </button>
        </article>
      </section>
    </AppShell>
  );
}
