import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
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
      await signup(
        form.name,
        form.email,
        form.password,
        form.role
      );

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">
          Create account
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Join the RFQ Marketplace
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full rounded-lg border p-3"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            <option value="BUYER">
              Buyer
            </option>

            <option value="SUPPLIER">
              Supplier
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 p-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-slate-900"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;