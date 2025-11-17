// frontend/src/utils/createDemoPipeline.js
import { useStore } from '../store';

/**
 * createDemoPipeline()
 * - creates 3 nodes: Input -> Text -> LLM
 * - connects Input.value -> Text.var-name
 * - connects Text.output -> LLM.prompt
 *
 * Safe: uses store.getState() under the hood to perform actions immediately.
 */
export function createDemoPipeline() {
  const store = useStore.getState();

  // create Input node
  const inputId = store.getNodeID('customInput'); // e.g., "input-1"
  store.addNode({
    id: inputId,
    type: 'customInput', // must match nodeTypes mapping
    position: { x: 40, y: 40 },
    data: { inputName: 'name', inputType: 'Text' },
  });

  // create Text node that uses {{name}}
  const textId = store.getNodeID('text'); // e.g., "text-1"
  store.addNode({
    id: textId,
    type: 'text',
    position: { x: 360, y: 40 },
    data: { text: 'Hello {{name}}' },
  });

  // create LLM node
  const llmId = store.getNodeID('llm');
  store.addNode({
    id: llmId,
    type: 'llm',
    position: { x: 680, y: 40 },
    data: {},
  });

  // Connect Input -> Text (Input's output handle is "value"; Text's var handle is "var-name")
  store.onConnect({
    source: inputId,
    target: textId,
    sourceHandle: `${inputId}-value`,
    targetHandle: `${textId}-var-name`,
  });

  // Connect Text -> LLM (Text output -> LLM prompt)
  store.onConnect({
    source: textId,
    target: llmId,
    sourceHandle: `${textId}-output`,
    targetHandle: `${llmId}-prompt`,
  });
}
