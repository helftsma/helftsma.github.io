import { Chart } from 'chart.js/auto'

const ctx = document.getElementById('myChart');
document.querySelector("#read-button").addEventListener('click', function() {
		let file = document.querySelector("#file-input").files[0];
		let reader = new FileReader();
		reader.onload = function(progressEvent) {
        // Entire file
          const text = this.result;
        // $output.innerText = text

        // By lines
        let lines = text.split('\n');
        let reached = false;
        let customerData = {
            "Time":[],
            "Load":[],
            "Indentation":[],
            "Cantilever":[],
            "Piezo":[]
        };
        let values;
        for (let line = 0; line < lines.length; line++) {
            if(reached){
                //ta.push(lines[line].split("\t"));
                values = lines[line].split("\t");
                customerData["Time"].push(values[0]);
                customerData["Load"].push(values[1]);
                customerData["Indentation"].push(values[2]);
                customerData["Cantilever"].push(values[3]);
                customerData["Piezo"].push(values[4]);
            }

            let words = lines[line].split('');
            for(let word = 0; word<words.length; word++){

                if(words.slice(-10).join("").trim() === "Auxiliary") {
                    reached = true;
                }
            }

        }




        let plotData = {};
    plotData["Time"]= customerData["Time"];
    plotData["Indentation"]= customerData["Indentation"];

    console.log(plotData);

(async function() {
  const data = plotData;

  new Chart(
    document.getElementById('myChart'),
    {
      type: 'line',
      data: {
        labels: data['Time'],
        datasets: [
          {
            label: 'Indentation over time',
            data: data['Indentation']
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

};
        reader.readAsText(file);
	});



