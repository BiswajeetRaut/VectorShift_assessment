// frontend/src/nodes/llmNode.js
import React from 'react';
import BaseNode from './BaseNode';

export default function LLMNode({ id, data }) {
  const inputs = [{ id: 'system' }, { id: 'prompt' }];
  const outputs = [{ id: 'response' }];

  return (
    <BaseNode id={id} title="LLM" inputs={inputs} outputs={outputs}>
      <div style={{ fontSize: 13 }}>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>LLM</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>Model settings and options</div>
      </div>
    </BaseNode>
  );
}
