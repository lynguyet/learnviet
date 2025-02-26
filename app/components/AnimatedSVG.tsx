'use client';

import React, { FC } from 'react';

const AnimatedSVG: FC = () => (
  <div className="relative md:block">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 400"
      width="300"
      height="400"
    >
      {/* Background paper effect with endeavor-50 color */}
      <rect 
        width="240" 
        height="320" 
        x="30" 
        y="40" 
        fill="#f1f7fe" 
        rx="10" 
        filter="drop-shadow(3px 3px 3px rgba(0,0,0,0.2))" 
      />

      {/* Checklist items using endeavor colors */}
      <g stroke="#0a2747" strokeWidth="2" fill="none">
        {/* First item */}
        <rect 
          className="checkbox" 
          width="20" 
          height="20" 
          x="50" 
          y="80" 
          rx="2" 
          fill="#e1eefd"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0 80"
            to="80 80"
            dur="1s"
            begin="0s;item3-line.end+2s"
            fill="freeze"
          />
        </rect>
        <path 
          className="checkmark" 
          d="M54 90l4 4 8-8"
          stroke="#1688e1"
          strokeDasharray="20"
          strokeDashoffset="20"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="20"
            to="0"
            dur="0.5s"
            begin="item1-box.end"
            fill="freeze"
            id="item1-check"
          />
        </path>
        <line 
          x1="80" 
          y1="90" 
          x2="220" 
          y2="90" 
          stroke="#103d6a"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0 140"
            to="140 140"
            dur="1s"
            begin="item1-check.end"
            fill="freeze"
            id="item1-line"
          />
        </line>

        {/* Second item */}
        <rect 
          className="checkbox" 
          width="20" 
          height="20" 
          x="50" 
          y="120" 
          rx="2" 
          fill="#e1eefd"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0 80"
            to="80 80"
            dur="1s"
            begin="item1-line.end"
            fill="freeze"
            id="item2-box"
          />
        </rect>
        <path 
          className="checkmark" 
          d="M54 130l4 4 8-8"
          stroke="#1688e1"
          strokeDasharray="20"
          strokeDashoffset="20"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="20"
            to="0"
            dur="0.5s"
            begin="item2-box.end"
            fill="freeze"
            id="item2-check"
          />
        </path>
        <line 
          x1="80" 
          y1="130" 
          x2="220" 
          y2="130" 
          stroke="#103d6a"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0 140"
            to="140 140"
            dur="1s"
            begin="item2-check.end"
            fill="freeze"
            id="item2-line"
          />
        </line>

        {/* Third item */}
        <rect 
          className="checkbox" 
          width="20" 
          height="20" 
          x="50" 
          y="160" 
          rx="2" 
          fill="#e1eefd"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0 80"
            to="80 80"
            dur="1s"
            begin="item2-line.end"
            fill="freeze"
            id="item3-box"
          />
        </rect>
        <path 
          className="checkmark" 
          d="M54 170l4 4 8-8"
          stroke="#1688e1"
          strokeDasharray="20"
          strokeDashoffset="20"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="20"
            to="0"
            dur="0.5s"
            begin="item3-box.end"
            fill="freeze"
            id="item3-check"
          />
        </path>
        <line 
          x1="80" 
          y1="170" 
          x2="220" 
          y2="170" 
          stroke="#103d6a"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0 140"
            to="140 140"
            dur="1s"
            begin="item3-check.end"
            fill="freeze"
            id="item3-line"
          />
        </line>
      </g>
    </svg>
  </div>
);

export default AnimatedSVG;