// src/components/CustomEdge.jsx
import React from 'react';
import { getSmoothStepPath } from 'reactflow';
import { useStore } from '../store';

/**
 * CustomEdge - renders a smoothstep edge path and a small delete button at the edge center.
 *
 * Props (from reactflow): id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd
 */
export default function CustomEdge(props) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
  } = props;

  // path for a smooth step curve (matches reactflow's smoothstep)
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // compute center point (midpoint) for placing the delete button
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  const removeEdge = useStore((s) => s.removeEdge);

  const handleDelete = (e) => {
    e.stopPropagation();
    // call store helper to remove the edge by id
    removeEdge(id);
  };

  return (
    <>
      {/* Edge path */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        strokeWidth={2}
        stroke={selected ? 'rgba(124,92,255,0.9)' : 'rgba(255,255,255,0.7)'}
        fill="none"
        opacity={0.95}
      />

      {/* Delete button positioned at the center of the edge */}
      <foreignObject width={40} height={40} x={centerX - 20} y={centerY - 20} style={{ overflow: 'visible' }}>
        <div
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto', // ensure button receives clicks
          }}
        >
          <button
            onClick={handleDelete}
            title="Delete connection"
            className={`edge-delete-btn ${selected ? 'selected' : ''}`}
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 14px rgba(2,6,23,0.3)',
              background: selected ? 'linear-gradient(90deg,#7c5cff,#6ea8ff)' : 'rgba(0,0,0,0.45)',
              color: '#fff',
              fontSize: 12,
              transform: 'translateY(-2px)',
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            ✕
          </button>
        </div>
      </foreignObject>
    </>
  );
}
