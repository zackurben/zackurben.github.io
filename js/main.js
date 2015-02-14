// Chart reference.
var c = {};

// 2D canvas context.
var ctx = document.getElementById("skill-chart").getContext("2d");

// Skills data.
var data = {
    labels: ['Java', 'HTML5', 'SQL', 'CSS3', 'JavaScript', 'UNIX', 'PHP', 'Git'],
    datasets: [
        {
            label: "Personal",
            fillColor: "rgba(27,188,155,0.5)",
            strokeColor: "#fff",
            pointColor: "rgba(27,188,155,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [8, 4, 4, 4, 2, 3, 4, 3]
        },
        {
            label: "Professional",
            fillColor: "rgba(29,29,29,0.5)",
            strokeColor: "#fff",
            pointColor: "rgba(29,29,29,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [0, 2, 2, 2, 1, 2, 2, 2]
        }
    ]
};

// Current chart specifics.
var personal = {
    color: '#1d1d1d',
    font: 'Open Sans, sans-serif',
    size: parseInt($('html, body').css('font-size').split('p')[0]) || 24,
    style: '300'
};

// Override base Chartjs options.
var options = {
    responsive: true,
    maintainAspectRatio: true,

    pointLabelFontColor : personal.color,
    pointLabelFontFamily : personal.font,
    pointLabelFontSize : personal.size,
    pointLabelFontStyle : personal.style,

    scaleFontColor: personal.color,
    scaleFontFamily: personal.font,
    scaleFontSize: personal.size,
    scaleFontStyle: personal.style,

    tooltipFontColor: '#fff',
    tooltipFontFamily: personal.font,
    tooltipFontSize: personal.size,
    tooltipFontStyle: personal.style,

    tooltipTitleFontColor: '#fff',
    tooltipTitleFontFamily: personal.font,
    tooltipTitleFontSize: personal.size,
    tooltipTitleFontStyle: '400',

    scaleLabel: '<%=value%>',

    //String - A legend template
    legendTemplate: '<% for (var i=0; i<datasets.length; i++){%><i class="fa fa-square" style=\'color:<%=datasets[i].fillColor%>\'></i>&nbsp;<%if(datasets[i].label){%><%=datasets[i].label%><br><%}%><%}%>',

    //String - Custom text to the tooltip
    multiTooltipTemplate: '<%= datasetLabel %> - <%= value %> years.'
};

var chart = function() {
    var c = {};
    personal.size = parseInt($('html, body').css('font-size').split('p')[0]);
    ctx.canvas.width = 512;
    ctx.canvas.height = 512;

    c = new Chart(ctx).Radar(data, options);
    c.scale.fontSize = personal.size;
    c.scale.showLabels = true;
    c.update();

    $('#skill-legend').html(c.generateLegend());
    return c;
};

// On page load, register scroll events and create out Chart.
window.onload = function() {
    var navHeight = $('nav').height(),
        paddingHeight = parseInt($('.content').css('padding-top').split('p')[0]),
        scrollOffset = Math.abs(paddingHeight - navHeight);

    // Hack for small-width devices, to fix nav height issues, due to dynamic DOM elements.
    if ($(window).width() < 728) {
        scrollOffset = Math.abs(paddingHeight + navHeight);
    }

    // Scroll to the about section on button click.
    $('.scroll, #about-nav').click(function() {
        $('html, body').animate({scrollTop: $('#about').offset().top - scrollOffset}, 'slow');
    });

    // Scroll to the projects section on button click.
    $('#projects-nav').click(function() {
        $('html, body').animate({scrollTop: $('#projects').offset().top - scrollOffset}, 'slow');
    });

    // Scroll to the contacts section on button click.
    $('#contact-nav').click(function() {
        $('html, body').animate({scrollTop: $('#contact').offset().top - scrollOffset}, 'slow');
    });

    // Scroll to the top of the page on reverse button click.
    $('footer div.scroll.reverse').click(function() {
        $('html, body').animate({scrollTop: 0}, 'fast');
    });

    c = chart();
};

// Add a resize event listener to remake the chart with responsive font-sizes.
window.addEventListener('resize', function(){
    c = chart();
});
