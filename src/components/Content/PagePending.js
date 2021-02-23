import React from 'react'

function PagePending() {
    return (
        <section className="content">
            <div className="error-page">
                <h2 className="headline text-warning"> </h2>
                <div className="error-content">
                    <h3><i className="fas fa-exclamation-triangle text-warning" /> Su cuenta está en revisión.</h3>
                    <p>
                        Contacte con algún administrador para solucionar su problema.
                    </p>
                </div>
                {/* /.error-content */}
            </div>
            {/* /.error-page */}
        </section>
    )
}

export default PagePending
