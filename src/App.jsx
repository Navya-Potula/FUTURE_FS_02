import React, { useState, useEffect, useRef } from "react";

export default function App() {

  // LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // ADMIN CHECK
  const [isAdmin, setIsAdmin] = useState(false);

  // LOGIN / REGISTER TOGGLE
  const [isRegistering, setIsRegistering] = useState(false);

  // CURRENT USER
  const [currentUser, setCurrentUser] = useState("");
  useEffect(() => {
  try {
    const savedUser = JSON.parse(
      localStorage.getItem("crm-current-user")
    );

    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser.username);
      setIsAdmin(savedUser.isAdmin);
    }
  } catch (error) {
    console.log("Error loading user");
  } finally {
    setLoading(false);
  }
}, []);

  // USERS
  const [users, setUsers] = useState([]);

  // AUTH FORM
  const [authData, setAuthData] = useState({
    username: "",
    password: "",
  });

  // LOGIN ERROR
  const [authError, setAuthError] = useState("");

  // SEARCH
  const [search, setSearch] = useState("");
  const leadsSectionRef = useRef(null);

  // LEADS
  const [leads, setLeads] = useState([]);

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    source: "Website",
    status: "New",
    notes: "",
  });

  // LOAD USERS
 useEffect(() => {
  try {
    const savedUsers = JSON.parse(
      localStorage.getItem("crm-users")
    );

    if (savedUsers && Array.isArray(savedUsers)) {
      setUsers(savedUsers);
    }
  } catch (error) {
    console.log("Error loading users");
  }
}, []);

  // SAVE USERS
 useEffect(() => {
  if (!loading) {
    localStorage.setItem(
      "crm-users",
      JSON.stringify(users)
    );
  }
}, [users, loading]);

  // LOAD LEADS
 useEffect(() => {
  try {
    const savedLeads = JSON.parse(
      localStorage.getItem("crm-leads")
    );

    if (savedLeads && Array.isArray(savedLeads)) {
      setLeads(savedLeads);
    }
  } catch (error) {
    console.log("Error loading leads");
  }
}, []);

  // SAVE LEADS
  useEffect(() => {
  if (!loading) {
    localStorage.setItem(
      "crm-leads",
      JSON.stringify(leads)
    );
  }
}, [leads, loading]);
  // AUTH INPUT CHANGE
  const handleAuthChange = (e) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value,
    });
  };

  // REGISTER
  const handleRegister = () => {

    if (!authData.username || !authData.password) {
      setAuthError("Please fill all fields");
      return;
    }
    if (authData.password.length < 6) {
  setAuthError("Password must be at least 6 characters");
  return;
}

    const userExists = users.find(
      (user) => user.username === authData.username
    );

    if (userExists) {
      setAuthError("User already exists");
      return;
    }

    const newUser = {
      username: authData.username,
      password: authData.password,
    };

    setUsers([...users, newUser]);

    setAuthError("");

    alert("Account Created Successfully");

    setIsRegistering(false);

    setAuthData({
      username: "",
      password: "",
    });
  };

  // LOGIN
  const handleLogin = () => {

    // ADMIN LOGIN
    if (
      authData.username === "admin" &&
      authData.password === "admin123"
    ) {

      setIsLoggedIn(true);

setCurrentUser("Admin");

setIsAdmin(true);

localStorage.setItem(
  "crm-current-user",
  JSON.stringify({
    username: "Admin",
    isAdmin: true,
  })
);

setAuthError("");

return;
    }

    // NORMAL USER LOGIN
    const validUser = users.find(
      (user) =>
        user.username === authData.username &&
        user.password === authData.password
    );

    if (validUser) {
setIsLoggedIn(true);

setCurrentUser(validUser.username);

setIsAdmin(false);

localStorage.setItem(
  "crm-current-user",
  JSON.stringify({
    username: validUser.username,
    isAdmin: false,
  })
);

setAuthError("");

    } else {

      setAuthError("Invalid Username or Password");

    }
  };

  // FORM CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD LEAD
  const addLead = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Please fill all required fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(formData.email)) {
  alert("Please enter a valid email");
  return;
}
const newLead = {
  id: Date.now(),
  ...formData,
  createdBy: currentUser,
  createdAt: new Date().toLocaleString(),
};
   setLeads((prevLeads) => [
  newLead,
  ...prevLeads,
]);

    setFormData({
      name: "",
      email: "",
      source: "Website",
      status: "New",
      notes: "",
    });
  };

  // DELETE LEAD
  const deleteLead = (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this lead?"
  );

  if (!confirmDelete) return;

  setLeads(leads.filter((lead) => lead.id !== id));
};

  // UPDATE STATUS
  const updateStatus = (id, status) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status } : lead
      )
    );
  };

  // SEARCH FILTER
  const filteredLeads = leads.filter((lead) => {
  const searchText = search.toLowerCase();

  return (
    lead.name.toLowerCase().includes(searchText) ||
    lead.email.toLowerCase().includes(searchText) ||
    lead.source.toLowerCase().includes(searchText)
  );
});
  // ANALYTICS
  const totalLeads = leads.length;

  const contacted = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const converted = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;
  const hour = new Date().getHours();

