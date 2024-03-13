function Voucherly(publicKey, options = null) {

    const api = VoucherlyApi(publicKey, options);

    const elements = function (paymentId) {

        // reference to the function registered on message event listener.
        // Needed to remvoe previous payment gateway listener registered.
        let _onMessageListenerCallback = null;

        const _buildCallbackErrorResponse = function (httpResponseBody) {
            const response = {
                success: false,
                paymentId: paymentId,
                error: {
                    raw: httpResponseBody,
                    message: "Si è verificato un errore..."
                }
            };

            if (httpResponseBody) {
                if (httpResponseBody.statusCode == 400 && httpResponseBody.message == "ExceededMaximumAmount") {
                    if (httpResponseBody.additionalData?.maximumAmount) {
                        response.error.message = `L'importo massimo pagabile &egrave; di &euro; ${(httpResponseBody.additionalData?.maximumAmount / 100).toFixed(2)}`;
                    } else {
                        response.error.message = "Si sta tentando di pagare un importo che eccede la spesa";
                    }
                } else if (httpResponseBody.statusCode == 400 && httpResponseBody.message == "InvalidCode") {
                    response.error.message = "Codice inserito non valido";
                }
            }

            return response;
        }


        const _initCodePayment = function (code, callback) {
            return fetch(this.url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    code: code
                })
            }).then(async response => {

                if (response.status != 200) {
                    let result = await response.json();

                    callback(_buildCallbackErrorResponse(result));
                    return;
                }

                let result = await response.json();
                callback(result);

                if (window.top) {
                    result.event = "transaction-result";
                    window.top.postMessage(result, "*");
                }
            });
        };

        const _initRedirectPayment = function (callback) {

            const paymentGatewayWindowSizes = {
                "ADYEN": "width=600,height=850",
                "PAYPAL": "width=400,height=780"
            };
            const size = paymentGatewayWindowSizes[this.paymentGatewayId] ?? 'width=1000,height=600';

            let paymentGatewayWindow = window.open(this.url, "Pagina di pagamento", size);

            // Intercept close event
            let _timer = setInterval(function () {
                if (paymentGatewayWindow.closed) {
                    clearInterval(_timer);

                    callback({
                        success: false,
                        paymentId: paymentId
                    });
                }
            }, 1000);

            _listenForMessages(function (data) {
                clearInterval(_timer);
                paymentGatewayWindow.close();

                callback(data);
            });
        };

        const _initDropinPayment = function (containerSelector, callback) {
            const iframeId = `voucherly-iframe-${this.id}`;
            document.querySelector(containerSelector).innerHTML = `<iframe id="${iframeId}" src="${this.url}" height="340" class="w-100" scrolling="no"></iframe>`;



            // Listen events from iframe
            _listenForMessages(function (data) {
                document.querySelector(containerSelector).innerHTML = "";

                callback(data);
            });
        };

        const _listenForMessages = function (callback) {
            if (_onMessageListenerCallback != null) {
                window.removeEventListener("message", _onMessageListenerCallback);
                _onMessageListenerCallback = null;
            }

            _onMessageListenerCallback = (event) => {
                if (event.data.event == "transaction-result") {
                    callback(event.data);

                    window.removeEventListener("message", _onMessageListenerCallback);
                    _onMessageListenerCallback = null;
                }
            }

            window.addEventListener("message", _onMessageListenerCallback, false);
        }

        const requestTransaction = async function (paymentGatewayId) {
            const transaction = await api.requestTransaction(paymentId, paymentGatewayId);

            var initPaymentFunc;

            switch (transaction.checkoutAction) {
                case "Code":
                    initPaymentFunc = _initCodePayment;
                    break;
                case "Redirect":
                    initPaymentFunc = _initRedirectPayment;
                    break;
                case "Dropin":
                    initPaymentFunc = _initDropinPayment;
                    break;
            }

            transaction.initPayment = initPaymentFunc;

            return transaction;
        };

        const getPaymentGateways = async function () {

            const paymentGateways = await api.getPaymentGateways(paymentId);

            return paymentGateways;
        }

        const getPayment = async function () {
            const payment = await api.getPayment(paymentId);

            return payment;
        }

        return {
            requestTransaction,
            getPaymentGateways,
            getPayment
        }
    }

    const dropin = function (paymentId) {
        const baseUrl = options?.checkoutUrl ?? "https://checkout.voucherly.it/";

        let libraryLoadingPromises = {
            iframeResizer: null
        };

        let _containerSelector;


        const _includeExternalLibrary = function (source, callback) {
            const script = document.createElement("script");
            script.src = source;
            script.onload = callback;

            const body = document.body;

            if (!body) {
                throw new Error("Expected document.body not to be null. Voucherly.js requires a <body> element");
            }

            body.appendChild(script);
        }

        const _onMessageEventListenerAction = function (onTransactionResultCallback, onPaymentResultCallback) {
            return (event) => {

                if (event.data.event == "transaction-result") {
                    onTransactionResultCallback(event.data);
                    return;
                }

                if (event.data.event == "payment-result") {
                    onPaymentResultCallback(event.data);
                    return;
                }

            };
        }

        const mount = async function (containerSelector, onTransactionResultCallback, onPaymentResultCallback) {
            _containerSelector = containerSelector;

            await libraryLoadingPromises.iframeResizer;

            const url = `${baseUrl}elements/pay/dropin?paymentId=${paymentId}&publicKey=${publicKey}`;

            const iframeId = `voucherly-iframe-dropin`;
            document.querySelector(containerSelector).innerHTML = `<iframe id="${iframeId}" src="${url}" width="300" height="500" frameBorder="0"></iframe>`;

            iFrameResize({ log: false }, `#${iframeId}`);

            window.addEventListener("message", _onMessageEventListenerAction(onTransactionResultCallback, onPaymentResultCallback));
        }

        const unmount = async function () {
            if (!_containerSelector) {
                throw new Error("You have to mount a element before unmount it");
            }

            document.querySelector(_containerSelector).innerHTML = "";

            window.removeEventListener("message", _onMessageEventListenerAction);
        }

        const getPayment = async function () {
            const payment = await api.getPayment(paymentId);

            return payment;
        }


        // Include IFrameResize to dynamically resize the iframe according to the content
        let iframeResizerResolve;
        libraryLoadingPromises.iframeResizer = new Promise(function (resolve, reject) {
            iframeResizerResolve = resolve;
        });
        
        _includeExternalLibrary("https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js", function () {
            iframeResizerResolve();
        });


        return {
            mount,
            unmount,
            getPayment
        };
    }

    return {
        elements,
        dropin
    };
}


function VoucherlyApi(publicKey, options = null) {

    const baseUrl = options?.apiUrl ?? "https://api.voucherly.it/";

    const httpClient = async function (endpoint, options = {}) {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers["Voucherly-API-KEY"] = publicKey;

        const response = await fetch(baseUrl + endpoint, options);
        if (response.status == 401) {
            throw Error("Invalid api key");
        }

        if (response.status == 403) {
            throw Error("Cannot access the resource. Be sure to use the public key");
        }

        return response;
    }

    const getPaymentGateways = async function (paymentId) {
        const response = await httpClient(`v1/payments/${paymentId}/payment-gateways`);

        const paymentGateways = await response.json();

        return paymentGateways;
    }

    const requestTransaction = async function (paymentId, paymentGatewayId) {
        const response = await httpClient(`v1/payments/${paymentId}/transaction/request?paymentGatewayId=${paymentGatewayId}`, {
            method: "POST"
        });
        const transaction = await response.json();

        return transaction;
    }

    const getPayment = async function (paymentId) {
        const response = await httpClient(`v1/payments/${paymentId}`);
        const payment = await response.json();

        return payment;
    }

    return {
        getPaymentGateways,
        requestTransaction,
        getPayment
    }
}