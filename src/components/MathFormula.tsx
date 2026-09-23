import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  math: string;
  block?: boolean;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ math, block = true }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false
        });
      } catch (e) {
        if (containerRef.current) {
          containerRef.current.innerText = math;
        }
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className={`inline-block font-mono ${block ? 'my-2 overflow-x-auto text-cyan-300' : ''}`} />;
};
