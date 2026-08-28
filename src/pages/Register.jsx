import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password: password,
      });

      console.log("Registration successful:", response.data);

      setSuccess("Registration successful! Redirecting to login...");

      setName("");
      setEmail("");
      setPassword("");

      // Go to login after registration
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data || "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Register to manage your documents
          </p>

        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <p className="text-sm text-green-400">
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleRegister}>

          {/* Name */}

          <label className="mb-2 block text-sm text-zinc-300">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="mb-5 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          {/* Email */}

          <label className="mb-2 block text-sm text-zinc-300">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mb-5 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          {/* Password */}

          <label className="mb-2 block text-sm text-zinc-300">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            className="mb-6 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          {/* Register */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        {/* Login */}

        <div className="mt-6 text-center">

          <p className="text-sm text-zinc-400">

            Already have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Login
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;