<tpl id="tplInsightContainer">
    <div class="colored-bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 360"><path d="M0,0H1400V260L0,360V0Z" transform="translate(0 0)" style="fill:<%= sectionColor %>;fill-rule:evenodd"/></svg>
    </div>

    <div class="inner-links container js-inner-links-container"></div>
    <div class="js-poll-info-section"></div>
    <div class="js-main-ads-with-video-container main-ads-with-video-container"></div>
    <div class="js-no-video-side-ads-container"></div>
    <div class="js-ldp-section container"></div>
    <div class="js-maps-section container"></div>
    <div class="js-poll-stats-section container"></div>
    <div class="js-compare-contrast-section compare-contrast-section container"></div>
    <div class="js-comments-section container"></div>
    <div class="js-related-and-social-section container"></div>

    <div class="js-insight-footer insight-footer"></div>
</tpl>

<tpl id="tplInsightInnerLinks">
    <div class="row sharing-fixed">
        <div class="js-partner-logo-header partner-logo-header-mob" style="background-color: <%= headerBackgroundColor %>"></div>

        <div class="sharing-wrapper">
            <div class="poll-info-top">
                <table cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td class="prev-top-wrap js-prev-poll hide">
                            <a href="" class="prev-top"></a>
                        </td><td class="img-box">
                            <div class="js-img-box-poll-info"></div>
                        </td>
                        <td>
                            <div class="img-wrap">
                                <span class="poll-name js-i-poll-s-tagline"></span>
                            </div>
                        </td>
                        <td class="sharing-tab-wrapper">
                            <div class="js-sharing-section sharing-section"></div>
                        </td>
                        <td class="prev-top-wrap js-next-poll hide">
                            <a href="" class="next-top"></a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <input type="checkbox" id="button-top" class="action-btn">
            <div class="sharing-mob">
            <div class="js-sharing-section sharing-section narrow-sharing"></div></div>
         <label class="btn-block" for="button-top"></label>
    </div>
    <div class="clear"></div>

    <div class="row bottom-border-fixed">
        <ul>
            <% if (insightEntity.displaySectionLeadDataPoint) { %>
            <li class="js-insight-lead-dp-shcut">
                <a href="#insight-ldp-section" class="lead-dp js-insight-nav">
                    <span class="for-wide"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-lead-data-point-section_label_shortcut_section_name_wide') %></span><span class="for-narrow"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-lead-data-point-section_label_shortcut_section_name_narrow') %></span>
                </a>
            </li>
            <% } %>
            <% if (insightEntity.displaySectionVotingMap) { %>
            <li class="js-insight-map-shcut relative-loader js-nav-loader-section">
                <%= loaderIcon %>
                <a href="#insight-map-section" class="interact js-insight-nav">
                    <span class="for-wide"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-map.label.shortcut_section_name_wide') %></span><span class="for-narrow"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-map.label.shortcut_section_name_narrow') %></span>
                </a>
            </li>
            <% } %>
            <% if (insightEntity.displaySectionPollStats) { %>
            <li class="js-insight-p-stats-shcut relative-loader js-nav-loader-section">
                <%= loaderIcon %>
                <a href="#insight-poll-stats-section" class="poll-statcs js-insight-nav">
                    <span class="for-wide"><%= $.i18n.mProp(insightLocale, 'ui.overall.poll-stats-section_shortcut_label_section_name_wide') %></span><span class="for-narrow"><%= $.i18n.mProp(insightLocale, 'ui.overall.poll-stats-section_shortcut_label_section_name_narrow') %></span>
                </a>
            </li>
            <% } %>
            <% if (insightEntity.displaySectionCompareAndContrast) { %>
            <li class="js-insight-compare-shcut relative-loader js-nav-loader-section">
                <%= loaderIcon %>
                <a href="#insight-compare-and-contrast-section" class="compare js-insight-nav">
                    <span class="for-wide"><%= $.i18n.mProp(insightLocale, 'ui.overall.compare-contrast_label_shortcut_section_name_wide') %></span><span class="for-narrow"><%= $.i18n.mProp(insightLocale, 'ui.overall.compare-contrast_label_shortcut_section_name_narrow') %></span>
                </a>
            </li>
            <% } %>
            <% if (insightEntity.displaySectionRelatedAndSocial) { %>
            <li class="js-insight-related-shcut relative-loader js-nav-loader-section">
                <%= loaderIcon %>
                <a href="#insight-related-and-social-section" class="rel-soc js-insight-nav">
                    <span class="for-wide"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-related-and-social-section.label_shortcut_section_name_wide') %></span><span class="for-narrow"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-related-and-social-section.label_shortcut_section_name_narrow') %></span>
                </a>
            </li>
            <% } %>
            <% if (insightEntity.displaySectionComments && !whiteLabelHoldingOrMember) { %>
            <li class="js-insight-comments-shcut relative-loader js-nav-loader-section">
                <%= loaderIcon %>
                <a href="#insight-comments-section" class="com-s js-insight-nav">
                    <span class="for-wide"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-comments-section_label_shortcut_section_name_wide') %></span><span class="for-narrow"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-comments-section_label_shortcut_section_name_narrow') %></span>
                </a>
            </li>
            <% } %>
        </ul>
    </div>
