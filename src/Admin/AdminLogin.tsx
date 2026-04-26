import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { apiRequest } from "../lib/api";
import Popup from "../components/Popup";

type UserRecord = {
  _id: string;
  name: string;
  email: string;
  salary?: number;
  role?: string;
};

export default function AdminLogin() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [logout, setLogout] = useState<boolean>(false);

  const [deleteUser, setDeleteUser] = useState<string | null>(null);
  const [Open, setOpen] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const handleDelete = async (id: string) => {
    console.log("Delete ID:", id);

    try {
      await apiRequest(`/users/del/${id}`, {
        method: "DELETE",
        token,
      });

      setUsers((prev) => {
        console.log("Before:", prev.map(u => u._id));

        const updated = prev.filter((user) => user._id !== id);

        console.log("After:", updated.map(u => u._id));

        return updated;
      });

      toast.success("User deleted");
    } catch (error: any) {
      toast.error(error.message || "Server error");
    }
  };



  const handleUsers = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest<UserRecord[]>("/users", {
        method: "GET",
        token,
      });
      setUsers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Server error");
    } finally {
      setLoading(false);
    }
  };


  const totalSalary = users.reduce((sum, user) => sum + Number(user.salary || 0), 0);

  return (
    <AppShell
      badge="Admin panel"
      title="Manage registered users"
      actions={
        <>
          <button className="button button--secondary" onClick={handleUsers}>
            {loading ? "Loading..." : "Load users"}
          </button>
          <button className="button button--ghost" onClick={() => setLogout(true)}>
            Logout
          </button>
        </>
      }
    >
      <section className="stats-grid">
        <article className="stat-card">
          <span>Total users</span>
          <strong>{users.length}</strong>
        </article>
        <article className="stat-card">
          <span>Admins</span>
          <strong>{users.filter((user) => user.role === "admin").length}</strong>
        </article>
        <article className="stat-card">
          <span>Total salary tracked</span>
          <strong>Rs. {totalSalary.toLocaleString()}</strong>
        </article>
      </section>

      <section className="content-grid content-grid--single">
        {users.length === 0 ? (
          <div className="panel empty-state">
            <p>{loading ? "Loading users..." : "Load users to start managing accounts."}</p>
          </div>
        ) : (
          <div className="admin-grid">
            {users.map((user) => (
              <article className="panel admin-card" key={user._id}>
                <div className="admin-card__header">
                  <div>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                  </div>
                  <span className={`role-pill role-pill--${user.role || "user"}`}>
                    {user.role || "user"}
                  </span>
                </div>

                <div className="admin-card__details">
                  <div>
                    <span>Salary</span>
                    <strong>Rs. {Number(user.salary || 0).toLocaleString()}</strong>
                  </div>
                </div>

                <button className="button button--danger" onClick={() => {
                  setOpen(true)
                  setDeleteUser(user._id);
                }}>
                  Delete user
                </button>
              </article>
            ))}
            <Popup isOpen={Open}
              title="Delete"
              onClose={() => setOpen(false)}
              onConfirm={() => {
                if (deleteUser) {
                  handleDelete(deleteUser)
                }
                setOpen(false);
              }} />
          </div>
        )}
        <Popup
          isOpen={logout}
          onClose={() => setLogout(false)}
          onConfirm={handleLogout}
        />
      </section>
    </AppShell>
  );
}
