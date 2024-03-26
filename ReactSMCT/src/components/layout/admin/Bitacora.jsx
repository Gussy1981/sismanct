import React, { useEffect, useState } from "react";
import { MdDelete, MdEditDocument } from "react-icons/md";
import Swal from "sweetalert2";
import { Table } from "react-bootstrap";

import {
  getBitacoras,
  updateBitacora,
  saveBitacora,
  deleteBitacora,
} from "../../configuracion/api";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { DateTime } from "luxon";

const Bitacora = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  const data = async () => {
    const entriesData = await getBitacoras();
    console.log(entriesData);
    setEntries(entriesData.bitacora);
    setLoading(false);
  };

  useEffect(() => {
    data();
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
      // Actualiza el contenido del editor cuando selectedEntry cambia
      editor.chain().setContent(selectedEntry.content).focus().run();
    }
  }, [selectedEntry, editor]);

  const handleSave = async () => {
    try {
      const savedContent = editor.getHTML();
      if (selectedEntry) {
        // si hay una entrada seleccionada, obtener el id y actualizar
        const bitacoraId = selectedEntry._id;
        console.log("id antes de pasar al metodo de api" + bitacoraId);
        const newContent = savedContent;
        console.log("content antes de pasar al metodo " + newContent);
        await updateBitacora(bitacoraId, newContent);
      } else {
        // si no hay una entrada seleccionada, crear una nueva
        await saveBitacora({ content: savedContent });
      }

      // refrescar la lista de entradas después de guardar
      const response = await getBitacoras();
      setEntries(response.bitacora);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (bitacoraId, bitacoraFecha) => {
    Swal.fire({
      title: `¿Estás seguro que quieres eliminar la bitacora del ${bitacoraFecha}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBitacora(bitacoraId)
          .then((response) => {
            if (response.status === "Success") {
              Swal.fire("¡Bitacora eliminada!", "", "success");
              data(); // Actualiza la lista de bitacoras después de la eliminación
            } else {
              Swal.fire("Error", response.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(
              "Error",
              "Hubo un problema al eliminar la bitacora",
              "error"
            );
          });
      }
    });
  };

  return (
    <div className="flex p-3">
      <div className="w-4/5">
        <RichTextEditor
          editor={editor}
          className=" text-orange-300"
        >
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
        <button
          className={
            selectedEntry
              ? "bg-green-500 text-white p-2 mt-2  rounded"
              : "bg-blue-500 text-white p-2 mt-2  rounded"
          }
          onClick={handleSave}
        >
          {selectedEntry ? "Actualizar Bitacora" : "Guardar Bitacora"}
        </button>
      </div>
      <div className="w-1/5 ml-4">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div>
            <p>Bitacoras guardadas:</p>
            <div className="pt-4">
              <Table hover variant="dark">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Modificar</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    entries.map((entry) => {
                      const fechaFormateada = DateTime.fromISO(entry.fecha).toFormat(
                        "dd-MM-yyyy"
                      );
                      return (
                        <tr key={entry._id}>
                          <td className="text-xs">{fechaFormateada}</td>
                          <td>
                            <button
                              className=" text-yellow-600 font-bold h5"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <MdEditDocument />
                            </button>
                          </td>
                          <td>
                            <button
                              className=" text-red-600 font-bold h5"
                              onClick={() => handleDelete(entry._id, fechaFormateada)}
                            >
                              <MdDelete />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div >
        )}
      </div>
    </div>
  );
};
export default Bitacora;
