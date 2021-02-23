import React, { Component, useState, useEffect, useContext } from "react";

import { AuthContext } from "../../../Auth";

import "firebase/auth";
import { messaging, useFirebaseApp, useUser } from "reactfire";
import EstadoCard from "./EstadoCard";
import ClimaCard from "./ClimaCard";
import EstadisticasCard from "./EstadisticasCard";

export default function Inicio() {

  const inicio = (
    <>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">
                  {" "}
                  {/*Top Navigation*/} <small></small>
                </h1>
              </div>
              {/* /.col */}
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <div className="content">
          <div className="container">
            <div className="row">
              {/* /.col-md-6 */}
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-md-9">
                    <EstadoCard></EstadoCard>
                  </div>
                  <div className="col-md-3">
                    <ClimaCard></ClimaCard>
                  </div>
                </div>
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h5 className="card-title m-0">Estadísticas</h5>
                  </div>

                  <div className="card-body">
                    {/*chart */}

                    <EstadisticasCard></EstadisticasCard>

                    {/*chart */}
                  </div>
                </div>

                {/*<div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Usuarios</h3>
                        <div className="card-tools">
                          <div
                            className="input-group input-group-sm"
                            style={{ width: 150 }}
                          >
                            <input
                              type="text"
                              name="table_search"
                              className="form-control float-right"
                              placeholder="Search"
                            />
                            <div className="input-group-append">
                              <button type="submit" className="btn btn-default">
                                <i className="fas fa-search" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-body table-responsive p-0"
                        style={{ height: 300 }}
                      >
                        <table className="table table-head-fixed text-nowrap">
                          <thead>
                            <tr>
                              <th>Nombres</th>
                              <th>Fecha de Registro</th>
                              <th>Estado</th>
                              <th>Cargo</th>
                              <th>Empresa</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Ronald Diaz</td>
                              <td>11-7-2014</td>
                              <td>
                                <span className="tag tag-success">Online</span>
                              </td>
                              <td>Jefe de Planta</td>
                              <td>JMarCobre</td>
                            </tr>
                            <tr>
                              <td>Rodrigo Guevara</td>
                              <td>11-7-2014</td>
                              <td>
                                <span className="tag tag-success">Offline</span>
                              </td>
                              <td>Jefe de Laboratorio</td>
                              <td>Orus</td>
                            </tr>
                            <tr>
                              <td>Arturo Lopez</td>
                              <td>11-7-2014</td>
                              <td>
                                <span className="tag tag-success">Offline</span>
                              </td>
                              <td>Tecnico Elec.</td>
                              <td>H&H</td>
                            </tr>
                            <tr>
                              <td>María Medina</td>
                              <td>11-7-2014</td>
                              <td>
                                <span className="tag tag-success">Online</span>
                              </td>
                              <td>Ing. Mecánica</td>
                              <td>JMarCobre</td>
                            </tr>
                            <tr>
                              <td>Celia Paredes</td>
                              <td>11-7-2014</td>
                              <td>
                                <span className="tag tag-success">Online</span>
                              </td>
                              <td>Jefe de Planta</td>
                              <td>JMarCobre</td>
                            </tr>
                            <tr>
                              <td>Vilma Huanca</td>
                              <td>11-7-2014</td>
                              <td>
                                <span className="tag tag-success">Online</span>
                              </td>
                              <td>Jefe de Planta</td>
                              <td>JMarCobre</td>
                            </tr>
                            <tr>
                              <td>Natalia Gomez</td>
                              <td>11-7-2014</td>
                              <td>
                                <span className="tag tag-success">Online</span>
                              </td>
                              <td>Jefe de Planta</td>
                              <td>JMarCobre</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>*/}
              </div>
              {/* /.col-md-6 */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content */}
      </div>
      {/* /.content-wrapper */}
    </>
  );
  return inicio;


}
