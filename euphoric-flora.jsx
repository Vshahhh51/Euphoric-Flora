import {
  loginWithGoogle,
  loginWithGithub,
  firebaseSignOut,
} from "./FirebaseConfig";

function EuphoricFlora() {
  const [cart, setCart] = React.useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showCart, setShowCart] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState("home");
  const [currentUser, setCurrentUser] = React.useState({ name: "", email: "" });

  // NEW: DB-related state
  const [dbUsers, setDbUsers] = React.useState([]);
  const [dbStatus, setDbStatus] = React.useState("");

  const allProducts = [
    {
      id: 1,
      name: "Red Roses Bouquet",
      category: "roses",
      price: 55,
      color: "red",
      icon: "🌹",
      description: "Classic red roses for love and passion",
    },
    {
      id: 2,
      name: "Pink Roses Bundle",
      category: "roses",
      price: 50,
      color: "pink",
      icon: "🌹",
      description: "Soft pink roses for grace and admiration",
    },
    {
      id: 3,
      name: "White Daisies",
      category: "daisies",
      price: 35,
      color: "white",
      icon: "🌼",
      description: "Cheerful white daisies for innocence",
    },
    {
      id: 4,
      name: "Yellow Daisies",
      category: "daisies",
      price: 35,
      color: "yellow",
      icon: "🌼",
      description: "Bright yellow daisies for friendship",
    },
    {
      id: 5,
      name: "Red Tulips",
      category: "tulips",
      price: 40,
      color: "red",
      icon: "🌷",
      description: "Perfect love with red tulips",
    },
    {
      id: 6,
      name: "Purple Tulips",
      category: "tulips",
      price: 42,
      color: "purple",
      icon: "🌷",
      description: "Royalty and elegance",
    },
    {
      id: 7,
      name: "Sunflower Bunch",
      category: "sunflowers",
      price: 45,
      color: "yellow",
      icon: "🌻",
      description: "Joyful sunflowers for admiration",
    },
    {
      id: 8,
      name: "Cherry Blossom Branch",
      category: "cherry",
      price: 60,
      color: "pink",
      icon: "🌸",
      description: "Beautiful renewal and spring",
    },
    {
      id: 9,
      name: "White Orchids",
      category: "orchids",
      price: 75,
      color: "white",
      icon: "🌺",
      description: "Luxury and elegance",
    },
    {
      id: 10,
      name: "Purple Orchids",
      category: "orchids",
      price: 80,
      color: "purple",
      icon: "🌺",
      description: "Exotic purple orchids",
    },
    {
      id: 11,
      name: "Birthday Bouquet",
      category: "occasion",
      price: 45,
      color: "mixed",
      icon: "🎉",
      description: "Colorful mix for birthdays",
    },
    {
      id: 12,
      name: "Anniversary Special",
      category: "occasion",
      price: 65,
      color: "red",
      icon: "💕",
      description: "Romantic anniversary arrangement",
    },
    {
      id: 13,
      name: "Im Sorry Flowers",
      category: "occasion",
      price: 55,
      color: "mixed",
      icon: "💐",
      description: "Apology bouquet with care",
    },
    {
      id: 14,
      name: "Just Because",
      category: "occasion",
      price: 40,
      color: "mixed",
      icon: "🌈",
      description: "Surprise someone special",
    },
  ];

  const [displayedProducts, setDisplayedProducts] = React.useState(
    allProducts.slice(10, 14)
  );

  const flowers = [
    {
      name: "Roses",
      meaning: "Love, passion, romance",
      icon: "🌹",
      category: "roses",
    },
    {
      name: "Daisies",
      meaning: "Cheerfulness, innocence",
      icon: "🌼",
      category: "daisies",
    },
    {
      name: "Tulips",
      meaning: "Caring, perfect love",
      icon: "🌷",
      category: "tulips",
    },
    {
      name: "Sunflowers",
      meaning: "Joy, admiration",
      icon: "🌻",
      category: "sunflowers",
    },
    {
      name: "Cherry Blossom",
      meaning: "Renewal, beauty",
      icon: "🌸",
      category: "cherry",
    },
    {
      name: "Orchids",
      meaning: "Luxury, elegance",
      icon: "🌺",
      category: "orchids",
    },
  ];


  // === DB HELPERS ===

  const fetchUsersFromDb = () => {
    setDbStatus("Loading users...");

    fetch("/api/users")
      .then(async (res) => {
        const text = await res.text();
        console.log("Response from /api/users:", res.status, text);

        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }

        const data = JSON.parse(text);
        setDbUsers(data);
        setDbStatus(data.length ? "" : "No users in database yet.");
      })
      .catch((err) => {
        console.error("fetchUsersFromDb error:", err);
        setDbStatus("Error loading users from database");
      });
  };

  const saveUserToDb = async (name, email) => {
    try {
      setDbStatus("Saving user...");
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setDbStatus("User saved to database.");
      fetchUsersFromDb();
    } catch (err) {
      console.error("Error saving user:", err);
      setDbStatus("Error saving user to database");
    }
  };

  // Social login: Google / GitHub via Firebase
  const handleSocialLogin = async (provider) => {
    try {
      let result;

      if (provider === "Google") {
        result = await loginWithGoogle();
      } else if (provider === "GitHub") {
        result = await loginWithGithub();
      } else {
        throw new Error("Unknown provider: " + provider);
      }

      const user = result.user;
      const name = user.displayName || "";
      const email = user.email || "";

      setCurrentUser({ name, email });
      await saveUserToDb(name, email);

      setIsLoggedIn(true);
      setCurrentPage("profile");
    } catch (err) {
      console.error("Social login error:", err);
      let errorMessage = err.message || "Unknown error";
      if (err.code === "auth/unauthorized-domain") {
        errorMessage = "This domain is not authorized in Firebase. Please add your Replit domain to Firebase Console > Authentication > Settings > Authorized domains.";
      } else if (err.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups for this site and try again.";
      } else if (err.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelled.";
      }
      alert("Login failed: " + errorMessage);
    }
  };

  // UPDATED: email signup now saves to DB
  const handleEmailSignup = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");

    if (name && email) {
      await saveUserToDb(name, email);
      setCurrentUser({ name, email });
    }

    setIsLoggedIn(true);
    setCurrentPage("profile");
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalItems = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setDisplayedProducts(allProducts.slice(10, 14));
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.color.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
    );

    setDisplayedProducts(
      filtered.length > 0 ? filtered : allProducts.slice(10, 14)
    );
  };

  const filterByCategory = (category) => {
    const filtered = allProducts.filter(
      (product) => product.category === category
    );
    setDisplayedProducts(filtered);
    setSearchQuery("");
  };

  const showAllFlowers = () => {
    setDisplayedProducts(allProducts);
    setSearchQuery("");
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsLoggedIn(false);
    setCurrentUser({ name: "", email: "" });
    setCurrentPage("home");
  };

  // When user is logged in and on profile page, load users from DB
  React.useEffect(() => {
    if (currentPage === "profile" && isLoggedIn) {
      fetchUsersFromDb();
    }
  }, [currentPage, isLoggedIn]);

  const renderPage = () => {
    if (currentPage === "store") {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-8">Our Store</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-rose-200 rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="bg-pink-100 border border-rose-200 rounded-lg h-32 mb-3 flex items-center justify-center">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h4 className="font-semibold text-amber-900 mb-1 text-sm">
                  {item.name}
                </h4>
                <p className="text-amber-800 mb-2 font-bold">$ {item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full px-3 py-2 bg-rose-200 text-amber-900 rounded hover:bg-rose-300 transition text-sm font-medium"
                >
                  Quick Add
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentPage === "about") {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">
            About Euphoric Flora
          </h2>
          <div className="bg-white border-2 border-rose-200 rounded-lg p-8">
            <p className="text-amber-900 mb-4 text-lg">
              Welcome to Euphoric Flora, where every bouquet tells a story and
              every bloom brings joy.
            </p>
            <p className="text-amber-900 mb-4">
              We specialize in same-day flower delivery with the freshest
              blooms.
            </p>
            <p className="text-amber-900">
              Each arrangement is carefully crafted by our expert florists.
            </p>
          </div>
        </div>
      );
    }

    if (currentPage === "faqs") {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-2">
                Do you offer same-day delivery?
              </h3>
              <p className="text-amber-800">
                Yes! We offer same-day delivery for orders placed before 2 PM.
              </p>
            </div>
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-2">
                How long will my flowers last?
              </h3>
              <p className="text-amber-800">
                With proper care, most bouquets last 5–7 days.
              </p>
            </div>
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-2">
                Can I customize my bouquet?
              </h3>
              <p className="text-amber-800">
                Absolutely! Use our Build Your Own Bouquet option.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === "profile") {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">My Profile</h2>
          <div className="bg-white border-2 border-rose-200 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-rose-200 rounded-full p-4 mr-4">
                <span className="text-4xl">👤</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900">
                  Welcome back, {currentUser.name || "User"}!
                </h3>
                <p className="text-amber-800">
                  {currentUser.email || "No email provided"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition"
            >
              Logout
            </button>

            {/* NEW: Users from database */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Users in Database
              </h3>
              {dbStatus && (
                <p className="text-sm text-amber-700 mb-2">{dbStatus}</p>
              )}
              <div className="space-y-2">
                {dbUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between bg-pink-50 border border-rose-200 rounded-lg px-4 py-2"
                  >
                    <span className="font-medium text-amber-900">{u.name}</span>
                    <span className="text-sm text-amber-700">{u.email}</span>
                  </div>
                ))}
                {!dbUsers.length && !dbStatus && (
                  <p className="text-sm text-amber-700">
                    No users found yet. Sign up with email to create one.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === "login") {
      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-amber-800 mb-6">
            Login with Google or GitHub, or sign up using your email.
          </p>

          <div className="bg-white border-2 border-rose-200 rounded-lg p-8 space-y-6">
            {/* Social login buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="w-full py-3 border-2 border-rose-200 rounded-lg flex items-center justify-center gap-3 hover:bg-rose-50 transition font-semibold text-amber-900"
              >
                <span>🔐</span>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin("GitHub")}
                className="w-full py-3 border-2 border-rose-200 rounded-lg flex items-center justify-center gap-3 hover:bg-rose-50 transition font-semibold text-amber-900"
              >
                <span>🐱</span>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-rose-200" />
              <span className="text-xs uppercase tracking-wide text-amber-700">
                or sign up with email
              </span>
              <div className="flex-1 h-px bg-rose-200" />
            </div>

            {/* Email sign-up form */}
            <form className="space-y-4" onSubmit={handleEmailSignup}>
              <div>
                <label className="block text-amber-900 mb-2 font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:border-rose-300"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-amber-900 mb-2 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:border-rose-300"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-amber-900 mb-2 font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:border-rose-300"
                  placeholder="Create a password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition font-semibold"
              >
                Sign up with Email
              </button>
            </form>
          </div>
        </div>
      );
    }

    // HOME PAGE
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <section className="mb-8">
              <h2 className="text-5xl font-bold text-amber-900 mb-2">
                Say it with Flowers
              </h2>
              <p className="text-xl text-amber-800 mb-6">
                Same-day delivery in your city.
              </p>

              <div className="bg-pink-200/40 border-2 border-rose-300 rounded-lg h-64 mb-6 flex items-center justify-center">
                <div className="text-center text-rose-400">
                  <div className="text-6xl mb-2">❤️</div>
                  <p className="text-amber-800">Featured Arrangement</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={showAllFlowers}
                  className="px-6 py-3 bg-white border-2 border-amber-900 text-amber-900 rounded-lg hover:bg-amber-50 transition font-medium"
                >
                  Shop All Flowers
                </button>
                <button
                  onClick={() => filterByCategory("occasion")}
                  className="px-6 py-3 bg-white border-2 border-amber-900 text-amber-900 rounded-lg hover:bg-amber-50 transition font-medium"
                >
                  Collections
                </button>
                <button
                  onClick={() => {
                    const justBecause = allProducts.find(
                      (p) => p.name === "Just Because"
                    );
                    if (justBecause) setDisplayedProducts([justBecause]);
                  }}
                  className="px-6 py-3 bg-white border-2 border-amber-900 text-amber-900 rounded-lg hover:bg-amber-50 transition font-medium"
                >
                  Just Because
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold text-amber-900 mb-6">
                {searchQuery ? "Search Results" : "Collections"}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {displayedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-rose-200 rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <div className="bg-pink-100 border border-rose-200 rounded-lg h-32 mb-3 flex items-center justify-center">
                      <span className="text-4xl">{item.icon}</span>
                    </div>
                    <h4 className="font-semibold text-amber-900 mb-1 text-sm">
                      {item.name}
                    </h4>
                    <p className="text-amber-800 mb-2 font-bold">
                      $ {item.price}
                    </p>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full px-3 py-2 bg-rose-200 text-amber-900 rounded hover:bg-rose-300 transition text-sm font-medium"
                    >
                      Quick Add
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-pink-100/60 border-2 border-rose-200 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <div className="text-amber-500 text-xl">★★★★★</div>
                </div>
                <p className="text-amber-900 italic">
                  Perfect bouquet, arrived fresh.
                </p>
              </div>
            </section>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">
                Flowers & Feelings
              </h3>
              <div className="space-y-4">
                {flowers.map((flower, idx) => (
                  <button
                    key={idx}
                    onClick={() => filterByCategory(flower.category)}
                    className="flex items-start space-x-3 pb-3 border-b border-rose-100 last:border-0 w-full text-left hover:bg-pink-50 p-2 rounded transition"
                  >
                    <span className="text-3xl">{flower.icon}</span>
                    <div>
                      <h4 className="font-semibold text-amber-900">
                        {flower.name}
                      </h4>
                      <p className="text-sm text-amber-700">
                        {flower.meaning}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <header className="bg-pink-100/80 backdrop-blur-sm border-b border-rose-200 sticky top-0 z-50">
        {/* FULL-WIDTH FLEX → ALWAYS LEFT/RIGHT */}
        <div className="w-full flex items-center justify-between max-w-7xl mx-auto px-4 py-2">
          {/* LEFT — LOGO */}
          <h1
            onClick={() => handleNavClick("home")}
            className="text-2xl font-bold text-amber-900 cursor-pointer text-left"
          >
            Euphoric-Flora
          </h1>

          {/* RIGHT — NAV */}
          <nav className="flex items-center gap-4 text-amber-900 text-sm">
            <button
              onClick={() => handleNavClick("home")}
              className="px-3 py-1 bg-rose-100 rounded-lg hover:bg-rose-200 transition"
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick("store")}
              className="px-3 py-1 bg-rose-100 rounded-lg hover:bg-rose-200 transition"
            >
              Store
            </button>

            <button
              onClick={() => handleNavClick("about")}
              className="px-3 py-1 bg-rose-100 rounded-lg hover:bg-rose-200 transition"
            >
              About
            </button>

            <button
              onClick={() => handleNavClick("faqs")}
              className="px-3 py-1 bg-rose-100 rounded-lg hover:bg-rose-200 transition"
            >
              FAQs
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => handleNavClick("profile")}
                className="px-3 py-1 bg-rose-100 rounded-lg hover:bg-rose-200 flex items-center gap-1"
              >
                👤 Profile
              </button>
            ) : (
              <button
                onClick={() => handleNavClick("login")}
                className="px-3 py-1 bg-rose-100 rounded-lg hover:bg-rose-200"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      {currentPage === "home" && (
        <div className="bg-pink-50 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 relative">
            <input
              type="text"
              placeholder="Search flowers, colors..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-rose-200 bg-white focus:outline-none focus:border-rose-300"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
          </div>
        </div>
      )}

      {renderPage()}

      {/* FOOTER */}
      <footer className="bg-pink-100/80 border-t border-rose-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-amber-900 mb-4 text-lg">
                Contact Us
              </h3>
              <div className="space-y-2 text-amber-800">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+1 111 111 1111</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>hello@euphoricflora.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>1600 Holloway ave</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-amber-900 mb-4 text-lg">
                Quick Links
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick("about")}
                  className="block text-amber-800 hover:text-amber-700 transition"
                >
                  About Us
                </button>
                <button
                  onClick={() => handleNavClick("faqs")}
                  className="block text-amber-800 hover:text-amber-700 transition"
                >
                  FAQs
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-amber-900 mb-4 text-lg">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-rose-200 p-3 rounded-full hover:bg-rose-300 transition"
                >
                  <span>📘</span>
                </a>
                <a
                  href="#"
                  className="bg-rose-200 p-3 rounded-full hover:bg-rose-300 transition"
                >
                  <span>📸</span>
                </a>
                <a
                  href="#"
                  className="bg-rose-200 p-3 rounded-full hover:bg-rose-300 transition"
                >
                  <span>🐦</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-rose-200 pt-6 text-center text-amber-800">
            <p>© 2024 Euphoric-Flora. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* CART BUTTON */}
      {getTotalItems() > 0 && (
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-8 right-8 z-40 bg-rose-400 text-white p-4 rounded-full shadow-lg hover:bg-rose-500 transition"
        >
          <span className="text-2xl">🛒</span>
          <span className="absolute -top-2 -right-2 bg-amber-900 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {getTotalItems()}
          </span>
        </button>
      )}

      {/* CART SIDEBAR */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowCart(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-900">
                  Your Cart
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-amber-900 text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-amber-800">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg"
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-amber-900">
                            {item.name}
                          </h3>
                          <p className="text-amber-800">$ {item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 bg-rose-200 rounded hover:bg-rose-300"
                          >
                            <span className="text-lg">−</span>
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 bg-rose-200 rounded hover:bg-rose-300"
                          >
                            <span className="text-lg">+</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 bg-red-200 rounded hover:bg-red-300 ml-2"
                          >
                            <span>🗑️</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-rose-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-amber-900">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-amber-900">
                        $ {getTotalPrice()}
                      </span>
                    </div>
                    <button className="w-full py-3 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition font-semibold">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