</tpl>

<tpl id="tplPartnerLogoSection">
    <div class="relative-loader">
        <div class="container">
            <div class="loaderContainer loaderIcon js-section-loader"></div>
            <div class="partner-logo" style="background-image: url(<%= partnerHeaderImgUrl %>)"></div>
            <div class="js-ad-unit-four ad-unit-four col-lg-9 hide"></div>
        </div>
    </div>
</tpl>

<tpl id="tplPollInfoSection">
    <div class="middle-white-wrapper poll-box">
        <div class="container">
            <div class="poll-section"></div>
            <div class="row next-prev"></div>
        </div>
    </div>
</tpl>

<tpl id="tplPollSection">
    <div class="row poll-bg" style="background-image: url(<%=  pollIcon %>-900x300)">
        <div class="col-lg-4 col-md-4 col-xs-12 poll-img-wrapper-mobile">
            <div class="poll-img-wrapper">
                <div class="tagline">
                <div class="tag-poll" style="background-color: <%= sectionColor %>">
                    <%= $.i18n.mProp(insightLocale, 'default_label_poll') %>
                </div>
                <div class="closed-poll <% if( !isClosedPoll ) { %>hide<% } %>"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-poll-info-section.label_poll_closed') %></div>
                <div class="js-dashboard-btn right"></div>
                <span class="poll-tagline js-truncate" title="<%- tagLine %>"><%= tagLine %></span></div>
                <div class="engaged">
                    <div class="eng-wrapper">
                        <div class="engico-votes"><%= totalVotes %></div><div class="engico-views"><%= totalViews %></div>
                    </div>
                    <div class="js-sharing-section sharing-section"></div>
                </div>
            </div>
        </div>
        <div class="col-lg-8 col-md-8 col-xs-12 poll-answers">
            <form>
                <ul class="sides-list">
                    <% $.each(sidesCollection.models, function(index, side) { %>
                    <% var sideId = side.get('id'); %>
                    <li class="item">
                        <input id="answer_<%= sideId %>"
                        type="radio"
                        class="js-vote-this-side vote-radio"
                        data-side-id="<%= sideId %>"
                        name="votes"
                        value="<%= sideId %>"
                        <% if(sideId === votedForSide) { %>checked="checked"<% } %>
                        <% if( !allowVoting ) { %>disabled<% } %>
                        />
                        <label for="answer_<%= sideId %>" <% if( !allowVoting ) { %>class="disabled"<% } %>>
                            <span class="circle-area" style="background-color: <%= sectionColor %>;border-color: <%= sectionColor %>;"></span>
                            <span class="side-text"><span class="side-text-cut js-truncate" title="<%- side.get('answer') %>"><%= side.get('answer') %></span></span>
                            <span class="total-percent"><%= side.get('votesFromTotalInPercent') %>%</span>
                        </label>
                    </li>
                    <% }); %>
                </ul>
            </form>
        </div>
    </div>
</tpl>

<tpl id="tplPollPrevNext">
    <a href="" class="prev js-prev-poll hide">
        <em></em>
        <span class="wide-text js-truncate" title="<%- prevPollTagline %>"><%= prevPollTagline %></span>
        <span class="narrow-text"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-poll-info-section.btn_label_back') %></span>
    </a>

    <a href="" class="next js-next-poll hide">
        <span class="wide-text js-truncate" title="<%- nextPollTagline %>"><%= nextPollTagline %></span>
        <span class="narrow-text"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-poll-info-section.btn_label_next') %></span>
        <em></em>
    </a>
</tpl>

<tpl id="tplDashBoardBtn">
        <a href="<%= dashboardLink %>" class="dashboard" target="_blank"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-poll-info-section.label_dashboard') %></a>
</tpl>

<tpl id="tplInsightLDPSection">
    <div id="insight-ldp-section" class="relative-loader bottom-white-wrapper row">
        <div class="loaderContainer loaderIcon js-section-loader"></div>
        <div class="tag-datapoint" style="background-color: <%= sectionColor %>">
            <%= $.i18n.mProp(insightLocale, 'ui.overall.insight-lead-data-point-section_label_section_name') %>
        </div>

        <div class="col-lg-8 col-md-8 col-xs-8 clear">
            <h5>
                <%= $.i18n.mProp(insightLocale, 'ui.overall.insight-lead-data-point-section_label_original_article') %>
            </h5>
            <div class="display-table">
                <div class="datapoint-img">
                    <a class="js-link-read-more" target="_blank" href="<%= insightDPEntity.sourceUrl %>">
                        <img src="<%= articleImgUrl %>">
                    </a>
                </div>
                <div class="datapoint-tagline">
                    <a class="js-link-read-more" target="_blank" href="<%= insightDPEntity.sourceUrl %>">
                        <span class="tagline-header">
                            <%= insightDPEntity.tagline %>
                        </span>
                        <p><%= insightDPEntity.text %></p>
                    </a>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-4 col-xs-4 sources-block">
            <h5><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-lead-data-point-section_label_source') %></h5>
            <a class="link-read-more js-link-read-more" target="_blank" href="<%= insightDPEntity.sourceUrl %>" style="border-color: <%= sectionColor %>;color: <%= sectionColor %>;"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-lead-data-point-section_btn_read_more_label') %></a>
            <div class="source"><%= insightDPEntity.sourceReference %></div>
            <div class="published <% if ( !insightDPEntity.sourcePublished ) { %>hide<% } %>">
                <%= $.i18n.mProp(insightLocale, 'ui.overall.insight-lead-data-point-section_label_published_on') %> <%= sourcePublished %>
            </div>
        </div>
    </div>
