import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
      if (
        !err.message.includes(
          "Cross-Origin-Opener-Policy policy would block the window.closed call"
        )
      ) {
        console.error(err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogle}
      className="flex items-center justify-center gap-2 mt-3 border p-2 rounded-lg hover:bg-gray-100"
    >
      <FcGoogle size={24} />
      Continue with Google
    </button>
  );
}















