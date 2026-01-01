import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import QuillBetterTable from "quill-better-table";

// Registrar SOLO UNA VEZ
if (!Quill.imports["modules/imageResize"]) {
  Quill.register("modules/imageResize", ImageResize);
}

if (!Quill.imports["modules/better-table"]) {
  Quill.register("modules/better-table", QuillBetterTable);
}

export default Quill;
