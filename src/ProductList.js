
// src/ProductList.js
import React from 'react';

function ProductList({ products, onRefresh }) {
    const calculateDifference = (amazonPrice, ebayPrice) => {
        return Math.abs(amazonPrice - ebayPrice).toFixed(2);
    };

    const findLowerPrice = (amazonPrice, ebayPrice) => {
        return amazonPrice < ebayPrice ? 'Amazon' : 'eBay';
    };

    return (
        <div>
            <button onClick={onRefresh}>Refresh Prices</button>
            {products.map((product, index) => (
                <div key={index} className="product">
                    <h3>{product.searchTerm}</h3>
                    <p>Amazon: ${product.amazonPrice}</p>
                    <p>eBay: ${product.ebayPrice}</p>
                    <p>Difference: ${calculateDifference(product.amazonPrice, product.ebayPrice)} (Lower on {findLowerPrice(product.amazonPrice, product.ebayPrice)})</p>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
