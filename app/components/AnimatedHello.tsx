'use client';

import React, { FC } from 'react';

const AnimatedHello: FC = () => (
  <div className="relative md:block">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 120"
      width="400"
      height="120"
    >
      {/* Hello text path */}
      <path
        d="M40 80 L40 40 M40 60 L70 60 M70 80 L70 40"  // H
        stroke="#0a2747"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="200"
        strokeDashoffset="200"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="200"
          to="0"
          dur="1s"
          begin="0s;animate6.end+2s"
          fill="freeze"
          id="animate1"
        />
      </path>

      <path
        d="M90 80 L90 40 L120 40 L120 80 L90 80"  // e
        stroke="#1688e1"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="200"
        strokeDashoffset="200"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="200"
          to="0"
          dur="1s"
          begin="animate1.begin+0.2s"
          fill="freeze"
          id="animate2"
        />
      </path>

      <path
        d="M140 80 L140 40"  // l
        stroke="#1688e1"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="200"
        strokeDashoffset="200"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="200"
          to="0"
          dur="1s"
          begin="animate2.begin+0.2s"
          fill="freeze"
          id="animate3"
        />
      </path>

      <path
        d="M160 80 L160 40"  // l
        stroke="#1688e1"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="200"
        strokeDashoffset="200"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="200"
          to="0"
          dur="1s"
          begin="animate3.begin+0.2s"
          fill="freeze"
          id="animate4"
        />
      </path>

      <path
        d="M180 80 C180 40 220 40 220 80 C220 120 180 120 180 80"  // o
        stroke="#103d6a"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="200"
        strokeDashoffset="200"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="200"
          to="0"
          dur="1s"
          begin="animate4.begin+0.2s"
          fill="freeze"
          id="animate5"
        />
      </path>

      {/* Optional dot at the end */}
      <circle
        cx="240"
        cy="80"
        r="4"
        fill="#0a2747"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          from="0"
          to="1"
          dur="0.3s"
          begin="animate5.begin+1s"
          fill="freeze"
          id="animate6"
        />
      </circle>
    </svg>
  </div>
);

export default AnimatedHello;