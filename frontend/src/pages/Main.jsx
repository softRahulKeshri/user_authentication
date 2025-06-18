import { useState } from "react";

import LoginForm from "./Login";
import RegisterForm from "./Register";

const Main = () => {
  const [activeForm, setActiveForm] = useState("register");

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveForm("register")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeForm === "register"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setActiveForm("login")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeForm === "login"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Login
            </button>
          </div>
        </div>

        {activeForm === "register" ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default Main;
