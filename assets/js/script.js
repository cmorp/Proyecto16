
const url= 'https://mindicador.cl/api'; 
const currencies = ['dolar', 'euro'];


const ctx = document.getElementById('myChart');

let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [3, 5],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const paintCurrencies = (currencies) => {
    html = '<option disabled selected>Selecciona una moneda</option>';
    const selectCurrencies = document.querySelector('#currencies');
    currencies.forEach(currencie => {
        html += `
            <option value=${currencie.codigo} id=${currencie.codigo}>${currencie.codigo}</option>
        `});
    selectCurrencies.innerHTML = html;
}

const getCurrencies = async () => {
    try {
        const resCurrencies = await fetch(url);
        const data = await resCurrencies.json();
        const currenciesList = currencies.map(currencie => {
            return {
                codigo: currencie.charAt(0).toUpperCase() + currencie.slice(1),
                valor: data[currencie].valor
            }
        });
        paintCurrencies(currenciesList);
        return data;
    } catch (error) {
        document.querySelector('h1').style.display = 'none';
        document.querySelector('.card').style.display = 'none';
        document.querySelector('.error').style.display = 'flex';
        document.querySelector('.errorMessage').textContent = 'Lo siento, algo salió mal :( ' + error.message;
        console.log(error);
    };
}
const getSymbolCurrencie = (actualCurrencie) => {
    if (actualCurrencie === 'dolar') {
        return "USD";
    } else if (actualCurrencie === 'euro') {
        return "€";
    };

}
const confChart = (data) => {
    const typeOfChart = "line";
    const days = data.serie.map((info) => (info.fecha.slice(0, 10))).slice(0, 10);
    const title = data.codigo.toUpperCase();
    const lineColor = "magenta";
    const values = data.serie.map((info) => { return info.valor; });
    const config = {
        type: typeOfChart,
        data: {
            labels: days,
            datasets: [{
                label: title,
                borderWidth: 3,
                borderColor: 'green',
                color: '#FFFFFF',
                lineTension: 0.5,
                backgroundColor: 'green',
                data: values
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        drawOnChartArea: false,
                        color: '#FFFFFF',
                        borderColor: '#FFFFFF'
                    },
                    ticks: {
                        color: '#FFFFFF'
                    },
                    border: {
                        color: '#FFFFFF'
                    }
                },
                y: {
                    grid: {
                        drawOnChartArea: false,
                        color: '#FFFFFF'
                    },
                    ticks: {
                        color: '#FFFFFF'
                    },
                    border: {
                        color: '#FFFFFF'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#FFFFFF'
                    }
                }
            }

        }
    };
    return config;
}

const calcMoneyExchange = async () => {
    const clpAmount = document.querySelector('#clpAmount').value;
    const currencieIndex = document.querySelector('#currencies').selectedIndex;
    if (clpAmount === '' || currencieIndex === 0) {
        // alert('Debes ingresar un monto en pesos')
        const modal = document.querySelector('#myModal');
        modal.style.display = 'block';
        modal.querySelector('#OK').addEventListener('click', (event) => modal.style.display = 'none');
    } else {
        const actualCurrencie = document.querySelector('#currencies').selectedOptions[0].value.toLowerCase();
        const currencieSymbol = getSymbolCurrencie(actualCurrencie);
        try {
            document.querySelector('#answer').style.display = 'none';
            document.querySelector('#valueOfDay').style.display = 'none';
            const resCurrencies = await fetch(url + '/' + actualCurrencie);
            const data = await resCurrencies.json();
            const actualValueCurrency = Number(data.serie[0].valor);
            let change = clpAmount / actualValueCurrency;
            setTimeout(() => {
                document.querySelector('#answer').style.display = 'inline-block';
                document.querySelector('#valueOfDay').style.display = 'block'
                document.querySelector('#answer').innerText = "$" + clpAmount + " equivalen a " + change.toFixed(2) + currencieSymbol 
                document.querySelector('#valueOfDay').innerText = "Valor del día: " + "$" + actualValueCurrency.toFixed(2);
                const conf = confChart(data);
                const chartDOM = document.querySelector("#myChart");
                myChart.destroy();
                myChart = new Chart(chartDOM, conf);
                document.querySelector(".chart").style.display = "flex";
            }, 1000);
        } catch (error) {
            document.querySelector('h1').style.display = 'none';
            document.querySelector('.card').style.display = 'none';
            document.querySelector('.error').style.display = 'flex';
            document.querySelector('.errorMessage').textContent = 'Lo siento, algo salió mal :( ' + error.message;  
            console.log(error);
        };
    };
};

function validateInput(event) {
    if (event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }

getCurrencies();
const buttonCalc = document.querySelector('#convert');
buttonCalc.addEventListener('click', calcMoneyExchange);