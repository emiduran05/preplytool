import "./main.css";
import { useState, useEffect } from "react";
import Header from "../../layouts/header/Header";
import { Circles } from 'react-loader-spinner'


export default function Main() {

    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);

    function obtenerAlumnos() {

        setTimeout(() => {

            const alumnos = [
                {
                    id: 1,
                    nombre: "Emiliano Durán",
                    progreso: 50,
                    ultima_sesion: "04/11/2025"

                },

                {
                    id: 2,
                    nombre: "Fernando Durán",
                    progreso: 20,
                    ultima_sesion: "02/11/2025"

                }, {
                    id: 3,
                    nombre: "Ivana Banderas",
                    progreso: 24,
                    ultima_sesion: "02/11/2025"

                }, {
                    id: 4,
                    nombre: "Viviana Fuentes",
                    progreso: 75,
                    ultima_sesion: "02/11/2025"

                }, {
                    id: 5,
                    nombre: "Iván Durán",
                    progreso: 70,
                    ultima_sesion: "02/11/2025"

                },

            ]

            setAlumnos(alumnos);
            setLoading(false);


        }, 3000)




    }



    useEffect(() => {
        obtenerAlumnos();
    }, [])


    useEffect(() => {
        console.log(alumnos);
    }, [alumnos])





    return (
        <>
            <Header />

            <main className="site_main">
                <h1>Portal de alumnos</h1>
                <p>Selecciona un alumno para continuar</p>

                <div className="site_main_container">
                    {loading ? (<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Circles
                            height="50"
                            width="50"
                            color="var(--naranja)"
                            ariaLabel="loading"
                        />
                    </div>) : alumnos.map((alumnos) => (
                        <div className="site_main_container_card" key={alumnos.id}>
                            <i class="fa-solid fa-trash delete"></i>
                            <i class="fa-solid fa-pencil edit"></i>
                            <p style={{fontWeight: "600", fontSize: "16px"}}>{alumnos.nombre}</p>
                            <p>Progreso:</p>
                            <div className="progress_bar">
                                <div className="progres_bar_width" style={{ height: "15px", width: alumnos.progreso + "%", backgroundColor: "var(--verde)", borderRadius: "5px" }}>

                                </div>
                            </div>
                            <p>Última Sesión: {alumnos.ultima_sesion}</p>
                            <button>Ir al perfil</button>
                        </div>
                    ))}
                </div>


                <button className="add">
                    Agregar alumno
                </button>

            </main>

        </>
    )
}