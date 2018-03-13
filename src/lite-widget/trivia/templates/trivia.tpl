<tpl id="tplWidgetBase">
    <div class="base">
        <% var simple = colorTheme === 'simpleLight' ? 'simple-light' : '' %>
        <div class="js-flex flex-container <%= simple %>" style="background-color: rgba(246,246,246,.92);">
            <div class="js-left-side-box side-box shortw"></div>
            <div class="js-right-side-box side-box right-content"
                style="background-color: <%= backgroundColor %>"></div>
        </div>
        <div class="js-sharing-dialog"></div>
        <div class="js-final-screen"></div>
        <div class="js-more-details"></div>
    </div>
</tpl>

<tpl id="tplLeftSideBox">
    <% if (poll) { %>
        <div class="main-titles">
            <div class="headline center">
                <div class="top-title">
                    <div class="cut-me"><%= headerText %></div>
                </div>
                <%= poll.get('tagLine') %>
            </div>
            <div class="js-skip-poll skip-btn"><%= $.i18n.prop('widget.trivia.skip') %></div>
        </div>
        <div class="img-wrapper<% if (backgroundImage) { %> responsive-poll-image" data-image-src="<%= backgroundImage %>"<% } else { %>"<% } %>data-image-type="poll-image"></div>
        <div class="owo-default-bg"></div>
    <% } else { %>
        <div class="final-screen side">
            <div class="f-return"></div>
            <div class="headline center">
                <div class="top-title">
                    <div class="cut-me"><%= headerText %></div>
                </div>
                <h4><%= $.i18n.prop('widget.trivia.youre_done') %></h4>
                <div class="skip-btn js-poll-vote-move">
                    <span><%= $.i18n.prop('widget.trivia.take_again') %></span>
                </div>
            </div>
        </div>
    <% } %>
</tpl>

<tpl id="tplRightSideBox">
    <% if (poll) { %>
        <ul class="js-answers-area answers-area">
            <%
                _.each(poll.get('sides').models, function(elem) {
            %>
            <li class="item">
                <input id="answer_<%= elem.get('id') %>"
                    class="vote-radio js-poll-vote"
                    type="radio"
                    name="votingButton"
                    data-poll-side-id="<%= elem.get('id') %>"
                    data-vote-token="<%= elem.get('voteToken') %>"
                    >
                <label for="answer_<%= elem.get('id') %>">
                    <span
                        class="circle-area"
                        style="border-color: <%= votingButtonsColor %>; background-color: <%= votingButtonsColor %>;"
                    ></span>
                    <div class="answer-name" style="color: <%= pollTaglineTextColor %>;"><%= elem.get('answer') %></div>
                </label>
            </li>
            <%
                });
            %>
        </ul>
        <% var backgroundStyle = backgroundImage ? ' style="background-image: url(' + backgroundImage + ');"' : ''; %>
        <div class="js-correct-answer correct results-main hide"<%= backgroundStyle %>></div>
        <div class="js-wrong-answer incorrect results-main hide"<%= backgroundStyle %>></div>
        <footer>
            <div class="js-show-sharing-dialog-btn share-btn"></div>
            <span class="score-num">
                <span id="score-correct-answ"><%= userScore.correct %></span> /
                <span id="score-total-answ"><%= userScore.total %></span>
            </span>
            <% if (isWhiteLabel) { %>
                <% if( config.WIDGET_FOOTER_ICON ) { %>
                    <a target="_blank"
                        href="<%= config.DOMAIN_URL %>"
                        class="project-icon cstm-icn"
                        style="background-image: url(<%= frontStatic + config.WIDGET_FOOTER_ICON %>);"
                        title="<%= config.WIDGET_FOOTER_ICON_TITLE %>">&nbsp;</a>
                <% } %>
            <% } else { %>
                <a target="_blank"
                    href="http://1worldonline.com/"
                    class="project-icon"
                    title="<%= $.i18n.prop('widget.trivia.visit_au_at') %> 1worldonline.com">&nbsp;</a>
            <% } %>
        </footer>
    <% } else { %>
    <div class="final-screen side">
        <div class="fsc-wrap">
        <h6 class="left"><%= $.i18n.prop('widget.trivia.challenge_your_friends') %></h6>
        <form id="" class="social-btn-container">
            <!--<div class="js-fb-share-btn fb-share-btn" data-mode="widgetShare"></div>-->
            <div class="js-g-plusone-share-btn g-plusone-share-btn" data-mode="widgetShare"></div>
            <div class="js-twitter-share-btn twitter-share-btn" data-mode="widgetShare"></div>
            <div class="js-vk-share-btn vk-share-btn" data-mode="widgetShare"></div>
        </form>
        <h6 class="left more-head js-related-header">Want more Trivia? Try this related topic:</h6>
        <div class="link-more-trivia js-link-related-tag"></div>
        </div>
        <% if (isWhiteLabel) { %>
            <% if ( config.WIDGET_FOOTER_ICON ) { %>
                <a target="_blank"
                    href="<%= config.DOMAIN_URL %>"
                    class="project-icon cstm-icn"
                    style="background-image: url(<%= frontStatic + config.WIDGET_FOOTER_ICON %>);"
                    title="<%= config.WIDGET_FOOTER_ICON_TITLE %>">&nbsp;</a>
            <% } %>
            <% } else { %>
                <a target="_blank"
                    href="http://1worldonline.com/"
                    class="project-icon gray-owo"
                    title="<%= $.i18n.prop('widget.trivia.visit_au_at') %> 1worldonline.com"
                >&nbsp;</a>
        <% } %>
        </div>
    <% } %>
