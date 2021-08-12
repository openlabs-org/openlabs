pragma solidity ^0.8.3; 

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol"; 


contract OpenLabsVerification is ChainlinkClient {
    using Chainlink for Chainlink.Request; 

    address private oracle;
    address private owner;
    bytes32 private httpGetJobId; 
    uint256 private httpGetJobFee; 

    constructor() {
        setPublicChainlinkToken();
        httpGetJobId = "2bb15c3f9cfc4336b95012872ff05092";
        owner = msg.sender;
        httpGetJobFee = 0.1 * 10 ** 18;
    }

    function requestMatchingControllers() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(httpGetJobId, address(this), this.fullfillMatchingControllers.selector);
        request.add("get", ""); 
        return sendChainlinkRequestTo(oracle, request, httpGetJobFee);
    }

    function fullfillMatchingControllers(bytes32 _requestId, bool _response) public recordChainlinkFulfillment(_requestId) {

    }
}