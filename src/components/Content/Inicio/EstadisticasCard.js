import { getDefaultNormalizer } from '@testing-library/react';
import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import app from "../../../firebase-config";

function EstadisticasCard() {
    const [hrs, setHrs] = useState([])
    const [alarmas, setAlarmas] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const [precauciones, setPrecauciones] = useState([]);
    const [noRDs, setNoRDs] = useState([]);
    const [fallas, setFallas] = useState([])
    const [ultimaHora, setUltimaHora] = useState(/*new Date().getTime()*/)
    const fecha = Date.now().toString();

    async function getData() {
        await app
            .firestore()
            .collection("sensor")
            .orderBy("hora", "desc")
            .limit(1)
            .onSnapshot((snap) => {
                snap.forEach(doc => {
                    setUltimaHora(doc.data().hora)
                })
            })
        await app
            .firestore()
            .collection("sensor")
            .orderBy("hora", "desc")
            .onSnapshot(snap => {
                const docHrs = []
                const docsAlarmas = [];
                const docsAvisos = [];
                const docsPracauciones = [];
                const docsNoRDs = [];
                const docsFallas = [];

                snap.forEach((doc) => {
                    docHrs.push(new Date(parseInt(doc.data().hora)).toLocaleTimeString())
                    if (doc.data().estado == 5) {
                        docsAlarmas.push(doc.data())
                    }
                    if (doc.data().estado == 4) {
                        docsAvisos.push(doc.data())
                    }
                    if (doc.data().estado == 3) {
                        docsPracauciones.push(doc.data())
                    }
                    if (doc.data().estado == 2) {
                        docsNoRDs.push(doc.data())
                    }
                    if (doc.data().estado == 1) {
                        docsFallas.push(doc.data())
                    }
                    /*docsAvisos.push(doc.data());
                    docsPracauciones.push(doc.data());
                    docsNoRDs.push(doc.data());
                    docsFallas.push(doc.data());*/
                })
                setHrs(docHrs)
                setAlarmas(docsAlarmas);
                setAvisos(docsAvisos);
                setPrecauciones(docsPracauciones);
                setNoRDs(docsNoRDs);
                setFallas(docsFallas);
                /*setAvisos(docsAvisos);
                setPrecauciones(docsPracauciones);
                setNoRDs(docsNoRDs);
                setFallas(docsFallas);*/
            })
    }

    useEffect(() => {
        getData().then(() => {
            const haceUnaHora = fecha - 700000;
            const haceDosHora = fecha - 700000 * 2;
            const haceTresHora = fecha - 700000 * 3;
            const haceCuatroHora = fecha - 700000 * 4;
            const haceCincoHora = fecha - 700000 * 5;
            const haceSeisHora = fecha - 700000 * 6;
            var cont1 = 0
            var cont2 = 0
            var cont3 = 0
            var cont4 = 0
            var cont5 = 0
            var cont6 = 0
            alarmas.forEach((doc) => {

                if (haceUnaHora < doc.hora <= ultimaHora) {
                    cont1++;
                }
                if (haceDosHora < doc.hora <= haceUnaHora) {
                    cont2++;
                }
                if (haceTresHora < doc.hora <= haceDosHora) {
                    cont3++;
                }
                if (haceCuatroHora < doc.hora <= haceTresHora) {
                    cont4++;
                }
                if (haceCincoHora < doc.hora <= haceCuatroHora) {
                    cont5++;
                }
                if (haceSeisHora < doc.hora <= haceCincoHora) {
                    cont6++;
                }
            })
        })
    }, [])

    return (
        <div className="row">
            <div className="col-md-8">
                <p className="text-center">
                    <strong>Estados detectados / Tiempo</strong>
                </p>

                <Line data={{
                    labels: hrs,
                    datasets: [{
                        label: "Alarma",
                        data: [15, 13, 10, 5, 2, 4, 15, 20, 23, 24, 22, 11, 8, 5, 4, 2, 5, 3, 5, 3, 2, 4, 2, 4],
                        backgroundColor: ["rgba(255,0,0,0.3)"],
                        borderColor: ["rgba(255,0,0,1)"],
                        fill: false
                    }, {
                        label: "Aviso",
                        data: [0, 1, 2, 1, 2, 12, 13, 14, 15, 12, 12, 0, 1, 1, 0, 1, 2, 2, 1],
                        backgroundColor: ["rgba(255,165,0,0.3)"],
                        borderColor: ["rgba(255,165,0,1)"],
                        fill: false
                    }, {
                        label: "Precaución",
                        data: [2, 22, 23, 5, 0, 1, 2, 0, 0, 1, 4, 2, 5, 2, 1, 2, 0, 2, 3],
                        backgroundColor: ["rgba(255,255,0,0.3)"],
                        borderColor: ["rgba(255,255,0,1)"],
                        fill: false
                    }, {
                        label: "No Relámpago Detectado",
                        data: [5, 3, 4, 5, 6, 4, 5, 2, 7, 4, 3, 4, 3, 4, 1, 5, 2, 5, 6, 5, 7],
                        backgroundColor: ["rgba(0,,255,0,0.3)"],
                        borderColor: ["rgba(0,255,0,1)"],
                        fill: false
                    }, {
                        label: "Falla",
                        data: [0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 0, 0, 2, 1, 0, 0, 0, 1, 0, 0, 0, 1],
                        backgroundColor: ["rgba(128,128,128,0.3)"],
                        borderColor: ["rgba(128,128,128,1)"],
                        fill: false
                    }]
                }}
                    options={{}}
                >

                </Line>





            </div>
            <div className="col-md-4">
                <p className="text-center">
                    <strong>Frecuencia de Estados</strong>
                </p>
                <div className="progress-group">
                    Falla
                          <span className="float-right">
                        <b>40</b>/200
                          </span>
                    <div className="progress progress-sm">
                        <div
                            className="progress-bar bg-info"
                            style={{ width: "20%" }}
                        />
                    </div>
                </div>
                {/* /.progress-group */}
                <div className="progress-group">
                    No Relámpago Detectado
                          <span className="float-right">
                        <b>310</b>/400
                          </span>
                    <div className="progress progress-sm">
                        <div
                            className="progress-bar bg-green"
                            style={{ width: "75%" }}
                        />
                    </div>
                </div>
                {/* /.progress-group */}
                <div className="progress-group">
                    <span className="progress-text">Precaución</span>
                    <span className="float-right">
                        <b>480</b>/800
                          </span>
                    <div className="progress progress-sm">
                        <div
                            className="progress-bar bg-yellow"
                            style={{ width: "60%" }}
                        />
                    </div>
                </div>
                {/* /.progress-group */}
                <div className="progress-group">
                    Aviso
                          <span className="float-right">
                        <b>250</b>/500
                          </span>
                    <div className="progress progress-sm">
                        <div
                            className="progress-bar bg-orange"
                            style={{ width: "50%" }}
                        />
                    </div>
                </div>
                {/* /.progress-group */}
                <div className="progress-group">
                    Alarma
                          <span className="float-right">
                        <b>250</b>/500
                          </span>
                    <div className="progress progress-sm">
                        <div
                            className="progress-bar bg-danger"
                            style={{ width: "50%" }}
                        />
                    </div>
                </div>
                {/* /.progress-group */}
            </div>
        </div>
    )
}

export default EstadisticasCard
