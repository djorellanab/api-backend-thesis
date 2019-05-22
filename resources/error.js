class HttpError extends Error{
    constructor(status, message) {
        super(message);
        this.status = status;
      }
    static get BadRequest() {
        return new HttpError(400,"Bad Request");;
    }
    static get Unauthorized() {
        return new HttpError(401,"Unauthorized");
    }
    static get PaymentRequired() {
        return new HttpError(402,"Payment Required");
    }
    static get Forbidden() {
        return new HttpError(403,"Forbidden");
    }
    static get NotFound() {
        return new HttpError(404,"Not Found");
    }
    static get MethodNotAllowed() {
        return new HttpError(405,"Method Not Allowed");
    }
    static get NotAcceptable() {
        return new HttpError(406,"Not Acceptable");
    }
    static get ProxyAuthenticationRequired() {
        return new HttpError(407,"Proxy Authentication Required");
    }
    static get RequestTimeout() {
        return new HttpError(408,"Request Time out");
    }
    static get Conflict() {
        return new HttpError(409,"Conflict");
    }
    static get Gone() {
        return new HttpError(410,"Gone");
    }
    static get LengthRequired() {
        return new HttpError(411,"Length Required");
    }
    static get PreconditionFailed() {
        return new HttpError(412,"Precondition Failed");
    }
    static get PayloadTooLarge() {
        return new HttpError(413,"Payload Too Large");
    }
    static get URITooLong() {
        return new HttpError(414,"URI Too Long");
    }
    static get UnsupportedMediaType() {
        return new HttpError(415,"Unsupported Media Type");
    }
    static get RangeNotSatisfiable() {
        return new HttpError(416,"Range Not Satisfiable");
    }
    static get ExpectationFailed() {
        return new HttpError(417,"Expectation Failed");
    }
    static get ImATeapot() {
        return new HttpError(418,"Im A Teapot");
    }
    static get MisdirectedRequest() {
        return new HttpError(421,"Misdirected Request");
    }
    static get UnprocessableEntity() {
        return new HttpError(422,"Unprocessable Entity");
    }
    static get Locked() {
        return new HttpError(423,"Locked");
    }
    static get FailedDependency() {
        return new HttpError(424,"Failed Dependency");
    }
    static get UnorderedCollection() {
        return new HttpError(425,"Unordered Collection");
    }
    static get UpgradeRequired() {
        return new HttpError(426,"Upgrade Required");
    }
    static get PreconditionRequired() {
        return new HttpError(428,"Precondition Required");
    }
    static get TooManyRequests() {
        return new HttpError(429,"Too Many Requests");
    }
    static get RequestHeaderFieldsTooLarge() {
        return new HttpError(431,"Request Header Fields Too Large");
    }
    static get UnavailableForLegalReasons() {
        return new HttpError(451,"Unavailable For Legal Reasons");
    }
    static get InternalServerError() {
        return new HttpError(500,"Internal Server Error");
    }
    static get NotImplemented() {
        return new HttpError(501,"Not Implemented");
    }
    static get BadGateway() {
        return new HttpError(502,"Bad Gateway");
    }
    static get ServiceUnavailable() {
        return new HttpError(503,"Service Unavailable");
    }
    static get GatewayTimeout() {
        return new HttpError(504,"Gateway Timeout");
    }
    static get HTTPVersionNotSupported() {
        return new HttpError(505,"HTTP Version Not Supported");
    }
    static get VariantAlsoNegotiates() {
        return new HttpError(506,"Variant Also Negotiates");
    }
    static get InsufficientStorage() {
        return new HttpError(507,"Insufficient Storage");
    }
    static get LoopDetected() {
        return new HttpError(508,"Loop Detected");
    }
    static get BandwidthLimitExceeded() {
        return new HttpError(509,"Bandwidth Limit Exceeded");
    }
    static get NotExtended() {
        return new HttpError(510,"Not Extended");
    }
    static get NetworkAuthenticationRequired() {
        return new HttpError(511,"Network Authentication Required");
    }
}

module.exports = {
    HttpError
};