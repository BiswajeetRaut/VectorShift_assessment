// src/submit.js
import React from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

/**
 * SubmitButton - fetches nodes & edges from store and posts to backend.
 * Ensures edges include handle-level fields (sourceHandle / targetHandle) when available.
 */
export const SubmitButton = () => {
  const { nodes, edges } = useStore((s) => ({ nodes: s.nodes || [], edges: s.edges || [] }), shallow);

  const normalizeEdges = (edgesList) => {
    // Ensure shape: { id, source, target, sourceHandle?, targetHandle?, ... }
    return edgesList.map((e, i) => {
      // if edge is a reactflow-style object, it may already contain sourceHandle/targetHandle
      const id = e.id ?? `e-${i}-${e.source ?? 's'}-${e.target ?? 't'}`;
      return {
        id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? e.sourceHandleId ?? null,
        targetHandle: e.targetHandle ?? e.targetHandleId ?? null,
        // preserve any other metadata
        ...(e.data ? { data: e.data } : {}),
      };
    });
  };

  const handleSubmit = async () => {
    const payload = {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        data: n.data ?? {},
        position: n.position ?? {},
      })),
      edges: normalizeEdges(edges),
    };

    try {
      const resp = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
      const data = await resp.json();
      alert(`Pipeline summary:\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${data.is_dag}`);
    } catch (err) {
      alert(`Failed to submit pipeline: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 12 }}>
      <button className="vs-submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};
