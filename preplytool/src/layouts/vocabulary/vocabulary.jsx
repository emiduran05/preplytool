import { useEffect, useState } from "react";
import "./vocabulary.css";

export default function Vocabulary({ lessonId }) {
    const [input, setInput] = useState("");
    const [words, setWords] = useState([]);

    // 🔹 Obtener vocabulario de la lección
    const fetchVocabulary = async () => {
        if (!lessonId) return;

        try {
            const response = await fetch(
                `https://preplytool-2tgl.vercel.app/api/vocabulario/${lessonId}`
            );

            if (!response.ok) throw new Error();

            const data = await response.json();
            setWords(data.map(item => item.palabra));
        } catch (error) {
            console.error("Error al obtener vocabulario", error);
        }
    };

    useEffect(() => {
        fetchVocabulary();
    }, [lessonId]);

    // 🔹 Manejo del input
    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        const separatedWords = value
            .split(",")
            .map(word => word.trim())
            .filter(word => word !== "");

        setWords(separatedWords);
    };

    // 🔹 Guardar vocabulario
    const handleSubmit = async () => {
        if (!lessonId || words.length === 0) return;

        try {
            const response = await fetch(
                `https://preplytool-2tgl.vercel.app/api/vocabulario/${lessonId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ vocabulary: words })
                }
            );

            if (!response.ok) throw new Error();

            alert("✅ Vocabulario guardado correctamente");
            setInput("");
            fetchVocabulary();

        } catch (error) {
            alert("❌ Error al guardar vocabulario");
        }
    };

    // 🔹 Eliminar palabra
    const handleDelete = async (word) => {
        try {
            const response = await fetch(
                `https://preplytool-2tgl.vercel.app/api/vocabulario/${lessonId}/${word}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) throw new Error();

            alert("🗑️ Palabra eliminada");
            fetchVocabulary();

        } catch (error) {
            alert("❌ Error al eliminar palabra");
        }
    };

    return (
        <div
            style={{
                width: "500px",
                margin: "0 auto",
                display: "flex",
                gap: "10px",
                flexDirection: "column"
            }}
        >
            <h3 align="center">Agregar vocabulario</h3>

            <input
                type="text"
                placeholder="Ej: palabra1, palabra2, palabra3"
                value={input}
                onChange={handleChange}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px"
                }}
            />

            {words.length > 0 && (
                <div className="general_voc">
                    {words.map((word, index) => (
                        <div className="vocabulary_words" key={index}>
                            {word}
                            <button
                                style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                    background: "transparent",
                                    border: "none",
                                    color: "red"
                                }}
                                onClick={() => handleDelete(word)}
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                style={{
                    padding: "5px",
                    backgroundColor: "#4048b5",
                    color: "#fff",
                    cursor: "pointer"
                }}
                onClick={handleSubmit}
            >
                Guardar vocabulario
            </button>
        </div>
    );
}
