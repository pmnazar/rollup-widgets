<tpl id="tplWideWidgetBase">
    <div class="js-widget-wrapper">
        <div id="widget-container" class="js-widget-container relative-widget-wrapper">
            <div id="pollContainer" class="poll-container"></div>
        </div>
    </div>
</tpl>

<tpl id="tplTaglineArea">
    <span class="p-tag">
        <span class="js-tagline-element">
            <%= poll.get('tagline') || poll.get('tagLine') %>
        </span>
    </span>
</tpl>

<tpl id="tplWideWidgetPollContainer">
    <div class="relative-widget-wrapper js-relative-crow-wrapper relative">
        <div class="base p-absolute">
            <div class="widgetContent js-main-wrapper"
                 style="background-color: <%= hexConvert(backgroundColor, 100) %>;">
                <% if ( showHeader ) { %>
                    <div class="headerContainer"
                         style="color: <%= headerTextColor %>; background-color: <%= headerBarColor %>;">
                        <div class="widget-header">
                            <% if (showHeaderLogo && headerLogo && headerLogo.image && headerLogo.image.url) { %>
                                <% if (headerLogoUrl !== null && typeof headerLogoUrl !== 'undefined') { %>
                                    <a href="<%= headerLogoUrl %>"
                                       target="_blank"
                                       class="link-icon">
                                        <img class="widget-icon" src="<%= headerLogo.image.url %>" alt=""/>
                                    </a>
                                <% } else { %>
                                    <img class="widget-icon" src="<%= headerLogo.image.url %>" alt=""/>
                                <% } %>
                            <% } %>
                            <div class="js-responsive-title header-text-wrap"
                                 style="<%= headerTextAlignment ? 'text-align: '+ headerTextAlignment : ''%>"
                                 title="<%= headerText %>">
                                <%= headerText %>
                            </div>
                        </div>
                    </div>
                <% } %>

                <% if (!isEmptyPoll) {
                    var showRelatedLink = poll.get('relatedUrl') && !poll.isRelatedToCurrentUrl;

                    if (enableCrowPolls) { %>
                        <div id="topPanel" class="topPanel">
                            <div class="p-tag-c">
                                <div id="tagline-crow-link" class="crowd-bar"></div>
                            </div>
                        </div>
                    <% } %>
                    <div id="poll-info-view-port" class="poll-info-view-port">
                        <%
                            var insightUrl = conf.DOMAIN_URL + 'insight.html#!/' + poll.get('id') + '/' + widgetCode + '/' + locale;
                            var pollUrl = conf.DOMAIN_URL + '#!/poll/' + poll.get('id');
                            var pollIcon = poll.get('icon');
                        %>

                        <% if(showLearnMore) { %>
                            <a target="_blank"
                               class="js-poll-icon poll-icon responsive-poll-image"
                               href="<%= insightUrl %>"
                                <%= pollIcon ? 'data-image-src="' + pollIcon + '"' : '' %>
                            >
                                <div class="tagline-area"></div>
                            </a>
                        <% } else { %>
                            <div
                                    class="js-poll-icon poll-icon responsive-poll-image"
                                    <%= pollIcon ? 'data-image-src="' + pollIcon + '"' : '' %>
                            >
                                <div class="tagline-area"></div>
                            </div>
                        <% } %>

                        <div class="wrap-els">
                            <!-- readMoreBtn -->
                            <% if (poll.get('relatedUrl')) { %>
                                <div class="js-read-more-btn js-read-more-container read-more-btn">
                                    <a target="_blank"
                                       href="<%- poll.get('relatedUrl') %>"
                                       class="read-more-btn-link"
                                    >
                                        <span class="wrap-rm">
                                            <%= poll.get('dataPointTagLine') ?
                                                    poll.get('dataPointTagLine')
                                                    : $.i18n.prop('widget.smart.read_more')
                                            %>
                                        </span>
                                    </a>
                                </div>
                            <% } %>
                            <!-- end -->
                            <div class="js-counters-container counters-container">
                                <% if (poll.get('votedForSide') || 'closed' === poll.get('status')) { %>
                                <div class="totalVotes">
                                    <span></span>
                                    <% if (poll.get('totalVotes') >= conf.NEW_POLL_CRITERION) { %>
                                    <%= toFriendlyNumber(poll.get('totalVotes'), 1) %>
                                    <% } else { %>
                                    <%= $.i18n.prop('widget.wide.total_votes_new') %>
                                    <% } %>
                                </div>
                                <% } else { %>
                                <div class="totalViews">
                                    <span></span><%= toFriendlyNumber(poll.get('totalViews'), 1) %>
                                </div>
                                <% } %>
                            </div>
                        </div>

                        <div class="owo-default-bg"></div>
                        <div class="js-a-viewport a-viewport <%= isVotingPanelExpanded ? 'hide-tmp' : ''%> <%= (poll.get('relatedUrl') && !poll.isRelatedToCurrentUrl) ? 'topmore': ''%>">
                            <div class="a-viewport-cont" id="actionViewPort"></div>
                        </div>
                        <% if ('closed' === poll.get('status')) { %>
                            <div class="js-closed-poll-label closed-poll-label"></div>
                        <% } %>
                    </div>
                    <% if (pollsNumber > 1) { %><div class="js-show-next-poll show-next-poll"></div><% } %>
                    <% if (pollsNumber > 1) { %><div class="js-show-prev-poll show-prev-poll"></div><% } %>
                    <!-- Complete poll insight box starts -->
                    <div class="js-actions-for-voted-poll-container"></div>
                <% } else { %>
                <% if (!enableCrowPolls) { %>
                <div style="position: absolute; top: 50%; width: 100%; text-align: center;"><%= $.i18n.prop('overall.widget.mobile.smart.no_polls') %></div>
                <% } %>
                <% } %>

                <div class="bpc">
                    <div id="bottomPanelContainer"></div>
                </div>
            </div>
        </div>
    </div>
