define(
    'settings/widget-types/smart-mobile',
    function() {
        return {
                name:'Smart',
                customType: 'smart-mobile',
                height: 375,
                width: 0,
                minHeight: 468,
                showHeaderLogo: false,
                maxHeight: 600,
                minWidth: 200,
                maxWidth: 900,
                headerHeight: 40,
                enableCrowPolls: false,
                showCrowdScreenIfNo1IndexPoll: false,
                showHeader: false,
                allowChangeHeight: true,
                allowChangeWidth:false,
                backgroundColor: '#ffffff',
                headerTextColor: '#ffffff',
                pollRotationArrowsColor: '#ffffff',
                pollRotationBtnBgColor: '#4493d0',
                widgetTaglineColor: '#222222',
                votingButtonsColor: '#4493d0',
                headerBarColor: '#4493d0',
                headerTitleState: "default",
                widgetTitleState: "default",
                widgetLogoState : "default",
                rotationFrequency: 30,
                showVotersCount: false,
                showFBLike: true,
                showGooglePlusLike: true,
                showTwitterLike: true,
                showLinkedInLike: true,
                showReadMoreOverlay: true,
                showWeiboSharing: {
                    cn: true,
                    'default': false
                },
                showVkontakteSharing: {
                    ru: true,
                    ua: true,
                    'default': false
                },
                showEmbedCodeBtn: false,
                enableConversionWindow: false,
                votesCountTriggerConversionWindow: 5,
                conversionWindowTextState: "default",
                showFooter: true,
                showFooterLogoAndText :true,
                showFbLogin: true,
                showTwitterLogin: true,
                pollTaglineTextColor: '#000000',
                pollTaglineAlignment: 'center',
                showGooglePlusLogin: true,
                isRotationEnabled: true,
                redirectByVote: false,
                headerTextAlignment: "right",
                backgroundTransparency: 'none',
                pollSideTextTruncate: true
        };
    }
);





