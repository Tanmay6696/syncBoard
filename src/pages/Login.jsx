import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await loginUser({
            email,
            password,
        });

        console.log("Login successful:", response.data);

        // SAVE USER
        localStorage.setItem(
            "user",
            JSON.stringify(response.data)
        );

        setUser(response.data);

        navigate("/documents");

    } catch (error) {
        console.error("Login failed:", error);
        setError("Invalid email or password");
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Login to access your documents
          </p>

        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleLogin}>

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
            placeholder="Enter your password"
            required
            className="mb-6 w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          {/* Login */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}

        <div className="mt-6 text-center">

          <p className="text-sm text-zinc-400">

            Don't have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Register
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;