</tpl>

<tpl id="tplPollVotesMap">
    <div id="insight-map-section" class="relative-loader bottom-white-wrapper row">
        <div class="loaderContainer loaderIcon js-section-loader"></div>
        <div class="tag-map" style="background-color: <%= sectionColor %>;" ><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-map.label.section_name') %></div>
        <div class="clear">
            <div class="wrapper-votes">
                <input type="checkbox" id="button" class="action-btn">
                <div class="votes-wrapper">
                    <div class="js-votes-details-table votes-details-table"></div>
                </div>
                <label class="btn-block" for="button"></label>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12 map-wrapper">
                <div class="js-details">
                    <span class="js-show-world-btn show-world-btn"></span>
                </div>
                <div id="map-main" class="map-container js-main js-map-main"></div>
                <div id="map-details" class="map-container js-details js-map-details"></div>
                <div id="region-detailed-map" class="map-container"></div>
            </div>
            <div class="js-votes-map-mobile-details"></div>
        </div>
    </div>
</tpl>

<tpl id="tplDisplayDetailsVotesTable">
    <h5><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-map-details.label.section_name') %> <%= regionName %></h5>
    <% if ( !_.isEmpty(collection.models) ) { 
    var moreThan1Day = collection.length > 1 ? true : false;%>
    <div class="detailed-table js-detailed-table">
        <div class="votes-table-wrapper">
            <table class="statsTable">
                <tr>
                    <td class="bold">
                        <%= $.i18n.mProp(insightLocale, 'ui.overall.insight-map-details.label.total') %>
                    </td>
                    <td class="bold"><%= collection.overallVotes %></td>
                </tr>
                <% $.each(collection.models, function(index, model) { %>
                <tr>
                    <td><%= model.get('regionName') %></td>
                    <td><%= model.get('totalVotes') %></td>
                </tr>
                <% }); %>
            </table>
        </div>
    </div>
    <% } %>
</tpl>

<tpl id="tplMobileDetailsVotesTable">
    <div class="col-lg-8 col-md-8 col-xs-12 mobile-legend">
        <h5><%= $.i18n.mProp(insightLocale, 'ui.overall.insight-map-mobile-details.label_map_legend') %></h5>
        <form>
            <ul class="sides-list">
                <% $.each(sidesCollection.models, function(index, side) { %>
                <% var sideId = side.get('id'); %>
                <li class="item">
                    <input id="answer_map<%= sideId %>"
                    type="radio"
                    class="vote-radio"
                    data-side-id="<%= sideId %>"
                    name="votes"
                    value="<%= sideId %>"
                    disabled
                    <% if(sideId === votedForSide) { %>checked="checked"<% } %>
                    />
                    <label for="answer_map<%= sideId %>">
                        <span class="circle-area" style="background-color: <%= side.get('sideColor') %>;border-color: <%= side.get('sideColor') %>;"></span>
                        <div class="cut-text"><%= side.get('answer') %></div>
                    </label>
                </li>
                <% }); %>
            </ul>
        </form>
    </div>
</tpl>

<tpl id="tplPollStatsSectionContainer">
    <div id="insight-poll-stats-section" class="relative-loader bottom-white-wrapper row js-insight-poll-stats-section">
        <div class="loaderContainer loaderIcon js-section-loader"></div>
        <div class="js-poll-stats-content poll-stats-content"></div>
        <div class="gray-bg-hack col-lg-4 col-md-4 col-xs-4"></div>
        <div class="white-bg-hack"></div>
    </div>
    <div id="new-account-section" class="bottom-white-wrapper row new-account js-new-account-section" hidden>
</tpl>

<tpl id="tplPollStatsSection">
    <div class="relative-loader">
        <div class="loaderContainer loaderIcon js-section-loader"></div>
        <div class="tag-poll-stats" style="background-color: <%= sectionColor %>" ><%= $.i18n.mProp(insightLocale, 'ui.overall.poll-stats-section_label_section_name') %></div>
        <div class="clear"></div>
        <div class="js-insight-poll-stats-tabs-content col-lg-8 col-md-8 col-xs-12"></div>
        <div class="js-insight-true-identity-section insight-true-identity-section col-lg-4 col-md-4 col-xs-12"></div>
    </div>
</tpl>

