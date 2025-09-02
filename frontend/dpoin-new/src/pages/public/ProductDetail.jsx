// ✅ FILE: src/pages/public/ProductDetail.jsx (REVISI TERAKHIR UNTUK MEMPERBAIKI KETIDAKSESUAIAN)

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';
import { FaShoppingCart } from 'react-icons/fa';
import FoodCard from '../../components/public/FoodCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const [error, setError] = useState(null);

    useTitle(product ? `Produk: ${product.name}` : 'Detail Produk');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                setLoading(false);
                // ✅ LOG DIAGNOSTIK: Tunjukkan data API yang sebenarnya
                console.log("Data API yang diterima untuk produk:", res.data);

                // Periksa di berbagai lokasi
                const sellerId = res.data.sellerInfo?._id || res.data.seller || null;
                if (sellerId) {
                    fetchRelatedProducts(sellerId);
                }
            } catch (error) {
                console.error('Gagal mengambil data produk:', error);
                setError('Produk tidak ditemukan atau gagal dimuat.');
                setLoading(false);
            }
        };

        const fetchRelatedProducts = async (sellerId) => {
            try {
                setRelatedLoading(true);
                const res = await api.get(`/products?seller=${sellerId}`);
                const otherProducts = res.data.filter(p => p._id !== id);
                setRelatedProducts(otherProducts);
                setRelatedLoading(false);
            } catch (error) {
                console.warn('Tidak ada produk lain dari seller ini.');
                setRelatedProducts([]);
                setRelatedLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        // ✅ LOG DIAGNOSTIK: Cek data produk di state
        console.log("Data produk saat ini:", product);

        // Cari sellerId dan storeName di berbagai lokasi yang mungkin
        const sellerId = product?.sellerInfo?._id || product?.sellerId || product?.seller;
        const storeName = product?.sellerInfo?.namaWarung || product?.storeName;

        if (!product || !product._id || !sellerId || !storeName) {
            console.error("Gagal menambahkan ke keranjang: Informasi penjual tidak tersedia.");
            setError("Gagal menambahkan ke keranjang: Informasi penjual tidak tersedia.");
            return;
        }

        const existingCart = JSON.parse(localStorage.getItem('dpoi_cart')) || [];
        const itemExists = existingCart.find(item => item._id === product._id);
        let updatedCart;

        if (itemExists) {
            updatedCart = existingCart.map(item =>
                item._id === product._id ? { ...item, qty: item.qty + 1 } : item
            );
        } else {
            const productForOrder = {
                _id: product._id,
                name: product.name,
                price: product.price,
                qty: 1,
                // ✅ Gunakan sellerId dan storeName yang sudah kita temukan
                sellerId: sellerId,
                storeName: storeName,
                image: product.image || '',
                description: product.description || '',
            };
            updatedCart = [...existingCart, productForOrder];
        }

        console.log("Keranjang yang akan disimpan:", updatedCart);
        localStorage.setItem('dpoi_cart', JSON.stringify(updatedCart));
        navigate('/dpoi-orders');
    };

    if (loading) return <div className="p-4 text-gray-600">Memuat produk...</div>;
    if (!product) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-4">
                <Link
                    to="/"
                    className="inline-block text-blue-600 hover:text-blue-800 font-semibold"
                    aria-label="Kembali ke Etalase"
                >
                    ⬅️ Kembali ke Etalase
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center items-center">
                    <img
                        src={product.image ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${product.image}` : 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md h-64 object-contain rounded-md border"
                    />
                </div>

                <div className="space-y-3 text-sm sm:text-base">
                    <p>
                        <span className="font-semibold text-gray-700">Nama Warung:</span>
                        <span className="ml-2 text-lg font-serif font-bold text-indigo-700 tracking-wide">
                            {product.sellerInfo?.namaWarung || product.storeName || 'Tidak diketahui'}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold text-gray-700">Nama Produk:</span>
                        <span className="ml-2 text-lg font-serif font-extrabold text-green-700 tracking-wide">
                            {product.name}
                        </span>
                    </p>
                    <p><span className="font-semibold text-gray-700">Deskripsi Produk:</span></p>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="text-xl font-bold text-green-600">Rp{product.price?.toLocaleString('id-ID')}</p>

                    <button
                        onClick={handleAddToCart}
                        className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow"
                    >
                        <FaShoppingCart /> Tambah ke Keranjang
                    </button>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Produk lain dari {product.sellerInfo?.namaWarung || product.storeName || 'penjual ini'}
                </h2>

                {relatedLoading ? (
                    <p>Memuat produk lain...</p>
                ) : relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {relatedProducts.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/product/${item._id}`)}
                                className="cursor-pointer bg-white hover:shadow-lg transition p-3 rounded-lg border"
                            >
                                <img
                                    src={item.image ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${item.image}` : 'https://via.placeholder.com/200'}
                                    alt={item.name}
                                    className="h-32 w-full object-contain mb-2"
                                />
                                <p className="text-sm font-semibold truncate">{item.name}</p>
                                <p className="text-green-600 text-sm">Rp{item.price?.toLocaleString('id-ID')}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Seller ini baru memiliki 1 produk yang ditampilkan.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;