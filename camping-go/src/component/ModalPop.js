import Modal from "react-modal";
import { useState } from "react";

function ModalPop(modalIsOpen, setIsOpen) {
  // const [modalIsOpen, setIsOpen] = useState(false);
  return (
    <div className='App'>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName={{
          base: "overlay-base",
          afterOpen: "overlay-after",
          beforeClose: "overlay-before",
        }}
        className={{
          base: "content-base",
          afterOpen: "content-after",
          beforeClose: "content-before",
        }}
        closeTimeoutMS={500}></Modal>
    </div>
  );
}

export default ModalPop;
