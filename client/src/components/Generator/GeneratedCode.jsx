import { useState } from 'react';
import PropTypes from 'prop-types';

const TABS = ['model', 'controller', 'route'];

const TAB_LABELS = {
  model: 'Model',
  controller: 'Controller',
  route: 'Routes',
};

const FILE_NAMES = {
  model: (name) => `models/${name}.js`,
  controller: (name) => `controllers/${name}Controller.js`,
  route: (name) =>
    `routes/${name
      .replace(/([A-Z])/g, (m, l, offset) => (offset ? '-' : '') + l)
      .toLowerCase()}Routes.js`,
};

const GeneratedCode = ({ modelName, code, onDownload }) => {
  const [activeTab, setActiveTab] = useState('model');
  const [copied, setCopied] = useState(false);

  // Copy the currently visible tab's source code to the clipboard,
  // then briefly show a "✓ Copied" confirmation label.
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="generated-code">
      <div className="code-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`code-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="code-header">
        <span className="code-filename">{FILE_NAMES[activeTab](modelName)}</span>
        <div className="code-actions">
          <button type="button" className="btn-copy" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          {onDownload && (
            <button
              type="button"
              className="btn-download"
              onClick={() => onDownload(activeTab, code[activeTab], modelName)}
            >
              Download
            </button>
          )}
        </div>
      </div>

      <pre className="code-block">
        <code>{code[activeTab]}</code>
      </pre>
    </div>
  );
};

GeneratedCode.propTypes = {
  modelName: PropTypes.string.isRequired,
  code: PropTypes.shape({
    model: PropTypes.string.isRequired,
    controller: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
  }).isRequired,
  onDownload: PropTypes.func,
};

export default GeneratedCode;
