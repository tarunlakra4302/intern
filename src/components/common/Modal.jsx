import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = ""
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const sizeClasses = {
    sm: 'modal-box w-11/12 max-w-md',
    md: 'modal-box w-11/12 max-w-2xl',
    lg: 'modal-box w-11/12 max-w-4xl',
    xl: 'modal-box w-11/12 max-w-6xl',
    full: 'modal-box w-11/12 max-w-7xl max-h-[90vh]'
  };

  return (
    <dialog
      ref={modalRef}
      className="modal modal-bottom sm:modal-middle"
      onClose={handleClose}
    >
      <div className={`${sizeClasses[size]} ${className}`} onClick={handleBackdropClick}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="font-bold text-lg text-base-content">{title}</h3>
          )}
          {showCloseButton && (
            <button
              className="btn btn-sm btn-circle btn-ghost ml-auto"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {children}
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeOnBackdropClick ? handleClose : undefined}>close</button>
      </form>
    </dialog>
  );
};

const ModalHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const ModalBody = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const ModalFooter = ({ children, className = "" }) => (
  <div className={`flex justify-end gap-2 mt-6 ${className}`}>
    {children}
  </div>
);

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;