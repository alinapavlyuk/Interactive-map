import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type ActionButtonsProps = {
  isDisabled: boolean;
  onSave: () => void;
  onCancel: () => void;
  onAdd: () => void;
};

export default function ActionButtons({
  isDisabled,
  onSave,
  onCancel,
  onAdd,
}: ActionButtonsProps) {
  return (
    <>
      <div id="confirm-changes-buttons">
        <button disabled={isDisabled} onClick={onSave}>
          Save
        </button>
        <button disabled={isDisabled} onClick={onCancel}>
          Cancel
        </button>
      </div>
      <button id="add-button" onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </>
  );
}
