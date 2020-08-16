var webURL = 'data/category-success.json';
var webURL2 = 'data/category-profitloss.json';
var webURL3 = 'data/category-number.json';
var webURL4 = 'data/category-hub.json';
var webURL5 = 'data/employment.json';
var webURL6 = 'data/super-contribution.json';

var chart1;
var superChart;
var totalGenderData = [];
var totalSuperData=[];
var superData=[];
var totalFemaleComparisonData=[];
var totalMaleComparisonData=[];
var category;
var totalReductionData = [ [50000] , [39000], [30000], [24000]]
 

$(document).ready(function() {


    GetSuperContributionData().done(function(data) {
        superData = data;
         buildSuperData(data, 'All', "superChart");
         buildGenderData(superData, category, "genderChart");
       drawSuperChart();
       drawReductionChart();
        drawAverageSuperContributionByGender();
        drawGenderComparisonData();
    });

        $('#category').on('change', function() {
            
           
        $('.charts').addClass('show');
        category = $(this).children("option:selected").val();
        if(category ==='All')
        {
            $('.charts').removeClass('show');
        }
        
             totalSuperData.length=0;
             totalGenderData.length=0;
             totalFemaleComparisonData.length=0;
             totalMaleComparisonData.length=0;
              buildSuperData(superData, category, "superChart");
              buildGenderData(superData, category, "genderChart");
              buildComparisonData(superData, category, "comparisonChart");
             totalsInfographic(category);
             //showMap(totalHubData);

        updateCharts();
        // callGraph();


    });
});

(function (H) {

    var pendingRenders = [];

    // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
    function isElementInViewport(el) {

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (
                window.innerHeight ||
                document.documentElement.clientHeight
            ) &&
            rect.right <= (
                window.innerWidth ||
                document.documentElement.clientWidth
            )
        );
    }

    H.wrap(H.Series.prototype, 'render', function deferRender(proceed) {
        var series = this,
            renderTo = this.chart.container.parentNode;

        // It is appeared, render it
        if (isElementInViewport(renderTo) || !series.options.animation) {
            proceed.call(series);

        // It is not appeared, halt renering until appear
        } else  {
            pendingRenders.push({
                element: renderTo,
                appear: function () {
                    proceed.call(series);
                }
            });
        }
    });

    function recalculate() {
        pendingRenders.forEach(function (item) {
            if (isElementInViewport(item.element)) {
                item.appear();
                H.erase(pendingRenders, item);
            }
        });
    }

    if (window.addEventListener) {
        ['DOMContentLoaded', 'load', 'scroll', 'resize']
            .forEach(function (eventType) {
                addEventListener(eventType, recalculate, false);
            });
    }

}(Highcharts));


function drawReductionChart() {
    reductionChart = Highcharts.chart('reduction', {
        title: {
            text: 'Reduction in retirement fund in $',
            align: 'center'
        },
        subtitle: {
            text: 'Based on Conexus Institute, Actuaries Institute and Super Consumers and ATO data',
            align: 'center'
        },
        tooltip: {
            formatter: function() {

                return ('Age ' + this.x + ' leads to reduction of '+ this.y + '$');
            }
        },
        plotOptions: {
            column: {
                allowPointSelect: true,
                pointPadding: 0.3,

                dataLabels: {
                    enabled: true,
                    
                },
                showInLegend: true
            }
        },
        xAxis: {
          
            categories: ['30 year', '40 year', '50 year', '60 year'],
            crosshair: true,
            title: {
                    text: 'Age of people withdrawing super'
                }
        },
        
        yAxis: [{
                title: {
                    text: 'Amount'
                },
            },
            

        ],

     series: [
         {
             type:"column",
            name: 'Total Income',
            data: totalReductionData
         }
        ],
       
    });
}
function drawSuperChart() {
   superChart = Highcharts.chart('ageWork', {
    
            title: {
                text: 'Average Time to recoup the amount lost by early withdrawal of super in years'
            },
        
            subtitle: {
                text: 'Based on Conexus Institute, Actuaries Institute and Super Consumers and ATO data'
            },
        
            yAxis: {
                title: {
                    text: 'Time in years'
                }
            },
        
            xAxis: {
                categories: ['30 year', '40 year', '50 year', '60 year'],
                title: {
                        text: 'Age of people withdrawing super'
                    }
            },
        
            tooltip: {
                formatter: function() {
                    return ('Need to work for ' + this.y + ' more years ');
                }
            },
        
            plotOptions: {
                series: {
                }
            },
        
            series: [{
                type:"column",
                name:"Work period extended in years",
                data:totalSuperData
            }],
        });
}

