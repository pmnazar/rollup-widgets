define(
    'settings/widget-types/smart-mobile-mini',
    function() {
        return {
            name:'Smart',
            customType: 'smart-mobile-mini',
            height: 250,
            width: 300,
            minHeight: 250,
            minWidth: 300,
            showVotersCount: false,
            showFBLike: true,
            showGooglePlusLike: true,
            showTwitterLike: true,
            showLinkedInLike: true,
            showWeiboSharing: {
                cn: true,
                'default': false
            },
            showVkontakteSharing: {
                ru: true,
                ua: true,
                'default': false
            },
            votingButtonsColor: '#4493d0',
            pollTaglineTextColor: '#000000',
            rotationFrequency: 30,
            showReadMoreOverlay: true,
            isRotationEnabled: true,
            redirectByVote: false,
            pollSideTextTruncate: true
        };
    }
);





