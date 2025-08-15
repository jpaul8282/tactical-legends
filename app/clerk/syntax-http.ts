Authorization: <auth-scheme> <authorization-parameters>

// Basic authentication
Authorization: Basic <credentials>

// Digest authentication
Authorization: Digest username=<username>,
    realm="<realm>",
    uri="<url>",
    algorithm=<algorithm>,
    nonce="<nonce>",
    nc=<nc>,
    cnonce="<cnonce>",
    qop=<qop>,
    response="<response>",
    opaque="<opaque>"
Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
WWW-Authenticate: <type> realm=<realm>
Proxy-Authenticate: <type> realm=<realm>
Authorization: <type> <credentials>
Proxy-Authorization: <type> <credentials>
