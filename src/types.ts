/**
 * Types of the `Voucherly` global exposed by Voucherly.js (https://checkout.voucherly.it/embed/v1/voucherly.js).
 * Reference: https://docs.voucherly.it/en/guides/online-payments/components/reference/
 */

export type ComponentName = "element" | "express";

export type Visibility = "auto" | "never";

export type ExpressVisibility = "always" | "auto" | "never";

/**
 * What happens to your page once the Payment closes.
 * `always` sends it to the `redirectOkUrl` or `redirectKoUrl` of the Payment, with the outcome in the query string, and the component fails to load with `redirect_url_missing` when the Payment has not both.
 * `if_required` keeps it and reports the outcome to `onPaymentComplete` and `onPaymentError`; it leaves only when a payment method needs a redirect.
 * A Payment already closed when the component is mounted is always reported to the callbacks.
 */
export type RedirectBehavior = "always" | "if_required";

/** Status of a Payment, as returned by the Voucherly API. */
export type PaymentStatus =
    | "Requested"
    | "Paid"
    | "Confirmed"
    | "Refunded"
    | "Cancelled"
    | "Voided"
    | "Expired"
    | "Dropped"
    | "Failed"
    | "ImpossibleRefund"
    | (string & {});

export interface TransactionError {
    code:
        | "Generic"
        | "Cancelled"
        | "NotCompleted"
        | "MissingPaymentMethod"
        | "Declined"
        | "System"
        | (string & {});
    declineErrorCode?: string;
    externalError?: {
        message?: string;
        code?: string;
    };
}

export interface ReadyEvent {
    /** Height of the component in pixels. The SDK has already applied it to the iframe. */
    height?: number;
    /** `true` when the component is reloading after the customer came back from a redirect-based payment method. */
    resumed?: boolean;
}

export interface PaymentCompleteEvent {
    success: true;
    paymentId: string;
    /** Total paid, in cents. */
    amount: number;
    status: PaymentStatus;
}

export interface PaymentErrorEvent {
    success?: false;
    paymentId?: string;
    status?: PaymentStatus;
    /** The error of the failed Transaction, the same object the Voucherly API returns in `transactions[].error`. */
    error?: TransactionError;
    gatewayName?: string;
    message?: string;
    /** Set on a configuration error: the component could not be rendered at all. `popup_blocked` means the browser refused to open the popup. */
    code?:
        | "popup_blocked"
        | "public_key_required"
        | "invalid_public_key"
        | "public_key_tenant_mismatch"
        | "payment_not_found"
        | "merchant_not_active"
        | "redirect_url_missing"
        | (string & {});
}

export interface PaymentPartialCompleteEvent {
    paymentId: string;
    /** Paid so far, in cents. */
    paidAmount: number;
    /** Still to pay, in cents. */
    remainingAmount: number;
    transactionId: string;
    gatewayName?: string;
}

export interface VoucherlyInitOptions {
    /** `inline`, the default, renders the component inside `containerId`. */
    displayMode?: "inline";
    /** Publishable key of your merchant account, `pk_live_…` or `pk_sand_…`. Never a secret key. */
    publicKey: string;
    /** Id of the Payment created server-side, `pay_…`. */
    paymentId: string;
    /** Id of the DOM element the component is rendered into. */
    containerId: string;
    /** Page the customer lands on after a redirect-based payment method. Defaults to the current URL. */
    returnUrl?: string;
    /** Defaults to `always`. */
    redirect?: RedirectBehavior;
    onReady?: (event: ReadyEvent) => void;
    onResize?: (height: number) => void;
    onPaymentComplete?: (event: PaymentCompleteEvent) => void;
    onPaymentError?: (event: PaymentErrorEvent) => void;
    onPaymentPartialComplete?: (event: PaymentPartialCompleteEvent) => void;
    /** Called when a payment method needs a top-level navigation. Defaults to `window.location.href = url`. */
    onRedirect?: (url: string) => void;
}