</tpl>

<tpl id="crowTaglineLink">
    <%
    var approved = crowdPollStatus !== 'approved' ?
            $.i18n.prop('widget_default_crow_approve')
            : $.i18n.prop('widget_default_crow_approved');
    var rejected = crowdPollStatus !== 'rejected' ?
            $.i18n.prop('widget_default_crow_reject')
            : $.i18n.prop('widget_default_crow_rejected');
    %>

    <% if (isCrowdPoll) { %>
    <%
        var userAvatarLink = 'https://web-1worldonline-biz.s3.amazonaws.com/external/qa/2.20-SNAPSHOT/img/common-web/default-avatar-light-45x45.png';
        var userAvatarSmall = image ? image + '-48x48' : userAvatarLink;
    %>
    <div class="left-float js-author-crow author-crow hide">
        <div class="av">
            <img src="<%= userAvatarSmall %>"/>
        </div>
        <div class="an">
            <em><%= $.i18n.prop('widget_default_crow_asked_by') %></em><br/>
            <span class="an-l"><%= name %></span>
        </div>
    </div>
    <% } %>
    <div class="right js-crow-status-bar">
        <% if (canManage && isCrowdPoll) { %>
            <a href="<%= conf.DOMAIN_URL %> <%= dashboardLink %>"
               target="_blank"
               class="ask-link relative dashboard"
            >
                <span class="vertical-wrapper"><%= $.i18n.prop("widget_default_crow_dashboard") %></span>
            </a>
            <a href="javascript:void(0)"
               class="ask-link relative approve js-set-crowd-status <%= crowdPollStatus === 'approved' ? 'approved' : '' %>"
               action-for="PollCrowdsourceApprove"
            >
                <span class="vertical-wrapper"><%= approved %></span>
            </a>
            <a href="javascript:void(0)"
               class="ask-link relative reject js-set-crowd-status <%= crowdPollStatus === 'rejected' ? 'active' : '' %>"
               action-for="PollCrowdsourceReject"
            >
                <span class="vertical-wrapper"><%= rejected %></span>
            </a>
        <% } else if(!isCrowdPoll || (!canManage && isCrowdPoll)) { %>
            <a href="<%=linkToScmCreatePoll%>"
               target="_blank"
               class="ask-link relative start-crow-poll js-start-crow-poll"
               style="border-color: <%= votingButtonsColor %>; color: <%= votingButtonsColor %>;"
            ><%= $.i18n.prop('widget_default_crow_tagline_text') %></a>
        <% } %>
    </div>
</tpl>

