<tpl id="tplDfpResponsive">
<script type = 'text/javascript'>
    var googletag = googletag || {};
    	googletag.cmd = googletag.cmd || [];

	(function() {
	    var gads = document.createElement('script');
	    gads.async = true;
	    gads.type = 'text/javascript';
	    var useSSL = 'https:' == document.location.protocol;
	    gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
	    var node = document.getElementsByTagName('script')[0];
	    node.parentNode.insertBefore(gads, node);
	})(); 
</script>

<script type="text/javascript">
  <% 
  	var sizeArray = '';

  	for (var i = 0; i < responsiveSize.length; i++) {
  		var value = '[' + responsiveSize[i] + ']';
  		if (responsiveSize.indexOf(responsiveSize[i]) !== responsiveSize.length-1) value += ',';
  		sizeArray += value;
  	}
  %>
  googletag.cmd.push(function() {
    googletag.defineSlot('/58277158/<%= dfpCode %>', [<%= sizeArray  %>], 'div-gpt-ad-1455787309296-0').addService(googletag.pubads());
    googletag.pubads().collapseEmptyDivs();
    googletag.pubads().enableSingleRequest();
    googletag.pubads().addEventListener('slotRenderEnded', function(event) {
    var dfpStatus = event;

      if (!dfpStatus.isEmpty) {
        var height = event.size[1];
        var parentDocument = parent.document;
        var parentElement = parentDocument.getElementById('ad-' + '<%= id %>').parentNode;
        var bannerType = '<%= bannerType %>';

          parentDocument.getElementById('ad-' + '<%= id %>').setAttribute('height', height + 'px');
          parentElement.setAttribute('style', 'height:' + height + 'px');
          
          if (window.parent.oneWorldPoller) {
              switch (bannerType) {
                  case 'adUnitPlacementOnTop':
                      window.parent.oneWorldPoller.bannerProp['<%= widgetCodeToken %>'].topBannerHeight = height;
                      window.parent.oneWorldPoller.checkWidgetVisibility('actionWithArguments', '<%= widgetCodeToken %>', 'setWidgetVisibility');
                  break;
                  case 'adUnitPlacementOnBottom':
                      window.parent.oneWorldPoller.bannerProp['<%= widgetCodeToken %>'].bottomBannerHeight = height;
                      window.parent.oneWorldPoller.checkWidgetVisibility('actionWithArguments', '<%= widgetCodeToken %>', 'setWidgetVisibility');
                  break;
              }
          }
      }
    });
    googletag.enableServices();
  });
</script>
<div id='div-gpt-ad-1455787309296-0'>
	<script type="text/javascript">
	googletag.cmd.push(function() { googletag.display('div-gpt-ad-1455787309296-0'); });
	</script>
</div>
</tpl>