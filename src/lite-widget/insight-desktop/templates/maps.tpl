<tpl id="thirdLevelMapContainer">
     <div class="filter-box map-switcher">
        <ul class="filter-tabs nav">
            <li class="btn <% if (mapType === 'counties') { %>active <% } %>">
                <a href="javascript:void(0);" class="js-change-region-type" data-type="counties"><%= $.i18n.mProp(insightLocale, 'ui.elements.maps.counties') %></a>
            </li> 
            <li class="btn <% if (mapType === 'districts') { %>active <% } %>">
                <a href="javascript:void(0);" class="js-change-region-type" data-type="districts"><%= $.i18n.mProp(insightLocale, 'ui.elements.maps.districts') %></a>
            </li>
        </ul>
    </div>
	<div id="third-level-map" class="map-container" style="text-align:center;"></div>
	<div id="show-region-button" class="js-third-level-map-notice show-world-btn back"></div>
    <div class="js-third-level-map-notice notice-wrapper" style="text-align: center;" >
        <span id="show-region-button" class="show-region-button show-world-button"><%= $.i18n.mProp(insightLocale, 'ui.elements.maps.click_back') %></span> <%= $.i18n.mProp(insightLocale, 'ui.elements.maps.to_see_region_map') %>
    </div>
</tpl>

<tpl id="tooltip">
    <div class="map-tooltip-wrapper tip-wrapper">
        <h4><%= selectedObject.name %></h4>
        <% _.each(selectedObject.votes, function(value, index) { %>
        <div class="strings">
            <span class="circle" style="border-color:<%= value.sideColor %>" ></span>
            <span class="opinion-name"><%= value.voteLabel %>: <span class="bold"><%= value.voteCount %>%</span></span>
        </div>
        <% }) %>
        <h4><% if(_.has(selectedObject, 'votesCount')) { %><%= $.i18n.mProp(insightLocale, 'ui.elements.maps.total_votes') %>: <% } %> <%= selectedObject.votesCount %></h4>
    </div>
</tpl>

<tpl id="tplOverallMapToolTip">
    <div class="map-tooltip-wrapper">
    <% $.each(_.omit(regionVotesById, 'totalVotes'), function(id, side) { %>
        <div class="strings">
            <span class="circle" style="border-color:<%= side.sideColor %>" ></span>
            <span class="opinion-name"><%= side.sideAnswer %>: <span class="bold"><%-side.sideVotesInPercents %>%</span></span>
        </div>
    <% }); %>
    <h4>Total: <%= regionVotesById.totalVotes %></h4>
    </div>
</tpl>

<tpl id="thirdLevelMapContaineWidget">
    <div id="back-to-states" class="link-back"><%= $.i18n.mProp(insightLocale, 'ui.elements.maps.back_to_states') %></div>
     <div class="filter-box map-switcher">
        <ul class="filter-tabs nav">
            <li class="btn <% if (mapType === 'counties') { %>active <% } %>">
                <a href="javascript:void(0);" class="js-change-region-type" data-type="counties"><%= $.i18n.mProp(insightLocale, 'ui.elements.maps.counties') %></a>
            </li>
            <li class="btn <% if (mapType === 'districts') { %>active <% } %>">
                <a href="javascript:void(0);" class="js-change-region-type" data-type="districts"><%= $.i18n.mProp(insightLocale, 'ui.elements.maps.districts') %></a>
            </li>
        </ul>
    </div>
	
	<div id="third-level-map" class="map-container" style="text-align:center;"></div>
</tpl>







