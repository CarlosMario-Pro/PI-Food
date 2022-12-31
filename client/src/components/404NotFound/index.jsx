import React from "react";
import { Link } from "react-router-dom";
import "./index.css";


function NotFound() {
    
    return (
        <section className="container_page_notFound">
            <h1>PAGE NOT FOUND</h1>
            <Link to={"/recipes"} style={{ textDecoration: 'none' }}>
            <div>
                <p className="text_visted_page">
                Enjoy your favorite recipes here<i className="bi bi-house"></i>
                </p>
            </div>

            </Link>
            <section>
                <div className="error-container">
                    <span>4</span>
                    <span>0</span>
                    <span>4</span>
                </div>
            </section>
        </section>
    );
};


export default NotFound;