export default function (partner) {
  const isPartnerWhiteLabelHolding = partner.customerType && partner.customerType === 'white_label_holding';
  const isParentWhiteLabelHolding = partner.parentObject && partner.parentObject.customerType === 'white_label_holding';

  return isPartnerWhiteLabelHolding || isParentWhiteLabelHolding;
};