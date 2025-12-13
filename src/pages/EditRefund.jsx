// src/pages/EditRefund.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function EditRefund() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "",
    mode: "Cash",
    refundDate: "",
    referenceNo: "",
    drawnOn: "",
    drawnAs: "",
    chequeDate: "",
    chequeNumber: "",
    bankName: "",
    transferType: "",
    transferDate: "",
    upiName: "",
    upiId: "",
    upiDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [billId, setBillId] = useState(""); // 🔵 NEW

  useEffect(() => {
    apiFetch(`/api/refunds/${id}`)
      .then((res) => {
        setForm({
          amount: res.amount || "",
          mode: res.mode || "Cash",
          refundDate: res.refundDate || "",
          referenceNo: res.referenceNo || "",
          drawnOn: res.drawnOn || "",
          drawnAs: res.drawnAs || "",
          chequeDate: res.chequeDate || "",
          chequeNumber: res.chequeNumber || "",
          bankName: res.bankName || "",
          transferType: res.transferType || "",
          transferDate: res.transferDate || "",
          upiName: res.upiName || "",
          upiId: res.upiId || "",
          upiDate: res.upiDate || "",
        });
        setBillId(res.billId); // 🔵 NEW
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load refund");
        setLoading(false);
      });
  }, [id]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    apiFetch(`/api/refunds/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    })
      .then(() => {
        // 🔵 NEW: Navigate with refresh flag
        navigate(`/bills/${billId}`, {
          state: { refresh: true, timestamp: Date.now() },
        });
      })
      .catch((err) => setError(err.message || "Failed to update refund"))
      .finally(() => setSaving(false));
  }

  if (loading) return <div className="text-sm">Loading refund details...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Edit Refund</h2>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setField("amount", e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Refund Date
          </label>
          <input
            type="date"
            value={form.refundDate}
            onChange={(e) => setField("refundDate", e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mode
          </label>
          <select
            value={form.mode}
            onChange={(e) => setField("mode", e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option>Cash</option>
            <option>Cheque</option>
            <option>BankTransfer</option>
            <option>UPI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Reference No. (optional)
          </label>
          <input
            value={form.referenceNo}
            onChange={(e) => setField("referenceNo", e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        {form.mode === "Cheque" && (
          <div className="space-y-3 border-t pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cheque No.
                </label>
                <input
                  value={form.chequeNumber}
                  onChange={(e) => setField("chequeNumber", e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Cheque Date
                </label>
                <input
                  type="date"
                  value={form.chequeDate}
                  onChange={(e) => setField("chequeDate", e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                value={form.bankName}
                onChange={(e) => setField("bankName", e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {form.mode === "BankTransfer" && (
          <div className="space-y-3 border-t pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Transfer Type
                </label>
                <select
                  value={form.transferType}
                  onChange={(e) => setField("transferType", e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option>IMPS</option>
                  <option>NEFT</option>
                  <option>RTGS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Transfer Date
                </label>
                <input
                  type="date"
                  value={form.transferDate}
                  onChange={(e) => setField("transferDate", e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                value={form.bankName}
                onChange={(e) => setField("bankName", e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {form.mode === "UPI" && (
          <div className="space-y-3 border-t pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  UPI Name
                </label>
                <input
                  value={form.upiName}
                  onChange={(e) => setField("upiName", e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  UPI ID
                </label>
                <input
                  value={form.upiId}
                  onChange={(e) => setField("upiId", e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                UPI Date
              </label>
              <input
                type="date"
                value={form.upiDate}
                onChange={(e) => setField("upiDate", e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Drawn On (optional)
            </label>
            <input
              value={form.drawnOn}
              onChange={(e) => setField("drawnOn", e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Drawn As (optional)
            </label>
            <input
              value={form.drawnAs}
              onChange={(e) => setField("drawnAs", e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Update Refund"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