<tpl id="tplNewAccountSection">
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 green-box">
        <div>
            <h3>We need your help!</h3>
            <p>At this time we don’t have enough responses to provide complete and accurate poll statistics.</p>
            <p>Please consider helping us build our statistics by providing some information about yourself or by registering on our site. You will get access to full statistics as well as your True Identity profile. </p>
            <p>We will not share your personal information with advertisers or third-party companies.</p>
            <p>Make your voice count!</p>
        </div>
    </div>
    <div class="poll-stats-content col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <div>
            <p>To see poll statistics, please answer a question about yourself.</p>
            <p class="bold js-question-string"><%= question %>?</p>
            <select class="textfield js-answers">
                <% if (!isAge) { %>
                    <option value="">Select...</option>
                    <% for(var key in answers) { %>
                        <option value="<%= key %>"><%= $.i18n.mProp(insightLocale, answers[key]) %></option>
                    <% }; %>
                <% } else { %>
                    <option value="">Select...</option>
                    <% for(var year = currentYear - 13; year >= currentYear - 100; year--) { %>
                        <option value="<%= year %>"><%= year %></option>
                    <% }; %>
                <% } %>
            </select>
            <input type="submit" value="Submit" class="btn-sbmt js-submit-btn dsbl"/>
            <p>You can also register using a social network account of your choice.</p>
            <form class="social-btn-container">
                <div class="fb-share-btn js-soc-auth" data-soc="FBAuth"></div>
                <div class="twitter-share-btn js-soc-auth" data-soc="TWAuth"></div>
                <div class="g-plusone-share-btn js-soc-auth" data-soc="GOAuth" data-gapiattached="true"></div>
            </form>
        </div>
    </div>
</tpl>

<tpl id="tplCompareAndContrast">
    <div id="insight-compare-and-contrast-section" class="relative-loader bottom-white-wrapper row">
        <div class="loaderContainer loaderIcon js-section-loader"></div>
        <div class="tag-poll-stats" style="background-color: <%= sectionColor %>">
            <%= $.i18n.mProp(insightLocale, 'ui.overall.compare-contrast_label_section_name') %>
        </div>
        <div class="col-lg-12 col-md-12 col-xs-12 clear">
            <form>
                <h5><%= $.i18n.mProp(insightLocale, 'ui.overall.compare-contrast_label_sub_section_name') %></h5>
                <ul class="sides-list">
                    <% $.each(sidesCollection.models, function(index, model) { %>
                    <% var sideId = model.get('id'),
                    sideName = model.get('answer'); %>
                    <li class="item">
                        <div class="col-lg-5 col-md-5 col-xs-12">
                            <input id="answer-comp-contrast_<%= sideId %>"
                                   type="radio"
                                   class="vote-radio"
                                   disabled
                                   <% if(sideId === votedForSide) { %>checked="checked"<% } %>
                                />
                            <label for="answer-comp-contrast_<%= sideId %>" class="disabled">
                                <span class="circle-area"
                                      style="background-color: <%= sectionColor %>;border-color: <%= sectionColor %>;"></span>
                                <span class="side-text js-this-site-side-<%= sideId %>-name"><%= sideName %></span>
                            </label>
                        </div>

                        <div class="stats-compare col-lg-7 col-md-7 col-xs-12">
                            <div class="site-side">
                                <span class="total-percent js-this-site-side-<%= sideId %>-votes"></span><span class="side-text"><span><%= $.i18n.mProp(insightLocale, 'ui.overall.compare-contrast_label_this_site_votes') %></span><span class="this-site js-progres-this-side-<%= sideId %>"></span></span>
                            </div>
                            <div class="site-side"><span class="total-percent js-other-sites-side-<%= sideId %>-votes"></span><span class="side-text"><span><%= $.i18n.mProp(insightLocale, 'ui.overall.compare-contrast_other_site_votes') %></span><span class="other-site js-progres-other-side-<%= sideId %>"></span></span></div>
                        </div>
                    </li>
                    <% }); %>
                </ul>
            </form>
        </div>
    </div>
</tpl>

<tpl id="tplSharingSection">
    <!--<div class="js-fb-share-btn fb-share-btn"></div>-->
    <div class="js-twitter-share-btn twitter-share-btn"></div>
    <div class="js-google-share-btn g-plusone-share-btn"></div>
    <div class="js-linked-in-share-btn linked-in-share-btn"></div>
</tpl>

<tpl id="tplMainAdsWithVideoContainer">
    <div class="middle-white-wrapper desktop-video">
        <div class="container">
            <div class="ad-unit-one-wrapper">
                <div class="label-video" style="background-color: <%= sectionColor %>;">
                    <%= $.i18n.mProp(insightLocale, 'ui.overall.insight-ad-unit-section.label_section_name') %>
                </div>
                <h2 class="video-title">2016 Ford Focus Review</h2>
                <div class="source-by">By Autotrader.com</div>
                <div class="js-ad-unit-one hide"></div>
            </div>
            <div class="side-ads-wrapper">
                <div class="js-ad-unit-two ad-unit-two hide"></div>
                <div class="js-ad-unit-three hide"></div>
            </div>
        </div>
    </div>
