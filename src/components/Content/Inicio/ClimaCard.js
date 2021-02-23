import React from 'react'

function ClimaCard() {
    return (
        <div className="card card-primary card-outline">
            <div className="card-header">
                <h5 className="card-title m-0">Clima</h5>
            </div>
            <div className="card-body">
                <h6 className="card-title"></h6>
                <p className="card-text"></p>
                {/* small card */}
                <div className="col-lg-12 col-12">
                    <div className="small-box">
                        <div className="inner">
                            <p>Arequipa</p>
                            <h3>14°C</h3>
                            <br></br>
                            <br></br>
                            <p>Parcialmente nublado</p>
                        </div>
                        <div className="icon">
                            <i className="fas fa-cloud-sun" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClimaCard
