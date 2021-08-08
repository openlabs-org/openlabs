pragma solidity ^0.8.3; 

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


contract dSocialCredits is ERC1155 {

    address _admin;

    constructor(address _adm) ERC1155("") {
        _admin = _adm;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(msg.sender == _admin || to == _admin, "Transfer disabled");
        _safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(msg.sender == _admin || to == _admin, "Transfer disabled");
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public {
        require(msg.sender == _admin, "Only designated admin can mint.");
        _burn(account, id, amount);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        require(msg.sender == _admin, "Only designated admin can mint.");
        _mint(account, id, amount, data);
    }


    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        require(msg.sender == _admin, "Only designated admin can mint.");
        _mintBatch(to, ids, amounts, data);
    }

}