</tpl>

<tpl id="tplMainAdsNoVideoContainer">
    <div class="middle-white-wrapper ads-bottom">
        <div class="container">
            <div class="js-ad-unit-two ad-unit-two ad-wrapper hide"></div>
            <div class="js-ad-unit-three ad-wrapper hide"></div>
            <div class="js-ad-unit-five ad-unit-five ad-wrapper hide"></div>
        </div>
    </div>
</tpl>

<tpl id="tplVideoAdContainer">
    <div class="label-video" style="background-color: <%= sectionColor %>;">
        <%= $.i18n.mProp(insightLocale, 'ui.overall.insight-ad-unit-section.label_section_name') %>
    </div>
    <h2 class="video-title">2016 Ford Focus Review</h2>
    <div class="source-by">By Autotrader.com</div>
    <div class="js-ad-unit-one"></div>
</tpl>

<tpl id="tplInsightFooter">
    <div class="container footer-link">
        <% if ( config.WIDGET_FOOTER_ICON ) { %>
            <a href="<%= config.DOMAIN_URL %>"
               target="_blank"
               style="background-image: url(<%= frontStatic + config.WIDGET_FOOTER_ICON_POLLER %>);"
               title="<%= config.WIDGET_FOOTER_ICON_TITLE %>">
            </a>
        <% } else { %>
            <a href="<%= config.DOMAIN_URL %>" target="_blank" title="<%= $.i18n.prop('widget.smart.visit_us') %>" class="owo-logo"></a>
        <% } %>
        <div class="cut-text">
            <%= footerText %>
        </div>
    </div>
    <div class="colored-bg footer-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 360"><path d="M1400,360H0V100L1400,0V360Z" transform="translate(0 0)" style="fill:<%= sectionColor %>;fill-rule:evenodd"/></svg>
    </div>
</tpl>

<tpl id="tplInsightCommentsSection">
    <div id="insight-comments-section" class="relative-loader bottom-white-wrapper row">
        <div class="loaderContainer loaderIcon js-section-loader"></div>
        <div class="tag-related" style="background-color: <%= sectionColor %>" >
            <%= $.i18n.mProp(insightLocale, 'ui.overall.insight-comments-section_label_section_name') %>
        </div>
        <div class="container">
            <div class="col-lg-8 col-md-8 col-xs-12 clear" style="height:12px"></div>
            <div class="col-lg-4 col-md-4 col-xs-12"></div>
            <div class="clear"></div>
            <div class="spot-im-frame-inpage" data-post-id="<%= pollId %>"></div>
        </div>
    </div>
</tpl>

<tpl id="tplRelatedAndSocialSection">
    <div id="insight-related-and-social-section" class="relative-loader bottom-white-wrapper row">
        <div class="loaderContainer loaderIcon js-section-loader"></div>
        <div class="tag-related" style="background-color: <%= sectionColor %>" >
            <%= $.i18n.mProp(insightLocale, 'ui.overall.insight-related-and-social-section.label_section_name') %>
        </div>
        <div class="container">
            <div class="col-lg-8 col-md-8 col-xs-12 clear" style="height:12px"></div>
            <div class="col-lg-4 col-md-4 col-xs-12"></div>
            <div class="js-relative-script-iframe-one related-wide col-lg-8 col-md-8 col-xs-12"></div>
            <div class="js-relative-script-iframe-two related-narrow col-lg-4 col-md-4 col-xs-12"></div>
        </div>
    </div>
</tpl>

<tpl id="tplInsightCommentsSectionScript">
    <script type="text/javascript">!function(t,e,n){function a(t){var a=e.createElement("script");a.type="text/javascript",a.async=!1,a.src=("https:"===e.location.protocol?"https":"http")+":"+n,(t||e.body||e.head).appendChild(a)}function o(){var t=e.getElementsByTagName("script"),n=t[t.length-1];return n.parentNode} var p=o();t.spotId="sp_aLtGuBOM",t.parentElement=p,a(p)}(window.SPOTIM={},document,"//www.spot.im/launcher/bundle.js");
    </script>
</tpl>

