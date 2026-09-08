/**
 * Types of the `Voucherly` global exposed by Voucherly.js (https://checkout.voucherly.it/embed/v1/voucherly.js).
 * Reference: https://docs.voucherly.it/en/guides/integrations/components/reference/
 */

export type ComponentName = "element" | "express";

export type Visibility = "auto" | "never";

export type ExpressVisibility = "always" | "auto" | "never";

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
    /** Total paid, in cents. Absent when the component resumes after a redirect. */
    amount?: number;
    /** Absent when the component resumes after a redirect. */
    status?: PaymentStatus;
}

export interface PaymentErrorEvent {
    success?: false;
    paymentId?: string;
    status?: PaymentStatus;
    /** The error of the failed Transaction, the same object the Voucherly API returns in `transactions[].error`. */
    error?: TransactionError;
    gatewayName?: string;
    message?: string;
    /** Set on a configuration error: the component could not be rendered at all. */
    code?:
        | "public_key_required"
        | "invalid_public_key"
        | "public_key_tenant_mismatch"
        | "payment_not_found"
        | "merchant_not_active"
        | (string & {});
}

export interface PartialPaymentEvent {
    paymentId: string;
    /** Paid so far, in cents. */
    paidAmount: number;
    /** Still to pay, in cents. */
    remainingAmount: number;
    transactionId: string;
    gatewayName?: string;
}

export interface VoucherlyInitOptions {
    /** Publishable key of your merchant account, `pk_live_…` or `pk_sand_…`. Never a secret key. */
    publicKey: string;
    /** Id of the Payment created server-side, `pay_…`. */
    paymentId: string;
    /** Id of the DOM element the component is rendered into. */
    containerId: string;
    /** Page the customer lands on after a redirect-based payment method. Defaults to the current URL. */
    returnUrl?: string;
    onReady?: (event: ReadyEvent) => void;
    onResize?: (height: number) => void;
    onPaymentComplete?: (event: PaymentCompleteEvent) => void;
    onPaymentError?: (event: PaymentErrorEvent) => void;
    onPartialPayment?: (event: PartialPaymentEvent) => void;
    /** Called when a payment method needs a top-level navigation. Defaults to `window.location.href = url`. */
    onRedirect?: (url: string) => void;
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
    /** Renders the Express Checkout Component. */
    initExpress(options: VoucherlyInitOptions, componentOptions?: ExpressComponentOptions): void;
    /** Sends new component options to one component, or to both when the name is omitted. */
    configure(name: ComponentName, options: PaymentComponentOptions | ExpressComponentOptions): void;
    configure(options: PaymentComponentOptions | ExpressComponentOptions): void;
    /** Submits the Payment Component from your own page, typically with `showSubmitButton: false`. */
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
