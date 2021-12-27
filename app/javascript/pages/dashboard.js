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

  async function monthSalesDaily(year, month) {

    return new Promise(function(resolve, reject) {

      $.ajax(`sales/${year}/${month}`, {
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

  $("#sales_trigger_daily").on('click', function() {

    // get the selected years for comparision
    const year1 = $("#year1_daily_select").find(":selected").val()
    const year2 = $("#year2_daily_select").find(":selected").val()
    const month = $("#month_daily_select").find(":selected").val()
    fillSalesDailyChart(year1, year2, month)
  })

  $("#sales_trigger_monthly").on('click', function() {

    // get the selected years for comparision
    const year1 = $("#year1_select").find(":selected").val()
    const year2 = $("#year2_select").find(":selected").val()
    fillSalesMonthlyChart(year1, year2)
  })

  // when ready fill all years
  // and put as default the first and second available years
  $(async function() {
    await getAllYears()
      .then(function(data) {
        const years = data
        // fill first and second select years of both charts
        $.each(years, function(index, item) {

          // Should not use a variable to hold its value otherwise
          // it won't fill them both

          // year 1 sales monthly
          $("#year1_select").append($('<option>', {
            value: years[index],
            text: years[index]
          }))

          // year 2 sales monthly
          $("#year2_select").append($('<option>', {
            value: years[index],
            text: years[index]
          }))

          // year 1 sales daily
          $("#year1_daily_select").append($('<option>', {
            value: years[index],
            text: years[index]
          }))

          // year 2 sales daily
          $("#year2_daily_select").append($('<option>', {
            value: years[index],
            text: years[index]
          }))

        })

        // default sales monthly chart comparision so it won't be empty at reload
        fillSalesMonthlyChart(years[0], years[1])
        // make the years option selected
        $('#year1_select :nth-child(2)').prop('selected', true)
        $('#year2_select :nth-child(3)').prop('selected', true)

        // default sales monthly chart comparision so it won't be empty at reload
        fillSalesDailyChart(years[0], years[1], "01")
        // make the years option selected
        $('#year1_daily_select :nth-child(2)').prop('selected', true)
        $('#year2_daily_select :nth-child(3)').prop('selected', true)
        $('#month_daily_select :nth-child(2)').prop('selected', true)

      })
      .catch(function(reason) {
        alert("Failed to retrieve years list")
        console.log(reason)
      })

  })

  async function fillSalesDailyChart(year_one, year_two, month) {

    // schedule loading screen for .3 seconds, so if data loads
    // much fast it won't blink causing a weird effect
    var loadingSchedule = setTimeout(function () {

        // console.log("Adding loading class.");
        $('.loading_screen').addClass('display_loading')

      },
      300
    )

    const month_one_sales = await monthSalesDaily(year_one, month)
      .catch(function(reason) {
        throw new Error(reason)
      });
    const month_two_sales = await monthSalesDaily(year_two, month)
      .catch(function(reason) {
        throw new Error(reason)
      });



    // empty datasets with previous values
    visitorsChart.data.datasets[0].data = []
    visitorsChart.data.datasets[1].data = []

    var month1_total_no = 0;
    var month2_total_no = 0;

    // fill first column with first year
    Object.keys(month_one_sales).forEach(function(k){
      visitorsChart.data.datasets[0].data.push(month_one_sales[k])
      // calculating total sales number month 1
      month1_total_no += month_one_sales[k]
    })

    // fill second column with second year
    Object.keys(month_two_sales).forEach(function(k){
      visitorsChart.data.datasets[1].data.push(month_two_sales[k])
      // calculating total sales number month 2
      month2_total_no += month_two_sales[k]
    })

    // bind a year to its respective color in the chart subtitle
    $("#gray_month").text(year_one)
    $("#blue_month").text(year_two)

    $("#sales_number_over_month1").text(`${month1_total_no}`)
    $("#sales_over_year1_daily").text(year_one)

    $("#sales_number_over_month2").text(`${month2_total_no}`)
    $("#sales_over_year2_daily").text(year_two)

    // setting percentage increase/decrease between the two years
    var percentage_increase_decrease = (((month2_total_no - month1_total_no)/month1_total_no) * 100).toFixed(1)

    // if first year's month has no values there isn't a percentage to show
    if(month1_total_no == 0)
      percentage_increase_decrease = 0

    // based on profit increasing or decreasing text turns green or red
    if (percentage_increase_decrease < 0)
      $("#text_increase_decrease_daily").removeClass().addClass("text-danger")
    else
      $("#text_increase_decrease_daily").removeClass().addClass("text-success")

    $("#percentage_increase_decrease_daily").text(`${percentage_increase_decrease}%`)

    // console.log("Updating sales Chart")
    visitorsChart.update()

    if (loadingSchedule) clearTimeout(loadingSchedule)
    // console.log("Clearing loading screen")
    $('.loading_screen').removeClass('display_loading')
  }

  async function fillSalesMonthlyChart(year_one, year_two) {

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
        throw new Error(`An error ocurred. ${reason}`)
      });
    const year_two_sales = await yearSalesMonthly(year_two)
      .catch(function(reason) {
        throw new Error(`An error ocurred. ${reason}`)
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

  var $salesChart = $('#sales-chart')
  // eslint-disable-next-line no-unused-vars
  var salesChart = new Chart($salesChart, {
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
  })

  var $visitorsChart = $('#visitors-chart')
  // eslint-disable-next-line no-unused-vars
  var visitorsChart = new Chart($visitorsChart, {
    data: {
      labels: [
        "1","2","3","4","5","6","7","8","9","10",
        "11","12","13","14","15","16","17","18",
        "19","20","21","22","23","24","25","26",
        "27","28","29","30"
      ],
      datasets: [
      // gray line
      {
        type: 'line',
        data: [],
        backgroundColor: 'tansparent',
        borderColor: '#ced4da',
        pointBorderColor: '#ced4da',
        pointBackgroundColor: '#ced4da',
        fill: false
        // pointHoverBackgroundColor: '#ced4da',
        // pointHoverBorderColor    : '#ced4da'
      },
      {
        // blue line
        type: 'line',
        data: [],
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        pointBorderColor: '#007bff',
        pointBackgroundColor: '#007bff',
        fill: false
        // pointHoverBackgroundColor: '#007bff',
        // pointHoverBorderColor    : '#007bff'
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
            suggestedMax: 10
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