<tpl id="tplInsightTrueIdentity">
    <h5>True Identity</h5>
    <div class="svg-wrapper">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 486 486" enable-background="new 0 0 486 486" xml:space="preserve">

        <g id="politic-affiliation">
            <use xlink:href="<%=pathToSvg%>#politic-affiliation-<%=trueIdentity.politicalAffiliationIconIndex%>"/>
        </g>

        <% if (trueIdentity.genderIconIndex) { %>
            <% if (trueIdentity.maritalStatusIconIndex >= 4) { %>
                <g id="marital-status" transform="scale(0.6)">
                    <use xlink:href="<%= pathToSvgAgePartnersGenderIconIndex %>" x="80%" y="32%"/>
                    <use xlink:href="<%= pathToSvgIncomePartnersGenderIconIndex %>" x="80%" y="32%"/>
                </g>
            <% } %>

            <g id="age">
                <use xlink:href="<%= pathToSvgAgeGenderIconIndex %>"/>
            </g>

            <g id="income">
                <use xlink:href="<%= pathToSvgIncomeGenderIconIndex %>"/>
            </g>
        <% } else { %>
            <% if (trueIdentity.maritalStatusIconIndex >= 4) { %>
                <g id="marital-status" transform="scale(0.6)">
                    <clipPath id="left-side-<%= uniqueSvgId %>">
                        <rect x="50%" y="0" width="50%" height="100%"/>
                    </clipPath>
                    <clipPath id="right-side-<%= uniqueSvgId %>">
                        <rect x="0" y="0" width="50%" height="100%"/>
                    </clipPath>
                    <use xlink:href="<%= pathToSvgAgePartnersGenderIconIndex0 %>" x="80%" y="32%" clip-path="url(#left-side-<%= uniqueSvgId %>)"/>
                    <use xlink:href="<%=pathToSvgAgeGenderIconIndex0 %>" x="80%" y="32%" clip-path="url(#right-side-<%= uniqueSvgId %>)"/>

                    <use xlink:href="<%= pathToSvgIncomePartnersGenderIconIndex %>" x="80%" y="32%" clip-path="url(#left-side-<%= uniqueSvgId %>)"/>
                    <use xlink:href="<%= pathToSvgIncomeGenderIconIndex %>" x="80%" y="32%" clip-path="url(#right-side-<%= uniqueSvgId %>)"/>

                    <rect x="130%" y="30%" width="3px" height="100%"/>
                </g>
            <% } %>
            <g id="ageIconIndex">
                <clipPath id="left-side-<%= uniqueSvgId %>">
                    <rect x="50%" y="0" width="50%" height="100%"/>
                </clipPath>
                <clipPath id="right-side-<%= uniqueSvgId %>">
                    <rect x="0" y="0" width="50%" height="100%"/>
                </clipPath>
                <use xlink:href="<%= pathToSvgAgeGenderIconIndex %>" clip-path="url(#right-side-<%= uniqueSvgId %>)"/>
                <use xlink:href="<%= pathToSvgAgePartnersGenderIconIndex %>" clip-path="url(#left-side-<%= uniqueSvgId %>)"/>
            </g>
            <g id="income">
                <clipPath id="left-side-<%= uniqueSvgId %>">
                    <rect x="50%" y="0" width="50%" height="100%"/>
                </clipPath>
                <clipPath id="right-side-<%= uniqueSvgId %>">
                    <rect x="0" y="0" width="50%" height="100%"/>
                </clipPath>
                <use xlink:href="<%= pathToSvgIncomePartnersGenderIconIndex %>" clip-path="url(#left-side-<%= uniqueSvgId %>)"/>
                <use xlink:href="<%= pathToSvgIncomeGenderIconIndex %>" clip-path="url(#right-side-<%= uniqueSvgId %>)"/>
            </g>
            <rect x="50%" width="3px" height="100%"/>
        <% } %>

        <g id="education">
            <use xlink:href="<%= pathToSvgAgeGenderIconIndexEducation %>"/>
        </g>
    </svg>
    </div>
    <% if ( showNoteMark ) { %>
    <p class="note-mark"><%= $.i18n.mProp(insightLocale, 'ui.overall.insight.true-identity-section.note_mark') %></p>
    <% } %>
    <% for ( var i = 0, tiKeyName, tiValue; i < TIStatsOrder.length; i++ ) { 
        tiKeyName = TIStatsOrder[i];
        tiValue = trueIdentity[tiKeyName];
    %>

    <% if ( tiValue ) { %>
    <div class="info-string">
        <span class="<%= trueIdentityCssClassMap[tiKeyName] %>"><%= $.i18n.mProp(insightLocale, translationsBase + tiKeyName) %> </span>
        <%= $.i18n.mProp(insightLocale, 'ui.overall.insight.true-identity-section.trueIdentityDescription.' + tiKeyName + '.' + tiValue) %>
    </div>
    <% } %>
    <% } %>
</tpl>

