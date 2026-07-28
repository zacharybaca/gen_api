import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth.js';
import FieldRow from './FieldRow.jsx';
import GeneratedCode from './GeneratedCode.jsx';
import './schema-builder.css';

const DEFAULT_FIELD = { name: '', type: 'String', required: false };

const SchemaBuilder = () => {
  const { user } = useAuth();

  const [modelName, setModelName] = useState('');
  const [fields, setFields] = useState([{ ...DEFAULT_FIELD }]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [generatedModelName, setGeneratedModelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [writeToFs, setWriteToFs] = useState(false);

  const handleFieldChange = (index, updatedField) => {
    setFields((prev) => prev.map((f, i) => (i === index ? updatedField : f)));
  };

  const handleAddField = () => {
    setFields((prev) => [...prev, { ...DEFAULT_FIELD }]);
  };

  const handleRemoveField = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownload = (fileType, content, name) => {
    const kebab = name
      .replace(/([A-Z])/g, (m, l, offset) => (offset ? '-' : '') + l)
      .toLowerCase();
    const suffixes = {
      model: `${name}.js`,
      controller: `${name}Controller.js`,
      route: `${kebab}Routes.js`,
    };
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = suffixes[fileType];
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = modelName.trim();
    if (!trimmedName) {
      toast.error('Model name is required.');
      return;
    }
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(trimmedName)) {
      toast.error(
        'Model name must start with a letter and contain only alphanumeric characters.',
      );
      return;
    }

    const validFields = fields.filter((f) => f.name.trim());
    if (validFields.length === 0) {
      toast.error('At least one field with a name is required.');
      return;
    }

    // Validate field names match the backend's identifier rules
    const identifierRe = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    const seenNames = new Set();
    for (const f of validFields) {
      if (!identifierRe.test(f.name)) {
        toast.error(
          `"${f.name}" is not a valid field name. Use letters, digits, _ or $ (must not start with a digit).`,
        );
        return;
      }
      if (seenNames.has(f.name.toLowerCase())) {
        toast.error(`Duplicate field name: "${f.name}"`);
        return;
      }
      seenNames.add(f.name.toLowerCase());
    }

    const endpoint = writeToFs
      ? '/api/generator/generate'
      : '/api/generator/preview';

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ modelName: trimmedName, fields: validFields }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Generation failed');
      }

      setGeneratedCode(data.code);
      setGeneratedModelName(
        trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1),
      );

      toast.success(
        writeToFs
          ? `Files generated for "${trimmedName}"!`
          : 'Preview ready — review and download individual files.',
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setModelName('');
    setFields([{ ...DEFAULT_FIELD }]);
    setGeneratedCode(null);
    setGeneratedModelName('');
  };

  return (
    <div className="schema-builder">
      <div className="schema-builder-header">
        <h1>API Creator</h1>
        <p className="schema-builder-subtitle">
          Define a data model and generate a Mongoose model, Express controller,
          and router — ready to drop into your project.
        </p>
        {!user && (
          <p className="schema-builder-auth-notice">
            Log in to write generated files directly to disk.
          </p>
        )}
      </div>

      <form className="schema-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <label className="form-label" htmlFor="modelName">
            Model Name
          </label>
          <input
            id="modelName"
            className="model-name-input"
            type="text"
            placeholder="e.g. BlogPost"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
          />
          <p className="field-hint">PascalCase recommended — e.g. BlogPost, ProductReview</p>
        </div>

        <div className="form-section">
          <h2 className="fields-heading">Fields</h2>
          <div className="fields-list">
            {fields.map((field, index) => (
              <FieldRow
                key={index}
                index={index}
                field={field}
                onChange={handleFieldChange}
                onRemove={handleRemoveField}
                canRemove={fields.length > 1}
              />
            ))}
          </div>
          <button
            type="button"
            className="btn-add-field"
            onClick={handleAddField}
          >
            + Add Field
          </button>
        </div>

        {user && (
          <div className="form-section write-option">
            <label className="write-toggle-label">
              <input
                type="checkbox"
                checked={writeToFs}
                onChange={(e) => setWriteToFs(e.target.checked)}
              />
              Write files to server disk (
              <code>server/generated/</code>)
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-generate" disabled={loading}>
            {loading ? 'Generating…' : writeToFs ? 'Generate & Save' : 'Preview Code'}
          </button>
          {generatedCode && (
            <button
              type="button"
              className="btn-reset"
              onClick={handleReset}
            >
              Start Over
            </button>
          )}
        </div>
      </form>

      {generatedCode && (
        <div className="generated-output">
          <GeneratedCode
            modelName={generatedModelName}
            code={generatedCode}
            onDownload={handleDownload}
          />
        </div>
      )}
    </div>
  );
};

export default SchemaBuilder;
