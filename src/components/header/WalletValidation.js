import { FormattedMessage } from "react-intl";

const WalletValidation = () => {

    return (
        <>
            <p style={{ display: "none" }} id="error">
                {" "}
                <FormattedMessage id="error" />
            </p>
            <p style={{ display: "none" }} id="metamaskExtensionError">
                {" "}
                <FormattedMessage id="metamaskExtensionError" />
            </p>
            <p style={{ display: "none" }} id="changeBlockChain">
                {" "}
                <FormattedMessage id="changeBlockChain" />
            </p>
            <p style={{ display: "none" }} id="selectBianceSmartChain">
                {" "}
                <FormattedMessage id="selectBianceSmartChain" />
            </p>
            <p style={{ display: "none" }} id="connected">
                {" "}
                <FormattedMessage id="connected" />
            </p>
            <p style={{ display: "none" }} id="metamaskConnected">
                {" "}
                <FormattedMessage id="metamaskConnected" />
            </p>
            <p style={{ display: "none" }} id="disConnected">
                {" "}
                <FormattedMessage id="disConnected" />
            </p>
            <p style={{ display: "none" }} id="disconnectMetamask">
                {" "}
                <FormattedMessage id="disconnectMetamask" />
            </p>
            <p style={{ display: "none" }} id="disconnectMetamaskWithBiance">
                {" "}
                <FormattedMessage id="disconnectMetamaskWithBiance" />
            </p>
            <p style={{ display: "none" }} id="accountChanged">
                {" "}
                <FormattedMessage id="accountChanged" />
            </p>
            <p style={{ display: "none" }} id="changeAccountConnectAgain">
                {" "}
                <FormattedMessage id="changeAccountConnectAgain" />
            </p>

        </>

    )
}
export default WalletValidation;