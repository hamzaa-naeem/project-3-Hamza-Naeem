import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { dashboardService } from '../../services/dashboardService';

export default function RevenueChart({ id, period = 'month' }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    let active = true;
    async function loadData() {
      try {
        const res = await dashboardService.getRevenueData(period);
        if (res.success && active) {
          if (inst.current) inst.current.destroy();
          inst.current = new Chart(ref.current, {
            type:'bar',
            data:{
              labels: res.data.labels,
              datasets:[{ label:'Revenue (Rs.)', data: res.data.data, backgroundColor:'rgba(37,99,235,0.85)', borderRadius:6, borderSkipped:false }]
            },
            options:{ responsive:true, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, ticks:{ callback:v=>`${(v/1000).toFixed(0)}K`, font:{size:11} }, grid:{ color:'rgba(0,0,0,0.05)' } }, x:{ grid:{ display:false }, ticks:{ font:{size:10} } } } }
          });
        }
      } catch (err) {
        console.error('Failed to load revenue chart data:', err);
      }
    }
    loadData();
    
    return () => {
      active = false;
      inst.current?.destroy();
    };
  }, [period, id]);

  return <canvas ref={ref} height={200} />;
}
