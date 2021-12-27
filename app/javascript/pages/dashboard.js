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
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"

  ]

  async function yearSalesMonthly(year) {

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

  async function getAllYears() {

    return new Promise(function(resolve, reject) {
      $.ajax('sales/all_years', {
        contentType: 'application/json',
        dataType: 'json'
      }).done(function(data){
          resolve(data);
      }).fail(function () {
        // TODO if it does fail gotta do something else
        reject(0)
      });
    })
  }

  $("#sales_trigger").on('click', function() {

    // get the selected years for comparision
    const year1 = $("#year1_select").find(":selected").text()
    const year2 = $("#year2_select").find(":selected").text()
    fillSalesChart(year1, year2)
  })

  // when ready fill all years
  // and put as default the first and second available years
  $(async function() {
    await getAllYears()
      .then(function(data) {
        const years = data
        // fill first and second select year
        $.each(years, function(index, item) {

          // Should not use a variable to hold its value otherwise
          // it won't fill them both
          $("#year1_select").append($('<option>', {
            value: years[index],
            text: years[index]
          }))
          $("#year2_select").append($('<option>', {
            value: years[index],
            text: years[index]
          }))
        })
        // default chart comparision so it won't be empty at reload
        fillSalesChart(years[0], years[1])
        // make the years option selected
        $('#year1_select :nth-child(2)').prop('selected', true)
        $('#year2_select :nth-child(3)').prop('selected', true)
      })
      .catch(function(reason) {
        alert("Failed to retrieve years list")
        console.log(reason)
      })

  })

  async function fillSalesChart(year_one, year_two) {

    // schedule loading screen for .3 seconds, so if data loads
    // much fast it won't blink causing a weird effect
    var loadingSchedule = setTimeout(function () {

        // console.log("Adding loading class.");
        $('.loading_screen').addClass('display_loading')

      },
      300
    )

    const year_one_sales = await yearSalesMonthly(year_one)
      .catch(function(reason) {
        throw new Error(reason)
      });
    const year_two_sales = await yearSalesMonthly(year_two)
      .catch(function(reason) {
        throw new Error(reason)
      });


    // empty datasets with previous values
    salesChart.data.datasets[0].data = []
    salesChart.data.datasets[1].data = []

    var year1_total = 0;
    var year2_total = 0;

    // fill first column with first year
    Object.keys(year_one_sales).forEach(function(k){
      salesChart.data.datasets[0].data.push(year_one_sales[k].toFixed(2))
      // calculating total earnings year 1
      year1_total += year_one_sales[k]
      // console.log("Inserting year one value: " + year_two_sales[k])
    })

    // fill second column with second year
    Object.keys(year_two_sales).forEach(function(k){
      salesChart.data.datasets[1].data.push(year_two_sales[k].toFixed(2))
      // calculating total earnings year 2
      year2_total += year_two_sales[k]
      // console.log("Inserting year two value: " + year_two_sales[k])
    })

    // console.log("Year one: ")
    // console.log(year_one_sales)

    // console.log("Year two: ")
    // console.log(year_two_sales)

    // bind a year to its respective color in the chart subtitle
    $("#gray_year").text(year_one)
    $("#blue_year").text(year_two)

    $("#sales_over_year1_value").text(`$${year1_total.toFixed(2)}`)
    $("#sales_over_year1").text(year_one)

    $("#sales_over_year2_value").text(`$${year2_total.toFixed(2)}`)
    $("#sales_over_year2").text(year_two)

    // setting percentage increase/decrease between the two years
    var percentage_increase_decrease = (((year2_total - year1_total)/year1_total) * 100).toFixed(1)

    // based on profit increasing or decreasing text turns green or red
    if (percentage_increase_decrease < 0)
      $("#text_increase_decrease").removeClass().addClass("text-danger")
    else
      $("#text_increase_decrease").removeClass().addClass("text-success")

    $("#percentage_increase_decrease").text(`${percentage_increase_decrease}%`)

    // console.log("Updating sales Chart")
    salesChart.update()

    if (loadingSchedule) clearTimeout(loadingSchedule)
    // console.log("Clearing loading screen")
    $('.loading_screen').removeClass('display_loading')
  }



  var salesChartObject = {
    type: 'bar',
    data: {
      labels: monthNames,
      datasets: [
        // gray year
        {
          backgroundColor: '#ced4da',
          borderColor: '#ced4da',
          data: []
        },
        // blue year
        {
          backgroundColor: '#007bff',
          borderColor: '#007bff',
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
