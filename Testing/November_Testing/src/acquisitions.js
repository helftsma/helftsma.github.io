import { Chart } from 'chart.js/auto'

(async function() {
  const data =
    { year: [2010, 2011, 2012, 2013, 2014, 2015, 2016], count: [10, 20, 15, 25, 22, 30, 28] };

  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'line',
      data: {
        labels: data['year'],
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data['count']
          }
        ]
      },
      options: {
        plugins: {
       }
    },
    }
  );
})();
