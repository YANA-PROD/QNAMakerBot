Version 1.1.0.1
If the SITE_URL is defined in the configuration then we append the SITE_URL with the google search URL along with the input,
If not then we just append the input along with the google search URL.

Version 1.1.0.0
1. If is test is enabled we will look in the test mode of QNA maker
    Else we will look into publish mode of QNA maker
    We have Introduced environment variable : IS_TEST for this
    Possible value for IS_TEST are true or false, If value is not mentioned it defaults to false
2. If response source is not a URL eg: it could be editorial
    We will add google link as the reference URL
    Else we will take source URL as the reference URL
    We have Introduced environment variable : SITE_URL for this eg: https://hr.virginia.edu/
    for the respective implementation we will have google URL to pass it to site
    Possible value for SITE_URL are the URL of the implementation.

Version 1.0.0.1
Added message id and ref_url in the response .

Version 1.0.0.0
Comments: Bot which connects to QNA maker server and gets answer.
            If Answer score is greater than or equal to configured score value.
            we will return succes response else we will return error reponse.
            We have two JSON files one for success and one for error.
            success would return decision status o, error would return descision status as 8.
Configuration variables:
    KB_SEARCH_URL : URL to QNA maker
    YANA_DEFAULT_TIMEOUT: General ketp at 5000 mili second
    KB_AUTHORIZATION: QNA maker authorization key
    ENVIRONMENT_NAME: Bot environment name
    KB_SEARCH_MIN_SCORE: Minimum score value to consider QNA maker answer.