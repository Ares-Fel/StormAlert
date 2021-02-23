import React from 'react'

function PageNotFound() {
    return (
        <section className="content">
            <div className="error-page">
                <h2 className="headline text-warning"> 404</h2>
                <div className="error-content">
                    <h3><i className="fas fa-exclamation-triangle text-warning" /> Oops! Página no encontrada.</h3>
                    <p>
                        No hemos podido encontrar la página que buscabas..
                        Debería regresar al <a href="/">inicio</a>.
                    </p>
                </div>
                {/* /.error-content */}
            </div>
            {/* /.error-page */}
        </section>

    )
}

export default PageNotFound
