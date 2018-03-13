<tpl id="tplWidgetBase">
    <div class="js-widget-wrapper widget-survey-main-content base">
        <div id="widget-container">
            <div id="pollContainer" class="flex-container">
                <% if ( showHeader ) { %>
                <header style="background-color: <%= headerBarColor %>;">
                    <%
                        var headerText, headerStyles = {};

                        if (headerTextAlignment) {
                            headerStyles['text-align'] = headerTextAlignment;
                        }

                        if ('default' != headerTitleState) {
                            headerText = headerTitle.replace(/<(?:.|\n)*?>/gm, '');
                        }
                        else {
                            if (isWhiteLabel) {
                                headerText = $.i18n.prop('widget_holdings_header_text', partnerName);
                            }
                            else {
                                headerText = $.i18n.prop('widget_default_header_text');
                            }
                        }
                    %>
                    <% if (showHeaderLogo && headerLogo && headerLogo.image && headerLogo.image.url) { %>
                        <% if (headerLogoUrl !== null && typeof headerLogoUrl !== 'undefined') { %>
                            <a href="<%= headerLogoUrl %>"
                               target="_blank"
                               class="link-icon">
                                <img class="widget-icon" src="<%= headerLogo.image.url %>">
                            </a>
                        <% } else { %>
                            <img class="widget-icon" src="<%= headerLogo.image.url %>">
                        <% } %>
                    <% } %>

                    <div class="header-text-wrap"
                        style="text-align:<%= headerStyles['text-align'] %>; color: <%= headerTextColor %>;"
                        title="<%= headerText %>"><%= headerText %></div>
                </header>
                <% } %>

                <div id="pollContent"
                    class="flex-container"
                    style="background-color: <%= hexConvert(backgroundColor, backgroundTransparency) %>;"></div>
                <footer style="background-color: <%= hexConvert(backgroundColor, backgroundTransparency) %>;">
                    <div class="footer-inner-wrapper">
                        <div class="js-answer-action button-action hide">
                            <div class="js-show-all-answers">
                                <span class="show" style="color:<%= pollTaglineTextColor %>;">
                                    <em>
                                        <svg version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            x="0px"
                                            y="0px"
                                            width="18px"
                                            height="11px"
                                            viewBox="-0.5 -1 18 11"
                                            enable-background="new -0.5 -1 18 11"
                                            xml:space="preserve">
                                            <path fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                fill="<%= pollTaglineTextColor %>"
                                                d="M-0.5,1l2-2l7,7l7-7l2,2l-9,9L-0.5,1z"/>
                                        </svg>
                                    </em>
                                    <%= $.i18n.prop('overall.widget.mobile.smart.show_all_answers') %>
                                </span>
                            </div>
                            <div class="js-hide-all-answers">
                                <span class="hide-btn"
                                    style="color:<%= pollTaglineTextColor %>;">
                                    <em>
                                        <svg version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            x="0px"
                                            y="0px"
                                            width="18px"
                                            height="11px"
                                            viewBox="-0.5 -1 18 11"
                                            enable-background="new -0.5 -1 18 11"
                                            xml:space="preserve">
                                            <path fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                fill="<%= pollTaglineTextColor %>"
                                                d="M-0.5,1l2-2l7,7l7-7l2,2l-9,9L-0.5,1z"/>
                                        </svg>
                                    </em>
                                    <%= $.i18n.prop('overall.widget.mobile.smart.hide_all_answers') %>
                                </span>
                            </div>
                        </div>
                        <% if(isWhiteLabel) { %>
                            <% if( config.WIDGET_FOOTER_ICON_POLLER ) { %>
                                <a target="_blank"
                                    href="<%= config.DOMAIN_URL %>"
                                    class="project-icon cstm-icn"
                                    style="background-image: url(<%= frontStatic + config.WIDGET_FOOTER_ICON_POLLER %>);"
                                    title="<%= config.WIDGET_FOOTER_ICON_TITLE %>">&nbsp;</a>
                            <% } %>
                        <% } else if (showFooterLogoAndText && !isWhiteLabel) { %>
                        <a target="_blank"
                            href="<%= conf.DOMAIN_URL %>"
                            class="project-icon"
                            title="<%= $.i18n.prop('widget.smart.visit_us') %>">&nbsp;</a>
                        <% } %>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</tpl>

