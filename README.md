# WAF

Inspiration: waffle.io


![](https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/106644/786095/R0uqVbH2DgtYYCX/waf_network_todo2.gif)


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




