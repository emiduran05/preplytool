import "./aside.css";
import { useState, useEffect } from "react";

export default function Aside({ onSelect }) {
    const [isloading, setIsloading] = useState(true);
    const [levelsData, setLevelsData] = useState([]);
    const [openLevel, setOpenLevel] = useState(null);
    const [openStage, setOpenStage] = useState(null);

    // --- Creation Modal ---
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [targetId, setTargetId] = useState(null);
    const [ordenLeccionCreate, setOrdenLeccionCreate] = useState("");

    // --- Edit Modal ---
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [ordenLeccionEdit, setOrdenLeccionEdit] = useState("");

    // --- Delete Modal ---
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    async function fetchLevelsData() {
        try {
            const res = await fetch(
                "https://preplytool-2tgl.vercel.app/api/services/nivel/niveles/completos"
            );
            const data = await res.json();
            setLevelsData(data);
            setIsloading(false);
        } catch (err) {
            console.error("Error:", err);
        }
    }

    // ---------- CREATE ----------
    async function postLevel(name) {
        return fetch("https://preplytool-2tgl.vercel.app/api/services/nivel/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: name }),
        });
    }

    async function postStage(name, nivelId) {
        return fetch("https://preplytool-2tgl.vercel.app/api/services/etapa/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: name, nivel_id: nivelId }),
        });
    }

    async function postLesson(name, etapaId, ordenLeccion) {
        console.log("🟢 FRONT CREATE LECCION:", {
            name,
            etapaId,
            ordenLeccion,
            type: typeof ordenLeccion,
        });

        return fetch(
            "https://preplytool-2tgl.vercel.app/api/services/leccion/create",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: name,
                    etapa_id: etapaId,
                    orden_leccion: ordenLeccion,
                }),
            }
        );
    }

    // ---------- EDIT ----------
    async function postEdit(type, id, name, ordenLeccion) {
        const body = { id, nombre: name };

        if (type === "leccion") {
            body.orden_leccion = ordenLeccion;
        }

        console.log("🟢 FRONT UPDATE:", body);

        return fetch(
            `https://preplytool-2tgl.vercel.app/api/services/${type}/update`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );
    }

    // ---------- DELETE ----------
    async function postDelete(type, id) {
        return fetch(
            `https://preplytool-2tgl.vercel.app/api/services/${type}/delete`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            }
        );
    }

    useEffect(() => {
        fetchLevelsData();
    }, []);

    // ---------- MODALS ----------
    function openModal(type, id = null) {
        setModalType(type);
        setTargetId(id);
        setInputValue("");
        setOrdenLeccionCreate("");
        setModalOpen(true);
    }

    function openEditModal(type, item) {
        setSelectedItem({ ...item, type });
        setInputValue(item.name || "");
        setOrdenLeccionEdit(item.orden ?? "");
        setEditModalOpen(true);
    }

    function openDeleteModal(type, item) {
        setSelectedItem({ ...item, type });
        setDeleteModalOpen(true);
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!inputValue.trim()) return;

        if (modalType === "nivel") await postLevel(inputValue);
        if (modalType === "etapa") await postStage(inputValue, targetId);

        if (modalType === "leccion") {
            if (ordenLeccionCreate === "") {
                alert("Debes indicar el orden de la lección");
                return;
            }

            await postLesson(
                inputValue,
                targetId,
                Number(ordenLeccionCreate)
            );
        }

        setModalOpen(false);
        fetchLevelsData();
    }

    async function handleEdit(e) {
        e.preventDefault();
        if (!inputValue.trim()) return;

        await postEdit(
            selectedItem.type,
            selectedItem.id,
            inputValue,
            selectedItem.type === "leccion"
                ? Number(ordenLeccionEdit)
                : undefined
        );

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
            {!isloading && openLevel === null && (
                <button className="add_btn_global" onClick={() => openModal("nivel")}>
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
                                <span
                                    className={`arrow ${openLevel === level.id ? "open" : ""}`}
                                >
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

                    {openLevel === level.id && (
                        <div className="stage_block">
                            {level.stages.map((stage) => (
                                <div key={stage.id}>
                                    <div className="row">
                                        <div className="collapse_btn stage_btn">
                                            <button
                                                className="display"
                                                onClick={() =>
                                                    setOpenStage(
                                                        openStage === stage.id ? null : stage.id
                                                    )
                                                }
                                            >
                                                <span
                                                    className={`arrow ${
                                                        openStage === stage.id ? "open" : ""
                                                    }`}
                                                >
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

                                    {openStage === stage.id && (
                                        <div className="lesson_block">
                                            {stage.lessons.map((lesson) => (
                                                <div key={lesson.id} className="row lesson_row">
                                                    <p
                                                        style={{
                                                            display: "inline-block",
                                                            marginRight: "20px",
                                                        }}
                                                        onClick={() => onSelect(`${lesson.id}`)}
                                                    >
                                                        {lesson.name} (#{lesson.orden_leccion})
                                                        <span style={{ marginLeft: "10px" }}>
                                                            <i
                                                                className="fa-solid fa-pencil edit"
                                                                onClick={() =>
                                                                    openEditModal("leccion", lesson)
                                                                }
                                                            ></i>
                                                        </span>
                                                    </p>
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

            {/* -------- MODAL CREAR -------- */}
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

                            {modalType === "leccion" && (
                                <input
                                    type="number"
                                    placeholder="Orden de la lección"
                                    value={ordenLeccionCreate}
                                    onChange={(e) =>
                                        setOrdenLeccionCreate(e.target.value)
                                    }
                                />
                            )}

                            <div className="modal_actions">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="cancel_button"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="confirm_btn">
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* -------- MODAL EDITAR -------- */}
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

                            {selectedItem.type === "leccion" && (
                                <input
                                    type="number"
                                    value={ordenLeccionEdit}
                                    onChange={(e) =>
                                        setOrdenLeccionEdit(e.target.value)
                                    }
                                    placeholder="Orden de la lección"
                                />
                            )}

                            <div className="modal_actions">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="cancel_button"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="confirm_btn">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* -------- MODAL DELETE -------- */}
            {deleteModalOpen && (
                <div className="modal_overlay">
                    <div className="modal warning">
                        <h3>¿Eliminar {selectedItem.type}?</h3>
                        <p>Se eliminará permanentemente y todos sus datos relacionados.</p>

                        <div className="modal_actions cancel_button">
                            <button onClick={() => setDeleteModalOpen(false)}>
                                Cancelar
                            </button>
                            <button onClick={handleDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
