import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { dashboardService } from '../../services/dashboardService';

export default function PassengersChart() {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    let active = true;
    async function loadData() {
      try {
        const res = await dashboardService.getPassengersDaily();
        if (res.success && active) {
          if (inst.current) inst.current.destroy();
          inst.current = new Chart(ref.current, {
            type:'line',
            data:{
              labels: res.data.labels,
              datasets:[{ label:'Passengers', data: res.data.data, borderColor:'#2563EB', backgroundColor:'rgba(37,99,235,0.08)', tension:0.4, fill:true, pointRadius:0 }]
            },
            options:{ responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ ticks:{ font:{size:9}, maxTicksLimit:8 }, grid:{display:false} }, y:{ ticks:{ font:{size:10} }, grid:{ color:'rgba(0,0,0,0.05)' } } } }
          });
        }
      } catch (err) {
        console.error('Failed to load daily passengers chart data:', err);
      }
    }
    loadData();

    return () => {
      active = false;
      inst.current?.destroy();
    };
  }, []);

  return <canvas ref={ref} height={160} />;
}
