// src/App.js
import React, {useEffect, useState} from 'react';
import ProductSearch from './ProductSearch';
import SearchResults from './SearchResults';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [showWaitingDisclaimer, setShowWaitingDisclaimer] = useState(false);

    useEffect(() => {
        // Set up the interval to refresh products once every day
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const intervalId = setInterval(() => {
            refreshProducts();
        }, oneDay);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [products]); // Make sure to include products in the dependency array if refreshProducts uses it directly

    async function refreshProducts() {
        const updatedProducts = [];
        for (const product of products) {
            try {
                const ebayData = await fetchEbay(product.searchTerm);
                const amazonData = await fetchAmazon(product.amazonUrl);
                // Assuming the new collection IDs are in the response data
                // and your response structure allows direct access like below
                updatedProducts.push({
                    ...product,
                    ebayCollectionId: ebayData.collection_id, // Adjust according to your actual data structure
                    amazonCollectionId: amazonData.collection_id, // Adjust according to your actual data structure
                });
            } catch (error) {
                console.error("Error refreshing product data:", error);
                // Optionally push the product as is if there was an error
                updatedProducts.push(product);
            }
        }
        // Update the state with the new product data
        setProducts(updatedProducts);
    }

    async function fetchEbay(keyword) {
        try {
            const response = await fetch('http://127.0.0.1:5000/triggerEbay', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keyword: keyword,
                    count: 10, // Assuming you want to fetch 10 results, adjust as necessary
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); // Do something with the data
            return data
        } catch (error) {
            console.error("Could not fetch data from backend:", error);
        }
    }

    async function fetchAmazon(url) {
        try {
            const response = await fetch('http://127.0.0.1:5000/triggerAmazon', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); // Do something with the data
            return data
        } catch (error) {
            console.error("Could not fetch data from backend:", error);
        }

    }

    async function fetchDatasetFromServer(collId) {
        try {
            const response = await fetch('http://127.0.0.1:5000/fetchDataset', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection_id: collId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); // Do something with the data
            if (data.error) {
                setShowWaitingDisclaimer(true);
                return null
            }
            setShowWaitingDisclaimer(false);
            return data
        } catch (error) {
            console.error("Could not fetch data from backend:", error);
        }

    }


    const addProduct = async (product) => {
        const amazonData = await fetchAmazon(product.amazonUrl);
        const ebayData = await fetchEbay(product.searchTerm);
        if (amazonData) {
            const productWithCollectionId = {
                ...product,
                amazonCollectionId: amazonData.collection_id,
                ebayCollectionId: ebayData.collection_id,// Assuming the key is collection_id
            };
            setProducts([...products, productWithCollectionId]);
            setShowDisclaimer(true); // Show the disclaimer when a product is added
        } else {
            // Handle the case where amazonData is null (e.g., error fetching data)
            console.error("Failed to fetch product data from Amazon.");
        }
    };

    const refreshPrices = async () => {
        const updatedProducts = await Promise.all(products.map(async (product) => {
            try {
                // Simulate fetching dataset for Amazon using its collection ID
                const amzRes = await fetchDatasetFromServer(product.amazonCollectionId); // Example, use product.amazonCollectionId
                // Assuming amzRes correctly returns a structure where you can access the price as shown
                const amazonPrice = amzRes[0].finalPrice.value;

                // Simulate fetching dataset for eBay using its collection ID
                const ebayRes = await fetchDatasetFromServer(product.ebayCollectionId); // Example, use product.ebayCollectionId
                console.log('ebay', ebayRes)
                // Find the lowest price in the ebayData list
                const ebayPrice = ebayRes.reduce((min, p) => p.price.value < min ? p.price.value : min, ebayRes[0].price.value);

                // Return a new product object with updated prices
                setShowDisclaimer(false);
                return {
                    ...product,
                    amazonPrice: amazonPrice,
                    ebayPrice: ebayPrice,
                };
            } catch (error) {
                console.error("Failed to fetch data for product:", product, error);
                // Return the product as is if there was an error fetching new prices
                return product;
            }
        }));

        // Update the products state with the new prices
        setProducts(updatedProducts);
    };


    return (
        <div className="App">
            <h1>Cross-Marketplace Analysis Tool</h1>
            <ProductSearch onAddProduct={addProduct} />
            {showDisclaimer && <p>Fetching prices, come back in 5 minutes and click refresh to see price details.</p>}
            {showWaitingDisclaimer && <p style={{ color: 'red' }}>Price data gathering still in progress. Try again later.</p>}
            <button onClick={refreshPrices}>Refresh Prices</button>
            {products.map((product, index) => (
                <SearchResults key={index} product={product} />
            ))}
        </div>
    );
}

export default App;
