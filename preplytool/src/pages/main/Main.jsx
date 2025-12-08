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

    function mostrarUltimaSesion(dias, horas, minutos, segundos) {

        if (dias == 0) {
            if (horas == 0) {
                if (minutos == 0) {

                    if (segundos <= 60) {
                        return "justo ahora";
                    } else {
                        return "justo ahora";
                    }

                } else {
                    return `hace ${minutos} minutos`
                }
            } else {
                return `hace ${horas} horas`
            }
        } else {
            return `hace ${dias} días`
        }
    }

    async function addAlumno() {

        const input = document.getElementById("name").value;
        if (input == "") {
            alert("Por favor proporciona un nombre")
        } else {
            await fetch("http://127.0.0.1:3000/api/alumnos/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: input
                })
            })
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));

            window.location.reload();


        }
    }

    function showEditWindow(nombre, id){
        const window = document.querySelector(".editAlumno");
        const blackScreen = document.querySelector(".black_screen");
        const input_value = document.getElementById("edit_name");
        const alumnoId = document.getElementById("id_alumno");

        alumnoId.value = id;

        input_value.value = nombre;
        blackScreen.classList.add("screen_visible");
        document.body.style.overflow = "hidden";
        window.classList.add("addAlumnoVisible");

    }

    function ventanaAñadir() {
        const blackScreen = document.querySelector(".black_screen");
        const addAlumno = document.querySelector(".addAlumno");

        blackScreen.classList.add("screen_visible");
        addAlumno.classList.add("addAlumnoVisible");
        document.body.style.overflow = "hidden";
    };

    function cerrarVentana() {
        const window = document.querySelector(".editAlumno");
        const blackScreen = document.querySelector(".black_screen");
        const addAlumno = document.querySelector(".addAlumno");
        const deleteAlumno = document.querySelector(".deleteAlumno");


        blackScreen.classList.remove("screen_visible");
        deleteAlumno.classList.remove("addAlumnoVisible");
        addAlumno.classList.remove("addAlumnoVisible");
        window.classList.remove("addAlumnoVisible");
        document.body.style.overflow = "auto";

    }

    async function eliminarAlumno(id) {

        await fetch(`http://127.0.0.1:3000/api/alumnos/delete/${id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(window.location.reload())
            .catch(err => console.error("Error:", err));



    }

    function showWarningMessage(id) {
        const blackScreen = document.querySelector(".black_screen");
        const deleteAlumno = document.querySelector(".deleteAlumno");

        blackScreen.classList.add("screen_visible");
        deleteAlumno.classList.add("addAlumnoVisible");
        

        deleteAlumno.innerHTML = `<p>¿Quieres continuar?</p>
                    <p>Se eliminarán todos los datos relacionados</p><button id="confirmDelete">Eliminar</button>`;

        const btn = document.getElementById("confirmDelete");
        btn.addEventListener("click", () => {
            eliminarAlumno(id);
        });
        document.body.style.overflow = "hidden";

    }

    async function updateAlumno(id, newName){

        await fetch(`http://127.0.0.1:3000/api/alumnos/update/${id}/${newName}`, {
            method: "PUT"
        })
            .then(res => res.json())
            .then(window.location.reload())
            .catch(err => console.error("Error:", err));
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
                                <div className="alumno__icons">
                                    <i className="fa-solid fa-pencil edit" onClick={() => showEditWindow(alumno.nombre, alumno.id)}></i>
                                    <i className="fa-solid fa-trash delete" onClick={() => showWarningMessage(alumno.id)}></i>
                                </div>

                                <p className="alumno__nombre">{alumno.nombre}</p>

                                <div className="alumno__progreso">
                                    <span>Progreso:</span>
                                    <div className="progress">
                                        <div
                                            className="progress__fill"
                                            style={{ width: `${alumno.progreso}%` }}
                                        ></div>
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

                                <button className="alumno__btn">Ir al perfil</button>
                            </div>
                        ))}
                    </div>
                )}

                <button className="add" onClick={() => ventanaAñadir(0)}>+ Agregar alumno</button>

                <div className="addAlumno">

                    <div className="crossmark">

                        <p>Añadir alumno</p>

                        <i className="fa-solid fa-xmark" onClick={() => cerrarVentana(0)}></i>
                        <form action="" onSubmit={
                            (e) => {
                                e.preventDefault();
                                addAlumno();

                            }
                        }>
                            <label htmlFor="name">Nombre del alumno:</label>
                            <input type="text" name="name" id="name" />
                            <button type="submit">Crear alumno</button>
                        </form>
                    </div>

                </div>


                <div className="deleteAlumno">

                </div>



            </main>

            <div className="black_screen" onClick={cerrarVentana}>

            </div>

            <div className="editAlumno">

                    <div className="crossmark">

                        <p>Editar alumno: </p>

                        <i className="fa-solid fa-xmark" onClick={() => cerrarVentana(0)}></i>
                        <form action="" onSubmit={
                            (e) => {
                                e.preventDefault();
                                const id = document.getElementById("id_alumno").value;
                                const newName  = document.getElementById("edit_name").value;
                                
                                if(newName == ""){
                                    alert("Agrega un nombre")
                                }else{
                                    updateAlumno(id, newName)

                                }


                            }
                        }>
                            <label htmlFor="edit_name">Nombre del alumno:</label>
                            <input type="hidden" id="id_alumno"/>
                            <input type="text" name="name" id="edit_name" />
                            <button type="submit">Editar Alumno</button>
                        </form>
                    </div>

                </div>

        </>
    );
}
