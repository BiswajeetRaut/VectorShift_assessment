// frontend/src/nodes/BaseNode.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import '../index.css';
import { useStore } from '../store';

export default function BaseNode({ id, title, inputs = [], outputs = [], children, style = {} }) {
  const removeNode = useStore((s) => s.removeNode);

  const handleDelete = (e) => {
    e.stopPropagation(); // avoid selecting the node when clicking delete
    // confirmation
    const ok = window.confirm('Delete this node and its connections?');
    if (!ok) return;
    removeNode(id);
  };

  return (
    <div className="vs-node" style={style} data-nodeid={id}>
      <div className="vs-node__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <i aria-hidden="true" style={{ width: 18, height: 18, borderRadius: 6, background: 'linear-gradient(90deg,#6ea8ff,#7c5cff)' }} />
          <div>{title}</div>
        </div>

        {/* delete button */}
        <button
          aria-label={`Delete node ${id}`}
          onClick={handleDelete}
          className="node-delete-btn"
          title="Delete node"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 6,
          }}
        >
          🗑
        </button>
      </div>

      <div className="vs-node__body">{children}</div>

      {inputs.map((h, i) => (
        <Handle
          key={`in-${h.id}`}
          type="target"
          position={Position.Left}
          id={`${id}-${h.id}`}
          style={{ top: h.top || `${10 + i * 20}px` }}
        />
      ))}

      {outputs.map((h, i) => (
        <Handle
          key={`out-${h.id}`}
          type="source"
          position={Position.Right}
          id={`${id}-${h.id}`}
          style={{ top: h.top || `${10 + i * 20}px` }}
        />
      ))}
    </div>
  );
}
