import {GITHUB_ENDPOINT, GITHUB_TOKEN} from './index.js'

export function interceptor() {

    return {
        request: function (config) {
            if(new RegExp("^"+GITHUB_ENDPOINT).test(config.url)) {
                config.headers = config.headers || {};

                config.headers["Authorization"] = "token 4b1728d425b70852e44753c09c9d63b0f5063d34"
            }

            return config;
        }
    }
}
