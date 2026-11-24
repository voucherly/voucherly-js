/**
 * Types of the `Voucherly` global exposed by Voucherly.js (https://js.voucherly.it/embed/v1/voucherly.js).
 * Reference: https://docs.voucherly.it/en/guides/online-payments/components/reference/
 */

export type ComponentName = "element" | "express";

export type Visibility = "auto" | "never";

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
    /** Called when the customer tries to pay while the component is `locked`: show what is still missing on your page. */
    onLockedAttempt?: (event: LockedAttemptEvent) => void;
}

export interface LockedAttemptEvent {
    /** The payment method the customer tried, when there is one. */
    paymentGatewayId?: string;
}

/** `done` once the attempt is over, whatever its outcome: the callbacks report it. `no_method` when no method is chosen, `locked` while the component is locked, `unanswered` when the component did not answer. */
export type SubmitStatus = "done" | "no_method" | "locked" | "unanswered";

export interface SubmitResult {
    status: SubmitStatus;
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

/** Each variable overrides the merchant's branding, which the component starts from. `fontSize` is the root size and scales the whole component. */
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

/** Apple Pay and Google Pay. `auto` shows a wallet only where the browser can pay with it. */
export interface WalletGateways {
    applePay?: Visibility;
    googlePay?: Visibility;
}

/** The customer's personal credit and prepaid quota on Voucherly. */
export interface VoucherlyCustomGateways {
    wallet?: Visibility;
    prepaid?: Visibility;
}

/** Which gateways a component offers. Every one is `auto` by default, which shows it when the merchant has it; `never` leaves it out. */
export interface PaymentGatewaysOptions<TVoucherly extends VoucherlyCustomGateways = VoucherlyCustomGateways> {
    wallets?: WalletGateways;
    voucherlyCustoms?: TVoucherly;
}

export interface PaymentComponentVoucherlyCustomGateways extends VoucherlyCustomGateways {
    /** The merchant's manual payment methods, such as cash at the counter. */
    manual?: Visibility;
}

/** `auto` lets Voucherly choose the layout; today it is `list`. */
export type PaymentComponentLayoutType = "auto" | "list";

export interface PaymentComponentLayout {
    /** Defaults to `auto`. */
    type?: PaymentComponentLayoutType;
    /** The radio of every row. `auto` and `always` show it, `if_multiple` only when the component offers more than one method. Defaults to `auto`. */
    radios?: "auto" | "always" | "never" | "if_multiple";
    /** Where a gateway's logo goes in its row: `start` right after the radio, `end` at the end. Defaults to `end`. */
    paymentGatewayLogoPosition?: "start" | "end";
    /** How many of the other methods show before the row that opens the rest. `0` shows them all. Defaults to `4`. */
    visibleItemsCount?: number;
}

export interface PaymentComponentOptions {
    appearance?: Appearance;
    /** With the Express Checkout Component on the same page, Apple Pay and Google Pay stay in the Express, and so do personal credit and prepaid quota when the Express shows them. */
    paymentGateways?: PaymentGatewaysOptions<PaymentComponentVoucherlyCustomGateways>;
    /** Read when the component is mounted: to change it, mount the component again. Defaults to `auto`. */
    layout?: PaymentComponentLayoutType | PaymentComponentLayout;
    /** Hide the pay button to submit from your own page with `Voucherly.submit()`. Defaults to `true`. */
    showSubmitButton?: boolean;
    /** `auto` lets the customer top up personal credit when the merchant allows it. Defaults to `auto`. */
    walletTopUp?: Visibility;
    savedPaymentMethods?: {
        /** `auto` lets the customer remove a saved payment method from the list. Defaults to `auto`. */
        remove?: Visibility;
    };
    /** While `true`, no payment starts from the component, wallets included, and `onLockedAttempt` is called instead. Keep it current with `configure({ locked })`, for example until the customer accepts your terms. Defaults to `false`. */
    locked?: boolean;
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
    /**
     * Whatever the Express Checkout Component shows, the Payment Component on the same page leaves out.
     * `auto` shows personal credit and prepaid quota only when they cover the whole remaining amount: a partial payment stays in the Payment Component.
     */
    paymentGateways?: PaymentGatewaysOptions;
}

export interface PaymentMessagesOptions {
    /** Merchant publishable key (`pk_live_…` / `pk_sand_…`). Never a secret key. */
    publicKey: string;
    /** Where the messages go: a CSS selector or the element itself, close to the price it describes. */
    container: string | HTMLElement;
    /** The price the messages describe, in cents. */
    amount: number;
    /** Defaults to `EUR`. */
    currency?: string;
}

export interface PaymentMessages {
    /** Changes the price; close updates are grouped, so it can follow a field as the customer types. */
    update(options: { amount: number }): void;
    /** Removes the messages from the container. */
    destroy(): void;
}

export interface VoucherlyStatic {
    /**
     * Shows the official message of each instalment gateway the merchant has active — PayPal Pay Later, Klarna, Scalapay — one under the other.
     * The text is the provider's own. Nothing is drawn, and no provider script is loaded, for a gateway the merchant lacks or an amount outside its range.
     */
    paymentMessages(options: PaymentMessagesOptions): PaymentMessages;
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
     * The promise settles when the component has handled the submission, so your button can show it is busy until then.
     */
    submit(): Promise<SubmitResult>;
    /** Removes both components. */
    destroy(): void;
    destroyComponent(name: ComponentName): void;
}

declare global {
    interface Window {
        Voucherly?: VoucherlyStatic;
    }
}
