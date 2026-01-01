import "./main.css";
import { useState, useEffect } from "react";
import Header from "../../layouts/header/Header";
import { Circles } from "react-loader-spinner";

export default function Main() {
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);

    // ------------------ Funciones Backend ------------------

    async function obtenerAlumnos() {
        try {
            const res = await fetch("https://preplytool-2tgl.vercel.app/api/alumnos");
            const data = await res.json();

            const alumnosConProgreso = data.map(a => ({ ...a, progreso: 0 }));
            setAlumnos(alumnosConProgreso);

            // Obtener progreso para cada alumno
            await Promise.all(alumnosConProgreso.map(a => getProgress(a.id)));

            setLoading(false);
        } catch (err) {
            console.error("Error al obtener alumnos:", err);
            setLoading(false);
        }
    }

    async function getProgress(id) {
        try {
            const res = await fetch(`https://preplytool-2tgl.vercel.app/api/alumnos/progress/${id}`);
            const data = await res.json();

            setAlumnos(prev =>
                prev.map(a => a.id === id ? { ...a, progreso: data.alumno } : a)
            );
        } catch (err) {
            console.error("Error al obtener progreso:", err);
        }
    }

    async function updateSession(id) {
        try {
            await fetch(`https://preplytool-2tgl.vercel.app/api/alumnos/update_sesion/${id}`, {
                method: "PUT"
            });

            const ahora = new Date();
            setAlumnos(prev =>
                prev.map(a => a.id === id
                    ? { 
                        ...a,
                        ultima_sesion: ahora,
                        tiempo_desde_ultima_sesion: { dias: 0, horas: 0, minutos: 0, segundos: 0 }
                    }
                    : a
                )
            );
        } catch (err) {
            console.error("Error al actualizar sesión:", err);
        }
    }

    async function addAlumno(nombre) {
        try {
            const res = await fetch("https://preplytool-2tgl.vercel.app/api/alumnos/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre })
            });
            const data = await res.json();

            setAlumnos(prev => [...prev, { ...data, progreso: 0, tiempo_desde_ultima_sesion: { dias:0, horas:0, minutos:0, segundos:0 } }]);
            getProgress(data.id);
        } catch (err) {
            console.error("Error al agregar alumno:", err);
        }
    }

    async function editAlumno(id, newName) {
        try {
            const res = await fetch(`https://preplytool-2tgl.vercel.app/api/alumnos/update/${id}/${newName}`, { method: "PUT" });
            const data = await res.json();

            setAlumnos(prev =>
                prev.map(a => a.id === id ? { ...a, nombre: data.alumno.nombre } : a)
            );

            obtenerAlumnos()
        } catch (err) {
            console.error("Error al editar alumno:", err);
        }
    }

    async function deleteAlumno(id) {
        try {
            await fetch(`https://preplytool-2tgl.vercel.app/api/alumnos/delete/${id}`, { method: "DELETE" });
            setAlumnos(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error("Error al eliminar alumno:", err);
        }
    }

    // ------------------ Funciones UI ------------------

    function mostrarUltimaSesion(dias, horas, minutos, segundos) {
        if (dias > 0) return `hace ${dias} días`;
        if (horas > 0) return `hace ${horas} horas`;
        if (minutos > 0) return `hace ${minutos} minutos`;
        return "justo ahora";
    }

    function abrirModalAgregar() {
        const blackScreen = document.querySelector(".black_screen");
        const modal = document.querySelector(".addAlumno");
        blackScreen.classList.add("screen_visible");
        modal.classList.add("addAlumnoVisible");
        document.body.style.overflow = "hidden";
    }

    function abrirModalEditar(nombre, id) {
        const blackScreen = document.querySelector(".black_screen");
        const modal = document.querySelector(".editAlumno");
        const input = document.getElementById("edit_name");
        const alumnoId = document.getElementById("id_alumno");
        alumnoId.value = id;
        input.value = nombre;
        blackScreen.classList.add("screen_visible");
        modal.classList.add("addAlumnoVisible");
        document.body.style.overflow = "hidden";
    }

    function abrirModalEliminar(id) {
        const blackScreen = document.querySelector(".black_screen");
        const modal = document.querySelector(".deleteAlumno");
        blackScreen.classList.add("screen_visible");
        modal.classList.add("addAlumnoVisible");
        modal.innerHTML = `
            <p>¿Quieres continuar?</p>
            <p>Se eliminarán todos los datos relacionados</p>
            <button id="confirmDelete">Eliminar</button>
        `;
        document.body.style.overflow = "hidden";

        document.getElementById("confirmDelete").onclick = () => {
            deleteAlumno(id);
            cerrarVentanas();
        };
    }

    function cerrarVentanas() {
        document.querySelector(".black_screen").classList.remove("screen_visible");
        document.querySelector(".addAlumno").classList.remove("addAlumnoVisible");
        document.querySelector(".editAlumno").classList.remove("addAlumnoVisible");
        document.querySelector(".deleteAlumno").classList.remove("addAlumnoVisible");
        document.body.style.overflow = "auto";
    }

    useEffect(() => {
        obtenerAlumnos();
    }, []);

    return (
        <>
            <Header />
            <main className="main_main">
                <h1>Portal de alumnos</h1>
                <p className="main__subtitle">Selecciona un alumno para continuar</p>

                {loading ? (
                    <div className="loader">
                        <Circles height="60" width="60" color="var(--naranja)" ariaLabel="loading" />
                    </div>
                ) : alumnos.length === 0 ? (
                    <p>No hay alumnos inscritos...</p>
                ) : (
                    <div className="alumnos">
                        {alumnos.map(alumno => (
                            <div className="alumno" key={alumno.id}>
                                <div className="alumno__icons">
                                    <i className="fa-solid fa-pencil edit" onClick={() => abrirModalEditar(alumno.nombre, alumno.id)}></i>
                                    <i className="fa-solid fa-trash delete" onClick={() => abrirModalEliminar(alumno.id)}></i>
                                </div>

                                <p className="alumno__nombre">{alumno.nombre}</p>

                                <div className="progress" style={{ position: "relative" }}>


                                        <div
                                            className="progress__fill"
                                            style={{ width: `${alumno.progreso}%` }}

                                        >
                                            <span style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                color: "#000" // Cambia según contraste
                                            }}>
                                                {Math.round((alumno.progreso))}%
                                            </span>

                                        </div>

                                    </div>
                                <p className="alumno__fecha">
                                    <span>
                                        Última sesión{" "}
                                        {mostrarUltimaSesion(
                                            alumno.tiempo_desde_ultima_sesion.dias,
                                            alumno.tiempo_desde_ultima_sesion.horas,
                                            alumno.tiempo_desde_ultima_sesion.minutos,
                                            alumno.tiempo_desde_ultima_sesion.segundos
                                        )}
                                    </span>
                                </p>

                                <a href={`/student/${alumno.id}`} onClick={() => updateSession(alumno.id)} className="alumno__btn">
                                    Ir a clase
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                <button className="add" onClick={abrirModalAgregar}>+ Agregar alumno</button>

                {/* Modal Agregar */}
                <div className="addAlumno">
                    <div className="crossmark">
                        <p>Añadir alumno</p>
                        <i className="fa-solid fa-xmark" onClick={cerrarVentanas}></i>
                        <form onSubmit={e => {
                            e.preventDefault();
                            const nombre = document.getElementById("name").value;
                            if (nombre) {
                                addAlumno(nombre);
                                cerrarVentanas();
                            } else alert("Agrega un nombre");
                        }}>
                            <label htmlFor="name">Nombre del alumno:</label>
                            <input type="text" id="name" />
                            <button type="submit">Crear alumno</button>
                        </form>
                    </div>
                </div>

                {/* Modal Editar */}
                <div className="editAlumno">
                    <div className="crossmark">
                        <p>Editar alumno</p>
                        <i className="fa-solid fa-xmark" onClick={cerrarVentanas}></i>
                        <form onSubmit={e => {
                            e.preventDefault();
                            const id = document.getElementById("id_alumno").value;
                            const newName = document.getElementById("edit_name").value;
                            if (newName) {
                                editAlumno(id, newName);
                                cerrarVentanas();
                            } else alert("Agrega un nombre");
                        }}>
                            <input type="hidden" id="id_alumno" />
                            <label htmlFor="edit_name">Nombre:</label>
                            <input type="text" id="edit_name" />
                            <button type="submit">Editar alumno</button>
                        </form>
                    </div>
                </div>

                {/* Modal Eliminar */}
                <div className="deleteAlumno"></div>

                <div className="black_screen" onClick={cerrarVentanas}></div>
            </main>
        </>
    );
}