const greeting =
  hour < 12
    ? "Good Morning ☀️"
    : hour < 18
    ? "Good Afternoon 🌤️"
    : "Good Evening 🌙";

  // AUTH PAGE
  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <h1 className="text-2xl font-bold text-cyan-400">
        Loading CRM...
      </h1>
    </div>
  );
}
  if (!isLoggedIn) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">

        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">

          <h1 className="text-4xl font-bold text-center text-cyan-400 mb-2">

            {isRegistering ? "Create Account" : "CRM Login"}

          </h1>

          <p className="text-center text-gray-400 mb-8">

            {isRegistering
              ? "Register to access CRM Dashboard"
              : "Secure CRM Access"}

          </p>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={authData.username}
            onChange={handleAuthChange}
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none border border-gray-700"
          />

          <input
  type="password"
  name="password"
  placeholder="Password"
  value={authData.password}
  onChange={handleAuthChange}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      isRegistering ? handleRegister() : handleLogin();
    }
  }}
  className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none border border-gray-700"
/>
          {authError && (
            <p className="text-red-400 mb-4 text-sm">
              {authError}
            </p>
          )}

          {isRegistering ? (

            <button
              onClick={handleRegister}
              className="w-full bg-green-500 py-3 rounded-xl font-bold hover:bg-green-600 hover:scale-[1.02] transition duration-300"
            >
              Create Account
            </button>

          ) : (

            <button
              onClick={handleLogin}
              className="w-full bg-cyan-500 py-3 rounded-xl font-bold hover:bg-cyan-600 hover:scale-[1.02] transition duration-300"
            >
              Login
            </button>

          )}

          <div className="text-center mt-6">

            {isRegistering ? (

              <p className="text-gray-400">
                Already have an account?{" "}

                <button
                  onClick={() => {
                    setIsRegistering(false);
                    setAuthError("");
                  }}
                  className="text-cyan-400 font-bold"
                >
                  Login
                </button>

              </p>

            ) : (

              <p className="text-gray-400">
                New User?{" "}

                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setAuthError("");
                  }}
                  className="text-green-400 font-bold"
                >
                  Create Account
                </button>

              </p>

            )}

          </div>

          

        </div>

      </div>
    );
  }

  // MAIN DASHBOARD
  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Mini CRM Dashboard
          </h1>
<p className="text-gray-400 mt-2">
  {greeting}, {currentUser} 👋
</p>

<p className="text-cyan-400 mt-1 text-sm">
  Total Leads: {totalLeads}
