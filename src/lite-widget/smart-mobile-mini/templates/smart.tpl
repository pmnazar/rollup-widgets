<tpl id="tplWidgetBase">
	<%
		var widgetWidth =  !containerWidth ? '100%' : containerWidth + 'px' ;
	%>
	<div class="base"> 
		<div id="widget-slide-wrapper" class="slide-wrapper" style="width: <%= widgetWidth %>">
		 	<div class="flex-container">
				<div class="poll-wrapper">
					<% if(isEmptyPoll) %><div><%= $.i18n.prop('overall.widget.mobile.smart.no_polls') %></div><% ; %>
				</div>
			</div>
		</div>
		<div id="bullets-nav">
			<!-- tpl: tplPageBullets -->
		</div>
	</div>
</tpl>

<tpl id="tplWidgetPollBase">
    <% _.each(polls.models, function(poll) { %>
    <div class="flex-container" data-poll-id="<%= poll.get('id') %>">
        <div class="poll-wrapper">
            <!-- first screen starts -->
            <div class="headpage abs-full">
                <a class="js-prevent-click js-show-poll vote-image responsive-poll-image"
                    data-image-src="<%= poll.get('icon') %>"
                    data-image-type="poll-image"
                >
                    <span class="top-left">
                        <span class="views"><%= toFriendlyNubmer(poll.get('totalViews'), 1) %></span>
                        <span class="closed-poll <% if(poll.get('status') !== 'closed') { %>hide<% } %>">
                            <%= $.i18n.prop('overall.widget.smart.poll_closed') %>
                        </span>
                    </span>
                    <span class="title" style="color:<%= pollTaglineTextColor %>;">
                        <span class="author hide">By 1World Online</span> <%= poll.get('tagline') %>
                    </span>
                    <span class="bottom-wrapper">
                        <span class="vote-animation">&nbsp;</span>
                        <% if(isWhiteLabel) { %>
                            <% if( config.WIDGET_FOOTER_ICON ) { %>
                                <span class="owo-icon" style="background-image: url(<%= frontStatic + config.WIDGET_FOOTER_ICON %>);">&nbsp;</span>
                            <% } %>
                        <% } else { %>
                            <span class="owo-icon">&nbsp;</span>
                        <% } %>
                    </span>
                </a>
            </div>
            <% if (showLearnMore) { %>
            <% var link = conf.DOMAIN_URL + 'insight.html#!/' + poll.get('id') + '/' + widgetCode + '/' + locale; %>
            <a class="l-m"
                href="<%= link %>"
                style="background-color: <%= votingButtonsColor %>;"
                target="_blank"
                data-type="learn-more"> <span class="js-learn-more"><%= $.i18n.prop('widget.smart.learn_more') %></span>
            </a>
            <% } else if(!_.isEmpty(poll.get('relatedUrl')) && !poll.isRelatedToCurrentUrl) { %>
            <a class="l-m"
                href="<%= poll.get('relatedUrl') %>"
                style="background-color: <%= votingButtonsColor %>;"
                target="_blank"> <span class="js-one-index"><%= $.i18n.prop('widget.smart.read_more') %></span> </a>
            <% } %>
            <!-- options screen starts -->
            <div class="js-options-block options abs-full" style="display:none"></div>
            <!-- sharing screen starts -->
            <div class="js-share-block share abs-full" style="display:none"></div>
        </div>
    </div>
    <% }); %>
</tpl>