<tpl id="tplInsightPollStatsTabs">
    <ul class="js-ips-nav insight-poll-stats-nav">
        <li class="active">
            <a href="#"
               class="js-tab gen"
               data-target-tab="#tab-gender"
               data-target-class="js-tab-pane"
               data-node="js-ips-nav"></a>
        </li>
        <li>
            <a href="#"
               class="js-tab ag"
               data-target-tab="#tab-age"
               data-target-class="js-tab-pane"
               data-node="js-ips-nav"></a>
        </li>
        <li>
            <a href="#"
               class="js-tab mst"
               data-target-tab="#tab-marital-status"
               data-target-class="js-tab-pane"
               data-node="js-ips-nav"></a>
        </li>
        <% if ( insightLocale === 'en' ) { %>
        <li>
            <a href="#"
               class="js-tab ed"
               data-target-tab="#tab-education"
               data-target-class="js-tab-pane"
               data-node="js-ips-nav"></a>
        </li>
        <li>
            <a href="#"
               class="js-tab inc"
               data-target-tab="#tab-income"
               data-target-class="js-tab-pane"
               data-node="js-ips-nav"></a>
        </li>
        <li>
            <a href="#"
               class="js-tab paf"
               data-target-tab="#tab-political-affiliation"
               data-target-class="js-tab-pane"
               data-node="js-ips-nav"></a>
        </li>
        <% } %>
    </ul>
    <div class="tab-content <% if ( insightLocale === 'en' ) { %>eng <% } %>">
        <div class="tab-pane js-tab-pane active" id="tab-gender">
            <h2><%= $.i18n.mProp(insightLocale, 'default_label_gender') %></h2>
            <ul class="js-ips-sub-tab-gender insight-poll-stats-nav">
                <li class="active">
                    <a href="#"
                       class="js-tab"
                       data-target-tab="#tab-male"
                       data-target-class="js-tab-sub-pane-gender"
                       data-node="js-ips-sub-tab-gender">
                        <%= $.i18n.mProp(insightLocale, 'default_label_gender_male') %>
                    </a>
                </li>
                <li>
                    <a href="#"
                       class="js-tab"
                       data-target-tab="#tab-female"
                       data-target-class="js-tab-sub-pane-gender"
                       data-node="js-ips-sub-tab-gender">
                        <%= $.i18n.mProp(insightLocale, 'default_label_gender_female') %>
                    </a>
                </li>
            </ul>

            <div id="tab-male" class="js-tab-sub-pane-gender tab-pane active">
                <%  var group = stats.gender.pies.male.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line"><span class="answ"><%= group[index].answer %></span><span class="perc"><%= group[index].votesInPercents %>%</span></div><span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="tab-female" class="js-tab-sub-pane-gender tab-pane">
                <%  var group = stats.gender.pies.female.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line"><span class="answ"><%= group[index].answer %></span><span class="perc"><%= group[index].votesInPercents %>%</span></div><span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
        </div>

        <div class="tab-pane js-tab-pane" id="tab-age">
            <h2><%= $.i18n.mProp(insightLocale, 'default_label_age') %></h2>
            <ul class="js-ips-nav-age insight-poll-stats-nav">
                <li class="active">
                    <a href="#"
                       class="js-tab"
                       data-target-tab="#tab-under21"
                       data-target-class="js-tab-sub-pane-age"
                       data-node="js-ips-nav-age"><%= $.i18n.mProp(insightLocale, 'default_label_age_under21') %></a>
                </li>
                <li>
                    <a href="#"
                       class="js-tab"
                       data-target-tab="#from21to40"
                       data-target-class="js-tab-sub-pane-age"
                       data-node="js-ips-nav-age"><%= $.i18n.mProp(insightLocale, 'default_label_age_from21to40') %></a>
                </li>
                <li>
                    <a href="#"
                       class="js-tab"
                       data-target-tab="#over40"
                       data-target-class="js-tab-sub-pane-age"
                       data-node="js-ips-nav-age"><%= $.i18n.mProp(insightLocale, 'default_label_age_over40') %></a>
                </li>
            </ul>

            <div id="tab-under21" class="js-tab-sub-pane-age tab-pane active">
                <%  var group = stats.age.pies.under21.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="from21to40" class="js-tab-sub-pane-age tab-pane">
                <%  var group = stats.age.pies.from21to40.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="over40" class="js-tab-sub-pane-age tab-pane">
                <%  var group = stats.age.pies.over40.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
        </div>

        <div class="tab-pane js-tab-pane" id="tab-marital-status">
            <h2><%= $.i18n.mProp(insightLocale, 'default_label_marital_status') %></h2>
            <ul class="js-insight-poll-stats-nav-marital-status insight-poll-stats-nav">
                <li class="active">
                    <a href="#" data-target-tab="#single" data-target-class="js-tab-sub-pane-marital-status" class="js-tab" data-node="js-insight-poll-stats-nav-marital-status">
                        <%= $.i18n.mProp(insightLocale, 'default_label_marital_status_single') %>
                    </a>
                </li>
                <li>
                    <a href="#" data-target-tab="#married" data-target-class="js-tab-sub-pane-marital-status" class="js-tab" data-node="js-insight-poll-stats-nav-marital-status">
                        <%= $.i18n.mProp(insightLocale, 'default_label_marital_status_married') %>
                    </a>
                </li>
                <li>
                    <a href="#" data-target-tab="#other" data-target-class="js-tab-sub-pane-marital-status" class="js-tab" data-node="js-insight-poll-stats-nav-marital-status">
                        <%= $.i18n.mProp(insightLocale, 'default_label_marital_status_other') %>
                    </a>
                </li>
            </ul>

            <div id="single" class="js-tab-sub-pane-marital-status tab-pane active">
                <%  var group = stats.maritalStatus.pies.single.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="married" class="js-tab-sub-pane-marital-status tab-pane">
                <%  var group = stats.maritalStatus.pies.married.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="other" class="js-tab-sub-pane-marital-status tab-pane">
                <%  var group = stats.maritalStatus.pies.other.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
        </div>
        <% if ( insightLocale === 'en' ) { %>
        <div class="tab-pane js-tab-pane" id="tab-education">
            <h2><%= $.i18n.mProp(insightLocale, 'default_label_education') %></h2>
            <ul class="js-insight-poll-stats-nav-education insight-poll-stats-nav">
                <li class="active">
                    <a href="#" data-target-tab="#school" data-target-class="js-tab-sub-pane-education" class="js-tab" data-node="js-insight-poll-stats-nav-education">High school</a>
                </li>
                <li>
                    <a href="#" data-target-tab="#college" data-target-class="js-tab-sub-pane-education" class="js-tab" data-node="js-insight-poll-stats-nav-education">College</a>
                </li>
                <li>
                    <a href="#" data-target-tab="#post-graduate" data-target-class="js-tab-sub-pane-education" class="js-tab" data-node="js-insight-poll-stats-nav-education">Post graduate</a>
                </li>
            </ul>

            <div id="school" class="js-tab-sub-pane-education tab-pane active">
                <%  var group = stats.education.pies.school.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="college" class="js-tab-sub-pane-education tab-pane">
                <%  var group = stats.education.pies.college.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="post-graduate" class="js-tab-sub-pane-education tab-pane">
                <%  var group = stats.education.pies.post_graduate.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
        </div>

        <div class="tab-pane js-tab-pane" id="tab-income">
            <h2>Income</h2>
            <ul class="js-insight-poll-stats-nav-income insight-poll-stats-nav">
                <li class="active">
                    <a href="#" data-target-tab="#t-under-50k" data-target-class="js-tab-sub-pane-income" class="js-tab" data-node="js-insight-poll-stats-nav-income">Under $50K</a>
                </li>
                <li class="">
                    <a href="#" data-target-tab="#t-50k-100k" data-target-class="js-tab-sub-pane-income" class="js-tab" data-node="js-insight-poll-stats-nav-income">$50K - $100K</a>
                </li>
                <li class="">
                    <a href="#" data-target-tab="#t-over-100k" data-target-class="js-tab-sub-pane-income" class="js-tab" data-node="js-insight-poll-stats-nav-income">Over $100K</a>
                </li>
            </ul>

            <div id="t-under-50k" class="js-tab-sub-pane-income tab-pane active">
                <%  var group = stats.income.pies.under_50k.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="t-50k-100k" class="js-tab-sub-pane-income tab-pane">
                <%  var group = stats.income.pies['50k_100k'].groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="t-over-100k" class="js-tab-sub-pane-income tab-pane">
                <%  var group = stats.income.pies.over_100k.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
        </div>

        <div class="tab-pane js-tab-pane" id="tab-political-affiliation">
            <h2><%= $.i18n.mProp(insightLocale, 'default_label_political_affiliation') %></h2>
            <ul class="js-insight-poll-stats-nav-political-affiliation insight-poll-stats-nav">
                <li class="active">
                    <a href="#" data-target-tab="#republican" data-target-class="js-tab-sub-pane-political-affiliation" class="js-tab" data-node="js-insight-poll-stats-nav-political-affiliation">
                        <%= $.i18n.mProp(insightLocale, 'default_label_political_affiliation_republican') %>
                    </a>
                </li>
                <li>
                    <a href="#" data-target-tab="#democrat" data-target-class="js-tab-sub-pane-political-affiliation" class="js-tab" data-node="js-insight-poll-stats-nav-political-affiliation">
                        <%= $.i18n.mProp(insightLocale, 'default_label_political_affiliation_democrat') %>
                    </a>
                </li>
                <li>
                    <a href="#" data-target-tab="#independent" data-target-class="js-tab-sub-pane-political-affiliation" class="js-tab" data-node="js-insight-poll-stats-nav-political-affiliation">
                        <%= $.i18n.mProp(insightLocale, 'default_label_political_affiliation_independent') %>
                    </a>
                </li>
            </ul>

            <div id="republican" class="js-tab-sub-pane-political-affiliation tab-pane active">
                <%  var group = stats.politicalAffiliation.pies.republican.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="democrat" class="js-tab-sub-pane-political-affiliation tab-pane">
                <%  var group = stats.politicalAffiliation.pies.democrat.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
            <div id="independent" class="js-tab-sub-pane-political-affiliation tab-pane">
                <%  var group = stats.politicalAffiliation.pies.independent.groupped;
                    for (var index = 0, length = group.length; index < length; index++) { %>
                    <div class="stat-line">
                        <span class="answ"><%= group[index].answer %></span>
                        <span class="perc"><%= group[index].votesInPercents %>%</span>
                    </div>
                    <span class="progperc"><em style="width:<%= group[index].votesInPercents %>%"></em></span>
                <% } %>
            </div>
        </div>
        <% } %>
    </div>
</tpl>

<tpl id="tplInsightImgSection"><img src="<%= pollIcon %>-214x177"/></tpl>

<tpl id="tplInsightPollStatsTagLine"><%= tagline %></tpl>