import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { dashboardService } from '../../services/dashboardService';

export default function RouteChart() {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    let active = true;
    async function loadData() {
      try {
        const res = await dashboardService.getRoutesDistribution();
        if (res.success && active) {
          if (inst.current) inst.current.destroy();
          inst.current = new Chart(ref.current, {
            type:'doughnut',
            data:{
              labels: res.data.labels,
              datasets:[{ data: res.data.data, backgroundColor:['#2563EB','#0A1628','#3B82F6','#1E3A8A','#60A5FA'], borderWidth:0 }]
            },
            options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:12 } } } }
          });
        }
      } catch (err) {
        console.error('Failed to load routes distribution chart data:', err);
      }
    }
    loadData();

    return () => {
      active = false;
      inst.current?.destroy();
    };
  }, []);

  return <canvas ref={ref} height={200} />;
}
