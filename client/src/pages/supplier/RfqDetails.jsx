import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function RfqDetails() {
  const { id } = useParams();

  const [rfq, setRfq] = useState(null);

  const [form, setForm] = useState({
    quotedPrice: "",
    estimatedDelivery: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRfq();
  }, [id]);

  async function fetchRfq() {
    try {
      const response = await api.get(`/rfqs/${id}`);

      setRfq(response.data.rfq);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load RFQ"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/quotations", {
        rfqId: id,
        quotedPrice: Number(form.quotedPrice),
        estimatedDelivery: form.estimatedDelivery,
        message: form.message,
      });

      setSuccess("Quotation submitted successfully.");

      setForm({
        quotedPrice: "",
        estimatedDelivery: "",
        message: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to submit quotation"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="py-12 text-center text-slate-500">
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
              to="/supplier/rfqs"
              className="mt-4 inline-block text-sm"
            >
              Back to RFQs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/supplier/rfqs"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to RFQs
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="text-sm text-slate-500">
                  RFQ #{rfq.id}
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                  {rfq.productName}
                </h1>
              </div>

              <span className="h-fit w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {rfq.status}
              </span>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-slate-500">
                Requirement
              </p>

              <p className="mt-2 leading-7">
                {rfq.description}
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">
                  Quantity
                </p>

                <p className="mt-1 font-semibold">
                  {rfq.quantity}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Delivery Location
                </p>

                <p className="mt-1 font-semibold">
                  {rfq.deliveryLocation}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Deadline
                </p>

                <p className="mt-1 font-semibold">
                  {new Date(
                    rfq.deadline
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              Submit Quotation
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Send your best offer to the buyer.
            </p>

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {rfq.status !== "OPEN" ? (
              <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                This RFQ is no longer accepting quotations.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Quoted Price
                  </label>

                  <input
                    type="number"
                    name="quotedPrice"
                    value={form.quotedPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 45000"
                    required
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Estimated Delivery
                  </label>

                  <input
                    type="text"
                    name="estimatedDelivery"
                    value={form.estimatedDelivery}
                    onChange={handleChange}
                    placeholder="e.g. 10 business days"
                    required
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Message / Notes
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Add any additional information..."
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-slate-900 p-3 font-medium text-white disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Quotation"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RfqDetails;