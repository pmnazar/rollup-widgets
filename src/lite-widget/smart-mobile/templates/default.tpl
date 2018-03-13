<!-- 
	banner/widget class name

	top banner: #owo-banner-top
	bottom banner: #owo-banner-bottom
	left banner: #owo-banner-left
	right banner: #owo-banner-right
 -->
<css id="main">
	div#owo-widget {
		position:relative;
        text-align:center;
	}
    div#owo-banner-pollRotation, div#owo-banner-beforeQuizResult {
        position:absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
        background: rgba(0, 0, 0, 0.85);
        overflow: hidden;
    }
    div#owo-banner-pollRotation .dvb, div#owo-banner-beforeQuizResult .dvb {
        margin: 36px 0 0;
        text-align: center;
    }
    a.owo-customDialogCloser {
        position: absolute;
        top:0;
        right:0;
        z-index: 10;
        width:48px;
        height:48px;
        background-position:50% 50%;
        background-repeat:no-repeat;
        background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIxN3B4IiBoZWlnaHQ9IjE3cHgiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTcgMTciIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwb2x5Z29uIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjY2NjY2NjIiBwb2ludHM9IjE2LjcwNywxLjcwNyAxNS4yOTMsMC4yOTMgOC41LDcuMDg2IDEuNzA3LDAuMjkzIAoJCQkwLjI5MywxLjcwNyA3LjA4Niw4LjUgMC4yOTMsMTUuMjkzIDEuNzA3LDE2LjcwNyA4LjUsOS45MTQgMTUuMjkzLDE2LjcwNyAxNi43MDcsMTUuMjkzIDkuOTE0LDguNSAJCSIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo=');
        background-size:18px;
        background-color:#0b0b0b;
        color: transparent;
        text-indent:-1000px;
    }
    a.owo-customDialogCloser + .dvb {
        margin:0 !important;
        top: 50%;
        right:0;
        left:0;
         -webkit-transform: translateY(-50%);
         -ms-transform: translateY(-50%);
         transform: translateY(-50%);
         position:absolute;
    }
    a.owo-dialogCloser {
        position: absolute;
        top:0;
        right:0;
        left:0;
        padding:0 10px;
        line-height: 36px;
        font-size:12px;
        text-decoration: underline !important;
        color: #5F5F5F !important;
        z-index: 21;
        font-family:Arial,Helvetica,sans-serif;
        background: #F2F2F2 none repeat scroll 0% 0%;
        text-align:right;
    }    
	div#owo-banner-top, div#owo-banner-bottom {
        text-align: center;
        position:relative;
        overflow:hidden;
    }
    div#owo-banner-top iframe, div#owo-banner-bottom iframe {
        position: absolute;left: 0; margin: auto; right: 0;
    }
    div#owo-banner-top iframe {bottom:0}
    div#owo-banner-bottom iframe {top:0}
    div.owo-main-wrapper {
        display: table;
        margin:0;
        padding:0;
    }
    div.owo-full-width {width:100%;}
    div.owo-main-wrapper iframe {vertical-align:bottom; max-height:1000px !important}
    div.owo-wrapper {
        display:table-cell;
        margin:0;
        padding:0;
        vertical-align:middle;
    }
	div#owo-banner-left {
		display:table-cell;
        margin:0;
        padding:0;
        vertical-align:middle;
        position:relative;
	}
	div#owo-banner-right {
		display:table-cell;
        margin:0;
        padding:0;
        vertical-align:middle;
        position:relative;
	}
</css>