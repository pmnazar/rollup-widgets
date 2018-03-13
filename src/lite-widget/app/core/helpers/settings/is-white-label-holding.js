define(
    'settings/is-white-label-holding',
    function() {
        var isWhiteLabelHolding = function(partner) {
            var isPartnerWhiteLabelHolding = partner.customerType && partner.customerType === 'white_label_holding',
                isParentWhiteLabelHolding = partner.parentObject && partner.parentObject.customerType === 'white_label_holding';

            return isPartnerWhiteLabelHolding || isParentWhiteLabelHolding;
        };

        return isWhiteLabelHolding;
    }
);
