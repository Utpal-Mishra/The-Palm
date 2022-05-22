$(document).ready(function() {
    $('#autowidth').lightSlider({
        autoWidth:true,
        loop:true,
        onSliderLoad: function(){
            $('#autowidth').removeClass('cS-hidden');
        }
    });
});
        