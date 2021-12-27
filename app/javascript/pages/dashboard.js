/* global Chart:false */

$(function () {
  'use strict'

  var ticksStyle = {
    fontColor: '#495057',
    fontStyle: 'bold'
  }

  var mode = 'index'
  var intersect = true

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"

  ]

  async function year_sales_monthly(year) {

    return new Promise(function(resolve, reject) {

      $.ajax(`sales/${year}`, {
        contentType: 'application/json',
        dataType: 'json'
      }).done(function (data) {
        // if profit is retrieved successfully resolve the promise
        resolve(data);
      }).fail(function () {
        // TODO if it does fail gotta do something else
        reject(0)
      })

    })

  }

  $("#sales_trigger").on('click', function(){
    fillSalesChart(2004, 2005)
  })

  async function fillSalesChart(year_one, year_two) {

    // schedule loading screen for .3 seconds, so if data loads
    // much fast it won't blink causing a weird effect
    var loadingSchedule = setTimeout(function () {

        console.log("Adding loading class.");
        $('.loading_screen').addClass('display_loading')

      },
      300
    )

    const year_one_sales = await year_sales_monthly(year_one);
    const year_two_sales = await year_sales_monthly(year_two);


    // empty datasets with previous values
    salesChart.data.datasets[0].data = []
    salesChart.data.datasets[1].data = []

    // fill first column with first year
    Object.keys(year_one_sales).forEach(function(k){
      salesChart.data.datasets[0].data.push(year_one_sales[k])
      // console.log("Inserting year one value: " + year_two_sales[k])
    })

    // fill second column with second year
    Object.keys(year_two_sales).forEach(function(k){
      salesChart.data.datasets[1].data.push(year_two_sales[k])
      // console.log("Inserting year two value: " + year_two_sales[k])
    })

    // console.log("Year one: ")
    // console.log(year_one_sales)

    // console.log("Year two: ")
    // console.log(year_two_sales)

    // bind a year to its respective color in the chart subtitle
    $("#blue_year").text(year_one)
    $("#gray_year").text(year_two)

    console.log("Updating sales Chart")
    salesChart.update()

    if (loadingSchedule) clearTimeout(loadingSchedule)
    console.log("Clearing loading screen")
    $('.loading_screen').removeClass('display_loading')
  }



  var salesChartObject = {
    type: 'bar',
    data: {
      labels: monthNames,
      datasets: [
        // blue year
        {
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          data: []
        },
        // gray year
        {
          backgroundColor: '#ced4da',
          borderColor: '#ced4da',
          data: []
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: mode,
        intersect: intersect
      },
      hover: {
        mode: mode,
        intersect: intersect
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          // display: false,
          gridLines: {
            display: true,
            lineWidth: '4px',
            color: 'rgba(0, 0, 0, .2)',
            zeroLineColor: 'transparent'
          },
          ticks: $.extend({
            beginAtZero: true,

            // Include a dollar sign in the ticks
            callback: function (value) {
              if (value >= 1000) {
                value /= 1000
                value += 'k'
              }

              return '$' + value
            }
          }, ticksStyle)
        }],
        xAxes: [{
          display: true,
          gridLines: {
            display: false
          },
          ticks: ticksStyle
        }]
      }
    }
  }
  var $salesChart = $('#sales-chart')
  // eslint-disable-next-line no-unused-vars
  var salesChart = new Chart($salesChart, salesChartObject)

  var $visitorsChart = $('#visitors-chart')
  // eslint-disable-next-line no-unused-vars
  var visitorsChart = new Chart($visitorsChart, {
    data: {
      labels: ['18th', '20th', '22nd', '24th', '26th', '28th', '30th'],
      datasets: [{
        type: 'line',
        data: [100, 120, 170, 167, 180, 177, 160],
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        pointBorderColor: '#007bff',
        pointBackgroundColor: '#007bff',
        fill: false
        // pointHoverBackgroundColor: '#007bff',
        // pointHoverBorderColor    : '#007bff'
      },
      {
        type: 'line',
        data: [60, 80, 70, 67, 80, 77, 100],
        backgroundColor: 'tansparent',
        borderColor: '#ced4da',
        pointBorderColor: '#ced4da',
        pointBackgroundColor: '#ced4da',
        fill: false
        // pointHoverBackgroundColor: '#ced4da',
        // pointHoverBorderColor    : '#ced4da'
      }]
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: mode,
        intersect: intersect
      },
      hover: {
        mode: mode,
        intersect: intersect
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          // display: false,
          gridLines: {
            display: true,
            lineWidth: '4px',
            color: 'rgba(0, 0, 0, .2)',
            zeroLineColor: 'transparent'
          },
          ticks: $.extend({
            beginAtZero: true,
            suggestedMax: 200
          }, ticksStyle)
        }],
        xAxes: [{
          display: true,
          gridLines: {
            display: false
          },
          ticks: ticksStyle
        }]
      }
    }
  })
})

// lgtm [js/unused-local-variable]