<tpl id="tplBottomPanel">
    <div class="bottom-panel">
        <% var redirectUrlVotedPollBottom = conf.DOMAIN_URL + 'insight.html#!/' + poll.get('id') + '/' + widgetCode + '/' + locale; %>

        <% if(showLearnMore) { %>
            <a href="<%= redirectUrlVotedPollBottom %>"
               class="stats-lnk js-learn-more <%= isVoted ? 'vtd' : ''%>"
               target="_blank"
            >   <em>&nbsp;</em><span>Poll insights</span>
            </a>
        <% } %>

        <div class="wrap-soc">
            <div class="social-btn-container js-social-btns">
                <!--<% if (showFBLike) { %><div class="js-fb-share-btn fb-b"></div><% } %>-->
                <% if (showTwitterLike) { %><div class="js-twitter-share-btn t-b"></div><% } %>
                <% if (showGooglePlusLike) { %><div class="js-g-plusone-share-btn g-b"></div><% } %>
                <% if (showLinkedInLike) { %><div class="js-linked-in-share-btn li-b"></div><% } %>
                <% if (showWeiboSharing) { %><div class="js-weibo-share-btn wb-b"></div><% } %>
                <% if (showVkontakteSharing) { %><div class="js-vk-share-btn vk-b"></div><% } %>
            </div>
            <em class="fakelink js-show-sharing">&nbsp;</em>
        </div>
        <div class="w-score-project">
            <% if (showFooterLogoAndText) { %>
            <div class="project">
                <% if (isWhiteLabel) { %>
                    <div class="projectLabel js-brand-title">
                        <%= $.i18n.prop('default_footer_text_holdings', config.WIDGET_FOOTER_PARTNER_NAME ?
                                config.WIDGET_FOOTER_PARTNER_NAME
                                : partnerName) %>
                    </div>
                    <% if( config.WIDGET_FOOTER_ICON_POLLER ) { %>
                        <a target="_blank"
                           href="<%= config.DOMAIN_URL %>"
                           class="project-icon cstm-icn"
                           style="background-image: url(<%= frontStatic + config.WIDGET_FOOTER_ICON_POLLER %>);"
                           title="<%= config.WIDGET_FOOTER_ICON_TITLE %>">&nbsp;</a>
                    <% } %>
                <% } else if ('custom' === widgetTitleState) { %>
                    <div class="projectLabel">
                        <%= widgetTitle.replace(/<(?:.|\n)*?>/gm, '') %>
                    </div>
                    <a target="_blank" href="<%= conf.DOMAIN_URL %>" class="project-icon"
                       title="<%= $.i18n.prop('widget.smart.visit_us') %>">&nbsp;</a>
                <% } else { %>
                    <a target="_blank" href="<%= conf.DOMAIN_URL %>" class="project-icon"
                       title="<%= $.i18n.prop('widget.smart.visit_us') %>">&nbsp;</a>
                <% } %>
            </div>
        <% } %>

        <% if (showUserScore) { %>
            <div class="count-of-user-score" id="count-of-user-score"><%= countOfUserScore %></div>
        <% } %>
        </div>
    </div>
</tpl>

