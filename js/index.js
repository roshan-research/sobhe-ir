function animateOverlay(id) {
    $('.overlay').fadeOut(500);
    setTimeout(function(){
        $(id).fadeIn(500);
    }, 500);
}

function infiniteAnimation(){
    animateOverlay(".golrokh");
    setTimeout(function(){animateOverlay(".naghsh")}, 6000);
    setTimeout(function(){animateOverlay(".alefba")}, 12000);
    setTimeout(function(){ infiniteAnimation()}, 18000);
}
$(document).ready(function(){
    // $(function(){
    //     $("#typed").typed({
    //         strings: ["نویسه خوان الف", "برای خواندن فارسی", "انگلیسی و عربی"],
    //         typeSpeed: 30,
    //         loop: true
    //     });
    // });

    $(".idea-block").hover(function(){
        var block = $(this);
        block.find("img").animate({"marginTop" : 10}, 500, 'easeOutCirc');
        block.find("h3").animate({"marginTop" : 30}, 500, 'easeOutCirc');
        block.find("p").toggleClass("visible");
    },
    function(){
        var block = $(this);
        block.find("img, h3").animate({"marginTop" : 70}, 500, 'easeOutCirc');
        block.find("p").toggleClass("visible");
    });

    
    $("button#golrokh").addClass('selected')
    animateOverlay(".golrokh");
    $("button.offset").click(function(e){
        if($(e.target).hasClass('selected')){
            return;
        }else{
            $('button.offset').removeClass('selected');
            $(e.target).addClass('selected')
        }
        animateOverlay('.' + e.target.id);
    });

    $("div.text-colored > *").click(function(e){
        window.open(e.currentTarget.closest(".text-colored").dataset.href, "_blank");
    });


});

window.onload = function(){
  $('body > #load').fadeOut(1000,function(){$(this).remove();});
};