/** The Payment Component opened in a popup by `Voucherly.submit()`: your page is never left, and the outcome is read from Voucherly while the popup is open. */
export interface VoucherlyPopupInitOptions {
    displayMode: "popup";
    /** Publishable key of your merchant account, `pk_live_…` or `pk_sand_…`. Never a secret key. */
    publicKey: string;
    /** Id of the Payment created server-side, `pay_…`. */
    paymentId: string;
    /** Dims your page while the popup is open, with buttons to bring the popup back or close it. Defaults to `true`. */
    overlay?: boolean;
    /** Defaults to `always`. */
    redirect?: RedirectBehavior;
    onPaymentComplete?: (event: PaymentCompleteEvent) => void;
    onPaymentError?: (event: PaymentErrorEvent) => void;
    onPaymentPartialComplete?: (event: PaymentPartialCompleteEvent) => void;
    onPopupOpened?: () => void;
    /** The popup window is no longer reachable. It does not mean the payment was abandoned: `onPaymentComplete` can still follow. */
    onPopupClosed?: () => void;
}

export interface AppearanceVariables {
    colorPrimary?: string;
    colorPrimaryHover?: string;
    colorPrimaryText?: string;
    colorText?: string;
    colorTextMuted?: string;
    colorBackground?: string;
    colorBorder?: string;
    colorDanger?: string;
    borderRadius?: string;
    fontFamily?: string;
    fontFamilyHeading?: string;
    fontSize?: string;
}

export interface Appearance {
    variables?: AppearanceVariables;
}

export interface PaymentComponentOptions {
    appearance?: Appearance;
    /** `auto` shows a wallet only when the browser can pay with it, and never while the Express Checkout Component is mounted on the same page. */
    wallets?: {
        applePay?: Visibility;
        googlePay?: Visibility;
    };
    /** Hide the pay button to submit from your own page with `Voucherly.submit()`. Defaults to `true`. */
    showSubmitButton?: boolean;
}

export type WalletButtonType = "buy" | "pay" | "plain" | (string & {});

export interface ExpressComponentOptions {
    appearance?: Appearance;
    /** Height of the wallet buttons in pixels. */
    buttonHeight?: number;
    buttonType?: {
        applePay?: WalletButtonType;
        googlePay?: WalletButtonType;
    };
    /** Whatever the Express Checkout Component shows, the Payment Component on the same page leaves out. */
    paymentMethods?: {
        /** `auto` shows the method only when it covers the whole remaining amount. Defaults to `always`. */
        wallet?: ExpressVisibility;
        /** `auto` shows the method only when it covers the whole remaining amount. Defaults to `always`. */
        prepaid?: ExpressVisibility;
        applePay?: Visibility;
        googlePay?: Visibility;
    };
}

export interface VoucherlyStatic {
    /** Renders the Payment Component. */
    init(options: VoucherlyInitOptions, componentOptions?: PaymentComponentOptions): void;
    /** Prepares the Payment Component in popup mode: `submit()` opens it. */
    init(options: VoucherlyPopupInitOptions): void;
    /** Renders the Express Checkout Component. */
    initExpress(options: VoucherlyInitOptions, componentOptions?: ExpressComponentOptions): void;
    /** Sends new component options to one component, or to both when the name is omitted. */
    configure(name: ComponentName, options: PaymentComponentOptions | ExpressComponentOptions): void;
    configure(options: PaymentComponentOptions | ExpressComponentOptions): void;
    /**
     * Submits the Payment Component from your own page, typically with `showSubmitButton: false`.
     * In popup mode it opens the popup, so call it from a user gesture such as the click handler of your pay button, or the browser blocks it.
     */
    submit(): void;
    /** Removes both components. */
    destroy(): void;
    destroyComponent(name: ComponentName): void;
}

declare global {
    interface Window {
        Voucherly?: VoucherlyStatic;
    }
}
