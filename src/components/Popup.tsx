import "./Popup.css"

interface PopupProps {
    title?: string,
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
}

export default function Popup({ title = "Logout", isOpen, onClose, onConfirm }: PopupProps) {
    if (!isOpen) return null;
    return (
        <>
            return (
            <div className="popup-overlay">
                <div className="popup-container">
                    <p>Are you sure you want to {title}?</p>

                    <div className="popup-actions">
                        <button className="popup-btn confirm" onClick={onConfirm}>
                            {title}
                        </button>

                        <button className="popup-btn cancel" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            );
        </>
    )
}