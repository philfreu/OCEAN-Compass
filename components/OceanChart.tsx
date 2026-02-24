import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { OceanScore, Trait, Language } from '../types';
import { TRAIT_DETAILS } from '../constants';

interface OceanChartProps {
  scores: OceanScore;
  secondaryScores?: OceanScore;
  language: Language;
  labelA?: string;
  labelB?: string;
}

const OceanChart: React.FC<OceanChartProps> = ({ 
  scores, 
  secondaryScores, 
  language,
  labelA = "Profile A",
  labelB = "Profile B"
}) => {
  const data = Object.values(Trait).map((trait) => ({
    subject: TRAIT_DETAILS[trait].label[language],
    A: scores[trait],
    B: secondaryScores ? secondaryScores[trait] : 0,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-80 bg-white rounded-xl shadow-sm p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={labelA}
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={3}
            fill="#818cf8"
            fillOpacity={0.4}
          />
          {secondaryScores && (
             <Radar
               name={labelB}
               dataKey="B"
               stroke="#ec4899"
               strokeWidth={3}
               fill="#f472b6"
               fillOpacity={0.4}
             />
          )}
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          {secondaryScores && <Legend wrapperStyle={{ paddingTop: '10px' }} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OceanChart;