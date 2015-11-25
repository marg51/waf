import {GITHUB_ENDPOINT, GITHUB_TOKEN} from './index.js'

export function interceptor() {

    return {
        request: function (config) {
            if(new RegExp("^"+GITHUB_ENDPOINT).test(config.url)) {
                config.headers = config.headers || {};

                config.headers["Authorization"] = "token "+GITHUB_TOKEN
            }

            return config;
        }
    }
}
