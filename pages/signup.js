import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerWithEmail, signinWithGoogle } from "../store/slices/authSlice";
import { useRouter } from "next/router";

const SignupPage = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => await dispatch(signinWithGoogle());

  const onSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      registerWithEmail({
        userName: userName,
        email: email,
        password: password,
      })
    );
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <div className="m-auto w-96 max-w-xs bg-white p-5 rounded-md shadow-md">
        <h2 className="text-3xl font-semibold text-center">Sign Up</h2>
        <form className="mt-5 space-y-3">
          <div>
            <label className="text-sm">Username</label>
            <input
              type="text"
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your password"
            />
          </div>
          <button
            onClick={onSubmit}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-5">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
          >
            Sign in with Google
          </button>
        </div>
        <p className="mt-5 text-sm text-center">
          Already have an account?{" "}
          <a href="login" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
