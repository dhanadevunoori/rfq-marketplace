import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function BrowseRfqs() {
  const [rfqs, setRfqs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRfqs();
  }, []);

  async function fetchRfqs() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rfqs");

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

  const filteredRfqs = rfqs.filter((rfq) => {
    const searchText = search.toLowerCase();
    const locationText = location.toLowerCase();

    const matchesSearch =
      rfq.productName
        .toLowerCase()
        .includes(searchText) ||
      rfq.description
        .toLowerCase()
        .includes(searchText);

    const matchesLocation =
      rfq.deliveryLocation
        .toLowerCase()
        .includes(locationText);

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold">
            Browse RFQs
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Find open requirements you can quote on.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Search product or requirement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border bg-white p-3"
          />

          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-lg border bg-white p-3"
          />
        </div>

        {loading && (
          <div className="py-12 text-center text-slate-500">
            Loading RFQs...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredRfqs.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="font-semibold">
              No RFQs found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {filteredRfqs.map((rfq) => (
            <Link
              key={rfq.id}
              to={`/supplier/rfqs/${rfq.id}`}
              className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h2 className="text-lg font-semibold">
                    {rfq.productName}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {rfq.description}
                  </p>
                </div>

                <span className="h-fit w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {rfq.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Quantity
                  </p>

                  <p className="mt-1 font-medium">
                    {rfq.quantity}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 font-medium">
                    {rfq.deliveryLocation}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Deadline
                  </p>

                  <p className="mt-1 font-medium">
                    {new Date(
                      rfq.deadline
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default BrowseRfqs;