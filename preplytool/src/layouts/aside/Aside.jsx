import "./aside.css";
import { useState, useEffect } from "react";

export default function Aside({ onSelect }) {
    const [isloading, setIsloading] = useState(true);
    const [levelsData, setLevelsData] = useState([]);
    const [openLevel, setOpenLevel] = useState(null);
    const [openStage, setOpenStage] = useState(null);

    // ---------- CREATE ----------
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [targetId, setTargetId] = useState(null);

    const [ordenNivelCreate, setOrdenNivelCreate] = useState("");
    const [ordenEtapaCreate, setOrdenEtapaCreate] = useState("");
    const [ordenLeccionCreate, setOrdenLeccionCreate] = useState("");

    // ---------- EDIT ----------
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [ordenNivelEdit, setOrdenNivelEdit] = useState("");
    const [ordenEtapaEdit, setOrdenEtapaEdit] = useState("");
    const [ordenLeccionEdit, setOrdenLeccionEdit] = useState("");

    // ---------- DELETE ----------
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    async function fetchLevelsData() {
        const res = await fetch(
            "https://preplytool-2tgl.vercel.app/api/services/nivel/niveles/completos"
        );
        const data = await res.json();
        setLevelsData(data);
        setIsloading(false);
    }

    // ---------- CREATE REQUESTS ----------
    const postLevel = (nombre, orden) =>
        fetch("/api/services/nivel/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, orden_nivel: orden }),
        });

    const postStage = (nombre, nivel_id, orden) =>
        fetch("/api/services/etapa/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, nivel_id, orden_etapa: orden }),
        });

    const postLesson = (nombre, etapa_id, orden) =>
        fetch("/api/services/leccion/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, etapa_id, orden_leccion: orden }),
        });

    // ---------- EDIT REQUEST ----------
    const postEdit = (type, id, nombre, orden) => {
        const body = { id, nombre };
        if (type === "nivel") body.orden_nivel = orden;
        if (type === "etapa") body.orden_etapa = orden;
        if (type === "leccion") body.orden_leccion = orden;

        return fetch(`/api/services/${type}/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    };

    // ---------- DELETE ----------
    const postDelete = (type, id) =>
        fetch(`/api/services/${type}/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

    useEffect(() => {
        fetchLevelsData();
    }, []);

    // ---------- MODALS ----------
    function openModal(type, id = null) {
        setModalType(type);
        setTargetId(id);
        setInputValue("");
        setOrdenNivelCreate("");
        setOrdenEtapaCreate("");
        setOrdenLeccionCreate("");
        setModalOpen(true);
    }

    function openEditModal(type, item) {
        setSelectedItem({ ...item, type });
        setInputValue(item.name || "");
        setOrdenNivelEdit(item.orden_nivel ?? "");
        setOrdenEtapaEdit(item.orden_etapa ?? "");
        setOrdenLeccionEdit(item.orden_leccion ?? "");
        setEditModalOpen(true);
    }

    async function handleCreate(e) {
        e.preventDefault();

        if (modalType === "nivel")
            await postLevel(inputValue, Number(ordenNivelCreate));

        if (modalType === "etapa")
            await postStage(inputValue, targetId, Number(ordenEtapaCreate));

        if (modalType === "leccion")
            await postLesson(inputValue, targetId, Number(ordenLeccionCreate));

        setModalOpen(false);
        fetchLevelsData();
    }

    async function handleEdit(e) {
        e.preventDefault();

        const orden =
            selectedItem.type === "nivel"
                ? Number(ordenNivelEdit)
                : selectedItem.type === "etapa"
                ? Number(ordenEtapaEdit)
                : Number(ordenLeccionEdit);

        await postEdit(selectedItem.type, selectedItem.id, inputValue, orden);
        setEditModalOpen(false);
        fetchLevelsData();
    }

    async function handleDelete() {
        await postDelete(selectedItem.type, selectedItem.id);
        setDeleteModalOpen(false);
        fetchLevelsData();
    }

    // ---------- RENDER ----------
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
                                    className={`arrow ${
                                        openLevel === level.id ? "open" : ""
                                    }`}
                                >
                                    <i className="fa-solid fa-caret-right"></i>
                                </span>
                            </button>

                            {level.name} (#{level.orden_nivel})

                            <div>
                                <i
                                    className="fa-solid fa-pencil edit"
                                    onClick={() => openEditModal("nivel", level)}
                                ></i>
                                <i
                                    className="fa-solid fa-trash delete"
                                    onClick={() => {
                                        setSelectedItem({ ...level, type: "nivel" });
                                        setDeleteModalOpen(true);
                                    }}
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

                                            {stage.name} (#{stage.orden_etapa})

                                            <div>
                                                <i
                                                    className="fa-solid fa-pencil edit"
                                                    onClick={() =>
                                                        openEditModal("etapa", stage)
                                                    }
                                                ></i>
                                                <i
                                                    className="fa-solid fa-trash delete"
                                                    onClick={() => {
                                                        setSelectedItem({
                                                            ...stage,
                                                            type: "etapa",
                                                        });
                                                        setDeleteModalOpen(true);
                                                    }}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>

                                    {openStage === stage.id && (
                                        <div className="lesson_block">
                                            {stage.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="row lesson_row"
                                                >
                                                    <p
                                                        onClick={() =>
                                                            onSelect(`${lesson.id}`)
                                                        }
                                                    >
                                                        {lesson.name} (
                                                        #{lesson.orden_leccion})
                                                        <i
                                                            className="fa-solid fa-pencil edit"
                                                            style={{ marginLeft: "10px" }}
                                                            onClick={() =>
                                                                openEditModal(
                                                                    "leccion",
                                                                    lesson
                                                                )
                                                            }
                                                        ></i>
                                                    </p>
                                                </div>
                                            ))}

                                            <button
                                                className="add_btn"
                                                onClick={() =>
                                                    openModal("leccion", stage.id)
                                                }
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

                            {modalType === "nivel" && (
                                <input
                                    type="number"
                                    placeholder="Orden del nivel"
                                    value={ordenNivelCreate}
                                    onChange={(e) =>
                                        setOrdenNivelCreate(e.target.value)
                                    }
                                />
                            )}

                            {modalType === "etapa" && (
                                <input
                                    type="number"
                                    placeholder="Orden de la etapa"
                                    value={ordenEtapaCreate}
                                    onChange={(e) =>
                                        setOrdenEtapaCreate(e.target.value)
                                    }
                                />
                            )}

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

                            {selectedItem.type === "nivel" && (
                                <input
                                    type="number"
                                    value={ordenNivelEdit}
                                    onChange={(e) =>
                                        setOrdenNivelEdit(e.target.value)
                                    }
                                    placeholder="Orden del nivel"
                                />
                            )}

                            {selectedItem.type === "etapa" && (
                                <input
                                    type="number"
                                    value={ordenEtapaEdit}
                                    onChange={(e) =>
                                        setOrdenEtapaEdit(e.target.value)
                                    }
                                    placeholder="Orden de la etapa"
                                />
                            )}

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
                        <p>
                            Se eliminará permanentemente y todos sus datos
                            relacionados.
                        </p>

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
