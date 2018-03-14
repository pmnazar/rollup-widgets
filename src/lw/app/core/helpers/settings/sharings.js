define(
    'settings/sharings',
    function() {
        return {
            FBShareUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
            GoogleShareUrl: 'https://plus.google.com/share?url=',
            TWShareUrl: 'https://twitter.com/share?text=',
            LinkedInShareUrl: 'https://www.linkedin.com/shareArticle?mini=true&url=',
            popupSettings: 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600',
            fbTrackActionName: 'insight_sharing_click_fb',
            googleTrackActionName: 'insight_sharing_click_g+',
            twTrackActionName: 'insight_sharing_click_twitter',
            LinkedInTrackActionName: 'insight_sharing_click_linkedin'
        };
    }
);