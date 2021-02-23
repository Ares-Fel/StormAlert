import React, { useState, useEffect } from 'react'

import app from "../../../firebase-config";

function EstadoCard() {
    const [estados, setEstados] = useState([]);

    async function getData() {
        await app
            .firestore()
            .collection("sensor")
            .orderBy("hora", "desc").limit(3)
            .onSnapshot((snap) => {
                const docs = [];
                snap.forEach((doc) => {
                    docs.push(doc.data());
                });
                setEstados(docs);
            });
    }


    useEffect(() => {
        getData()
    }, [])

    const estadoCard = (
        <div className="card card-primary card-outline">
            <div className="card-header">
                <h5 className="card-title m-0">Estado</h5>
            </div>
            <div className="card-body">
                <h6 className="card-title">
                    Estado actual de tormenta
                    </h6>
                <p className="card-text"></p>
                {/* small card */}
                {estados.length <= 2 ? <div>Cargando...</div> :

                    <div className="row">
                        <div className="col-md-7 col-sm-6 col-12">
                            <div
                                className="small-box"
                                style={{
                                    backgroundColor: estados[0].detalle == "Alarma" ? "red"
                                        : estados[0].detalle == "Aviso" ? "orange"
                                            : estados[0].detalle == "Precaución" ? "yellow"
                                                : estados[0].detalle == "No Relámpago Detectado" ? "#28a745"
                                                    : "gray"
                                }}
                            >
                                <div className="inner">
                                    <p style={{ fontSize: 35, fontWeight: "bold" }}>{estados[0].detalle}
                                    </p>
                                    <p>
                                        Hoy Sábado <br></br> A las 09:30 hrs.
                            </p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-exclamation-triangle" />
                                </div>
                                <a href="#" className="small-box-footer">
                                    Más <i className="fas fa-arrow-circle-right" />
                                </a>
                            </div>
                        </div>
                        <div className="col-md-5 col-sm-6 col-12">
                            <div className="row">
                                <div className="info-box col-12">
                                    <span className="info-box-icon bg-info">
                                        <i className="fas fa-arrow-left" />
                                    </span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">
                                            {estados[1].detalle}
                                        </span>
                                        <span className="info-box-number">
                                            Hoy, 9:25 hrs.
                              </span>
                                    </div>
                                    {/* /.info-box-content */}
                                </div>
                                <div className="info-box col-12">
                                    <span className="info-box-icon bg-info">
                                        <i className="fas fa-arrow-up" />
                                    </span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">
                                            {estados[2].detalle}
                                        </span>
                                        <span className="info-box-number">
                                            Hoy, 9:19 hrs.
                              </span>
                                    </div>
                                    {/* /.info-box-content */}
                                </div>
                            </div>
                        </div>
                    </div>}

            </div>
        </div>


    )
    return estadoCard


}

export default EstadoCard
