document.addEventListener('DOMContentLoaded', () => {
    
// show date

  (function() {
  let now = new Date();
  let dateBox = document.querySelector('.c-date-box');

  function showTextMonths(x) {
  let months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  return months[x];
  };

  dateBox.innerText = `${now.getDate()} ${showTextMonths(now.getMonth())} ${now.getFullYear()}`;
  })();

// show date

async function getCurrency(currency) {
  let response = await fetch('https://api.nbp.pl/api/exchangerates/rates/a/'+currency+'/');
  if (response.status != 200) {
      response = await fetch('https://api.nbp.pl/api/exchangerates/rates/b/'+currency+'/');
      let json = await response.json();
      return json.rates[0].mid;
  }
  let json = await response.json();
  return json.rates[0].mid; 
}

async function convert() {
  if (select1Input.value === "PLN" && select2Input.value !== "PLN") {
    summaryInput.value = dotToComma((amountInput.value / await getCurrency(select2Input.value)).toFixed(2)) + " " + select2Input.value;
      
      if (amountInput.value!=='') {
        detailsBox.innerText = `${dotToComma(amountInput.value)} ${select1Input.value} = ${summaryInput.value}`;
      } else {
        detailsBox.innerText = ''
      }
    
  }
}

function dotToComma(x) {
    return x.replace('.',',');
}

//event handlers

let amountInput = document.querySelector('#amount');
let summaryInput = document.querySelector('#summary');
let select1Input = document.querySelector('#select1');
let select2Input = document.querySelector('#select2');
let detailsBox = document.querySelector('.t-main-section__details');

amountInput.addEventListener('input', () => {
  convert();
});






  

    let select1 = new SlimSelect({
        select: '#select1'
    });

    let select2 = new SlimSelect({
        select: '#select2'
    });

    let data =[];
      data.push({innerHTML: '<img width="24" height="24" src="flags/pln.svg" title="Złoty polski" style="margin-right: 20px"></img> <div><div>PLN</div></div>', text: 'PLN', value: 'PLN', currency: 'Złoty polski'});
      fetch('https://api.nbp.pl/api/exchangerates/tables/a/')
        .then(res => res.json())
        .then(json => {
          let rates = json[0].rates;
          rates.forEach(el => {
            if (el.code == 'ZAR') {el.currency = 'rand południowoafrykański'} else {
              if (el.code == 'XCD' ) return;
            }
            data.push({innerHTML: '<img width="24" height="24" src="flags/'+el.code.toLowerCase()+'.svg" title="'+el.currency+'" style="margin-right: 20px"></img> <div><div>'+ el.code +'</div></div>', text: el.code, value: el.code, currency: el.mid});            
            // data.push({innerHTML: '<img width="20" height="20" src="flags/'+el.code.toLowerCase()+'.svg"></img> <div><div>'+ el.code +'</div><br><div class="currency">'+ el.currency+ '</div></div>', text: el.code, value: el.code, currency: el.mid});
          });
          
        })
        .then(
          fetch('https://api.nbp.pl/api/exchangerates/tables/b/')
          .then(res => res.json())
          .then(json => {
            let rates = json[0].rates;
            rates.forEach(el => {
                data.push({innerHTML: '<img width="24" height="24" src="flags/'+el.code.toLowerCase()+'.svg" title="'+el.currency+'" style="margin-right: 20px"></img> <div><div>'+ el.code +'</div></div>', text: el.code, value: el.code, currency: el.mid});
            //   data.push({innerHTML: '<img width="20" height="20" src="flags/'+el.code+'.svg" title="'+el.currency+'"></img> <div><div>'+ el.code +'</div><br><div class="currency">'+ el.currency+ '</div></div>', text: el.code, value: el.code, currency: el.mid});
            });
            select1.setData(data);
            select2.setData(data);
            select1.set('PLN');
            select2.set('EUR');
          })
        );


});