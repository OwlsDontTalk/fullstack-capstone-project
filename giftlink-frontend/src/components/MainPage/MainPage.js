import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn } = useAppContext();

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchGifts();
    }, []);

    const goToDetailsPage = (productId) => {
        if (!productId) {
            console.warn('Missing product id for navigation');
            return;
        }

        if (!isLoggedIn) {
            navigate('/app/login');
            return;
        }

        navigate(`/app/product/${productId}`);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) {
            return 'Unknown date';
        }

        const date = new Date(Number(timestamp) * 1000);
        if (Number.isNaN(date.getTime())) {
            return 'Invalid date';
        }

        return date.toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => {
                    const productId = gift.id || gift._id;

                    return (
                        <div key={productId} className="col-md-4 mb-4">
                            <div className="card product-card">
                                <div className="image-placeholder">
                                    {gift.image ? (
                                        <img src={gift.image} alt={gift.name} className="card-img-top" />
                                    ) : (
                                        <div className="no-image-available">No Image Available</div>
                                    )}
                                </div>

                                <div className="card-body">
                                    <h5 className="card-title">{gift.name}</h5>

                                    <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                    {gift.condition}
                                    </p>

                                    <p className="card-text text-muted">
                                        {formatDate(gift.date_added)}
                                    </p>
                                

                                    <button onClick={() => goToDetailsPage(productId)} className="btn btn-primary">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MainPage;
