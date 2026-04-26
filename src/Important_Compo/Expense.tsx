import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { apiRequest } from "../lib/api";
import Popup from "../components/Popup";
import html2pdf from "html2pdf.js";
import "./ExpenseHistory.css";

type ExpenseItem = {
  _id?: string;
  title: string;
  amount: number;
  type: string;
  description?: string;
  balance?: number;
  date?: string;
};

export default function Expense() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [history, setHistory] = useState<ExpenseItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logout, setLogout] = useState<boolean>(false);

  const [salary, setSalary] = useState<number>(() => {
    const saved = localStorage.getItem("salary");
    return saved ? Number(saved) : 0;
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const totalSpent = useMemo(
    () => history.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [history],
  );
  const remainingBalance =
    history[0]?.balance ?? history[history.length - 1]?.balance ?? salary - totalSpent;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("salary");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const handleDash = async () => {
    if (!title.trim() || !type.trim() || !amount) {
      toast.error("Fill all expense fields");
      return;
    }

    if (!token) {
      toast.error("User not logged in");
      return;
    }

    try {
      setSaving(true);
      await apiRequest("/users/expense", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          type: type.trim(),
          description: description.trim(),
        }),
      });

      toast.success("Expense added");
      setTitle("");
      setAmount("");
      setType("");
      setDescription("");

      if (showHistory) {
        await handleHistory();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleHistory = async () => {
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    try {
      setHistoryLoading(true);
      const data = await apiRequest<ExpenseItem[] | { expense?: ExpenseItem[] }>(
        "/users/history",
        {
          method: "GET",
          token,
        },
      );

      if (Array.isArray(data)) {
        setHistory(data);
      } else if (Array.isArray(data.expense)) {
        setHistory(data.expense);
      } else {
        setHistory([]);
      }

      setShowHistory(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  }

  const handleDownload = (): void => {
    if (!showHistory || history.length === 0) {
      toast.error("Load the History!");
      return;
    }
    const element = document.getElementById('data');

    if (!element) {
      console.log("Element is Not Found!");
      return;
    }

    html2pdf()
      .from(element)
      .set({
        filename: "Expense-History.pdf",
        margin: 10,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .save();
  };

  const formatCurrency = (value: number | undefined): string => {
    return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
  };

  return (
    <AppShell
      badge="Expense tracker"
      title="Track every expense with clarity"
      actions={
        <>
          <button className="button button--secondary" onClick={() => void handleHistory()}>
            {historyLoading ? "Loading..." : "Show history"}
          </button>
          <button className="button button--ghost" onClick={() => setLogout(true)}>
            Logout
          </button>

        </>
      }
    >
      <section className="stats-grid">
        <article className="stat-card">
          <span>Saved salary</span>
          <strong>Rs. {salary.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <span>Total logged</span>
          <strong>Rs. {totalSpent.toLocaleString()}</strong>
        </article>
        <article className="stat-card">
          <span>Remaining balance</span>
          <strong>Rs. {Number(remainingBalance || 0).toLocaleString()}</strong>
        </article>
      </section>

      <section className="content-grid">
        <form
          className="panel"
          onSubmit={(event) => {
            event.preventDefault();
            void handleDash();
          }}
        >
          <div className="panel__intro">
            <h2>Add a new expense</h2>
          </div>

          {salary === 0 && (
            <label className="field">
              <span>Salary</span>
              <input
                type="number"
                placeholder="Enter your salary"
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setSalary(value);
                  localStorage.setItem("salary", value.toString());
                }}
              />
            </label>
          )}

          <label className="field">
            <span>Category</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="text"
              placeholder="Groceries, rent, travel"
            />
          </label>

          <label className="field">
            <span>Type</span>
            <input
              value={type}
              onChange={(event) => setType(event.target.value)}
              type="text"
              placeholder="Needs, wants, bills"
            />
          </label>

          <label className="field">
            <span>Amount</span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              placeholder="Enter the amount"
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a short note about this expense"
              rows={4}
            />
          </label>

          <button style={{width:'116%',height: '59px'}} className="button button--primary" type="submit" disabled={saving}>
            {saving ? "Saving expense..." : "Add expense"}
          </button>
        </form>

        <aside className={`panel history-panel ${showHistory ? "history-panel--open" : ""}`}>
          <div className="panel__intro panel__intro--row">
            <div>
              <h2>Expense history</h2>
            </div>
            <button className="icon-button" type="button" onClick={() => setShowHistory(false)}>
              Close
            </button>
          </div>
<div className="expense-pdf-container" id="data">
  
  {/* ================= HEADER ================= */}
  <div className="pdf-header">
    <div className="header-content">
      <h1 className="header-title">Expense History Report</h1>
      <p className="header-subtitle">Complete Transaction Record</p>
      <p className="report-date">
        Generated on{" "}
        {new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  </div>

  {/* ================= SUMMARY ================= */}
  <div className="pdf-summary">
    <div className="summary-card">
      <span className="summary-label">Total Salary</span>
      <strong className="summary-amount">
        {formatCurrency(salary)}
      </strong>
    </div>

    <div className="summary-card">
      <span className="summary-label">Total Expenses</span>
      <strong className="summary-amount expense">
        {formatCurrency(totalSpent)}
      </strong>
    </div>

    <div className="summary-card">
      <span className="summary-label">Remaining Balance</span>
      <strong className="summary-amount balance">
        {formatCurrency(remainingBalance)}
      </strong>
    </div>
  </div>

  {/* ================= BREAKDOWN ================= */}
  {(() => {
    const typeMap = new Map();

    history.forEach((item) => {
      const current = typeMap.get(item.type) || 0;
      typeMap.set(item.type, current + Number(item.amount));
    });

    return typeMap.size > 0 ? (
      <div className="pdf-breakdown">
        <h3 className="breakdown-title">Expense Breakdown by Type</h3>

        <div className="breakdown-grid">
          {Array.from(typeMap.entries()).map(([type, amount]) => (
            <div key={type} className="breakdown-item">
              <div className="breakdown-type">{type}</div>
              <div className="breakdown-amount">
                {formatCurrency(amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  })()}

  {/* ================= TABLE ================= */}
  <div className="pdf-transactions">
    <h2 className="transactions-title">Transaction Details</h2>

    <table className="transactions-table">
      <thead>
        <tr>
          <th className="col-date">Date</th>
          <th className="col-category">Category</th>
          <th className="col-type">Type</th>
          <th className="col-description">Description</th>
          <th className="col-amount">Amount</th>
          <th className="col-balance">Balance</th>
        </tr>
      </thead>

      <tbody>
        {history.map((item, index) => (
          <tr
            key={item._id || index}
            className={`transaction-row ${index % 2 === 0 ? "even" : "odd"}`}
          >
            <td className="col-date">
              {new Date(item.date || new Date()).toLocaleDateString("en-IN")}
            </td>

            <td className="col-category">{item.title}</td>

            <td className="col-type">
              <span className={`type-badge ${item.type.toLowerCase()}`}>
                {item.type}
              </span>
            </td>

            <td className="col-description">
              {item.description || "-"}
            </td>

            <td className="col-amount">
              {formatCurrency(item.amount)}
            </td>

            <td className="col-balance">
              {formatCurrency(item.balance)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* ================= FOOTER ================= */}
  <div className="pdf-footer">
    <div className="footer-summary">
      <div className="footer-item">
        <span className="footer-label">Total Transactions:</span>
        <span className="footer-value">{history.length}</span>
      </div>

      <div className="footer-item">
        <span className="footer-label">Final Balance:</span>
        <span className="footer-value balance">
          {history.length > 0
            ? formatCurrency(history[history.length - 1].balance)
            : formatCurrency(0)}
        </span>
      </div>
    </div>

    {/* 🔥 PRO TOUCH */}
    <div className="report-note">
      Thanks for using <strong>MoneyExpense</strong> 💙 <br />
      Track smart. Spend wiser.
    </div>
  </div>
</div>

{/* ================= DOWNLOAD BUTTON ================= */}
<button
  type="button"
  className="button button--secondary"
  onClick={handleDownload}
  disabled={!showHistory || history.length === 0}
>
  Download History as PDF
</button>
        </aside>

      </section>
      <Popup
        isOpen={logout}
        onClose={() => setLogout(false)}
        onConfirm={handleLogOut}
      />
    </AppShell>

  );
}