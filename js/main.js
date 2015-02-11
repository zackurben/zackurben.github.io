window.onload = function() {
    // Scroll to the about section on button click.
    $('.scroll, #about-nav').click(function() {
        $('body').animate({scrollTop: $('#about').offset().top}, 'slow');
    });

    // Scroll to the projects section on button click.
    $('#projects-nav').click(function() {
        $('body').animate({scrollTop: $('#projects').offset().top}, 'slow');
    });

    // Scroll to the contacts section on button click.
    $('#contact-nav').click(function() {
        $('body').animate({scrollTop: $('#contact').offset().top}, 'slow');
    });

    // Scroll to the top of the page on reverse button click.
    $('footer div.scroll-reverse').click(function() {
        $('body').animate({ scrollTop: 0 }, 'slow');
    });

    // Add out chart.js skill graph.
    var ctx = document.getElementById("skill-chart").getContext("2d");
    var data = {
        labels: ['PHP', 'Java', 'HTML5', 'CSS3', 'JavaScript', 'UNIX', 'Git', 'SQL'],
        datasets: [
            {
                label: "Personal",
                fillColor: "rgba(27,188,155,0.5)",
                strokeColor: "#fff",
                pointColor: "rgba(27,188,155,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [4, 8, 4, 4, 2, 3, 2, 4]
            },
            {
                label: "Professional",
                fillColor: "rgba(29,29,29,0.5)",
                strokeColor: "#fff",
                pointColor: "rgba(29,29,29,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [2, 0, 2, 2, 1, 1, 2, 2]
            }
        ]
    };
    var options = {
        //Boolean - Whether to show lines for each scale point
        scaleShowLine : true,

        //Boolean - Whether we show the angle lines out of the radar
        angleShowLineOut : true,

        //Boolean - Whether to show labels on the scale
        scaleShowLabels : false,

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero : true,

        //String - Colour of the angle line
        angleLineColor : "rgba(0,0,0,.1)",

        //Number - Pixel width of the angle line
        angleLineWidth : 1,

        //String - Point label font declaration
        pointLabelFontFamily : "'Arial'",

        //String - Point label font weight
        pointLabelFontStyle : "thin",

        //Number - Point label font size in pixels
        pointLabelFontSize : 16,

        //String - Point label font colour
        pointLabelFontColor : "#1d1d1d",

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 3,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

        //String - Custom text to the tooltip
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value %> years."
    };

    Chart.defaults.global.responsive = true;
    Chart.defaults.global.maintainAspectRatio = true;
    new Chart(ctx).Radar(data, options);
};
