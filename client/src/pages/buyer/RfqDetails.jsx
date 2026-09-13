import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function RfqDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  const [editing, setEditing] = useState(false);
  const [showQuotations, setShowQuotations] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    productName: "",
    description: "",
    quantity: "",
    deliveryLocation: "",
    deadline: "",
  });

  useEffect(() => {
    fetchRfq();
  }, [id]);

  async function fetchRfq() {
    try {
      const response = await api.get(`/rfqs/my/${id}`);

      const data = response.data.rfq;

      setRfq(data);

      setForm({
        productName: data.productName,
        description: data.description,
        quantity: data.quantity,
        deliveryLocation: data.deliveryLocation,
        deadline: formatDateForInput(data.deadline),
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load RFQ"
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDateForInput(date) {
    const value = new Date(date);

    const offset = value.getTimezoneOffset();

    const localDate = new Date(
      value.getTime() - offset * 60 * 1000
    );

    return localDate.toISOString().slice(0, 16);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();

    setFormError("");
    setSaving(true);

    try {
      const response = await api.put(`/rfqs/my/${id}`, {
        ...form,
        quantity: Number(form.quantity),
        deadline: new Date(form.deadline).toISOString(),
      });

      setRfq(response.data.rfq);
      setEditing(false);

      await fetchRfq();
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Unable to update RFQ"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleClose() {
    const confirmed = window.confirm(
      "Are you sure you want to close this RFQ?"
    );

    if (!confirmed) {
      return;
    }

    setClosing(true);
    setError("");

    try {
      await api.patch(`/rfqs/my/${id}/close`);

      await fetchRfq();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to close RFQ"
      );
    } finally {
      setClosing(false);
    }
  }

  async function handleViewQuotations() {
    setShowQuotations(true);

    try {
      const response = await api.get(
        `/quotations/rfq/${id}`
      );

      setQuotations(response.data.quotations);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load quotations"
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex justify-center py-16 text-slate-500">
          Loading RFQ...
        </div>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold">
              RFQ not found
            </h1>

            <Link
              to="/buyer/rfqs"
              className="mt-4 inline-block text-sm font-medium"
            >
              Back to My RFQs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/buyer/rfqs"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to My RFQs
        </Link>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm text-slate-500">
                RFQ #{rfq.id}
              </p>

              <h1 className="mt-1 text-2xl font-bold">
                {rfq.productName}
              </h1>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                rfq.status === "OPEN"
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {rfq.status}
            </span>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!editing ? (
            <>
              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Requirement
                  </p>

                  <p className="mt-1 text-slate-900">
                    {rfq.description}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-slate-500">
                      Quantity
                    </p>

                    <p className="mt-1 font-medium">
                      {rfq.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Delivery Location
                    </p>

                    <p className="mt-1 font-medium">
                      {rfq.deliveryLocation}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Deadline
                    </p>

                    <p className="mt-1 font-medium">
                      {new Date(
                        rfq.deadline
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {rfq.status === "OPEN" && (
                <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row">
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                  >
                    Edit RFQ
                  </button>

                  <button
                    onClick={handleClose}
                    disabled={closing}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {closing ? "Closing..." : "Close RFQ"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <form
              onSubmit={handleUpdate}
              className="mt-8 space-y-5"
            >
              {formError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product or Service
                </label>

                <input
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
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

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormError("");
                  }}
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Supplier Quotations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                See quotations submitted for this RFQ.
              </p>
            </div>

            <button
              onClick={handleViewQuotations}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              {showQuotations
                ? "Refresh Quotations"
                : "View Quotations"}
            </button>
          </div>

          {showQuotations && (
            <div className="mt-6">
              {quotations.length === 0 ? (
                <div className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No quotations received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {quotations.map((quotation) => (
                    <div
                      key={quotation.id}
                      className="rounded-lg border p-5"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <h3 className="font-semibold">
                            {quotation.supplierName}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {quotation.supplierEmail}
                          </p>
                        </div>

                        <p className="text-xl font-bold">
                          ₹{quotation.quotedPrice}
                        </p>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-500">
                            Estimated Delivery
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {quotation.estimatedDelivery}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Submitted
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {new Date(
                              quotation.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {quotation.message && (
                        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                          {quotation.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RfqDetails;