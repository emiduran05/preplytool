import "./aside.css";
import { useState, useEffect } from "react";

export default function Aside() {
    const [isloading, setIsloading] = useState(true);
    const [levelsData, setLevelsData] = useState([]);
    const [openLevel, setOpenLevel] = useState(null);
    const [openStage, setOpenStage] = useState(null);

    // --- Creation Modal ---
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [targetId, setTargetId] = useState(null);

    // --- Edit Modal ---
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // {id, type, nombre}

    // --- Delete Warning Modal ---
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    async function fetchLevelsData() {
        await fetch(`http://localhost:3000/api/services/nivel/niveles/completos`)
            .then(res => res.json())
            .then(data => {
                setLevelsData(data);
                setIsloading(false);
            })
            .catch(err => console.error("Error:", err));
    }

    // --- POST Requests ---
    async function postLevel(name) {
        return fetch("http://localhost:3000/api/services/nivel/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nombre: name })
        });
    }

    async function postStage(name, nivelId) {
        return fetch("http://localhost:3000/api/services/etapa/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nombre: name, nivel_id: nivelId })
        });
    }

    async function postLesson(name, etapaId) {
        return fetch("http://localhost:3000/api/services/leccion/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nombre: name, etapa_id: etapaId })
        });
    }

    // -------- EDIT REQUEST --------
   async function postEdit(type, id, name) {

    const response = await fetch(`http://localhost:3000/api/services/${type}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name, id: id })
    });

    // Si no hay cuerpo:
    if (!response.ok) throw new Error("Error en el servidor");

    const data = await response.json().catch(() => null);

    console.log("Edit result:", data);
    return data;
}


    // -------- DELETE REQUEST --------
    async function postDelete(type, id) {
        return fetch(`http://127.0.0.1:3000/api/services/${type}/delete`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: id
            })
        });
    }

    useEffect(() => {
        fetchLevelsData();
    }, []);

    // --- Open Create Modal ---
    function openModal(type, id = null) {
        setModalType(type);
        setTargetId(id);
        setInputValue("");
        setModalOpen(true);
    }

    // --- Open EDIT Modal ---
    function openEditModal(type, item) {
        setSelectedItem({ ...item, type });
        setInputValue(item.name);
        setEditModalOpen(true);
    }

    // --- Open DELETE Warning Modal ---
    function openDeleteModal(type, item) {
        setSelectedItem({ ...item, type });
        setDeleteModalOpen(true);
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!inputValue.trim()) return;

        if (modalType === "nivel") await postLevel(inputValue);
        if (modalType === "etapa") await postStage(inputValue, targetId);
        if (modalType === "leccion") await postLesson(inputValue, targetId);

        setModalOpen(false);
        fetchLevelsData();
    }

    async function handleEdit(e) {
        e.preventDefault();
        if (!inputValue.trim()) return;

        await postEdit(selectedItem.type, selectedItem.id, inputValue)
        setEditModalOpen(false);
        fetchLevelsData();
    }

    async function handleDelete() {
        await postDelete(selectedItem.type, selectedItem.id);
        setDeleteModalOpen(false);
        fetchLevelsData();
    }

    return (
        <div className="aside_container">

            {/* BOTÓN AGREGAR NIVEL */}
            {!isloading && openLevel === null && (
                <button
                    className="add_btn_global"
                    onClick={() => openModal("nivel")}
                >
                    + Agregar Nivel
                </button>
            )}

            {levelsData.map((level) => (
                <div key={level.id} className="item">
                    <div className="row">
                        <div className="collapse_btn">
                            <button
                                className="display"
                                onClick={() =>
                                    setOpenLevel(openLevel === level.id ? null : level.id)
                                }
                            >
                                <span className={`arrow ${openLevel === level.id ? "open" : ""}`}>
                                    <i className="fa-solid fa-caret-right"></i>
                                </span>
                            </button>

                            {level.name}

                            <div>
                                <i
                                    className="fa-solid fa-pencil edit"
                                    onClick={() => openEditModal("nivel", level)}
                                ></i>

                                <i
                                    className="fa-solid fa-trash delete"
                                    onClick={() => openDeleteModal("nivel", level)}
                                ></i>
                            </div>
                        </div>
                    </div>

                    {/* ETAPAS */}
                    {openLevel === level.id && (
                        <div className="stage_block">

                            {level.stages.map((stage) => (
                                <div key={stage.id}>
                                    <div className="row">
                                        <div className="collapse_btn stage_btn">
                                            <button
                                                className="display"
                                                onClick={() =>
                                                    setOpenStage(openStage === stage.id ? null : stage.id)
                                                }
                                            >
                                                <span className={`arrow ${openStage === stage.id ? "open" : ""}`}>
                                                    <i className="fa-solid fa-caret-right"></i>
                                                </span>
                                            </button>

                                            {stage.name}

                                            <div>
                                                <i
                                                    className="fa-solid fa-pencil edit"
                                                    onClick={() => openEditModal("etapa", stage)}
                                                ></i>

                                                <i
                                                    className="fa-solid fa-trash delete"
                                                    onClick={() => openDeleteModal("etapa", stage)}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* LECCIONES */}
                                    {openStage === stage.id && (
                                        <div className="lesson_block">
                                            {stage.lessons.map((lesson) => (
                                                <div key={lesson.id} className="row lesson_row">
                                                    <p >{lesson.name}</p>

                                                    <div>
                                                        
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                className="add_btn"
                                                onClick={() => openModal("leccion", stage.id)}
                                            >
                                                + Agregar Lección
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                className="add_btn"
                                onClick={() => openModal("etapa", level.id)}
                            >
                                + Agregar Etapa
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* ------------------------ MODAL CREAR ------------------------ */}
            {modalOpen && (
                <div className="modal_overlay">
                    <div className="modal">
                        <h3>Agregar {modalType}</h3>

                        <form onSubmit={handleCreate}>
                            <input
                                type="text"
                                placeholder={`Nombre de ${modalType}`}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />

                            <div className="modal_actions">
                                <button type="button" onClick={() => setModalOpen(false)} className="cancel_button">Cancelar</button>
                                <button type="submit" className="confirm_btn">Crear</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ------------------------ MODAL EDITAR ------------------------ */}
            {editModalOpen && (
                <div className="modal_overlay">
                    <div className="modal">
                        <h3>Editar {selectedItem.type}</h3>

                        <form onSubmit={handleEdit}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />

                            <div className="modal_actions">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="cancel_button">Cancelar</button>
                                <button type="submit" className="confirm_btn">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ------------------------ MODAL DELETE WARNING ------------------------ */}
            {deleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal warning">
                        <h3>¿Eliminar {selectedItem.type}?</h3>
                        <p>Se eliminará permanentemente y todos sus datos relaiconados.</p>

                        <div className="modal_actions cancel_button">
                            <button type="button" onClick={() => setDeleteModalOpen(false)} >
                                Cancelar
                            </button>

                            <button className="cancel_button" onClick={handleDelete}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
