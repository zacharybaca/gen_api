import PropTypes from 'prop-types';

const FIELD_TYPES = ['String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Mixed'];

const FieldRow = ({ index, field, onChange, onRemove, canRemove }) => {
  // Propagate a single key/value change to the parent's field list
  const handleChange = (key, value) => {
    onChange(index, { ...field, [key]: value });
  };

  return (
    <div className="field-row">
      <input
        className="field-input"
        type="text"
        placeholder="Field name"
        value={field.name}
        onChange={(e) => handleChange('name', e.target.value)}
        aria-label={`Field ${index + 1} name`}
      />

      <select
        className="field-select"
        value={field.type}
        onChange={(e) => handleChange('type', e.target.value)}
        aria-label={`Field ${index + 1} type`}
      >
        {FIELD_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <label className="field-required-label">
        <input
          type="checkbox"
          checked={!!field.required}
          onChange={(e) => handleChange('required', e.target.checked)}
          aria-label={`Field ${index + 1} required`}
        />
        Required
      </label>

      {canRemove && (
        <button
          type="button"
          className="btn-remove-field"
          onClick={() => onRemove(index)}
          aria-label={`Remove field ${index + 1}`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

FieldRow.propTypes = {
  index: PropTypes.number.isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    required: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  canRemove: PropTypes.bool.isRequired,
};

export default FieldRow;
