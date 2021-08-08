pragma solidity ^0.8.3; 

import "./dSocialCredits.sol";
import "./library/ABDKMath64x64.sol";

contract desilo {

    uint256 public groupCreationSCAmount;
    uint256 public scStakeAmount;
    uint256 public scSeedAmount;
    uint256 public scStakePeriod;

    dSocialCredits _scContract; 
    address _owner;
    uint256 _scID = 0;
    mapping(address => bool) public registered;

    // mapping(entityID)
    mapping(uint256 => mapping(address => uint256)) _stakedAmount; 
    mapping(uint256 => mapping(address => uint256)) _stakeExpiry; 
    mapping(uint256 => uint256) _entityToThread;
    mapping(uint256 => string) _entityURI;

    // mapping(threadID)
    mapping(uint256 => string) _threadURI;
    mapping(uint256 => mapping(uint256 => bool)) _threadGSC;
    mapping(uint256 => uint256) _threadGSCCount;


    // mapping(groupID => fixed128x128)
    uint _groupCount = 1; 
    mapping(uint256 => string) _groupURI;
    mapping(uint256 => int128) public gscYield;
    mapping(uint256 => uint256) _gscMinAcceptance; 


    constructor(uint256 _scStakeAmount, int128 _scYield, uint256 _groupCreationSCAmount, uint256 _scSeedAmount, uint256 _scStakePeriod) {
        gscYield[0] = _scYield;
        scStakeAmount = _scStakeAmount;
        groupCreationSCAmount = _groupCreationSCAmount;
        scSeedAmount = _scSeedAmount;
        scStakePeriod = _scStakePeriod;
        _owner = msg.sender;
    }

    function createGroup(uint256 _initialSupply, string memory _uri) external {
        _scContract.burn(msg.sender, _scID, groupCreationSCAmount);
        _groupURI[_groupCount] = _uri; 
        _scContract.mint(msg.sender, _groupCount, _initialSupply, "");
        _groupCount++;
    }

    function setSC(dSocialCredits _sc) external {
        require(msg.sender == _owner);
        _scContract = _sc;
    }

    function seedSC() external {
        require(!registered[msg.sender], "Cannot call this function, user already registered");
        registered[msg.sender] = true;
        _scContract.mint(msg.sender, _scID, scSeedAmount, "");
    }

    function getStaked(uint256 _commitId, address _addr) public view returns(uint256) {
        return _stakedAmount[_commitId][_addr];
    }

    function stake(uint256 _commitId) external {
        _scContract.safeTransferFrom(msg.sender, address(this), _scID, scStakeAmount, "");
        _stakedAmount[_commitId][msg.sender] += scStakeAmount;
        _stakeExpiry[_commitId][msg.sender] = block.timestamp + scStakePeriod;
    }

    function unstake(uint256 _commitId) external {
        require(block.timestamp >= _stakeExpiry[_commitId][msg.sender], "desilo: You may not yet unstake."); 
        require(getStaked(_commitId,msg.sender) >= 0, "desilo: You have not yet staked."); 
        
        uint256 stakedAmount = getStaked(_commitId,msg.sender);
        uint256 threadID = _entityToThread[_commitId];
        uint256 gscCount = _threadGSCCount[threadID];
        uint256[] memory ids = new uint256[](gscCount);
        uint256[] memory amounts = new uint256[](gscCount);


        _stakedAmount[_commitId][msg.sender] -= stakedAmount; 
        _stakeExpiry[_commitId][msg.sender] = 0;

        _scContract.safeTransferFrom(address(this), msg.sender, _scID, stakedAmount, "");
        _scContract.mint(msg.sender, _scID, ABDKMath64x64.mulu(gscYield[0], stakedAmount), "");

        uint256 count = 0;
        for (uint256 i = 1; i < _groupCount; i++) {
            if (_threadGSC[threadID][i]) {
                ids[count] = i;
                amounts[count] = ABDKMath64x64.mulu(gscYield[i], stakedAmount);
                count++;
            }
        }
        _scContract.mintBatch(msg.sender, ids, amounts, "");
    }

}