define(
    'settings/account',
    function() {
         var account = function() {
            return {
                gender : {
                    male: 'default_label_gender_male',
                    female: 'default_label_gender_female'
                },
                maritalStatus: {
                    single: 'default_label_marital_status_single',
                    married: 'default_label_marital_status_married',
                    other: 'default_label_marital_status_other'
                },
                education: {
                    less_than_high_school: 'default_label_education_less_than_high_school',
                    high_school_diploma: 'default_label_education_high_school_diploma',
                    some_college: 'default_label_education_some_college',
                    bachelors_degree: 'default_label_education_bachelors_degree',
                    masters_or_professional_degree: 'default_label_education_masters_or_professional_degree',
                    doctoral_degree: 'default_label_education_doctoral_degree'
                },
                income: {
                    'under_25k': 'default_label_income_per_year_under_25k',
                    '25k_50k': 'default_label_income_per_year_25k_50k',
                    '50k_75k': 'default_label_income_per_year_50k_75k',
                    '75k_100k': 'default_label_income_per_year_75k_100k',
                    '100k_125k': 'default_label_income_per_year_100k_125k',
                    '125k_150k': 'default_label_income_per_year_125k_150k',
                    '150k_175k': 'default_label_income_per_year_150k_175k',
                    '175k_200k': 'default_label_income_per_year_175k_200k',
                    'over_200k': 'default_label_income_per_year_over_200k'
                },
                politicalAffiliation: {
                    'democrat': 'default_label_political_affiliation_democrat',
                    'republican': 'default_label_political_affiliation_republican',
                    'independent': 'default_label_political_affiliation_independent',
                    'conservative': 'default_label_political_affiliation_conservative',
                    'liberal': 'default_label_political_affiliation_liberal',
                    'moderate': 'default_label_political_affiliation_moderate'
                }
            };
        };

        return account;
    }
);