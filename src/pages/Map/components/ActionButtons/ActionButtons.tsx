import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type ActionButtonsProps = {
  isDisabled: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export default function ActionButtons({
  isDisabled,
  onSave,
  onCancel,
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
      <button id="add-button">
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </>
  );
}
