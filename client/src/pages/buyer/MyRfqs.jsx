import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function MyRfqs() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRfqs();
  }, []);

  async function fetchRfqs() {
    try {
      const response = await api.get("/rfqs/my");

      setRfqs(response.data.rfqs);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to load RFQs"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">
              My RFQs
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your submitted requirements.
            </p>
          </div>

          <Link
            to="/buyer/rfqs/create"
            className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white"
          >
            + Create RFQ
          </Link>
        </div>

        {loading && (
          <div className="mt-8 text-center text-slate-500">
            Loading RFQs...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && rfqs.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="font-semibold">
              No RFQs yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first RFQ to start receiving quotations.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {rfqs.map((rfq) => (
            <Link
              key={rfq.id}
              to={`/buyer/rfqs/${rfq.id}`}
              className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h2 className="text-lg font-semibold">
                    {rfq.productName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {rfq.description}
                  </p>
                </div>

                <span
                  className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${
                    rfq.status === "OPEN"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {rfq.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-500 sm:grid-cols-3">
                <div>
                  <span className="block text-xs">
                    Quantity
                  </span>
                  <span className="font-medium text-slate-900">
                    {rfq.quantity}
                  </span>
                </div>

                <div>
                  <span className="block text-xs">
                    Location
                  </span>
                  <span className="font-medium text-slate-900">
                    {rfq.deliveryLocation}
                  </span>
                </div>

                <div>
                  <span className="block text-xs">
                    Deadline
                  </span>
                  <span className="font-medium text-slate-900">
                    {new Date(rfq.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MyRfqs;