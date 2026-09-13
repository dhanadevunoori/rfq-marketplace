import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Buyer Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your business requirements and quotations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/buyer/rfqs/create"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">
              Create RFQ
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Post a new product or service requirement.
            </p>
          </Link>

          <Link
            to="/buyer/rfqs"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">
              My RFQs
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View and manage your submitted requirements.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default BuyerDashboard;