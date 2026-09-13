import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function MyQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuotations();
  }, []);

  async function fetchQuotations() {
    try {
      const response = await api.get(
        "/quotations/my"
      );

      setQuotations(response.data.quotations);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load quotations"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold">
            My Quotations
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quotations you have submitted to buyers.
          </p>
        </div>

        {loading && (
          <div className="py-12 text-center text-slate-500">
            Loading quotations...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          quotations.length === 0 && (
            <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
              <h2 className="font-semibold">
                No quotations yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Browse open RFQs and submit your first quotation.
              </p>

              <Link
                to="/supplier/rfqs"
                className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Browse RFQs
              </Link>
            </div>
          )}

        <div className="mt-6 space-y-4">
          {quotations.map((quotation) => (
            <div
              key={quotation.id}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h2 className="text-lg font-semibold">
                    {quotation.productName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    RFQ #{quotation.rfqId}
                  </p>
                </div>

                <p className="text-xl font-bold">
                  ₹{quotation.quotedPrice}
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Delivery
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {quotation.estimatedDelivery}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    RFQ Status
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {quotation.rfqStatus}
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
      </main>
    </div>
  );
}

export default MyQuotations;