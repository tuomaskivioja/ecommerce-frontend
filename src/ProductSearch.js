// src/ProductSearch.js
import React, { useState } from 'react';

function ProductSearch({ onAddProduct }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [amazonUrl, setAmazonUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddProduct({ searchTerm, amazonUrl });
        setSearchTerm('');
        setAmazonUrl('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter product phrase"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter Amazon product URL"
                value={amazonUrl}
                onChange={(e) => setAmazonUrl(e.target.value)}
            />
            <button type="submit">Add Product</button>
        </form>
    );
}

export default ProductSearch;
