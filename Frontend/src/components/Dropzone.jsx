import React, { useEffect, useRef } from "react";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css"; // Importez le fichier CSS de Dropzone
import PropTypes from "prop-types"; // Importer PropTypes

const CustomDropzone = ({ onFileAdded }) => {
  const dropzoneRef = useRef(null);

  useEffect(() => {
    Dropzone.autoDiscover = false;

    const dropzone = new Dropzone(dropzoneRef.current, {
      url: "/target",
      autoProcessQueue: false,
      init: function() {
        this.on("addedfile", file => {
          onFileAdded(file);
        });
      }
    });

    return () => {
      dropzone.destroy();
    };
  }, [onFileAdded]);

  return (
    <form ref={dropzoneRef} className="dropzone" id="my-dropzone">
      <div className="dz-message"> Click to select files</div>
    </form>
  );
};

// Ajouter la validation des props
CustomDropzone.propTypes = {
  onFileAdded: PropTypes.func.isRequired
};

export default CustomDropzone;