</p>

        </div>

        <button
         onClick={() => {
  setIsLoggedIn(false);
  setIsAdmin(false);

  localStorage.removeItem("crm-current-user");
}}
className="bg-red-500 px-5 py-3 rounded-xl mt-5 md:mt-0 hover:bg-red-600 hover:scale-[1.03] transition duration-300"
        >
          Logout
        </button>

      </div>

      {/* SEARCH */}
      <div className="mb-8">

        <input
          type="text"
          placeholder="Search leads by name..."
          value={search}
         onChange={(e) => {
  const value = e.target.value;

  setSearch(value);

  clearTimeout(window.searchTimeout);

  window.searchTimeout = setTimeout(() => {
    if (value.trim() !== "") {
      leadsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 800);
}}
          className="w-full md:w-[400px] p-4 rounded-xl bg-slate-800 border border-gray-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition duration-300"
        />

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
          <h2 className="text-gray-400">Total Leads</h2>
          <p className="text-4xl font-bold mt-3 text-cyan-400">
            {totalLeads}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
          <h2 className="text-gray-400">New Leads</h2>
          <p className="text-4xl font-bold mt-3 text-blue-400">
            {newLeads}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
          <h2 className="text-gray-400">Contacted</h2>
          <p className="text-4xl font-bold mt-3 text-yellow-400">
            {contacted}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
          <h2 className="text-gray-400">Converted</h2>
          <p className="text-4xl font-bold mt-3 text-green-400">
            {converted}
          </p>
        </div>

      </div>

      {/* ONLY ADMIN CAN MODIFY */}
      {isAdmin && (

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-10">

          <h2 className="text-3xl font-bold mb-6 text-cyan-400">
            Add New Lead
          </h2>

          <form
            onSubmit={addLead}
            className="grid md:grid-cols-2 gap-6"
          >

            <input
              type="text"
              name="name"
              placeholder="Client Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#1e293b] p-4 rounded-xl outline-none border border-gray-700"
            />

            <input
              type="email"
              name="email"
              placeholder="Client Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#1e293b] p-4 rounded-xl outline-none border border-gray-700"
            />

            <select
  name="source"
  value={formData.source}
  onChange={handleChange}
  className="bg-[#1e293b] p-4 rounded-xl outline-none border border-gray-700"
>
  <option>Website</option>
  <option>Instagram</option>
  <option>Facebook</option>
  <option>LinkedIn</option>
  <option>Referral</option>
</select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-[#1e293b] p-4 rounded-xl outline-none border border-gray-700"
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Converted</option>
            </select>

            <textarea
              name="notes"
              placeholder="Notes..."
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="md:col-span-2 bg-[#1e293b] p-4 rounded-xl outline-none border border-gray-700"
            ></textarea>

            <button className="md:col-span-2 bg-gradient-to-r from-cyan-500 to-blue-500 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition duration-300 shadow-lg">
              Add Lead
            </button>

          </form>

        </div>

      )}

      {/* LEADS */}
      {/* LEADS */}
<div ref={leadsSectionRef}>

       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

  <h2 className="text-3xl font-bold text-cyan-400">
    Client Leads
  </h2>

  <p className="text-gray-400 mt-2 md:mt-0">
    Showing {filteredLeads.length} lead
    {filteredLeads.length !== 1 ? "s" : ""}
  </p>

</div>

        <div className="grid gap-6">

          {filteredLeads.length === 0 ? (

            <div className="bg-white/10 p-10 rounded-3xl text-center text-gray-400 border border-white/10">

  <div className="text-6xl mb-4">
    📭
  </div>

  <h3 className="text-2xl font-bold text-white mb-2">
    No Leads Found
  </h3>

  <p className="text-gray-400">
    Add your first client lead to get started.
  </p>

</div>

          ) : (

            filteredLeads.map((lead) => (

              <div
                key={lead.id}
                className={`bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row justify-between gap-6 transition duration-300 hover:scale-[1.01] hover:border-cyan-400/40 border-l-4 ${
  lead.status === "New"
    ? "border-l-blue-500"
    : lead.status === "Contacted"
    ? "border-l-yellow-500"
    : "border-l-green-500"
}`}
              >

                <div>

                  <h3 className="text-2xl font-bold">
                    {lead.name}
                  </h3>

                  <p className="text-gray-300 mt-2">
                    {lead.email}
                  </p>

                  <p className="text-gray-400 mt-1">
                    Source: {lead.source}
                  </p>

                  <p className="text-gray-400 mt-3">
                    {lead.notes}
                  </p>

                  <p className="text-cyan-400 text-sm mt-3">
  Added by {lead.createdBy} • {lead.createdAt}
</p>

                </div>

                <div className="flex flex-col gap-4">

                  <span
                    className={`px-5 py-2 rounded-full text-center font-semibold ${
                      lead.status === "New"
                        ? "bg-blue-500/20 text-blue-400"
                        : lead.status === "Contacted"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {lead.status}
                  </span>

                  {/* ONLY ADMIN CAN UPDATE */}
                  {isAdmin && (

                    <div className="flex gap-3 flex-wrap justify-start">

                      <button
                        onClick={() => updateStatus(lead.id, "New")}
                        className="bg-blue-500 px-4 py-2 rounded-xl hover:scale-105 transition duration-300"
                      >
                        New
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(lead.id, "Contacted")
                        }
                        className="bg-yellow-500 text-black px-4 py-2 rounded-xl hover:scale-105 transition duration-300"
                      >
                        Contacted
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(lead.id, "Converted")
                        }
                        className="bg-green-500 px-4 py-2 rounded-xl hover:scale-105 transition duration-300"
                      >
                        Converted
                      </button>

                    </div>

                  )}

                  {/* ONLY ADMIN CAN DELETE */}
                  {isAdmin && (

                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 hover:scale-105 transition duration-300"
                    >
                      Delete Lead
                    </button>

                  )}

                </div>

              </div>

            ))
          )}

        </div>

      </div>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 mt-16 pb-6">
        Mini CRM Dashboard © 2026 | Built with React & Tailwind CSS
      </footer>

    </div>
  );
}