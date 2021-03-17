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