function drawAverageSuperContributionByGender() {
    genderChart = Highcharts.chart('gender', {
        title: {
            text: 'Average super contribution by gender in $',
            align: 'center'
        },
        subtitle: {
            text: 'Based on ATO data',
            align: 'center'
        },
        tooltip: {
            formatter: function() {

                return ('Average super contribution ' + this.x );
            }
        },
        plotOptions: {
            column: {
                allowPointSelect: true,
                pointPadding: 0.3,

                dataLabels: {
                    enabled: true,
                    
                },
                showInLegend: true
            }
        },
        xAxis: {
            categories: ['male', 'female'],
            crosshair: true,
            title: {
                    text: 'Gender'
                }
        },
        
        yAxis: [{
                title: {
                    text: 'Amount'
                },
            },
            

        ],

     series: [
         {
             type:"column",
            name: 'Average super contribution',
            data:totalGenderData
         }
        ],
       
    });
}
function drawGenderComparisonData() {
    comparisonChart = Highcharts.chart('comparisonContianer', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Additional Work year per gender in years'
    },
    subtitle: {
        text: 'Source: ATO Data'
    },
    xAxis: [{
        categories: [30, 40, 50, 60],
        reversed: false,
        labels: {
            step: 1
        },
        accessibility: {
            description: 'Additional years (male)'
        }
    }, { // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: [30, 40, 50, 60],
        linkedTo: 0,
        labels: {
            step: 1
        },
        accessibility: {
            description: 'Additional years (female)'
        }
    }],
    yAxis: {
        title: {
            text: "Years"
        },
        labels: {
            formatter: function () {
                return Math.abs(this.value);
            }
        },
        accessibility: {
            description: 'Additional years',
            rangeDescription: 'Range: 0 to 20 years'
        }
    },

    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },

    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                'Additional years: ' + Highcharts.numberFormat(Math.abs(this.point.y), 1) + 'years';
        }
    },

    series: [{
        name: 'Male',
        data: totalMaleComparisonData,
        color:"#2e5299"
    }, {
        name: 'Female',
        data: totalFemaleComparisonData,
        color:"#d7153a"
    }]
});
}

function updateCharts() {
     superChart.series[0].setData(totalSuperData);
     reductionChart.series[0].setData(totalReductionData);
     genderChart.series[0].setData(totalGenderData);
     comparisonChart.series[0].setData(totalMaleComparisonData);
     comparisonChart.series[1].setData(totalFemaleComparisonData);
}
function chartType(item, chart, genderType) {
    switch (chart) {
        case "superChart":
            totalSuperData.push([item]);
            break;   
        case "genderChart":
            totalGenderData.push([item]);
            break;   
        case "comparisonChart":
            genderType ? totalFemaleComparisonData.push([item]) : totalMaleComparisonData.push([item * -1]);
            break;   
               
    }
}
function buildSuperData(data, category, chart) {


    $.each(data, function(index, item) {
    if (item.Enterprise_industry === category ) {
        $.each(item.data, function(index, dataItem) {
            chartType(dataItem, chart);
        })
    }
    });
}
function buildGenderData(data, category, chart) {


    $.each(data, function(index, item) {
    if (item.Enterprise_industry === category ) {
        chartType(item.male, chart);
        chartType(item.female, chart);
    }
    });
}
function buildComparisonData(data, category, chart) {


    $.each(data, function(index, item) {
    if (item.Enterprise_industry === category ) {
            $.each(item.femaleData, function(index, dataItem) {
                chartType(dataItem, chart, "female");
            })
            $.each(item.maleData, function(index, dataItem) {
                chartType(dataItem, chart);
            })
    }
    });
}
function spinner(ref)
{
    $(ref).html('<div class="spinner-border text-white" role="status"><span class="sr-only">Loading...</span> </div>');
}
function GetSuperContributionData() {

    var deffer = $.Deferred();
    
    $.getJSON(webURL6, function(data) {
        
     deffer.resolve(data);
});

    
    return deffer.promise();
}

function numberConvert(num) {
    
     let parse= parseInt(num);
     var dollar;
    if (parse < 0 ? dollar ='-$' :dollar = '$');
   num = Math.abs(parse)
    
    
    if (num >= 1000000000) {
        return dollar + (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return dollar + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return dollar + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return dollar +(num);
}
function convertInt(cost) {
    return parseInt(cost);
}
function totalsInfographic(category){
    $.each(superData,function(index,item){
        
      if(item.Enterprise_industry ===category)
    {
        var $this = $('#avgSuper');
      $this.html(item.Super_Contribution);
      $this.parent().removeClass('danger');
       $this.parent().removeClass('good');
        if(item.projected<0 ? $this.parent().addClass('danger') : $this.parent().addClass('good'));
      animate($this,0);
    }
    });
    $.each(superData,function(index,item){
        
      if(item.Enterprise_industry ===category)
    {
        var $this = $('#jobsLost');
      $this.html(item.jobsLost);
      $this.parent().removeClass('danger');
       $this.parent().removeClass('good');
        if(item.projected<0 ? $this.parent().addClass('danger') : $this.parent().addClass('good'));
      animate($this,1);
    }
    });

}

function animate(ref,int){
      
  var $this = $(ref);
  $({ Counter: 0 }).animate({ Counter: $this.text() }, {
    duration: 1500,
    easing: 'swing',
    step: function () {
        if(int==1)
        {
      $this.text(Math.ceil(this.Counter).toLocaleString() + " jobs lost");
        }
        else
        {
             $this.text("$" + Math.ceil(this.Counter).toLocaleString());
        }
        
    }
  });

}