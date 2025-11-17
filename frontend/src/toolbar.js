// toolbar.js

import { DraggableNode } from './draggableNode';

import { createDemoPipeline } from './utils/createDemoPipeline';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <button
                    className="toolbar-item"
                    onClick={() => createDemoPipeline()}
                    title="Add demo nodes"
                    style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer' }}
                >
                    Add Demo Pipeline
                </button>
            </div>
        </div>
    );
};