</tpl>

<tpl id="tplCorrectAnswer">
  <div class="result-wrap">
    <div class="result-headline"><%= question %></div>
      <div class="result-options">
      	<span class="string"><%= $.i18n.prop('widget.trivia.correct') %></span>
          <div class="cut-me"><%= answer %></div>
      </div>
    <% if (additionalInfo) { %>
      <div class="js-show-more-details skip-btn" data-side-id="<%= sideId %>">
          <%= $.i18n.prop('widget.trivia.learn_why').toUpperCase() %>
      </div>
    <% } %>
  </div>
  <div class="js-next-poll btn continue"><%= $.i18n.prop('widget.trivia.continue') %></div>
</tpl>

<tpl id="tplWrongAnswer">
  <div class="result-wrap">
    <div class="result-headline"><%= question %></div>
      <div class="result-options">
          <span class="string"><%= $.i18n.prop('widget.trivia.incorect_then_answer_is') %></span>
          <div class="cut-me"><%= correctAnswer %></div>
      </div>
    <% if (additionalInfo) { %>
      <div class="js-show-more-details skip-btn" data-side-id="<%= sideId %>">
          <%= $.i18n.prop('widget.trivia.learn_why').toUpperCase() %>
      </div>
    <% } %>
    </div>
    <div class="js-next-poll btn continue"><%= $.i18n.prop('widget.trivia.continue') %></div>

</tpl>

<tpl id="tplMoreDetails">
  <div class="js-flex conversionDialog n-container column">
      <div class="side"><div class="js-close-details close-actions-for-voted-poll-btn"></div>
          <div class="crowdsource-wrapper additional-block">
            <% if (additionalInfoValue) { %>
              <p class="sharing-title"><%= pollTagline %></p>
              <div class="relbox">
              <p><%= additionalInfoValue.get('additionalInfo') %></p>
            <% } %>
            <% if (datapointValue) { %>
              <div class="data-point">
                <a href="<%= datapointValue.sourceUrl ? datapointValue.sourceUrl : '#' %>"
                    class="img-dlink" target="_blank">
                    <% if(datapointValue.icon) { %>
                        <img src="<%= datapointValue.icon + '-120x120' %>"/>
                    <% } %>
                </a>
                <div class="dbox">
                  <span class="hline"><%= $.i18n.prop('widget.trivia.data_point') %></span>
                  <a href="<%= datapointValue.sourceUrl ? datapointValue.sourceUrl : '#' %>"
                      class="data-point-link" target="_blank">
                    <%= datapointValue.tagline %>
                  </a>
                  <p><%= datapointValue.text %></p>
                </div>
              </div>
            <% } %>
        </div>
      </div>
    </div>
  </div>
</tpl>

