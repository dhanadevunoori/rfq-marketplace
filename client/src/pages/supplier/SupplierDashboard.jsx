import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function SupplierDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Supplier Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Discover business opportunities and submit quotations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/supplier/rfqs"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">
              Browse RFQs
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Find open business requirements from buyers.
            </p>
          </Link>

          <Link
            to="/supplier/quotations"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">
              My Quotations
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View quotations you have submitted.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default SupplierDashboard;