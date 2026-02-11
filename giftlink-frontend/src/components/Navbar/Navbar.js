import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { isLoggedIn, userName, logout } = useAppContext();

    const handleLogout = () => {
        logout();
        navigate('/app/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <Link className="navbar-brand" to="/app">GiftLink</Link>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/home.html">Home</a>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>
                    {isLoggedIn && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/app/profile">Profile</Link>
                        </li>
                    )}
                </ul>

                <ul className="navbar-nav ms-auto">
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item d-flex align-items-center me-3">
                                <span className="navbar-text">Hi, {userName || 'Friend'}!</span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-secondary" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
