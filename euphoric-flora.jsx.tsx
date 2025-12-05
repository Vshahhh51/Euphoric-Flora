import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, Heart, Plus, Minus, Trash2, User, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const EuphoricFlora = () => {
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const allProducts = [
    { id: 1, name: 'Red Roses Bouquet', category: 'roses', price: 55, color: 'red', icon: '🌹', description: 'Classic red roses for love and passion' },
    { id: 2, name: 'Pink Roses Bundle', category: 'roses', price: 50, color: 'pink', icon: '🌹', description: 'Soft pink roses for grace and admiration' },
    { id: 3, name: 'White Daisies', category: 'daisies', price: 35, color: 'white', icon: '🌼', description: 'Cheerful white daisies for innocence' },
    { id: 4, name: 'Yellow Daisies', category: 'daisies', price: 35, color: 'yellow', icon: '🌼', description: 'Bright yellow daisies for friendship' },
    { id: 5, name: 'Red Tulips', category: 'tulips', price: 40, color: 'red', icon: '🌷', description: 'Perfect love with red tulips' },
    { id: 6, name: 'Purple Tulips', category: 'tulips', price: 42, color: 'purple', icon: '🌷', description: 'Royalty and elegance' },
    { id: 7, name: 'Sunflower Bunch', category: 'sunflowers', price: 45, color: 'yellow', icon: '🌻', description: 'Joyful sunflowers for admiration' },
    { id: 8, name: 'Cherry Blossom Branch', category: 'cherry', price: 60, color: 'pink', icon: '🌸', description: 'Beautiful renewal and spring' },
    { id: 9, name: 'White Orchids', category: 'orchids', price: 75, color: 'white', icon: '🌺', description: 'Luxury and elegance' },
    { id: 10, name: 'Purple Orchids', category: 'orchids', price: 80, color: 'purple', icon: '🌺', description: 'Exotic purple orchids' },
    { id: 11, name: 'Birthday Bouquet', category: 'occasion', price: 45, color: 'mixed', icon: '🎉', description: 'Colorful mix for birthdays' },
    { id: 12, name: 'Anniversary Special', category: 'occasion', price: 65, color: 'red', icon: '💕', description: 'Romantic anniversary arrangement' },
    { id: 13, name: 'Im Sorry Flowers', category: 'occasion', price: 55, color: 'mixed', icon: '💐', description: 'Apology bouquet with care' },
    { id: 14, name: 'Just Because', category: 'occasion', price: 40, color: 'mixed', icon: '🌈', description: 'Surprise someone special' }
  ];

  const [displayedProducts, setDisplayedProducts] = useState(allProducts.slice(10, 14));

  const flowers = [
    { name: 'Roses', meaning: 'Love, passion, romance', icon: '🌹', category: 'roses' },
    { name: 'Daisies', meaning: 'Cheerfulness, innocence', icon: '🌼', category: 'daisies' },
    { name: 'Tulips', meaning: 'Caring, perfect love', icon: '🌷', category: 'tulips' },
    { name: 'Sunflowers', meaning: 'Joy, admiration', icon: '🌻', category: 'sunflowers' },
    { name: 'Cherry Blossom', meaning: 'Renewal, beauty', icon: '🌸', category: 'cherry' },
    { name: 'Orchids', meaning: 'Luxury, elegance', icon: '🌺', category: 'orchids' }
  ];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setDisplayedProducts(allProducts.slice(10, 14));
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.color.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    );
    
    setDisplayedProducts(filtered.length > 0 ? filtered : allProducts.slice(10, 14));
  };

  const filterByCategory = (category) => {
    const filtered = allProducts.filter(product => product.category === category);
    setDisplayedProducts(filtered);
    setSearchQuery('');
  };

  const showAllFlowers = () => {
    setDisplayedProducts(allProducts);
    setSearchQuery('');
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (currentPage === 'store') {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-8">Our Store</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProducts.map((item) => (
              <div key={item.id} className="bg-white border-2 border-rose-200 rounded-lg p-4 hover:shadow-lg transition">
                <div className="bg-pink-100 border border-rose-200 rounded-lg h-32 mb-3 flex items-center justify-center">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h4 className="font-semibold text-amber-900 mb-1 text-sm">{item.name}</h4>
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

    if (currentPage === 'about') {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">About Euphoric Flora</h2>
          <div className="bg-white border-2 border-rose-200 rounded-lg p-8">
            <p className="text-amber-900 mb-4 text-lg">
              Welcome to Euphoric Flora, where every bouquet tells a story and every bloom brings joy.
            </p>
            <p className="text-amber-900 mb-4">
              We specialize in same-day flower delivery with the freshest blooms.
            </p>
            <p className="text-amber-900">
              Each arrangement is carefully crafted by our expert florists.
            </p>
          </div>
        </div>
      );
    }

    if (currentPage === 'faqs') {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-2">Do you offer same-day delivery?</h3>
              <p className="text-amber-800">Yes! We offer same-day delivery for orders placed before 2 PM.</p>
            </div>
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-2">How long will my flowers last?</h3>
              <p className="text-amber-800">With proper care, most bouquets last 5-7 days.</p>
            </div>
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-2">Can I customize my bouquet?</h3>
              <p className="text-amber-800">Absolutely! Use our Build Your Own Bouquet option.</p>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'profile') {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">My Profile</h2>
          <div className="bg-white border-2 border-rose-200 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-rose-200 rounded-full p-4 mr-4">
                <User size={48} className="text-amber-900" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900">Welcome back!</h3>
                <p className="text-amber-800">user@example.com</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    if (currentPage === 'login') {
      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">Login</h2>
          <div className="bg-white border-2 border-rose-200 rounded-lg p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-amber-900 mb-2 font-semibold">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:border-rose-300"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-amber-900 mb-2 font-semibold">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:border-rose-300"
                  placeholder="Password"
                />
              </div>
              <button 
                onClick={handleLogin}
                className="w-full py-3 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition font-semibold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <section className="mb-8">
              <h2 className="text-5xl font-bold text-amber-900 mb-2">Say it with Flowers</h2>
              <p className="text-xl text-amber-800 mb-6">Same-day delivery in your city.</p>
              
              <div className="bg-pink-200/40 border-2 border-rose-300 rounded-lg h-64 mb-6 flex items-center justify-center">
                <div className="text-center text-rose-400">
                  <Heart size={80} className="mx-auto mb-2" />
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
                  onClick={() => filterByCategory('occasion')}
                  className="px-6 py-3 bg-white border-2 border-amber-900 text-amber-900 rounded-lg hover:bg-amber-50 transition font-medium"
                >
                  Build Your Own Bouquet
                </button>
                <button 
                  onClick={() => {
                    const justBecause = allProducts.find(p => p.name === 'Just Because');
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
                {searchQuery ? 'Search Results' : 'Best Sellers'}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {displayedProducts.map((item) => (
                  <div key={item.id} className="bg-white border-2 border-rose-200 rounded-lg p-4 hover:shadow-lg transition">
                    <div className="bg-pink-100 border border-rose-200 rounded-lg h-32 mb-3 flex items-center justify-center">
                      <span className="text-4xl">{item.icon}</span>
                    </div>
                    <h4 className="font-semibold text-amber-900 mb-1 text-sm">{item.name}</h4>
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

              <div className="bg-pink-100/60 border-2 border-rose-200 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <div className="text-amber-500 text-xl">★★★★★</div>
                </div>
                <p className="text-amber-900 italic">Perfect bouquet, arrived fresh.</p>
              </div>
            </section>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">Flowers & Feelings</h3>
              <div className="space-y-4">
                {flowers.map((flower, idx) => (
                  <button
                    key={idx}
                    onClick={() => filterByCategory(flower.category)}
                    className="flex items-start space-x-3 pb-3 border-b border-rose-100 last:border-0 w-full text-left hover:bg-pink-50 p-2 rounded transition"
                  >
                    <span className="text-3xl">{flower.icon}</span>
                    <div>
                      <h4 className="font-semibold text-amber-900">{flower.name}</h4>
                      <p className="text-sm text-amber-700">{flower.meaning}</p>
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-amber-900">Euphoric-Flora</h1>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-amber-900 bg-rose-200 p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-amber-900 text-sm md:text-base">
            <button onClick={() => handleNavClick('home')} className="hover:text-amber-700 transition font-medium px-3 py-2 bg-rose-100 rounded-lg">Home</button>
            <button onClick={() => handleNavClick('store')} className="hover:text-amber-700 transition font-medium px-3 py-2 bg-rose-100 rounded-lg">Store</button>
            <button onClick={() => handleNavClick('about')} className="hover:text-amber-700 transition font-medium px-3 py-2 bg-rose-100 rounded-lg">About</button>
            <button onClick={() => handleNavClick('faqs')} className="hover:text-amber-700 transition font-medium px-3 py-2 bg-rose-100 rounded-lg">FAQs</button>
            {isLoggedIn ? (
              <button onClick={() => handleNavClick('profile')} className="hover:text-amber-700 transition flex items-center gap-2 font-medium px-3 py-2 bg-rose-100 rounded-lg">
                <User size={18} />
                Profile
              </button>
            ) : (
              <button onClick={() => handleNavClick('login')} className="hover:text-amber-700 transition font-medium px-3 py-2 bg-rose-100 rounded-lg">Login</button>
            )}
          </nav>

          {currentPage === 'home' && (
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search flowers, colors..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-rose-200 bg-white/80 focus:outline-none focus:border-rose-300"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
          )}
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-pink-100 border-t border-rose-200 py-4">
            <nav className="flex flex-col space-y-3 px-4 text-amber-900">
              <button onClick={() => handleNavClick('home')} className="text-left hover:text-amber-700 transition">Home</button>
              <button onClick={() => handleNavClick('store')} className="text-left hover:text-amber-700 transition">Store</button>
              <button onClick={() => handleNavClick('about')} className="text-left hover:text-amber-700 transition">About</button>
              <button onClick={() => handleNavClick('faqs')} className="text-left hover:text-amber-700 transition">FAQs</button>
              {isLoggedIn ? (
                <button onClick={() => handleNavClick('profile')} className="text-left hover:text-amber-700 transition">Profile</button>
              ) : (
                <button onClick={() => handleNavClick('login')} className="text-left hover:text-amber-700 transition">Login</button>
              )}
            </nav>
          </div>
        )}
      </header>

      {renderPage()}

      <footer className="bg-pink-100/80 border-t border-rose-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-amber-900 mb-4 text-lg">Contact Us</h3>
              <div className="space-y-2 text-amber-800">
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>hello@euphoricflora.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>123 Bloom Street</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-amber-900 mb-4 text-lg">Quick Links</h3>
              <div className="space-y-2">
                <button onClick={() => handleNavClick('about')} className="block text-amber-800 hover:text-amber-700 transition">About Us</button>
                <button onClick={() => handleNavClick('faqs')} className="block text-amber-800 hover:text-amber-700 transition">FAQs</button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-amber-900 mb-4 text-lg">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-rose-200 p-3 rounded-full hover:bg-rose-300 transition">
                  <Facebook size={20} className="text-amber-900" />
                </a>
                <a href="#" className="bg-rose-200 p-3 rounded-full hover:bg-rose-300 transition">
                  <Instagram size={20} className="text-amber-900" />
                </a>
                <a href="#" className="bg-rose-200 p-3 rounded-full hover:bg-rose-300 transition">
                  <Twitter size={20} className="text-amber-900" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-rose-200 pt-6 text-center text-amber-800">
            <p>© 2024 Euphoric-Flora. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {getTotalItems() > 0 && (
        <button 
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-8 right-8 bg-rose-400 text-white p-4 rounded-full shadow-lg hover:bg-rose-500 transition"
        >
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-amber-900 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {getTotalItems()}
          </span>
        </button>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCart(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-amber-900">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="text-amber-900">
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-amber-800">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-amber-900">{item.name}</h3>
                          <p className="text-amber-800">$ {item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 bg-rose-200 rounded hover:bg-rose-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 bg-rose-200 rounded hover:bg-rose-300"
                          >
                            <Plus size={16} />
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 bg-red-200 rounded hover:bg-red-300 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-rose-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-amber-900">Total:</span>
                      <span className="text-2xl font-bold text-amber-900">$ {getTotalPrice()}</span>
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
};

export default EuphoricFlora;