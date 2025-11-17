// src/nodes/textNode.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BaseNode from './BaseNode';

/**
 * TextNode
 * - autosize height and width
 * - detect variables in the form {{ varName }} (valid JS identifiers)
 * - create one left handle per unique variable with id: `${nodeId}-var-<name>`
 *
 * Props:
 *  - id: node id (from react-flow)
 *  - data: optional initial data { text: string, update: fn }
 */

const VAR_RE = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g; // valid JS id inside {{ }}
const ALL_PLACEHOLDERS_RE = /\{\{\s*([^}]*)\s*\}\}/g; // to detect any placeholder (for invalid highlight)

export default function TextNode({ id, data }) {
  const initialText = data?.text ?? '{{input}}';
  const [text, setText] = useState(initialText);
  const [rawPlaceholders, setRawPlaceholders] = useState([]); // holds all raw contents inside {{ }}
  const taRef = useRef(null);
  const mirrorRef = useRef(null); // invisible element to measure width
  const [width, setWidth] = useState(240); // px, initial width
  const MIN_W = 160;
  const MAX_W = 520;
  const PADDING_X = 24; // account for textarea padding + scrollbar space

  // Debounced parsing: update variables after short delay while user types quickly.
  useEffect(() => {
    const t = setTimeout(() => {
      // gather raw placeholders for invalid detection
      const raw = [];
      let m;
      while ((m = ALL_PLACEHOLDERS_RE.exec(text)) !== null) {
        raw.push(m[1].trim());
      }
      setRawPlaceholders(raw);
    }, 180); // 180ms debounce
    return () => clearTimeout(t);
  }, [text]);

  // Extract only valid variable names using VAR_RE (unique)
  const variables = useMemo(() => {
    const found = new Set();
    let m;
    while ((m = VAR_RE.exec(text)) !== null) {
      found.add(m[1]);
    }
    return Array.from(found);
  }, [text]);

  // Keep parent in sync (if node data supports update)
  useEffect(() => {
    if (data && typeof data.update === 'function') {
      data.update({ text, variables });
    }
  }, [text, variables, data]);

  // Autosize textarea height
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    // reset height to measure
    ta.style.height = '0px';
    const scrollH = ta.scrollHeight;
    const minH = 48;
    const maxH = 420;
    ta.style.height = Math.max(minH, Math.min(maxH, scrollH)) + 'px';
  }, [text]);

  // Autosize width using hidden mirror element
  useEffect(() => {
    // ensure mirror exists
    const mirror = mirrorRef.current;
    const ta = taRef.current;
    if (!mirror || !ta) return;

    const lines = text.split('\n');
    const longest = lines.reduce((acc, l) => (l.length > acc.length ? l : acc), '');
    // Escape HTML
    const escaped = longest.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Use a whitespace-preserving span
    mirror.innerHTML = '<span style="white-space:pre">' + escaped + '</span>';

    // measure
    const measured = mirror.offsetWidth + PADDING_X; // add some padding
    const clamped = Math.max(MIN_W, Math.min(MAX_W, measured));
    setWidth(clamped);
  }, [text]);

  // Prepare input handles derived from variables: ids like `var-<name>`
  const inputs = variables.map((v) => ({ id: `var-${v}` }));

  // Identify invalid placeholders (raw placeholders not matching VAR_RE)
  const invalidPlaceholders = useMemo(() => {
    // set of valid names for quick lookup
    const valid = new Set(variables);
    return rawPlaceholders.filter((r) => !valid.has(r) && r !== '');
  }, [rawPlaceholders, variables]);

  // Render
  return (
    <BaseNode id={id} title="Text" inputs={inputs} outputs={[{ id: 'output' }]}>
      {/* Hidden mirror for width measurement */}
      <div
        ref={mirrorRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
          visibility: 'hidden',
          whiteSpace: 'pre',
          fontSize: 13,
          fontFamily: 'inherit',
          padding: '8px',
          boxSizing: 'content-box',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 12, color: '#cfe3ff' }}>Text</label>
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text and variables like {{name}}"
          style={{
            width: `${width}px`,
            maxWidth: '100%',
            boxSizing: 'border-box',
            padding: '8px',
            resize: 'none',
            fontSize: 13,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
            color: '#e6eef8',
            lineHeight: 1.3,
          }}
        />

        {/* show variable chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {variables.map((v) => (
            <div
              key={v}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                background: '#e6eef8',
                color: '#05263f',
                fontSize: 12,
                boxShadow: '0 6px 14px rgba(2,6,23,0.2)',
              }}
            >
              {v}
            </div>
          ))}
          {invalidPlaceholders.length > 0 &&
            invalidPlaceholders.map((p, i) => (
              <div
                key={`inv-${i}`}
                title={`Invalid placeholder: {{${p}}}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(255,60,60,0.12)',
                  color: '#ff9b9b',
                  fontSize: 12,
                  border: '1px solid rgba(255,60,60,0.08)',
                }}
              >
                ⚠ {p}
              </div>
            ))}
        </div>
      </div>
    </BaseNode>
  );
}
