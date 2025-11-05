import "./main.css";
import { useState, useEffect } from "react";
import Header from "../../layouts/header/Header";
import { Circles } from "react-loader-spinner";

export default function Main() {
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);

    function obtenerAlumnos() {
        setTimeout(() => {
            const data = [
                { id: 1, nombre: "Emiliano Durán", progreso: 50, ultima_sesion: "04/11/2025" },
                { id: 2, nombre: "Fernando Durán", progreso: 20, ultima_sesion: "02/11/2025" },
                { id: 3, nombre: "Ivana Banderas", progreso: 24, ultima_sesion: "02/11/2025" },
                { id: 4, nombre: "Viviana Fuentes", progreso: 75, ultima_sesion: "02/11/2025" },
                { id: 5, nombre: "Iván Durán", progreso: 70, ultima_sesion: "02/11/2025" },
            ];

            setAlumnos(data);
            setLoading(false);
        }, 2000);
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
