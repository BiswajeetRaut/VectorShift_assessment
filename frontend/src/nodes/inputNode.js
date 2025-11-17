// frontend/src/nodes/inputNode.js
import React, { useEffect, useState } from 'react';
import BaseNode from './BaseNode';

export default function InputNode({ id, data }) {
  const [inputName, setInputName] = useState((data && data.inputName) || id);
  const [inputType, setInputType] = useState((data && data.inputType) || 'Text');

  useEffect(() => {
    if (data && typeof data.update === 'function') {
      data.update({ inputName, inputType });
    }
  }, [inputName, inputType, data]);

  return (
    <BaseNode id={id} title="Input" outputs={[{ id: 'value' }]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12 }}>Name</label>
        <input value={inputName} onChange={(e) => setInputName(e.target.value)} style={{ padding: 6 }} />
        <label style={{ fontSize: 12 }}>Type</label>
        <select value={inputType} onChange={(e) => setInputType(e.target.value)} style={{ padding: 6 }}>
          <option>Text</option>
          <option>File</option>
          <option>Number</option>
        </select>
      </div>
    </BaseNode>
  );
}
