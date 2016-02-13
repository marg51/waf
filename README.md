# WAF

Inspiration: waffle.io


![waf-new](https://cloud.githubusercontent.com/assets/543507/13028013/3a37a43a-d25a-11e5-983c-7af41fb87dd7.gif)


### install

#### Nginx

There is a template included, **you'll have to change two paths** in the template.

- **Debian (& ubuntu)** the nginx.conf should be located at `/etc/nginx/sites-enabled/waf.conf`

- **mac (homebrew)**: `/usr/local/etc/nginx/sites-enabled/waf.conf`

Don't forget to update the template, instructions are included

Reload nginx: `sudo nginx -s reload`


#### Github integration

It uses github login, you'll have to add some tokens:


create a new file `./server/config.js`

```javascript
export const config = {
    client_id: "FROM GITHUB APP",
    client_secret: "FROM GITHUB",
    redirect_uri: "http://localhost:4041/login",
    secret: "CANBEANYTHING$$$$"
}
```

#### run

``` bash
npm install
npm start
```

then go to http://localhost:4041