<tpl id="tplWidgetPollContainer">
    <% if (!isEmptyPoll) { %>
        <%
            var showRelatedLink = poll.get('relatedUrl') && !poll.isRelatedToCurrentUrl;
            var link;
            var className = showLearnMore ? 'js-learn-more' : 'js-one-index';

            if (!showLearnMore && showRelatedLink) {
                link = poll.get('relatedUrl');
            }
            else {
                link = conf.DOMAIN_URL + 'insight.html#!/' + poll.get('id') + '/' + widgetCode + '/' + locale;
            }
        %>

        <div class="poll-question text-<%=pollTaglineAlignment%>" style="color:<%= pollTaglineTextColor %>;">
            <div>
                <% if (showRelatedLink || showLearnMore) { %>
                        <a target="_blank" class="js-tagline-container tagline-link" href="<%= link %>" title="<%= poll.get('tagline') %>">
                            <span class="<%= className %> js-tagline-element js-mobile-widget"><%= poll.get('tagline').replace(/<(?:.|\n)*?>/gm, '') %></span>
                        </a>
                    <% } else { %>
                        <span class="js-tagline-container">
                            <span class="js-tagline-element"><%= poll.get('tagline').replace(/<(?:.|\n)*?>/gm, '') %></span>
                        </span>
                <% } %>
            </div>
        </div>

        <%
            var readMore = (!_.isEmpty(poll.get('relatedUrl')) && !poll.isRelatedToCurrentUrl);
        %>
        <% if (readMore || showSocialButton || showLearnMore) { %>
        <div class="share-read-more">
            <% if (readMore || showLearnMore) { %>
                <div class="btn-style" style="color: <%= pollTaglineTextColor %>; border: 1px solid <%= votingButtonsColor %>" >
                    <a target="_blank" class="read-more-link" href="<%= link %>">
                        <span class="<%= className %>">
                        <% if (readMore && !showLearnMore) { %>
                            <%= $.i18n.prop('widget.smart.read_more') %>
                        <% } else if (showLearnMore) { %>
                            <%= $.i18n.prop('widget.smart.learn_more') %>
                        <% } %>
                        </span>
                    </a>
                </div>
            <% } %>

            <% if (showSocialButton) { %>
            <div class="js-show-sharing-dialog-btn btn-style"
                 style="color: <%= pollTaglineTextColor %>; border: 1px solid <%= votingButtonsColor %>;" >
                    <%= $.i18n.prop('overall.widget.mobile.smart.share') %>
            </div>
            <% } %>
        </div>
        <% } %>
        <div class="img-wrapper responsive-poll-image" data-image-src="<%= poll.get('icon') %>" data-image-type="poll-image">
            <% if (poll.get('votedForSide') || 'closed' === poll.get('status')) { %>
                <div class="totalVotes"><span><%= toFriendlyNubmer(poll.get('totalVotes'), 1) %></span></div>
            <% } else { %>
                <div class="totalViews"><span><%= toFriendlyNubmer(poll.get('totalViews'), 1) %></span></div>
            <% } %>
            <% if ('closed' === poll.get('status')) { %>
                <div class="closed-poll-label"><%= $.i18n.prop('overall.widget.smart.poll_closed') %></div>
            <% } %>

            <!-- prev/next button -->
            <% if (pollsNumber > 1) { %>
                <div id="showPrevPoll" class="show-prev-poll"></div>
                <div id="showNextPoll" class="show-next-poll"></div>
            <% } %>
            <!-- end -->
            <div class="js-sharing-dialog <% if ( !showHeader ) %> no-header <%;%>actions-for-voted-poll-container show-link hide" style="display:none"></div>
        </div>

        <div class="owo-default-bg"></div>

        <div id="poll-info-view-port" class="poll-info-view-port <% if ( !showHeader ) %> no-header-vp <%;%>"></div>

    <% } else { %>
            <div style="position: absolute; top: 50%; width: 100%; text-align: center;"><%= $.i18n.prop('overall.widget.mobile.smart.no_polls') %></div>
    <% } %>
</tpl>

<tpl id="tplWidgetVotingPanel">
<%
    var buttonsNumber = sides.length;
%>
<div class="js-answer-container answers-area" style="background-color: <%= hexConvert(backgroundColor, backgroundTransparency) %>;">
    <% for (var rowNumber = 0; rowNumber < buttonsNumber; rowNumber++) { %>
        <%
            var side = sides.at(rowNumber),
                isSideVoted = (side.get('id') == poll.get('votedForSide')),
                isVotedOrClosed = poll.get('votedForSide') || 'closed' === poll.get('status');
        %>

        <div class="js-poll-answer item">
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
                <div class="answer-name" style="color:<%= pollTaglineTextColor %>;"><%= side.get('answer') %></div>
            </label>

        </div>
    <% } %>
</div>

</tpl>

<tpl id="tplActionsForVotedPoll">
    <div class="actions-for-voted-poll actions-wrapper">
        <div class="js-close-sharing-dialog-btn close-actions-for-voted-poll-btn"></div>
        <% if (showFBLike || showTwitterLike || showGooglePlusLike || showLinkedInLike || showWeiboSharing || showVkontakteSharing) { %>
            <p class="share-opinion-label"><%= $.i18n.prop('overall.widget.mobile.smart.share_this_poll') %></p>
        <% } %>
        <div class="social-btn-container">
        <!--<% if (showFBLike) { %><div class="js-fb-share-btn fb-share-btn"></div><% } %>-->
        <% if (showTwitterLike) { %><div class="js-twitter-share-btn twitter-share-btn"></div><% } %>
        <% if (showGooglePlusLike) { %><div class="js-g-plusone-share-btn g-plusone-share-btn"></div><% } %>
        <% if (showLinkedInLike) { %><div class="js-linked-in-share-btn linked-in-share-btn"></div><% } %>
        <% if (showVkontakteSharing) { %><div class="js-vk-share-btn vk-share-btn"></div><% } %>
        <% if (showWeiboSharing) { %><div class="js-weibo-share-btn weibo-share-btn"></div><% } %>
        </div>
    </div>
</tpl>

<tpl id="tplWidgetEmbedCode">
    <div data-owo-type="widget" data-owo-code="<%= widget.widgetCode %>" data-owo-mode="<%= widget.mode %>"></div>
    <script src="<%= conf.FRONT_STATIC %>poller-constructor.js" type="text/javascript" async></script>
</tpl>

