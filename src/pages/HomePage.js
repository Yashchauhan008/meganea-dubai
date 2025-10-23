import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
            <h1 className="text-4xl md:text-6xl font-extrabold text-text dark:text-dark-text mb-4">
                Inventory Management, <span className="text-primary dark:text-dark-primary">Simplified</span>.
            </h1>
            <p className="max-w-2xl text-lg text-text-secondary dark:text-dark-text-secondary mb-8">
                Streamline your stock, bookings, and dispatches with an intuitive and powerful system designed for efficiency.
            </p>
            <div>
                {isAuthenticated ? (
                    <Link
                        to="/dashboard"
                        className="px-8 py-3 rounded-md font-semibold text-white bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover transition-transform transform hover:scale-105"
                    >
                        Go to Dashboard
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        className="px-8 py-3 rounded-md font-semibold text-white bg-primary hover:bg-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover transition-transform transform hover:scale-105"
                    >
                        Get Started
                    </Link>
                )}
            </div>
        </div>
    );
};

export default HomePage;
