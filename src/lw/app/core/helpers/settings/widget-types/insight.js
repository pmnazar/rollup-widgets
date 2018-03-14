define(
    'settings/widget-types/insight',
    function() {
        return {
            taglineMaxLength: 120,
            insightDefaultSectionColor: '#555555',
            insightDefaultHeaderBackgroundColor: '#f6f6f7',
            criteriaSearchDelay: 1500,
            displaySectionComments: true,
            sectionLoadPriorities: [
                ['InsightPollInfoSection', 'InsightSharingSections', 'InsightAdUnitSection'],
                ['ILDPSection', 'InsightMapSection', 'InsightPollStatsSection', 'InsightCompareAndContrast'],
                ['InsightCommentSection', 'InsightRelatedAndSocialSection']
            ]
        };
    }
);