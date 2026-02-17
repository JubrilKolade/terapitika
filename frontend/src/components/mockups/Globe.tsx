'use client';

import { motion } from 'framer-motion';

export function Globe({ className }: { className?: string }) {
    return (
        <div className={`relative ${className}`}>
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-therapy-500/20 rounded-full blur-[100px] scale-150" />

            {/* SVG Globe */}
            <svg
                viewBox="0 0 800 800"
                className="w-full h-full opacity-40 animate-[spin_60s_linear_infinite]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="400" cy="400" r="300" stroke="url(#globe-gradient)" strokeWidth="0.5" strokeDasharray="4 4" />

                {/* Latitudes */}
                {[...Array(8)].map((_, i) => (
                    <ellipse
                        key={`lat-${i}`}
                        cx="400"
                        cy="400"
                        rx="300"
                        ry={300 * Math.sin(((i + 1) * Math.PI) / 9)}
                        stroke="url(#globe-gradient)"
                        strokeWidth="0.5"
                        strokeDasharray="2 4"
                        className="opacity-50"
                    />
                ))}

                {/* Longitudes */}
                {[...Array(8)].map((_, i) => (
                    <ellipse
                        key={`long-${i}`}
                        cx="400"
                        cy="400"
                        rx={300 * Math.sin(((i + 1) * Math.PI) / 9)}
                        ry="300"
                        stroke="url(#globe-gradient)"
                        strokeWidth="0.5"
                        strokeDasharray="2 4"
                        className="opacity-50"
                    />
                ))}

                {/* Dotted Dots */}
                {[...Array(50)].map((_, i) => {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.random() * 300;
                    return (
                        <circle
                            key={`dot-${i}`}
                            cx={400 + r * Math.cos(angle)}
                            cy={400 + r * Math.sin(angle)}
                            r="1"
                            fill="currentColor"
                            className="text-therapy-400 opacity-40"
                        >
                            <animate
                                attributeName="opacity"
                                values="0.2;0.8;0.2"
                                dur={`${2 + Math.random() * 4}s`}
                                repeatCount="indefinite"
                            />
                        </circle>
                    );
                })}

                <defs>
                    <linearGradient id="globe-gradient" x1="0" y1="0" x2="800" y2="800" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0ea5e9" />
                        <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Core Glow */}
            <div className="absolute inset-[25%] bg-gradient-to-br from-therapy-500/10 to-calm-500/10 rounded-full blur-3xl" />
        </div>
    );
}
