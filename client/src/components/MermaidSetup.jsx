import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "default"
})

export const cleanMermaidChart = (diagram) => {
  if (!diagram) return "";

  let clean = diagram
    .replace(/```mermaid/gi, "")
    .replace(/```/g, "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!clean.toLowerCase().startsWith("graph")) {
    clean = `graph TD\n${clean}`;
  }

  const idMap = new Map();
  let nextId = 0;
  const nextLetter = () => {
    let n = nextId++;
    let id = "";
    do {
      id = String.fromCharCode(65 + (n % 26)) + id;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return id;
  };

  clean = clean
    .split("\n")
    .map((line) => {
      if (/^\s*graph\s/i.test(line)) return line;
      return line.replace(/(^|[^\w])(\[[^\]]+\])/g, (match, prefix, bracket) => {
        if (!idMap.has(bracket)) idMap.set(bracket, nextLetter());
        return `${prefix}${idMap.get(bracket)}${bracket}`;
      });
    })
    .join("\n");

  return clean;
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const chart = cleanMermaidChart(diagram);
    if (!chart || !containerRef.current) return;

    let cancelled = false;
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError("");
        }
      })
      .catch((err) => {
        console.log('mermaid render error', err);
        if (!cancelled) setError("Unable to render diagram");
      });

    return () => {
      cancelled = true;
    };
  }, [diagram]);

  if (!diagram) return null;

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 overflow-x-auto'>
      {error && <p className='text-xs text-red-500 mb-2'>{error}</p>}
      <div ref={containerRef} />
    </div>
  );
}

export default MermaidSetup
