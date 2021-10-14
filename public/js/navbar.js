$(function(){
    var current = location.pathname;
    $('.nav-link-container a').each(function(){
        var $this = $(this);
        // if the current path is like this link, make it active
        if($this.attr('href').indexOf(current) !== -1){
            $this.addClass('active');
        }else{
            $this.removeClass('active');
            
        }
    })
})