<tpl id="tplShareDialog">
    <div style="display: block;" class="js-flex conversionDialog n-container column">
        <div class="side"><div class="js-close-sharing-dialog close-actions-for-voted-poll-btn"></div>
            <div class="crowdsource-wrapper">
              <% if (score.total > 0) { %>
                <p class="sharing-title-one"><%= $.i18n.prop('widget.trivia.you_answered') %> <%= parseInt((score.correct / score.total) * 100) %>% <%= $.i18n.prop('widget.trivia.of_all') %> <br><%= $.i18n.prop('widget.trivia.questions_correctly') %></p>
              <% } %>
                <p class="sharing-title"><%= $.i18n.prop('widget.trivia.challenge_your_friends') %></p>
                <form id="" class="social-btn-container">
                    <!--<div class="js-fb-share-btn fb-share-btn"></div>-->
                    <div class="js-g-plusone-share-btn g-plusone-share-btn"></div>
                    <div class="js-twitter-share-btn twitter-share-btn"></div>
                    <div class="js-vk-share-btn vk-share-btn"></div>
                </form>
            </div>
            <div class="add-to-site hide"><%= $.i18n.prop('widget.trivia.add_to_you_site') %></div>
            <footer class="footer-sharing">
                <% if (isWhiteLabel) { %>
                    <% if ( config.WIDGET_FOOTER_ICON ) { %>
                        <a target="_blank"
                            href="<%= config.DOMAIN_URL %>"
                            class="project-icon cstm-icn"
                            style="background-image: url(<%= frontStatic + config.WIDGET_FOOTER_ICON %>);"
                            title="<%= config.WIDGET_FOOTER_ICON_TITLE %>">&nbsp;</a>
                    <% } %>
                <% } else { %>
                    <a target="_blank"
                        href="http://1worldonline.com/"
                        class="project-icon gray-owo"
                        title="<%= $.i18n.prop('widget.trivia.visit_au_at') %> 1worldonline.com">&nbsp;</a>
                <% } %>
            </footer>
        </div>
    </div>
</tpl>

<tpl id="tplFinalScreen">
  <div style="display: flex;" class="js-flex conversionDialog final-wrap column">
      <div class="shortw final-screen side" style="background-image:url('<%= img + '-400x300' %>');">
          <div class="adv-wrapper">
              <div class="top-title">
                  <div class="cut-me">
                      <%= headerText %>
                  </div>
              </div>
              <h4><%= $.i18n.prop('widget.trivia.you_are_done') %></h4>
              <h6><%= $.i18n.prop('widget.trivia.final_score') %></h6>
              <h2><%= score.correct %> <%= $.i18n.prop('widget.trivia.out_of') %> <%= score.total %></h2>
              <div class="skip-btn js-poll-vote-move">
                  <span><%= $.i18n.prop('widget.trivia.take_again') %></span>
              </div>
          </div>
      </div>
    <div class="final-screen side">
        <div class="fsc-wrap">
          <h6 class="left"><%= $.i18n.prop('widget.trivia.challenge_your_friends') %></h6>
          <form id="" class="social-btn-container">
            <!--<div class="js-fb-share-btn fb-share-btn" data-mode="widgetShare"></div>-->
            <div class="js-g-plusone-share-btn g-plusone-share-btn" data-mode="widgetShare"></div>
            <div class="js-twitter-share-btn twitter-share-btn" data-mode="widgetShare"></div>
            <div class="js-vk-share-btn vk-share-btn" data-mode="widgetShare"></div>
          </form>
          <h6 class="left more-head js-related-header">Want more Trivia? Try this related topic:</h6>
          <div class="link-more-trivia js-link-related-tag"></div>
        </div>
        <% if (isWhiteLabel) { %>
            <% if ( config.WIDGET_FOOTER_ICON ) { %>
                <a target="_blank"
                    href="<%= config.DOMAIN_URL %>"
                    class="project-icon cstm-icn"
                    style="background-image: url(<%= frontStatic + config.WIDGET_FOOTER_ICON %>);"
                    title="<%= config.WIDGET_FOOTER_ICON_TITLE %>">&nbsp;</a>
            <% } %>
            <% } else { %>
                <a target="_blank"
                    href="http://1worldonline.com/"
                    class="project-icon gray-owo"
                    title="<%= $.i18n.prop('widget.trivia.visit_au_at') %> 1worldonline.com"
                >&nbsp;</a>
        <% } %>
    </div>
  </div>
</tpl>
