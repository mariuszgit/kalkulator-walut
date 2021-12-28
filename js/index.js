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

function dotToComma(x) {
  String(x);
  return x.replace('.',',');
}

function showDetails() {
  if (amountInput.value!=='') {
      summaryInput.title = `${dotToComma(amountInput.value)} ${select1Input.value} = ${summaryInput.value}`;
    } else if (amountInput.value=='') {
      summaryInput.title = ''
    }
}

function showLabel() {
  if (amountInput.value!=='') {
    summaryLabel.innerText = `${dotToComma(amountInput.value)} ${select1Input.value} to:`;
  } else if (amountInput.value=='') {
    summaryLabel.innerHTML = '&nbsp;'
  }
}

async function convert() {
  if (amountInput.value == '') {
    summaryInput.value = '';
    showDetails();
    showLabel();
  } else
  if (select1Input.value === "PLN" && select2Input.value !== "PLN") {
    summaryInput.value = dotToComma((amountInput.value / await getCurrency(select2Input.value)).toFixed(2)) + " " + select2Input.value;
    showDetails();
    showLabel();
  } else
  if (select1Input.value !== "PLN" && select2Input.value === "PLN") {
    summaryInput.value = dotToComma((amountInput.value * await getCurrency(select1Input.value)).toFixed(2)) + " " + select2Input.value;
    showDetails();
    showLabel();
  } else 
  if (select1Input.value !== "PLN" && select2Input.value !== "PLN") {
    console.log(`${amountInput.value * await getCurrency(select1Input.value)}`);
    summaryInput.value = dotToComma((amountInput.value * await getCurrency(select1Input.value)/ await getCurrency(select2Input.value)).toFixed(2)) + " " + select2Input.value;
    showDetails();
    showLabel();
  }
}

//event handlers

let amountInput = document.querySelector('#amount');
let summaryInput = document.querySelector('#summary');
let select1Input = document.querySelector('#select1');
let select2Input = document.querySelector('#select2');
let detailsBox = document.querySelector('.t-main-section__details');
let summaryLabel = document.querySelector('label[for="summary"]');
let rotateButton = document.querySelector('.t-main-section__rotate');

amountInput.addEventListener('input', () => {
  convert();
});

rotateButton.addEventListener('click', () => {
  let temp = select1Input.value;
  select1.set(select2Input.value);
  select2.set(temp);
  convert();
});

select1Input.addEventListener('change', () => {
  convert();
});

select2Input.addEventListener('change', () => {
  convert();
});

  

    let select1 = new SlimSelect({
        select: '#select1',
        searchPlaceholder: 'Szukaj'
    });

    let select2 = new SlimSelect({
        select: '#select2',
        searchPlaceholder: 'Szukaj'
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