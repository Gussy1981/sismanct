import React, { useEffect, useState, useMemo } from "react";
import {
  getBitacoras,
  updateBitacora,
  saveBitacora,
} from "../../configuracion/api";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { DateTime } from "luxon";

const stripHtml = (html) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getExcerpt = (plainText, searchTerm, maxLength = 80) => {
  if (!searchTerm) return plainText.slice(0, maxLength) + (plainText.length > maxLength ? "…" : "");
  const idx = plainText.toLowerCase().indexOf(searchTerm.toLowerCase());
  if (idx === -1) return plainText.slice(0, maxLength) + (plainText.length > maxLength ? "…" : "");
  const start = Math.max(0, idx - 20);
  const end = Math.min(plainText.length, idx + searchTerm.length + 40);
  const excerpt = (start > 0 ? "…" : "") + plainText.slice(start, end) + (end < plainText.length ? "…" : "");
  // Resaltar el término encontrado
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return excerpt.replace(regex, "<mark>$1</mark>");
};

const Bitacora = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = async () => {
    const entriesData = await getBitacoras();
    setEntries(entriesData.bitacora);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: selectedEntry ? selectedEntry.content : "",
  });

  useEffect(() => {
    if (editor && selectedEntry) {
      editor.chain().setContent(selectedEntry.content).focus().run();
    }
  }, [selectedEntry, editor]);

  const handleSave = async () => {
    try {
      const savedContent = editor.getHTML();
      if (selectedEntry) {
        await updateBitacora(selectedEntry._id, savedContent);
      } else {
        await saveBitacora({ content: savedContent });
      }
      const response = await getBitacoras();
      setEntries(response.bitacora);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewEntry = () => {
    setSelectedEntry(null);
    if (editor) editor.chain().setContent("").focus().run();
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Filtro por texto
      if (searchTerm.trim()) {
        const plain = stripHtml(entry.content || "");
        if (!plain.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      }
      // Filtro por fecha desde
      if (dateFrom) {
        const from = DateTime.fromISO(dateFrom).startOf("day");
        const entryDate = DateTime.fromISO(entry.fecha);
        if (entryDate < from) return false;
      }
      // Filtro por fecha hasta
      if (dateTo) {
        const to = DateTime.fromISO(dateTo).endOf("day");
        const entryDate = DateTime.fromISO(entry.fecha);
        if (entryDate > to) return false;
      }
      return true;
    });
  }, [entries, searchTerm, dateFrom, dateTo]);

  const hasFilters = searchTerm.trim() || dateFrom || dateTo;

  return (
    <div className="flex p-3 gap-4">
      {/* Editor principal */}
      <div className="w-4/5">
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Hr />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content className="p-3 text-gray-50 bg-slate-700 rounded" />
        </RichTextEditor>

        <div className="flex gap-2 mt-2">
          <button
            className={selectedEntry ? "bg-green-500 text-white p-2 rounded" : "bg-blue-500 text-white p-2 rounded"}
            onClick={handleSave}
          >
            {selectedEntry ? "Actualizar Bitácora" : "Guardar Bitácora"}
          </button>
          {selectedEntry && (
            <button className="bg-gray-400 text-white p-2 rounded" onClick={handleNewEntry}>
              Nueva entrada
            </button>
          )}
        </div>
      </div>

      {/* Sidebar con buscador y lista */}
      <div className="w-1/5 flex flex-col gap-3">
        {/* Buscador de texto */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Buscar en contenido</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej: bomba hidráulica..."
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-cyan-600"
          />
        </div>

        {/* Filtro por rango de fechas */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-cyan-600"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-cyan-600"
          />
        </div>

        {/* Limpiar filtros */}
        {hasFilters && (
          <button
            onClick={() => { setSearchTerm(""); setDateFrom(""); setDateTo(""); }}
            className="text-xs text-red-500 underline text-left"
          >
            Limpiar filtros
          </button>
        )}

        {/* Lista de entradas */}
        <div>
          {loading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-1">
                {hasFilters
                  ? `${filteredEntries.length} resultado${filteredEntries.length !== 1 ? "s" : ""} de ${entries.length}`
                  : `${entries.length} entrada${entries.length !== 1 ? "s" : ""}`}
              </p>
              <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {filteredEntries.length === 0 ? (
                  <li className="text-sm text-gray-400 italic">Sin resultados.</li>
                ) : (
                  filteredEntries.map((entry) => {
                    const fechaFormateada = DateTime.fromISO(entry.fecha).toFormat("dd-MM-yyyy");
                    const plain = stripHtml(entry.content || "");
                    const excerpt = getExcerpt(plain, searchTerm);
                    const isSelected = selectedEntry?._id === entry._id;

                    return (
                      <li
                        key={entry._id}
                        onClick={() => setSelectedEntry(entry)}
                        className={`cursor-pointer p-2 border rounded text-sm transition-colors ${
                          isSelected
                            ? "border-cyan-600 bg-cyan-50"
                            : "border-gray-200 hover:border-cyan-400 hover:bg-gray-50"
                        }`}
                      >
                        <p className="font-semibold text-cyan-800 mb-1">{fechaFormateada}</p>
                        <p
                          className="text-gray-500 text-xs leading-snug"
                          dangerouslySetInnerHTML={{ __html: excerpt }}
                        />
                      </li>
                    );
                  })
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bitacora;
