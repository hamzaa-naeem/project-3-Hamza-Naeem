import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { dashboardService } from '../../services/dashboardService';

export default function StatusChart() {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    let active = true;
    async function loadData() {
      try {
        const res = await dashboardService.getStatusDistribution();
        if (res.success && active) {
          const labelColors = {
            'Confirmed': '#10B981',
            'Pending': '#F59E0B',
            'Cancelled': '#EF4444',
            'Refunded': '#94A3B8'
          };
          const colors = res.data.labels.map(l => labelColors[l] || '#CBD5E1');
          
          if (inst.current) inst.current.destroy();
          inst.current = new Chart(ref.current, {
            type:'pie',
            data:{
              labels: res.data.labels,
              datasets:[{ data: res.data.data, backgroundColor: colors, borderWidth:0 }]
            },
            options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:10 } } } }
          });
        }
      } catch (err) {
        console.error('Failed to load status chart data:', err);
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
