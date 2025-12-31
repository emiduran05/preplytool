import "./main.css";
import { useState, useEffect } from "react";
import Header from "../../layouts/header/Header";
import { Circles } from "react-loader-spinner";

export default function Main() {
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtener alumnos desde el backend
    async function obtenerAlumnos() {
        try {
            const res = await fetch("http://127.0.0.1:3000/api/alumnos");
            const data = await res.json();

            // Inicializa alumnos con progreso 0
            const alumnosConProgreso = data.map(a => ({
                ...a,
                progreso: 0
            }));

            setAlumnos(alumnosConProgreso);

            // Obtener progreso para cada alumno
            await Promise.all(alumnosConProgreso.map(a => getProgress(a.id)));

            setLoading(false);

        } catch (err) {
            console.error("Error al obtener alumnos:", err);
            setLoading(false);
        }
    }

    // Obtener progreso de un alumno y actualizar el estado
    async function getProgress(id) {
        try {
            const res = await fetch(`http://127.0.0.1:3000/api/alumnos/progress/${id}`);
            const data = await res.json();

            console.log(data)

            setAlumnos(prev =>
                prev.map(a => a.id === id ? { ...a, progreso: data.alumno } : a)
            );
        } catch (err) {
            console.error("Error al obtener progreso:", err);
        }
    }

    // Actualizar sesión sin recargar
    async function updateSession(id) {
        try {
            await fetch(`http://127.0.0.1:3000/api/alumnos/update_sesion/${id}`, {
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

    // Calcular tiempo desde última sesión
    function mostrarUltimaSesion(dias, horas, minutos, segundos) {
        if (dias > 0) return `hace ${dias} días`;
        if (horas > 0) return `hace ${horas} horas`;
        if (minutos > 0) return `hace ${minutos} minutos`;
        return "justo ahora";
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
                        {alumnos.map((alumno) => (
                            <div className="alumno" key={alumno.id}>
                                <p className="alumno__nombre">{alumno.nombre}</p>

                                <div className="alumno__progreso" >
                                    <span>Progreso:</span>
                                    <div className="progress" style={{position: "relative"}}>

                                        
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
      {Math.round(alumno.progreso)}%
    </span>

                                        </div>
                                        
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
            </main>
        </>
    );
}
