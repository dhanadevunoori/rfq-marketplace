import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function CreateRfq() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    quantity: "",
    deliveryLocation: "",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/rfqs", {
        ...form,
        quantity: Number(form.quantity),
        deadline: new Date(form.deadline).toISOString(),
      });

      navigate("/buyer/rfqs");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to create RFQ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/buyer"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold">
            Create RFQ
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Tell suppliers what you need.
          </p>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Product or Service
              </label>

              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="e.g. Office Chairs"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Requirement Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your requirements..."
                rows="5"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Delivery Location
              </label>

              <input
                name="deliveryLocation"
                value={form.deliveryLocation}
                onChange={handleChange}
                placeholder="e.g. Hyderabad"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                RFQ Deadline
              </label>

              <input
                type="datetime-local"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 p-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create RFQ"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateRfq;