import React from 'react';

function SearchResults({ product }) {
    let priceDifference, lowerPricePlatform, amazonPriceColor, ebayPriceColor;

    // Check if both amazonPrice and ebayPrice exist
    if (product.amazonPrice != null && product.ebayPrice != null) {
        // Calculate the price difference
        priceDifference = Math.abs(product.amazonPrice - product.ebayPrice).toFixed(2);

        // Determine which platform has the lower price
        lowerPricePlatform = product.amazonPrice <= product.ebayPrice ? 'Amazon' : 'eBay';

        // Determine the color for Amazon price text
        amazonPriceColor = product.amazonPrice <= product.ebayPrice ? 'green' : 'red';

        // Determine the color for eBay price text
        ebayPriceColor = product.ebayPrice < product.amazonPrice ? 'green' : 'red';
    } else {
        // Default values or handling when one or both prices are missing
        priceDifference = "N/A";
        lowerPricePlatform = "N/A";
        amazonPriceColor = ebayPriceColor = "black"; // Default color when prices are not available
    }

    return (
        <div>
            <h3>{product.searchTerm}</h3>
            <ul>
                {product.amazonPrice != null && (
                    <li style={{ color: amazonPriceColor }}>
                        Amazon: ${product.amazonPrice.toFixed(2)}
                    </li>
                )}
                {product.ebayPrice != null && (
                    <li style={{ color: ebayPriceColor }}>
                        eBay: ${product.ebayPrice.toFixed(2)}
                    </li>
                )}
            </ul>
            {product.amazonPrice != null && product.ebayPrice != null ? (
                <p>Price difference: ${priceDifference} (Lower on {lowerPricePlatform})</p>
            ) : (
                <p>Price information is incomplete.</p>
            )}
        </div>
    );
}

export default SearchResults;