<tpl id="tplWidgetOptions">
	<%
	    var buttonsNumber = sides.length;
	%>
	<div class="top-acions">
		<span class="js-back-btn btn back" data-scr="option"></span>
		<% if (showLearnMore) { %>
			<% var link = conf.DOMAIN_URL + 'insight.html#!/' + poll.get('id') + '/' + widgetCode + '/' + locale; %>
			<a class="l-m" href="<%= link %>" style="background-color: <%= votingButtonsColor %>;" target="_blank">
				<span class="js-learn-more"><%= $.i18n.prop('widget.smart.learn_more') %></span>
			</a>
		<% } else if(!_.isEmpty(poll.get('relatedUrl')) && !poll.isRelatedToCurrentUrl) { %>
			<a class="l-m" href="<%= poll.get('relatedUrl') %>" style="background-color: <%= votingButtonsColor %>;" target="_blank">
				<span class="js-one-index"><%= $.i18n.prop('widget.smart.read_more') %></span>
			</a> 
		<% } %>
		<span class="js-show-sharing-btn btn share-btn"></span> 
	</div>
	<div class="answers-area">
    <% for (var rowNumber = 0; rowNumber < buttonsNumber; rowNumber++) { %>
        <%
            var side = sides.at(rowNumber),
                isSideVoted = (side.get('id') == poll.get('votedForSide')),
                isVotedOrClosed = poll.get('votedForSide') || 'closed' === poll.get('status');
        %>
		<div class="item">
            <input  id="answer_<%= side.get('id') %>"
                    data-poll-side-id="<%= side.get('id') %>"
                    data-vote-token="<%= side.get('voteToken') %>"
                    class="vote-radio js-poll-vote" 
                    type="radio"
                    <% if (side.get('id') == poll.get('votedForSide')) { %>checked="checked"<% } %>
                    name="votingButton"
            />

            <label 
                for="answer_<%= 'closed' === poll.get('status') ? 'closed' : side.get('id') %>"
                class="<% if (side.get('id') == poll.get('votedForSide')) { %> voted<% } %>"
                title="<%= side.get('answer') %><%if (poll.get('votedForSide') || 'closed' === poll.get('status')){ %> (<%= side.get('votesPercent') %>%)<%}%>">
                <span class="circle-area" style="border-color: <%= votingButtonsColor %>; background-color: <%= votingButtonsColor %>;"></span>
                <% if (isVotedOrClosed) {%>
                    <div class="votes-percentage" style="color:<%= pollTaglineTextColor %>;"> <b><%= side.get('votesPercent') + '%' %></b> </div>
                <% } %>
                <div class="answer-name" style="color:<%= pollTaglineTextColor %>;">
                	<%= side.get('answer').length > 50 && isVotedOrClosed ? side.get('answer').substr(0, 40) + '...' : side.get('answer') %>
                </div>
            </label>
		</div>
	<% } %>
	
	</div>
</tpl>

<tpl id="tplWidgetShare">
	<div class="top-acions">
		<span class="js-back-btn btn back" data-scr="share"></span> 
		<span class="btn next">
			<span class="text">next</span><span class="hand">&nbsp;</span>
		</span>
	</div>
	<div class="sharing-wrapper">
		<form id="" class="social-btn-container">
	        <!--<% if (showFBLike) { %><div class="js-fb-share-btn fb-share-btn"></div><% } %>-->
	        <% if (showTwitterLike) { %><div class="js-twitter-share-btn twitter-share-btn"></div><% } %>
	        <% if (showGooglePlusLike) { %><div class="js-g-plusone-share-btn g-plusone-share-btn"></div><% } %>
	        <% if (showLinkedInLike) { %><div class="js-linked-in-share-btn linked-in-share-btn"></div><% } %>
	        <% if (showVkontakteSharing) { %><div class="js-vk-share-btn vk-share-btn"></div><% } %>
	        <% if (showWeiboSharing) { %><div class="js-weibo-share-btn weibo-share-btn"></div><% } %>  
		</form>
		<% if (showLearnMore) { %>
			<% var link = conf.DOMAIN_URL + 'insight.html#!/' + poll.get('id') + '/' + widgetCode + '/' + locale; %>
			<a class="l-m" href="<%= link %>" style="background-color: <%= votingButtonsColor %>;" target="_blank" data-type="learn-more">
				<span class="js-learn-more"><%= $.i18n.prop('widget.smart.learn_more') %></span>
			</a>
		<% } else if(!_.isEmpty(poll.get('relatedUrl')) && !poll.isRelatedToCurrentUrl) { %>
			<a class="l-m" href="<%= poll.get('relatedUrl') %>" style="background-color: <%= votingButtonsColor %>;" target="_blank">
				<span class="js-one-index"><%= $.i18n.prop('widget.smart.read_more') %></span>
			</a>
		<% } %>
	</div>
</tpl>

<tpl id="tplWidgetPageBullets">
    <ul class="js-bullets-list other-polls-bullets">
    <% for (var i = 0; i < qty; i++) { %>
		<li <%if (i === 0) { %>class="current-poll"<% } %>></li>
    <% } %>
    </ul>
</tpl>