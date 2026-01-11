import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const avatarRef = useRef();
  const coverRef = useRef();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Min 6 chars")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!avatar) {
        toast.error("Avatar is required");
        setSubmitting(false);
        return;
      }
      const data = new FormData();
      Object.entries(values).forEach(([k, v]) => data.append(k, v));
      data.append("avatar", avatar);
      if (coverImage) data.append("coverImage", coverImage);

      try {
        await API.post("/users/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      } catch (e) {}
      setSubmitting(false);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <form
        className="bg-gray-800 border border-gray-900 rounded-lg p-6 sm:p-8 w-full max-w-md lg:max-w-lg flex flex-col gap-4"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 text-white">
          Register on VideoTube
        </h1>

        {/* Full Name */}
        <div>
          <input
            name="fullName"
            placeholder="Full Name"
            className="bg-gray-900 rounded p-2 sm:p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 w-full text-sm sm:text-base"
            onChange={formik.handleChange}
            value={formik.values.fullName}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <div className="text-red-500 text-xs sm:text-sm mt-1">
              {formik.errors.fullName}
            </div>
          )}
        </div>

        {/* Username */}
        <div>
          <input
            name="username"
            placeholder="Username"
            className="bg-gray-900 rounded p-2 sm:p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 w-full text-sm sm:text-base"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="text-red-500 text-xs sm:text-sm mt-1">
              {formik.errors.username}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="bg-gray-900 rounded p-2 sm:p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 w-full text-sm sm:text-base"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs sm:text-sm mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-gray-900 rounded p-2 sm:p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 w-full text-sm sm:text-base"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs sm:text-sm mt-1">
              {formik.errors.password}
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Avatar Upload */}
          <div className="flex-1">
            <button
              type="button"
              className="px-3 py-2 bg-rose-600 rounded text-white hover:bg-rose-700 transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base"
              onClick={() => avatarRef.current.click()}
            >
              {avatar ? "Change Avatar" : "Select Avatar"}
            </button>
            <input
              ref={avatarRef}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
            {avatar && (
              <div className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                {avatar.name}
              </div>
            )}
          </div>

          {/* Cover Image Upload */}
          <div className="flex-1">
            <button
              type="button"
              className="px-3 py-2 bg-rose-600 rounded text-white hover:bg-rose-700 transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base"
              onClick={() => coverRef.current.click()}
            >
              {coverImage ? "Change Cover" : "Select Cover"}
            </button>
            <input
              ref={coverRef}
              type="file"
              name="coverImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
            {coverImage && (
              <div className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                {coverImage.name}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-rose-600 text-white rounded px-4 py-2 sm:py-3 mt-2 font-semibold hover:bg-rose-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4 text-gray-400 text-xs sm:text-sm">
          Already have an account?{" "}
          <Link
            className="text-rose-600 hover:underline hover:text-rose-500 transition-colors duration-200"
            to="/login"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