<tpl id="tplWideWidgetVotingPanel">
    <% var buttonsNumber = sides.length; %>
    <div class="a-viewport-inner">
        <% if (isInvisibleButtons) { %>
        <div id="buttons-switcher" class="buttons-switcher-container relative <%= expanded ? 'expanded' : '' %>">
            <div class="buttons-switcher-bg"
                 style="background-color:<%= hexConvert(backgroundColor, backgroundTransparency) %>"
            >&nbsp;
            </div>
            <div class="buttons-switcher <%= expanded ? 'expanded' : '' %>">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                     y="0px"
                     width="15px" height="10px" viewBox="0 0 15 10" enable-background="new 0 0 15 10"
                     xml:space="preserve">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0,5l7.5-5L15,5v3L7.5,3L0,8V5z"/>
                    </svg>
            </div>
        </div>
        <% } %>
        <div id="buttonsContainer"
             class="voting-panel <%= isInvisibleButtons ? 'isInvisibleButtons' : '' %> <%= expanded ? 'expanded' : '' %> <%= pollSideTextTruncate ? 'short-opt' : '' %>"
             style="background-color: <%= hexConvert(backgroundColor, backgroundTransparency) %>;">
            <div class="buttons-container relative">
                <div id="questions-table" class="d-t questions-table">
                    <% for (var rowNumber = 0; rowNumber < buttonsNumber; rowNumber++) { %>
                    <% var side = sides.at(rowNumber); %>
                    <% var sideColor = poll.get('votedForSide') || 'closed' === poll.get('status') ? side.get('sideColor') : votingButtonsColor; %>
                    <label for="answer_<%= 'closed' === poll.get('status') ? 'closed' : side.get('id') %>"
                           class="check-box-main-wrap relative<% if (side.get('id') == poll.get('votedForSide')) { %> voted<% } %>"
                            <% if (pollSideTextTruncate) { %>
                           title="<%= side.get('answer').replace(/<(?:.|\n)*?>/gm, '') %>
                           <% if (poll.get('votedForSide') || 'closed' === poll.get('status')) { %> (<%= side.get('votesPercent') %>%)<% } %>"
                            <% } %>
                    >
                        <div class="d-t relative">
                            <span class="js-button radio-button d-t-c">
                                <input id="answer_<%= side.get('id') %>"
                                       data-poll-side-id="<%= side.get('id') %>"
                                       data-vote-token="<%= side.get('voteToken') %>"
                                       class="css-checkbox js-poll-vote"
                                       type="radio"
                                       <% if (side.get('id') == poll.get('votedForSide')) { %>checked="checked"
                                        <% } %>
                                       name="votingButton"/>
                                <span class="css-checkbox js-poll-vote"
                                      style="border-color: <%= votingButtonsColor %>; background-color: <%= votingButtonsColor %>;">
                                    &nbsp;
                                </span>
                            </span>
                            <span style="color: <%= pollTaglineTextColor %>;"
                                  class="js-answer answer ellipsis-shorten <% if (poll.get('votedForSide') || 'closed' === poll.get('status')) { %>closed-answer<% } %>">
                                <%= side.get('answer').replace(/<(?:.|\n)*?>/gm, '') %>
                            </span>
                            <% if (poll.get('votedForSide') || 'closed' === poll.get('status')) { %>
                            <div class="votes-percents <% if (showVotersCount) { %>wider<% } %> d-t-c">
                                <% if (showVotersCount) { %>
                                <span class="votes-percentage" style="color: <%= pollTaglineTextColor %>">
                                        <b><%= toFriendlyNumber(side.get('votes'), 1) %></b>
                                    </span>
                                <span style="color:#818181"> / </span>
                                <% } %>
                                <span class="js-votes-percentage votes-percentage"
                                      style="color: <%= pollTaglineTextColor %>">
                                        <b><%= side.get('votesPercent') %>%</b>
                                    </span>
                            </div>
                            <% } %>
                        </div>
                        <% if (poll.get('votedForSide') || 'closed' === poll.get('status')) { %>
                        <span class="percents-bar">
                                <span class="percents-bar-in"
                                      style="width: <%= side.get('votesPercent') + '%' %>; background: <%= votingButtonsColor %>;">
                                </span>
                            </span>
                        <% } %>
                    </label>
                    <% } %>
                </div>
            </div>
        </div>
    </div>
</tpl>

<tpl id="tplActionsForVotedPoll">
    <div class="js-actions-for-voted-poll"></div>
</tpl>

<tpl id="tplEmbedCodeDialog">
    <div class="embed-code-dialog-container p-absolute">
        <div class="js-close-embed-code-dialog x-emcode x-all"></div>
        <div class="embed-code-dialog d-t">
            <div class="embed-code-dialog-content d-t-c">
                <div class="embed-code-dialog-title">
                    <%= $.i18n.prop('overall.widget.smart.show_widget_embed_code') %>
                </div>
                <div class="embed-code"><textarea title=""><%= _.escape(embedCodeHtml) %></textarea></div>
            </div>
        </div>
    </div>
</tpl>

<tpl id="tplWidgetEmbedCode">
    <div data-owo-type="widget" data-owo-code="<%= widget.widgetCode %>" data-owo-mode="<%= widget.mode %>"></div>
    <script src="<%= conf.FRONT_STATIC %>poller-constructor.js" type="text/javascript" async></script>
</tpl>

<tpl id="tplClosedPollLabel">
    <div class="poll-closed-info vertical-wrapper">
        <div class="wrap-text"><%= $.i18n.prop('overall.widget.smart.poll_closed') %></div>
    </div>
</tpl>