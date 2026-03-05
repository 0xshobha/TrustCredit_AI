'use client';

import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
    score: number;
    maxScore?: number;
    size?: number;
    grade?: string;
}

export default function ScoreGauge({ score, maxScore = 1000, size = 220, grade }: ScoreGaugeProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const center = size / 2;
    const radius = (size - 24) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = animatedScore / maxScore;
    const dashOffset = circumference * (1 - progress * 0.75); // 270° arc

    useEffect(() => {
        const duration = 2000;
        const start = performance.now();

        const animate = (now: number) => {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
            setAnimatedScore(Math.round(score * eased));
            if (t < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [score]);

    const getScoreColor = (s: number) => {
        if (s >= 800) return '#10b981';
        if (s >= 650) return '#06b6d4';
        if (s >= 500) return '#f59e0b';
        return '#f43f5e';
    };

    const color = getScoreColor(score);

    return (
        <div className="score-gauge-container" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background arc */}
                <circle
                    className="score-gauge-bg"
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * 0.25}
                    transform={`rotate(135 ${center} ${center})`}
                />

                {/* Score arc */}
                <circle
                    className="score-gauge-fill"
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform={`rotate(135 ${center} ${center})`}
                    style={{ filter: `drop-shadow(0 0 12px ${color}40)` }}
                />

                {/* Score number */}
                <text
                    x={center}
                    y={center - 5}
                    textAnchor="middle"
                    className="score-gauge-text"
                    style={{ fill: color }}
                >
                    {animatedScore}
                </text>

                {/* Label */}
                <text
                    x={center}
                    y={center + 25}
                    textAnchor="middle"
                    className="score-gauge-label"
                >
                    Trust Score
                </text>

                {/* Grade */}
                {grade && (
                    <text
                        x={center}
                        y={center + 48}
                        textAnchor="middle"
                        style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            fontFamily: 'Outfit, sans-serif',
                            fill: color,
                        }}
                    >
                        Grade {grade}
                    </text>
                )}
            </svg>
        </div>
    );
}
