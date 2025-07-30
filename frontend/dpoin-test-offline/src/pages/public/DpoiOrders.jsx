// ✅ FILE: src/pages/public/DpoiOrders.jsx (Revisi Lengkap & Diagnostik Tombol)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { FaShoppingCart, FaStore, FaTrash, FaPlus, FaMinus, FaTimes } from 'react-icons/fa'; 

const DpoiOrders = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [groupedCart, setGroupedCart] = useState({});
  const [selectedStoreForCheckout, setSelectedStoreForCheckout] = useState(null);

  // State untuk modal tambah produk
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productsForModal, setProductsForModal] = useState([]); 
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [selectedStoreDataForAdd, setSelectedStoreDataForAdd] = useState(null); 

  useEffect(() => {
    const loadCart = () => {
      const storedCart = JSON.parse(localStorage.getItem('dpoi_cart')) || [];
      const parsedCart = storedCart.map(item => ({
          ...item,
          price: Number(item.price), 
          qty: Number(item.qty)      
      }));
      setCartItems(parsedCart);
      groupCartByStore(parsedCart);
    };

    loadCart();
  }, []);

  const groupCartByStore = (items) => {
    const grouped = items.reduce((acc, item) => {
      const storeIdentifier = item.storeId || item.storeName || 'Unknown Store'; 
      if (!acc[storeIdentifier]) {
        acc[storeIdentifier] = {
          storeName: item.storeName || 'Toko Tidak Dikenal',
          sellerId: item.sellerId, 
          items: [],
          total: 0,
        };
      }
      acc[storeIdentifier].items.push(item);
      acc[storeIdentifier].total += item.price * item.qty;
      return acc;
    }, {});
    setGroupedCart(grouped);

    if (items.length > 0 && !selectedStoreForCheckout) {
      const firstStoreKey = Object.keys(grouped)[0];
      setSelectedStoreForCheckout(firstStoreKey);
    } else if (items.length > 0 && selectedStoreForCheckout && !grouped[selectedStoreForCheckout]) {
      const firstStoreKey = Object.keys(grouped)[0];
      setSelectedStoreForCheckout(firstStoreKey);
    } else if (items.length === 0) {
      setSelectedStoreForCheckout(null);
    }
  };

  const updateCartInStorageAndState = (updatedCart) => {
    localStorage.setItem('dpoi_cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    groupCartByStore(updatedCart); 
  };

  const removeItemFromCart = (idToRemove) => {
    const updatedCart = cartItems.filter(item => item._id !== idToRemove);
    updateCartInStorageAndState(updatedCart);
  };

  const updateItemQuantity = (idToUpdate, newQty) => {
    if (newQty < 1) {
      removeItemFromCart(idToUpdate);
      return;
    }
    const updatedCart = cartItems.map(item =>
      item._id === idToUpdate ? { ...item, qty: newQty } : item
    );
    updateCartInStorageAndState(updatedCart);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Keranjang Anda kosong. Silakan tambah produk dulu.');
      return;
    }

    if (!selectedStoreForCheckout) {
        alert('Mohon pilih toko yang ingin Anda checkout.');
        return;
    }

    const itemsForCheckout = groupedCart[selectedStoreForCheckout].items;

    if (itemsForCheckout.length === 0) {
      alert('Tidak ada produk di toko yang dipilih untuk checkout.');
      return;
    }

    localStorage.setItem('dpoi_checkout_temp', JSON.stringify(itemsForCheckout));
    navigate('/checkout');
  };

  // --- LOGIKA MODAL TAMBAH PRODUK ---
  const handleOpenAddProductModal = async (storeKey) => {
    console.log("DpoiOrders: handleOpenAddProductModal called for storeKey:", storeKey); // DIAGNOSTIK 1
    const storeData = groupedCart[storeKey];
    if (!storeData) {
        console.error("DpoiOrders: Store data not found for storeKey:", storeKey); // DIAGNOSTIK 2
        return;
    }
    console.log("DpoiOrders: Store data for modal:", storeData); // DIAGNOSTIK 3

    setSelectedStoreDataForAdd(storeData);
    setShowAddProductModal(true); // Ini yang membuat modal terlihat
    setModalLoading(true);
    setModalError(null);
    setProductsForModal([]);

    try {
      if (!storeData.sellerId) {
          console.error("DpoiOrders: sellerId is missing for store:", storeData.storeName); // DIAGNOSTIK 4
          setModalError('ID penjual tidak ditemukan untuk toko ini.');
          setModalLoading(false);
          return;
      }
      
      console.log(`DpoiOrders: Fetching products for sellerId: ${storeData.sellerId}`); // DIAGNOSTIK 5
      const res = await axios.get(`http://localhost:4000/api/products?sellerId=${storeData.sellerId}`); 
      console.log("DpoiOrders: Products API response:", res.data); // DIAGNOSTIK 6
      
      const availableProducts = res.data.filter(
        (product) => !cartItems.some((cartItem) => cartItem._id === product._id)
      );
      setProductsForModal(availableProducts);
      setModalLoading(false);
      console.log("DpoiOrders: Available products for modal (after filtering existing cart):", availableProducts); // DIAGNOSTIK 7

      if (availableProducts.length === 0) {
        console.log("DpoiOrders: No new products found for this store to add to cart."); // DIAGNOSTIK 8
      }

    } catch (err) {
      console.error("DpoiOrders: Gagal memuat produk untuk modal:", err.response?.data || err.message || err); // DIAGNOSTIK 9
      setModalError('Gagal memuat produk. Coba lagi.');
      setModalLoading(false);
    }
  };

  const handleAddProductFromModal = (productToAdd) => {
    const existingCart = JSON.parse(localStorage.getItem('dpoi_cart')) || [];
    const itemExists = existingCart.find(item => item._id === productToAdd._id);

    let updatedCart;
    if (itemExists) {
      updatedCart = existingCart.map(item =>
        item._id === productToAdd._id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      const productForCart = {
        _id: productToAdd._id,
        name: productToAdd.name,
        price: Number(productToAdd.price), 
        qty: 1,
        sellerId: productToAdd.sellerId, 
        storeName: productToAdd.storeName,
        image: productToAdd.image,
        description: productToAdd.description,
      };
      updatedCart = [...existingCart, productForCart];
    }
    updateCartInStorageAndState(updatedCart); 
    setShowAddProductModal(false); // Ini menutup modal
  };

  const handleCloseModal = () => {
    setShowAddProductModal(false); // Ini menutup modal
    setProductsForModal([]); 
    setModalError(null);
  };
  // --- AKHIR LOGIKA MODAL TAMBAH PRODUK ---

  const handleGoToEtalaseAndClearStorage = () => {
    localStorage.clear(); 
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20"> 
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden md:max-w-2xl">
        <div className="p-5">
          {/* HEADER KERANJANG BELANJA DENGAN TOMBOL ETALASE BERSEBELAHAN */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
              <FaShoppingCart className="text-blue-600" /> Keranjang
            </h1>
            <button
              onClick={handleGoToEtalaseAndClearStorage}
              className="text-blue-600 hover:text-blue-800 font-semibold py-2 px-3 rounded-lg transition-colors text-base"
            >
              &lt;&lt; Etalase
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-xl text-gray-600 mb-5">Keranjang Anda masih kosong.</p>
              <button
                onClick={handleGoToEtalaseAndClearStorage}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div>
              {/* Multi-store selection (only if more than 1 store) */}
              {Object.keys(groupedCart).length > 1 && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="font-semibold text-indigo-800 mb-3 text-base">Pilih toko untuk checkout:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(groupedCart).map(storeKey => (
                      <button
                        key={storeKey}
                        onClick={() => setSelectedStoreForCheckout(storeKey)}
                        className={`py-2 px-3 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                          selectedStoreForCheckout === storeKey
                            ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                            : 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300'
                        }`}
                      >
                        <FaStore className="inline mr-2 text-base" />
                        {groupedCart[storeKey].storeName}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-indigo-700 mt-3 italic text-center">
                    Selesaikan pesanan per toko untuk kemudahan pengiriman.
                  </p>
                </div>
              )}
              {/* Single store indicator */}
              {Object.keys(groupedCart).length === 1 && selectedStoreForCheckout && (
                 <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 text-green-800 text-center text-base font-semibold">
                    <FaStore className="inline mr-2 text-lg" /> Belanja dari: {groupedCart[selectedStoreForCheckout].storeName}
                </div>
              )}

              {/* Individual Store Sections */}
              {Object.entries(groupedCart).map(([storeKey, storeData]) => (
                <div key={storeKey} className={`mb-8 p-4 border rounded-xl shadow-sm bg-white transition-all duration-300 ${selectedStoreForCheckout !== storeKey ? 'opacity-50 blur-[0.5px]' : 'border-blue-300 shadow-md'}`}>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <FaStore className="text-blue-500" /> {storeData.storeName}
                  </h2>
                  <div className="space-y-4">
                    {storeData.items.map(item => (
                      <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-xs">
                        <img
                          src={item.image ? `http://localhost:4000${item.image}` : 'https://via.placeholder.com/80'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border flex-shrink-0"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-lg text-gray-800 line-clamp-2">{item.name}</p>
                          <p className="text-sm text-gray-600">Rp{item.price?.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                            <p className="text-lg font-bold text-indigo-700 mb-2">
                                Rp{(item.price * item.qty)?.toLocaleString('id-ID')}
                            </p>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => updateItemQuantity(item._id, item.qty - 1)}
                                    className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 disabled:opacity-30 transition-colors"
                                    disabled={selectedStoreForCheckout !== storeKey}
                                >
                                    <FaMinus className="text-sm" />
                                </button>
                                <span className="font-semibold text-gray-800 w-8 text-center">
                                    {item.qty}
                                </span>
                                <button
                                    onClick={() => updateItemQuantity(item._id, item.qty + 1)}
                                    className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 disabled:opacity-30 transition-colors"
                                    disabled={selectedStoreForCheckout !== storeKey}
                                >
                                    <FaPlus className="text-sm" />
                                </button>
                                <button
                                    onClick={() => removeItemFromCart(item._id)}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-full disabled:opacity-30 transition-colors"
                                    disabled={selectedStoreForCheckout !== storeKey}
                                >
                                    <FaTrash className="text-sm" />
                                </button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-6 pt-4 border-t border-gray-100 font-bold text-lg text-red-600">
                    Subtotal: Rp {storeData.total.toLocaleString('id-ID')} 
                  </div>
                  {/* TOMBOL TAMBAH PRODUK DENGAN MODAL */}
                  {selectedStoreForCheckout === storeKey && ( 
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => { // ✅ LOG DIAGNOSTIK KLIK TOMBOL
                          console.log("Tombol 'Tambah Produk' diklik untuk toko:", storeKey);
                          handleOpenAddProductModal(storeKey);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all duration-300 shadow-md text-base transform hover:scale-105 active:scale-95"
                      >
                        <FaPlus className="text-sm" /> Tambah Produk 
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom button for Checkout */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl p-4 border-t border-gray-200 z-10">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Keranjang:</p>
              <p className="text-2xl font-extrabold text-blue-700">
                Rp{Object.values(groupedCart).reduce((sum, store) => sum + store.total, 0).toLocaleString('id-ID')}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className={`flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg ${!selectedStoreForCheckout ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              disabled={!selectedStoreForCheckout}
            >
              Checkout
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ✅ MODAL TAMBAH PRODUK (Window Mengambang) */}
      {showAddProductModal && selectedStoreDataForAdd && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal} // Klik di luar untuk menutup
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto transform scale-95 md:scale-100 transition-transform duration-300 relative overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()} // Mencegah klik di dalam modal menutupnya
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
              Tambah Produk dari {selectedStoreDataForAdd.storeName}
            </h2>

            {modalLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat produk...</p>
              </div>
            ) : modalError ? (
              <div className="text-center py-10 text-red-600">
                <p>{modalError}</p>
              </div>
            ) : productsForModal.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>Tidak ada produk lain yang tersedia dari toko ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {productsForModal.map(product => (
                  <div key={product._id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                    <img
                      src={product.image ? `http://localhost:4000${product.image}` : 'https://via.placeholder.com/60'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-lg text-gray-800 line-clamp-2">{product.name}</p>
                      <p className="text-sm text-green-600 font-bold">Rp{product.price?.toLocaleString('id-ID')}</p>
                    </div>
                    <button
                      onClick={() => handleAddProductFromModal(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors flex-shrink-0"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-5 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DpoiOrders;