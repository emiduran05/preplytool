import "./main.css";
import { useState, useEffect } from "react";
import Header from "../../layouts/header/Header";
import { Circles } from "react-loader-spinner";

export default function Main() {
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function obtenerAlumnos() {

        await fetch("http://127.0.0.1:3000/api/alumnos", {
            method: "GET",
        })
        .then(res => res.json())
        .then(data => {
            setAlumnos(data);
            setLoading(false);
        })
    }

    useEffect(() => {
        obtenerAlumnos();
    }, []);

    return (
        <>
            <Header />
            <main className="main">
                <h1>Portal de alumnos</h1>
                <p className="main__subtitle">Selecciona un alumno para continuar</p>

                {loading ? (
                    <div className="loader">
                        <Circles height="60" width="60" color="var(--naranja)" ariaLabel="loading" />
                    </div>
                ) : (
                    <div className="alumnos">
                        {alumnos.map((alumno) => (
                            <div className="alumno" key={alumno.id}>
                                <div className="alumno__icons">
                                    <i className="fa-solid fa-pencil edit"></i>
                                    <i className="fa-solid fa-trash delete"></i>
                                </div>

                                <p className="alumno__nombre">{alumno.nombre}</p>

                                <div className="alumno__progreso">
                                    <label>Progreso:</label>
                                    <div className="progress">
                                        <div
                                            className="progress__fill"
                                            style={{ width: `${alumno.progreso}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="alumno__fecha">
                                    Última sesión: <span>{alumno.ultima_sesion}</span>
                                </p>

                                <button className="alumno__btn">Ir al perfil</button>
                            </div>
                        ))}
                    </div>
                )}

                <button className="add">+ Agregar alumno</button>
            </main>
        </>
    );
}
