// frontend/src/nodes/outputNode.js
import React, { useEffect, useState } from 'react';
import BaseNode from './BaseNode';

export default function OutputNode({ id, data }) {
  const [name, setName] = useState((data && data.name) || id);
  const [type, setType] = useState((data && data.type) || 'Text');

  useEffect(() => {
    if (data && typeof data.update === 'function') {
      data.update({ name, type });
    }
  }, [name, type, data]);

  return (
    <BaseNode id={id} title="Output" inputs={[{ id: 'value' }]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12 }}>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 6 }} />
        <label style={{ fontSize: 12 }}>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: 6 }}>
          <option>Text</option>
          <option>JSON</option>
          <option>Image</option>
        </select>
      </div>
    </BaseNode>
  );
}
