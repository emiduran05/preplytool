import "./aside.css";
import { useState, useEffect } from "react";

// const levelsData = [
//     {
//         id: 1,
//         name: "Nivel A1",
//         stages: [
//             {
//                 id: 1,
//                 name: "Etapa 1",
//                 lessons: [
//                     { id: 1, name: "Lección 1" },
//                     { id: 2, name: "Lección 2" }
//                 ]
//             },

//             {
//                 id: 4,
//                 name: "Etapa 2",
//                 lessons: [
//                     { id: 3, name: "Lección 1" },
//                     { id: 4, name: "Lección 2" }
//                 ]
//             },


//         ]
//     },
//     {
//         id: 2,
//         name: "Nivel A2",
//         stages: [
//             {
//                 id: 2,
//                 name: "Etapa 1",
//                 lessons: [{ id: 3, name: "Lección 1" }]
//             }
//         ]
//     },

//     {
//         id: 4,
//         name: "Nivel B1",
//         stages: [
//             {
//                 id: 2,
//                 name: "Etapa 1",
//                 lessons: []
//             }
//         ],
//     }
// ];

export default function Aside() {
    const [isloading, setIsloading] = useState(true);
    const [levelsData, setLevelsData] = useState([]);
    const [openLevel, setOpenLevel] = useState(null);
    const [openStage, setOpenStage] = useState(null);

    async function fetchLevelsData() {

        await fetch(`http://localhost:3000/api/services/niveles/completos`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {setLevelsData(data); setIsloading(false); console.log(data)})
            .catch(err => console.error("Error:", err));

    }

    useEffect(() => {
        fetchLevelsData()
    }, [])


    return (
        <div className="aside_container">

            {isloading ? "cargando..." : 

            openLevel === null && (
                <button className="add_btn_global">+ Agregar Nivel</button>
            )}

            {levelsData.map((level) => (
                <div key={level.id} className="item">

                    {/* NIVEL */}
                    <div className="row">
                        <div className="collapse_btn">

                            <button
                                className="display"
                                onClick={() =>
                                    setOpenLevel(openLevel === level.id ? null : level.id)
                                }
                            >
                                <span className={`arrow ${openLevel === level.id ? "open" : ""}`}>
                                    <i class="fa-solid fa-caret-right"></i>
                                </span>
                            </button>
                            {level.name}

                            <div>
                                <span>
                                    <i className="fa-solid fa-pencil edit"></i>
                                </span>

                                <span>
                                    <i className="fa-solid fa-trash delete" ></i>
                                </span>
                            </div>
                        </div>


                    </div>

                    {openLevel === level.id && (
                        <div className="stage_block">

                            {level.stages.map((stage) => (
                                <div key={stage.id}>

                                    {/* ETAPA */}
                                    <div className="row">
                                        <div className="collapse_btn stage_btn">
                                            <button
                                                className="display"
                                                onClick={() =>
                                                    setOpenStage(openStage === stage.id ? null : stage.id)
                                                }
                                            >
                                                <span
                                                    className={`arrow ${openStage === stage.id ? "open" : ""
                                                        }`}
                                                >
                                                    <i class="fa-solid fa-caret-right"></i>
                                                </span>

                                            </button>

                                            {stage.name}

                                            <div>
                                                <span>
                                                    <i className="fa-solid fa-pencil edit"></i>
                                                </span>

                                                <span>
                                                    <i className="fa-solid fa-trash delete" ></i>
                                                </span>
                                            </div>

                                        </div>


                                    </div>

                                    {/* LECCIONES */}
                                    {openStage === stage.id && (
                                        <div className="lesson_block">
                                            {stage.lessons.map((lesson) => (
                                                <div key={lesson.id} className="row lesson_row">
                                                    <a href={`?leccion_id=${lesson.id}`}>{lesson.name}</a>
                                                    <div className="actions">

                                                    </div>
                                                </div>
                                            ))}

                                            <button className="add_btn">+ Agregar Lección</button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button className="add_btn">+ Agregar Etapa</button>
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
}
