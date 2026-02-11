import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './SearchPage.css';

const categories = [
    'Appliances',
    'Books',
    'Clothing',
    'Electronics',
    'Furniture',
    'Office',
    'Outdoors',
    'Toys',
    'Other',
];

const conditions = ['New', 'Like New', 'Used', 'Older'];

function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    const handleSearch = async () => {
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
        });

        if (selectedCategory) {
            queryParams.append('category', selectedCategory);
        }

        if (selectedCondition) {
            queryParams.append('condition', selectedCondition);
        }

        const requestUrl = `${urlConfig.backendUrl}/api/search?${queryParams.toString()}`;

        try {
            setIsSearching(true);
            setError('');
            setHasSearched(true);
            const response = await fetch(requestUrl);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (err) {
            console.error('Failed to fetch search results:', err);
            setError(err.message);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    const renderResultCard = (product) => {
        const productId = product.id || product._id;

        return (
            <div key={productId} className="card search-result-card mb-4">
                <div className="result-image-wrapper">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="card-img-top"
                        />
                    ) : (
                        <div className="no-image-placeholder">No Image Available</div>
                    )}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted">
                        {product.description ? `${product.description.slice(0, 100)}...` : 'No description available.'}
                    </p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary">{product.condition || 'Unknown'}</span>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => goToDetailsPage(productId)}
                    >
                        View Details
                    </button>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        if (searchResults.length > 0) {
            return searchResults.map(renderResultCard);
        }

        if (hasSearched) {
            return (
                <div className="alert alert-info" role="alert">
                    No products found. Please adjust your filters.
                </div>
            );
        }

        return (
            <div className="placeholder-message text-center text-muted">
                Use the filters above to search for gifts by name, category, condition, or age.
            </div>
        );
    };

    return (
        <div className="container search-page mt-5">
            <h1 className="mb-4 text-center">Find the Perfect Gift</h1>

            <div className="card p-4 search-controls">
                <div className="form-group d-flex flex-column flex-md-row align-items-md-center">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search by name or keyword"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="btn btn-primary search-btn"
                        onClick={handleSearch}
                        disabled={isSearching}
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>

                <div className="row mt-3 g-3">
                    <div className="col-md-4">
                        <label htmlFor="categorySelect" className="form-label">Category</label>
                        <select
                            id="categorySelect"
                            className="form-control"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="conditionSelect" className="form-label">Condition</label>
                        <select
                            id="conditionSelect"
                            className="form-control"
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                        >
                            <option value="">All</option>
                            {conditions.map((condition) => (
                                <option key={condition} value={condition}>
                                    {condition}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="ageRange" className="form-label">Age (years)</label>
                        <input
                            type="range"
                            className="form-range age-slider"
                            id="ageRange"
                            min="1"
                            max="10"
                            value={ageRange}
                            onChange={(e) => setAgeRange(e.target.value)}
                        />
                        <div className="text-muted">Less than {ageRange} years old</div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {error}
                    </div>
                )}
            </div>

            <div className="search-results mt-4">
                {renderResults()}
            </div>
        </div>
    );
}

export default SearchPage;
